import fs from 'fs';
import path from 'path';

export function getRandomOgImage(): string {
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
}