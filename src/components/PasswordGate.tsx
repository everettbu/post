'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'siteUnlocked';
const PASSWORD = 'stinky';

interface PasswordGateProps {
  children: React.ReactNode;
}

export default function PasswordGate({ children }: PasswordGateProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const unlocked = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === PASSWORD.toLowerCase()) {
      localStorage.setItem(STORAGE_KEY, 'true');
      // Signal that we just unlocked for burst mode
      sessionStorage.setItem('justUnlocked', 'true');
      setIsUnlocked(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  // Loading state
  if (isUnlocked === null) {
    return <div className="fixed inset-0 bg-background" />;
  }

  // Unlocked - show content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Locked - show password gate
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className={`
            bg-white text-zinc-900 text-xl text-center tracking-widest
            px-8 py-3 outline-none w-72 rounded-sm
            ${error ? 'animate-shake' : ''}
          `}
        />
      </form>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
