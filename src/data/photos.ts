export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  likes: number;
}

export interface PhotoLikes {
  photoId: string;
  count: number;
}

export const initialPhotos: Photo[] = [
  {
    id: '1',
    url: '/photos/matthew.jpg',
    caption: 'Not here',
    date: '09-14-2001',
    likes: 0
  },    
  {
    id: '2',
    url: '/photos/matthew.jpg',
    caption: 'HERE',
    date: '2024-03-20',
    likes: 0
  },
  {
    id: '3',
    url: '/photos/matthew.jpg',
    caption: '',
    date: '2024-03-20',
    likes: 0
  },
  {
    id: '4',
    url: '/photos/matthew.jpg',
    caption: 'Cheese',
    date: '2024-01-20',
    likes: 0
  }
];
