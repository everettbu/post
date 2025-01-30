'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, X } from 'lucide-react';
import { CommentSection } from "@/components/pages/CommentSection";

interface Photo {
  id: string;
  url: string;
  caption: string;
  likes: number;
  date: string;
}

export default function PhotoGrid() {
  const [photos, setPhotos] = useState<Photo[]>([
    // Sample data - replace with your actual photos
    {
      id: '1',
      url: '/photos/matthew.jpg',
      caption: 'Not',
      likes: 0,
      date: '2025-01-30'
    },    
    {
      id: '2',
      url: '/photos/sample-photo-2.jpg',
      caption: 'HERE',
      likes: 0,
      date: '2024-03-20'
    },
    {
      id: '3',
      url: '/photos/sample-photo-3.jpg',
      caption: '',
      likes: 0,
      date: '2024-03-20'
    },
    {
       id: '4',
       url: '/photos/sample-photo-4.jpg',
       caption: 'Cheese',
       likes: 0,
       date: '2024-03-20'
    },

    







  ]);

  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);

  // Sort photos by ID in descending order (reversed)
  const sortedPhotos = [...photos].sort((a, b) => 
    parseInt(b.id) - parseInt(a.id)
  );

  const handleLike = (photoId: string) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ));
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
              <div className="flex gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLike(photo.id)}
                  className="flex items-center gap-1"
                >
                  <Heart className={`w-5 h-5 ${photo.likes > 0 ? 'fill-red-500 text-red-500' : ''}`} />
                  <span>{photo.likes}</span>
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
                {new Date(photo.date).toLocaleDateString()}
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