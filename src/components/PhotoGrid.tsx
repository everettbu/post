'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, MessageSquare } from 'lucide-react';
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
      url: '/photos/sample-photo-1.jpg',
      caption: 'Beautiful sunset in Tokyo',
      likes: 0,
      date: '2024-03-20'
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sortedPhotos.map((photo) => (
          <Card key={photo.id} className="overflow-hidden bg-card">
            <CardContent className="p-0 relative aspect-square">
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

      <CommentSection 
        photoId={selectedPhoto || ''}
        isOpen={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        caption={photos.find(p => p.id === selectedPhoto)?.caption}
      />
    </>
  );
} 