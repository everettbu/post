'use client';

import React, { createContext, useContext, useState } from 'react';

interface Comment {
  id: string;
  photoId: string;
  username: string;
  content: string;
  timestamp: string;
}

interface CommentContextType {
  comments: Comment[];
  addComment: (photoId: string, username: string, content: string) => void;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([]);

  const addComment = (photoId: string, username: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      photoId,
      username,
      content,
      timestamp: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  return (
    <CommentContext.Provider value={{ comments, addComment }}>
      {children}
    </CommentContext.Provider>
  );
}

export function useComments() {
  const context = useContext(CommentContext);
  if (context === undefined) {
    throw new Error('useComments must be used within a CommentProvider');
  }
  return context;
} 