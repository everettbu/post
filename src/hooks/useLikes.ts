import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { PhotoLikes } from '../data/photos';

export function useLikes() {
  const [likes, setLikes] = useState<PhotoLikes[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all likes
  useEffect(() => {
    fetchLikes();

    // Set up real-time subscription
    const subscription = supabase
      .channel('photo_likes_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'photo_likes' },
        (payload) => {
          const newLike = payload.new as PhotoLikes;
          setLikes(current => 
            current.map(like => 
              like.photoId === newLike.photoId 
                ? { photoId: newLike.photoId, count: newLike.count }
                : like
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function fetchLikes() {
    try {
      const { data, error } = await supabase
        .from('photo_likes')
        .select('photo_id, count');

      if (error) throw error;

      setLikes(
        data.map(item => ({
          photoId: item.photo_id,
          count: item.count
        }))
      );
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function incrementLike(photoId: string) {
    try {
      const { error } = await supabase.rpc('increment_like', {
        photo_id_input: photoId
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing like:', error);
    }
  }

  return {
    likes,
    loading,
    incrementLike
  };
} 