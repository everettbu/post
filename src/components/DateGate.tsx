'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DateGateProps {
  onDateSubmit: (date: string) => void;
}

export default function DateGate({ onDateSubmit }: DateGateProps) {
  const [date, setDate] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const dateSubmitted = document.cookie.includes('date-submitted=true');
    if (dateSubmitted) {
      router.push('/');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputDate = new Date(date);
    
    // Use UTC methods to avoid timezone issues
    if (inputDate.getUTCMonth() === 8 && inputDate.getUTCDate() === 14 && inputDate.getUTCFullYear() === 2001) {
      // 24-hour expiration
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `date-submitted=true; path=/; expires=${expires}; SameSite=Strict`;
      onDateSubmit(date);
      setError('');
      try {
        router.push('/');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    } else {
      setError('Incorrect date. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button 
        type="submit" 
        className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Enter
      </button>
    </form>
  );
} 