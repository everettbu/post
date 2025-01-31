import React from "react";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { Timeline } from "@/components/home/Timeline";

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

      {/* Timeline Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">Timeline of Events Post Graduation</h2>
          <Timeline />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 bg-background">
        <div className="container mx-auto px-4">
          <nav className="mb-4">
            <ul className="flex justify-center space-x-6">
              <li>
              </li>
              <li>
                <a href="/baboon-jokes" className="text-muted-foreground hover:text-foreground transition">
                  Baboon Jokes
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}