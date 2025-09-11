'use client';

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';

interface AnimatedPhoto {
  id: number;
  src: string;
  x: number;
  y: number;
}

export default function PhotoAnimation() {
  const [animatedPhotos, setAnimatedPhotos] = useState<AnimatedPhoto[]>([]);
  const animatedPhotosRef = useRef<AnimatedPhoto[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const photoIndexRef = useRef(0);

  // Load photos from API
  useEffect(() => {
    fetch('/api/photos')
      .then(res => res.json())
      .then(data => {
        if (data.photos && data.photos.length > 0) {
          setPhotos(data.photos);
        }
      })
      .catch(err => console.error('Failed to load photos:', err));
  }, []);

  useEffect(() => {
    animatedPhotosRef.current = animatedPhotos;
  }, [animatedPhotos]);

  const checkOverlap = (newX: number, newY: number, existingPhotos: AnimatedPhoto[]): number => {
    let overlapCount = 0;
    const threshold = 25; // Increased from 15 to create more spacing
    
    for (const photo of existingPhotos) {
      const distance = Math.sqrt(Math.pow(newX - photo.x, 2) + Math.pow(newY - photo.y, 2));
      if (distance < threshold) {
        overlapCount++;
      }
    }
    
    return overlapCount;
  };

  const getNextPhoto = (): string | null => {
    if (photos.length === 0) return null;
    
    // Get current photo and increment index
    const photo = photos[photoIndexRef.current];
    photoIndexRef.current = (photoIndexRef.current + 1) % photos.length;
    
    // Check if this photo is already on screen
    const currentSrcs = new Set(animatedPhotosRef.current.map(p => p.src));
    if (currentSrcs.has(photo)) {
      // Skip to next photo if this one is already displayed
      for (let i = 0; i < photos.length; i++) {
        const nextPhoto = photos[photoIndexRef.current];
        photoIndexRef.current = (photoIndexRef.current + 1) % photos.length;
        if (!currentSrcs.has(nextPhoto)) {
          return nextPhoto;
        }
      }
      return null; // All photos are on screen
    }
    
    return photo;
  };

  useEffect(() => {
    if (photos.length === 0) return;

    let localNextId = 0;

    const addPhoto = () => {
      const nextPhoto = getNextPhoto();
      if (!nextPhoto) return;
      
      let randomX = 0;
      let randomY = 0;
      let attempts = 0;
      let overlaps = 0;
      
      do {
        randomX = Math.random() * 70 + 15; // Reduced range for better distribution
        randomY = Math.random() * 50 + 35; // Keep away from edges
        overlaps = checkOverlap(randomX, randomY, animatedPhotosRef.current);
        attempts++;
      } while (overlaps >= 1 && attempts < 30); // Allow max 1 overlap, more attempts to find good spot
      
      const photoId = localNextId++;
      const newPhoto: AnimatedPhoto = {
        id: photoId,
        src: nextPhoto,
        x: randomX,
        y: randomY,
      };

      setAnimatedPhotos(prev => [...prev, newPhoto]);

      setTimeout(() => {
        setAnimatedPhotos(prev => prev.filter(photo => photo.id !== photoId));
      }, 10000);
    };

    // Start with a slight delay for first photo
    const timeout = setTimeout(addPhoto, 100);
    
    const interval = setInterval(addPhoto, 1500);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {animatedPhotos.map(photo => (
        <div
          key={photo.id}
          className="absolute animate-grow-fade"
          style={{
            left: `${photo.x}%`,
            top: `${photo.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image
            src={photo.src}
            alt="Animated photo"
            width={250}
            height={250}
            className="rounded-lg object-cover"
          />
        </div>
      ))}
    </div>
  );
}