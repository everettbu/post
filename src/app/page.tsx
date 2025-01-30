import React from "react";
import { FeaturedSection } from "@/components/home/FeaturedSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">

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