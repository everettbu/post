import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // In production, return a predefined list or empty array
  if (process.env.NODE_ENV === 'production') {
    // You could maintain a static list of photos here if needed
    return NextResponse.json({ photos: [] });
  }
  
  try {
    const photosDirectory = path.join(process.cwd(), 'public', 'photos');
    const files = fs.readdirSync(photosDirectory);
    
    // Filter for image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });
    
    // Return the file paths relative to public
    const photos = imageFiles.map(file => `/photos/${file}`);
    
    return NextResponse.json({ photos });
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return NextResponse.json({ photos: [] });
  }
}