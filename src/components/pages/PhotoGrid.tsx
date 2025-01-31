'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from 'lucide-react';
import { CommentSection } from "@/components/pages/CommentSection";
import { Photo, initialPhotos } from '@/data/photos';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Update interface
interface PhotoLikePayload {
  new: {
    photo_id: string;
    count: number;
  };
}

export default function PhotoGrid() {
  const [photos] = useState<Photo[]>(initialPhotos);
  const [likes, setLikes] = useState<Record<string, number>>({});

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  // Sort photos by ID in descending order (reversed)
  const sortedPhotos = [...photos].sort((a, b) => 
    parseInt(b.id) - parseInt(a.id)
  );

  // Load initial likes
  useEffect(() => {
    const fetchLikes = async () => {
      const { data, error } = await supabase
        .from('photo_likes')
        .select('photo_id, count');
      
      if (error) {
        console.error('Error fetching likes:', error);
        return;
      }

      const likesMap = Object.fromEntries(
        data.map(item => [item.photo_id, item.count])
      );
      setLikes(likesMap);
    };

    fetchLikes();

    // Subscribe to changes
    const channel = supabase.channel('photo_likes_changes');
    
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'photo_likes'
        },
        (payload: RealtimePostgresChangesPayload<PhotoLikePayload>) => {
          console.log('Received update:', payload);
          const newData = payload.new as { photo_id: string; count: number };
          if (newData) {
            setLikes(current => ({
              ...current,
              [newData.photo_id]: newData.count
            }));
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleLike = async (photoId: string) => {
    try {
      // Optimistically update the UI
      setLikes(current => ({
        ...current,
        [photoId]: (current[photoId] || 0) + 1
      }));

      const { error } = await supabase.rpc('increment_like', {
        photo_id_input: photoId
      });

      if (error) {
        // Revert on error
        setLikes(current => ({
          ...current,
          [photoId]: (current[photoId] || 1) - 1
        }));
        throw error;
      }
    } catch (err: unknown) {
      console.error('Error incrementing like:', err instanceof Error ? err.message : err);
    }
  };

  return (
    <div suppressHydrationWarning={true}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden bg-card">
            <CardContent className="p-0 relative aspect-square cursor-pointer" onClick={() => setViewingPhoto(photo)}>
              <Image
                src={photo.url}
                alt={photo.caption}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </CardContent>
            <CardFooter className="flex justify-between p-4">
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLike(photo.id)}
                  className="flex items-center gap-1"
                >
                  <Heart className={`w-5 h-5 ${likes[photo.id] > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{likes[photo.id] || 0}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPhoto(photo.id)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment</span>
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {new Date(photo.date).toLocaleDateString('en-US', {
                  month: '2-digit',
                  day: '2-digit',
                  year: 'numeric'
                }).replace(/\//g, '-')}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Photo Viewing Modal */}
      {viewingPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setViewingPhoto(null)}>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setViewingPhoto(null);
            }}
          >
            <X className="h-6 w-6" />
          </Button>
          <div className="relative w-full max-w-6xl h-[95vh] m-4 flex items-center justify-center">
            <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
              <Image
                src={viewingPhoto.url}
                alt={viewingPhoto.caption}
                fill
                className="object-contain scale-125 transition-transform duration-300"
                sizes="(max-width: 1920px) 100vw, 1920px"
                priority
              />
            </div>
          </div>
        </div>
      )}

      <CommentSection 
        photoId={selectedPhoto || ''}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        caption={photos.find(p => p.id === selectedPhoto)?.caption}
      />
    </div>
  );
} 