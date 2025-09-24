import fs from 'fs';
import path from 'path';

export function getRandomOgImage(): string {
  // In production, we can't use fs.readdirSync
  // Return a static image instead
  if (process.env.NODE_ENV === 'production') {
    // Use a specific image that we know exists
    return 'https://joep.com/photos/CD51BA7B-429E-4565-9A79-4B9883F43AD7.PNG';
  }
  
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos');
    const imageFiles = fs.readdirSync(photosDir).filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    });
    
    if (imageFiles.length === 0) {
      return '/game/joe-1.png';
    }
    
    const randomIndex = Math.floor(Math.random() * imageFiles.length);
    const selectedImage = imageFiles[randomIndex];
    
    return `/photos/${selectedImage}`;
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return '/game/joe-1.png';
  }
}