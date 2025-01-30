'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

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
  deleteComment?: (commentId: string) => void; // Optional feature for later
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([]);

  // Load comments from localStorage on initial render
  useEffect(() => {
    const savedComments = localStorage.getItem('photoComments');
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, []);

  const addComment = (photoId: string, username: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      photoId,
      username,
      content,
      timestamp: new Date().toISOString(),
    };
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    // Save to localStorage
    localStorage.setItem('photoComments', JSON.stringify(updatedComments));
  };

  // Optional: Add delete functionality
  const deleteComment = (commentId: string) => {
    const updatedComments = comments.filter(comment => comment.id !== commentId);
    setComments(updatedComments);
    localStorage.setItem('photoComments', JSON.stringify(updatedComments));
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, deleteComment }}>
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