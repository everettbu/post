import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Nav Bar */}
      <nav className="bg-white shadow-sm fixed w-full top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-semibold">Everett Butler</Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <a href="#timeline" className="text-gray-600 hover:text-gray-900">Timeline</a>
                <a href="#adventures" className="text-gray-600 hover:text-gray-900">Adventures</a>
                <a href="#photos" className="text-gray-600 hover:text-gray-900">Photos</a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="min-h-screen flex items-center justify-center pt-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Hello, welcome to everettbutler.com
          </h1>
          <p className="mt-4 text-xl" style={{ color: 'var(--text-secondary)' }}>
            I bought a domain, and deleted social media. This is where you can find me.
          </p>
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
