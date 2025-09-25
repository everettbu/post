import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  // In production, return a predefined list of photos
  if (process.env.NODE_ENV === 'production') {
    // Static list of photos for production - Updated with all 43 photos
    const productionPhotos = [
      '/photos/06816E51-75C4-4129-874C-CC158BC0DACD.PNG',
      '/photos/14534E31-A53B-4758-80DA-CCD908BF66A1.png',
      '/photos/1F68B340-8E66-4AAD-BE5F-470725F7E9AD.PNG',
      '/photos/203016FA-E422-4B92-A9A7-23FD8A0E7919 2.PNG',
      '/photos/27C4E3A3-AA43-48FF-8D16-6F2D536CC3EF.PNG',
      '/photos/336E62C9-1363-49B7-9E90-00F2016FFF15.PNG',
      '/photos/39850345-9974-4126-9557-0E6510346C6A.PNG',
      '/photos/4DDA3973-45E5-4E19-B4DC-3BD8BA0E2D65.PNG',
      '/photos/503ADBDF-BAAB-4674-A4C4-6EA95969012C.PNG',
      '/photos/5499D3B8-0BD1-4820-AD19-E4F82627CF48.PNG',
      '/photos/6FC0E6DF-03AA-4486-B522-260BEEF7B0ED 2.PNG',
      '/photos/715747DA-3FB4-4DA0-89FB-967E156F6DA1.PNG',
      '/photos/727E5F78-A61A-4494-887C-61A40DA53BEB.png',
      '/photos/7a91a668-ac7e-4b1b-bad2-911403e7a730.png',
      '/photos/8C2EF758-D6E2-425B-97CD-87302A5E9AC2.PNG',
      '/photos/90D218BB-A81F-46C8-92E0-1429EB4C3729.png',
      '/photos/914D8A87-A391-4115-A485-F79D3BECE39A.JPG',
      '/photos/9A0BF430-73E5-4A2E-A409-4321B2BD9948.PNG',
      '/photos/9E38CC7F-8DB6-4570-984A-874DBE527016.png',
      '/photos/A43CDC02-5571-4694-9D2B-739E29AC8760.PNG',
      '/photos/A4E851A0-D153-4157-8391-91FEC41EF74B.PNG',
      '/photos/A919F9A6-A270-45C0-8492-8BB4FCC141FA.png',
      '/photos/AA8136DE-D0F0-45C6-99B4-1F17F09D108E.PNG',
      '/photos/B0F13646-1AB1-4143-9FB0-286B86DC4304.PNG',
      '/photos/B6900461-2E2D-425D-88D2-F0E96969889A.PNG',
      '/photos/C64D7007-5BE2-4A73-98E4-2CA9426FFD5B.PNG',
      '/photos/C87126F2-88DC-49F9-8016-CF575E26BB19.PNG',
      '/photos/CA847D8B-0E7C-43D7-9A5C-4BBE910E728D.PNG',
      '/photos/CAB658B8-BF7D-4ECA-920A-88E45E4987EE.JPG',
      '/photos/CD51BA7B-429E-4565-9A79-4B9883F43AD7.PNG',
      '/photos/D867FBD9-5CC1-478C-9356-A8AD616E0076.png',
      '/photos/DAE45FFE-43E2-477B-B783-F82D1E4A3997.JPG',
      '/photos/E045245D-5619-4F82-9563-F8321208F8E3.PNG',
      '/photos/E2F716F8-E971-4E35-90AA-42EB59314AA9.PNG',
      '/photos/E65D6DE8-EBDB-4AA7-B857-1C1AF56F45DE.PNG',
      '/photos/F3A117CA-4497-4375-BC26-4A9E0B40DF32.png',
      '/photos/Joe P.JPEG',
      '/photos/PNG image (1).PNG',
      '/photos/PNG image (3).PNG',
      '/photos/PNG image (4).PNG',
      '/photos/PNG image 2.PNG',
      '/photos/PNG image.PNG',
      '/photos/updatedgnome.PNG'
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