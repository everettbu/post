'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useComments } from './CommentContext';
import { Loader2 } from 'lucide-react';

interface CommentSectionProps {
  photoId: string;
  isOpen: boolean;
  onClose: () => void;
  caption?: string;
}

export function CommentSection({ photoId, isOpen, onClose, caption }: CommentSectionProps) {
  const { comments, addComment, isLoading } = useComments();
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [usernameSubmitted, setUsernameSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && content.trim()) {
      setIsSubmitting(true);
      await addComment(photoId, username, content);
      setContent('');
      setUsernameSubmitted(true);
      setIsSubmitting(false);
    }
  };

  const photoComments = comments.filter(comment => comment.photo_id === photoId);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Comments
          </DialogTitle>
        </DialogHeader>
        
        {caption && (
          <div className="bg-muted p-4 rounded-lg mb-4">
            <p className="text-md">{caption}</p>
          </div>
        )}

        <div className="h-[300px] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            photoComments.map((comment) => (
              <div key={comment.id} className="flex gap-3 mb-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{comment.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-2 mt-4">
          {!usernameSubmitted && (
            <Input
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mb-2"
            />
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Add a comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <Button 
              type="submit" 
              disabled={!username || !content.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Post'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}