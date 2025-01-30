'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DateGateProps {
  onDateSubmit: (date: string) => void;
}

const DateGate = ({ onDateSubmit }: DateGateProps) => {
  const [mounted, setMounted] = useState(false);
  const [date, setDate] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const dateSubmitted = document.cookie.includes('date-submitted=true');
    if (dateSubmitted) {
      router.push('/');
    }
  }, [router]);

  if (!mounted) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const inputDate = new Date(date);
    
    // Use UTC methods to avoid timezone issues
    if (inputDate.getUTCMonth() === 8 && inputDate.getUTCDate() === 14 && inputDate.getUTCFullYear() === 2001) {
      // 24-hour expiration
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `date-submitted=true; path=/; expires=${expires}; SameSite=Strict`;
      onDateSubmit(date);
      try {
        router.push('/');
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-12">
      <p className="text-lg mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
        Enter birthday for access
      </p>
      <div className="flex items-center gap-4 justify-center" style={{ color: 'var(--text-tertiary)' }}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="p-2 border rounded text-black"
          required
        />
        <button 
          type="submit" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Enter
        </button>
      </div>
    </form>
  );
};

export default DateGate; 