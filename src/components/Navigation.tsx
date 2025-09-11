'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 w-full py-6 px-4 sm:px-8 z-50 bg-background">
      {/* Mobile layout - all 4 items evenly spaced */}
      <div className="flex sm:hidden items-center justify-around">
        <Link 
          href="/" 
          className="hover:scale-110 transition-transform"
          onClick={() => {
            setIsTapped(true);
            setTimeout(() => setIsTapped(false), 500);
          }}
        >
          <Image
            src={isTapped ? "/game/joe-2.png" : "/game/joe-1.png"}
            alt="Home"
            width={40}
            height={40}
            className="cursor-pointer"
          />
        </Link>
        <Link 
          href="/shop" 
          className="text-3xl hover:text-gray-600 transition-colors"
        >
          Shop
        </Link>
        <Link 
          href="/games" 
          className="text-3xl hover:text-gray-600 transition-colors"
        >
          Games
        </Link>
        <Link 
          href="/emojis" 
          className="text-3xl hover:text-gray-600 transition-colors"
        >
          Joemojis
        </Link>
      </div>
      
      {/* Desktop layout - home button on left, nav centered */}
      <div className="hidden sm:flex items-center justify-center relative">
        <Link 
          href="/" 
          className="absolute left-8 top-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Image
            src={isHovered ? "/game/joe-2.png" : "/game/joe-1.png"}
            alt="Home"
            width={50}
            height={50}
            className="cursor-pointer"
          />
        </Link>
        
        <div className="flex gap-12">
          <Link 
            href="/shop" 
            className="text-4xl hover:text-gray-600 transition-colors"
          >
            Shop
          </Link>
          <Link 
            href="/games" 
            className="text-4xl hover:text-gray-600 transition-colors"
          >
            Games
          </Link>
          <Link 
            href="/emojis" 
            className="text-4xl hover:text-gray-600 transition-colors"
          >
            Joemojis
          </Link>
        </div>
      </div>
    </nav>
  );
}