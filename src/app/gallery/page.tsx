import Image from 'next/image'
import Link from 'next/link'

interface PhotoCollection {
  id: string
  title: string
  coverImage: string
  description: string
  photoCount: number
}

const collections: PhotoCollection[] = [
  {
    id: 'nature',
    title: 'Nature Photography',
    coverImage: '/public/gallery/example.jpg',
    description: 'Beautiful landscapes and wildlife',
    photoCount: 12 // TODO: pull the number of photos from the folder
  },
  {
    id: 'urban',
    title: 'Urban Scenes',
    coverImage: '/public/gallery/example.jpg',
    description: 'City life and architecture',
    photoCount: 8
  },
  {
    id: 'birding',
    title: 'Birding',
    coverImage: '/public/gallery/example.jpg',
    description: 'Bird photography and wildlife',
    photoCount: 8 
  },
]

export default function GalleryPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Photo Gallery</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link 
            href={`/gallery/${collection.id}`} 
            key={collection.id}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <div className="relative h-48 w-full">
                <Image
                  src={collection.coverImage}
                  alt={collection.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{collection.title}</h2>
                <p className="text-gray-600 mb-2">{collection.description}</p>
                <p className="text-sm text-gray-500">{collection.photoCount} photos</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}
