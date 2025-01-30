import React from "react";
import Link from "next/link";
import { FeaturedSection } from "@/components/FeaturedSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav Bar */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-xl font-semibold text-foreground hover:text-primary transition-colors">
                Everett Butler
              </Link>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#timeline" className="text-muted-foreground hover:text-primary transition-colors">
                Timeline
              </Link>
              <Link href="#adventures" className="text-muted-foreground hover:text-primary transition-colors">
                Adventures
              </Link>
              <Link href="#photos" className="text-muted-foreground hover:text-primary transition-colors">
                Photos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-4 relative bg-[url('/hero.jpg')] bg-cover bg-[center_20%]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-background/70 to-background z-0" />
        <div className="text-center space-y-6 relative z-10 -mt-32">
          <p className="text-2xl text-gray-200 max-w-2xl mx-auto">
            If you&apos;re here, you know what I&apos;m about.
          </p>
          <h1 className="text-6xl font-bold text-white tracking-tight">
            Welcome to my website.
          </h1>
        </div>
      </section>
  
      <FeaturedSection />

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">Made with ❤️ using Next.js and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
}