'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface Comment {
  id: string;
  photo_id: string;
  content: string;
  created_at: string;
  user_id?: string;
  username: string;  // We'll keep this for now, but ideally would come from users table
}

interface CommentContextType {
  comments: Comment[];
  addComment: (photoId: string, username: string, content: string) => Promise<void>;
  deleteComment?: (commentId: string) => Promise<void>;
  isLoading: boolean;
}

const CommentContext = createContext<CommentContextType | undefined>(undefined);

export function CommentProvider({ children }: { children: React.ReactNode }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load comments from Supabase on initial render
  useEffect(() => {
    const fetchComments = async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching comments:', error);
        return;
      }

      setComments(data);
      setIsLoading(false);
    };

    fetchComments();

    // Subscribe to changes
    const channel = supabase.channel('comments_channel');
    
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments'
        },
        (payload: RealtimePostgresChangesPayload<Comment>) => {
          if (payload.eventType === 'INSERT') {
            setComments(current => [payload.new as Comment, ...current]);
          } else if (payload.eventType === 'DELETE') {
            setComments(current => 
              current.filter(comment => comment.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const addComment = async (photoId: string, username: string, content: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            photo_id: photoId,
            username,
            content,
          }
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Optimistic update handled by real-time subscription
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      // Optimistic update handled by real-time subscription
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <CommentContext.Provider value={{ comments, addComment, deleteComment, isLoading }}>
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