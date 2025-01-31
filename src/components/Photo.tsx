import { useLikes } from '../hooks/useLikes';
import type { Photo as PhotoType } from '@/data/photos';

export function Photo({ photo }: { photo: PhotoType }) {
  const { likes, loading, incrementLike } = useLikes();
  
  const photoLikes = likes.find(like => like.photoId === photo.id)?.count ?? 0;

  return (
    <div>
      {/* Your existing photo display code */}
      <button 
        onClick={() => incrementLike(photo.id)}
        disabled={loading}
      >
        ❤️ {photoLikes}
      </button>
    </div>
  );
} 