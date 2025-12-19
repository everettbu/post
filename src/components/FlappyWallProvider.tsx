'use client';

import { useState, useEffect, ReactNode } from 'react';
import FlappyJoeWall from './FlappyJoeWall';

const STORAGE_KEY = 'flappyJoeUnlocked';
const TARGET_SCORE = 14;

interface FlappyWallProviderProps {
  children: ReactNode;
}

export default function FlappyWallProvider({ children }: FlappyWallProviderProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    // Check localStorage on mount
    const unlocked = localStorage.getItem(STORAGE_KEY) === 'true';
    setIsUnlocked(unlocked);
  }, []);

  const handleUnlock = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setIsUnlocked(true);
  };

  // Show nothing while checking localStorage to prevent flash
  if (isUnlocked === null) {
    return (
      <div className="fixed inset-0 bg-black" />
    );
  }

  // Show the wall if not unlocked
  if (!isUnlocked) {
    return <FlappyJoeWall onUnlock={handleUnlock} targetScore={TARGET_SCORE} />;
  }

  // Show the site content if unlocked
  return <>{children}</>;
}
