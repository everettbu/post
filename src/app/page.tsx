import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen" suppressHydrationWarning={true}>
      {/* Nav Bar */}
      <nav className="bg-foreground shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 text-gray-500 hover:text-gray-700">
            <Link href="/" className="text-xl font-semibold">Everett Butler</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#timeline" className="text-gray-500 hover:text-gray-700">Timeline</a>
                <a href="#adventures" className="text-gray-500 hover:text-gray-700">Adventures</a>
                <a href="#photos" className="text-gray-500 hover:text-gray-700">Photos</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

        {/* Hero */}
        <section className="min-h-screen flex items-center justify-center pt-12">
          <div className=" px-4 text-center">
            <h1 className="text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Hello
            </h1>
          </div>
        </section>


      {/* Simple Footer */}
      <footer className="py-6 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>Made with ❤️</p>
        </div>
      </footer>
    </div>
  );
}
