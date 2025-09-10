'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function EmojisPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const emojis = [
    '1FF7B09F-0576-45FE-99BF-8FF6AE1D7E55.png',
    '4D8580A6-4B78-4306-9804-91CD5A048AFC.png',
    '5C7CD7B2-AC63-4CDF-A71F-CAA60D6B0284.png',
    '65069DBE-7ABD-4452-BE0F-94401B252EB8.png',
    '9C02F0AA-BBE6-4BF7-A68B-5B141631FB69.png',
    '9DB918EF-7F84-44AF-97B5-72077B478F1C.png',
    'A0BCB42D-6E75-47FA-A730-B76494E204DF.png',
    'B05DC243-4AF3-4231-B11D-681E12CDAEFA.png',
    'C2A9927E-4339-41C9-A912-A600C6234CC8.png',
    'F5DCC241-B2B2-466A-A449-EC365D24767F.png',
  ];

  const handleCopyEmoji = async (emoji: string, index: number) => {
    try {
      // Check if on mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      
      if (isMobile && navigator.share) {
        // Mobile: Use native share (allows copying to clipboard in iOS)
        const response = await fetch(`/emojis/${emoji}`);
        const blob = await response.blob();
        const file = new File([blob], `emoji-${index + 1}.png`, { type: 'image/png' });
        
        await navigator.share({
          files: [file]
        });
        
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        // Desktop: Copy to clipboard
        const response = await fetch(`/emojis/${emoji}`);
        const blob = await response.blob();
        const pngBlob = blob.type === 'image/png' ? blob : await convertToPng(blob);
        
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': pngBlob
            })
          ]);
          
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        } else {
          // Fallback: Copy image URL
          await navigator.clipboard.writeText(window.location.origin + `/emojis/${emoji}`);
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        }
      }
    } catch (err) {
      console.error('Failed to handle emoji:', err);
      // Fallback: Copy image URL
      try {
        await navigator.clipboard.writeText(window.location.origin + `/emojis/${emoji}`);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy also failed:', fallbackErr);
      }
    }
  };

  const convertToPng = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((pngBlob) => {
          resolve(pngBlob || blob);
        }, 'image/png');
      };
      
      img.src = URL.createObjectURL(blob);
    });
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Click any emoji to copy it to your clipboard</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {emojis.map((emoji, index) => (
          <div
            key={emoji}
            className="relative group cursor-pointer"
            onClick={() => handleCopyEmoji(emoji, index)}
          >
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors">
              <Image
                src={`/emojis/${emoji}`}
                alt={`Emoji ${index + 1}`}
                fill
                className="object-contain p-2"
              />
            </div>
            
            {copiedIndex !== index && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                  Click to copy
                </span>
              </div>
            )}
            
            {copiedIndex === index && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 rounded-lg pointer-events-none">
                <span className="text-white font-semibold">Copied!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}