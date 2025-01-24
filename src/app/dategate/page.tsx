'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import DateGate from '../../components/DateGate';

export default function GatePage() {
  const router = useRouter();

  const handleDateSubmit = (date: string) => {
    // You can add any date validation logic here
    console.log('Selected date:', date);
    router.push('/'); // Redirect to home page after date submission
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[var(--background)]">
      <div className="container mx-auto px-4 text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Hello, welcome to everettbutler.com
        </h1>
        <p className="mt-4 text-lg md:text-xl" style={{ color: 'var(--text-secondary)' }}>
          I bought a domain, and deleted social media. This is where you can find me.
        </p>
      </div>
      
      <DateGate onDateSubmit={handleDateSubmit} />
    </div>
  );
} 