import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // In production, return a predefined list of photos
  if (process.env.NODE_ENV === 'production') {
    // Static list of photos for production
    const productionPhotos = [
      '/photos/06816E51-75C4-4129-874C-CC158BC0DACD.PNG',
      '/photos/14534E31-A53B-4758-80DA-CCD908BF66A1.png',
      '/photos/1F68B340-8E66-4AAD-BE5F-470725F7E9AD.PNG',
      '/photos/27C4E3A3-AA43-48FF-8D16-6F2D536CC3EF.PNG',
      '/photos/284CC577-4B68-4873-94E6-8B4FCD1D737A.JPG',
      '/photos/336E62C9-1363-49B7-9E90-00F2016FFF15.PNG',
      '/photos/39850345-9974-4126-9557-0E6510346C6A.PNG',
      '/photos/4DDA3973-45E5-4E19-B4DC-3BD8BA0E2D65.PNG',
      '/photos/5499D3B8-0BD1-4820-AD19-E4F82627CF48.PNG',
      '/photos/596016C5-265C-45D0-B7DC-9C0311D4D715.PNG',
      '/photos/715747DA-3FB4-4DA0-89FB-967E156F6DA1.PNG',
      '/photos/727E5F78-A61A-4494-887C-61A40DA53BEB.png',
      '/photos/7a91a668-ac7e-4b1b-bad2-911403e7a730.png',
      '/photos/8C2EF758-D6E2-425B-97CD-87302A5E9AC2.PNG',
      '/photos/90D218BB-A81F-46C8-92E0-1429EB4C3729.png',
      '/photos/914D8A87-A391-4115-A485-F79D3BECE39A.JPG',
      '/photos/9A0BF430-73E5-4A2E-A409-4321B2BD9948.PNG',
      '/photos/9E38CC7F-8DB6-4570-984A-874DBE527016.png',
      '/photos/CD51BA7B-429E-4565-9A79-4B9883F43AD7.PNG'
    ];
    
    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = [...productionPhotos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return NextResponse.json({ photos: shuffled });
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
    
    // Shuffle the array
    const shuffled = [...photos];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return NextResponse.json({ photos: shuffled });
  } catch (error) {
    console.error('Error reading photos directory:', error);
    return NextResponse.json({ photos: [] });
  }
}