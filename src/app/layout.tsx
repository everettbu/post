'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        // If we're scrolling down and we're 100px or more from the top
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false);
        } else {
          // If we're scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      // Cleanup
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Nav Bar */}
        <nav className={`border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full top-0 z-10 transition-transform duration-300 ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                  Everett Butler
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="photos" className="text-muted-foreground hover:text-primary transition-colors">
                  Photos
                </Link>
                <Link href="travel" className="text-muted-foreground hover:text-primary transition-colors">
                  Travel
                </Link>
                <Link href="gallery" className="text-muted-foreground hover:text-primary transition-colors">
                  Gallery
                </Link>
                <Link href="timeline" className="text-muted-foreground hover:text-primary transition-colors">
                  Timeline
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
