'use client';

// import { useState } from 'react';
// import Image from 'next/image';

export default function EmojisPage() {
  // TEMPORARILY DISABLED - Remove this block to re-enable joemojis
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4 text-white">Coming Soon...</h1>
        <p className="text-2xl text-gray-400">
          Joemojis available 9/26/25, 2pm PST
        </p>
      </div>
    </div>
  );

  // Original joemojis code - uncomment below to re-enable
  /*
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null);

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
        setAnimatingIndex(index);
        setTimeout(() => {
          setAnimatingIndex(null);
          setTimeout(() => setCopiedIndex(null), 300);
        }, 1700);
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
          setAnimatingIndex(index);
          setTimeout(() => {
            setAnimatingIndex(null);
            setTimeout(() => setCopiedIndex(null), 300);
          }, 1700);
        } else {
          // Fallback: Copy image URL
          await navigator.clipboard.writeText(window.location.origin + `/emojis/${emoji}`);
          setCopiedIndex(index);
          setAnimatingIndex(index);
          setTimeout(() => {
            setAnimatingIndex(null);
            setTimeout(() => setCopiedIndex(null), 300);
          }, 1700);
        }
      }
    } catch (err) {
      console.error('Failed to handle emoji:', err);
      // Fallback: Copy image URL
      try {
        await navigator.clipboard.writeText(window.location.origin + `/emojis/${emoji}`);
        setCopiedIndex(index);
        setAnimatingIndex(index);
        setTimeout(() => {
          setAnimatingIndex(null);
          setTimeout(() => setCopiedIndex(null), 300);
        }, 1700);
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
    <div className="fixed inset-0 overflow-hidden">
      <div className="h-full pt-32 pb-8 px-4 sm:px-8 overflow-y-auto">
        <div className="text-left mb-8">
          <p className="text-2xl sm:text-3xl text-white/70">Click joemoji to copy to clipboard</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
        {emojis.map((emoji, index) => (
          <div
            key={emoji}
            className="relative group cursor-pointer h-fit transform transition-all duration-300 hover:scale-105 hover:rotate-2"
            onClick={() => handleCopyEmoji(emoji, index)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/50 to-blue-600/50 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all duration-300 shadow-xl">
              <Image
                src={`/emojis/${emoji}`}
                alt={`Emoji ${index + 1}`}
                fill
                className="object-contain p-4 drop-shadow-2xl"
              />
              
              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            {copiedIndex !== index && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 sm:group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="bg-white/90 backdrop-blur-md text-black px-4 py-2 rounded-full text-sm font-bold shadow-2xl transform group-hover:scale-110 transition-transform">
                  TAP TO COPY
                </span>
              </div>
            )}
            
            {copiedIndex === index && (
              <div className={`absolute inset-0 flex items-center justify-center rounded-2xl pointer-events-none transition-all duration-300 ${
                animatingIndex === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}>
                <div className="bg-gradient-to-br from-green-400 to-blue-400 text-white font-bold text-lg px-6 py-3 rounded-full shadow-2xl">
                  ✓ COPIED!
                </div>
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
    </div>
  );
  */
}