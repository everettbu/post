export interface Photo {
  id: string;
  url: string;
  caption: string;
  likes: number;
  date: string;
}

export const initialPhotos: Photo[] = [
  {
    id: '1',
    url: '/photos/matthew.jpg',
    caption: 'Not here',
    likes: 0,
    date: '09-14-2001'
  },    
  {
    id: '2',
    url: '/photos/sample-photo-2.jpg',
    caption: 'HERE',
    likes: 0,
    date: '2024-03-20'
  },
  {
    id: '3',
    url: '/photos/sample-photo-3.jpg',
    caption: '',
    likes: 0,
    date: '2024-03-20'
  },
  {
    id: '4',
    url: '/photos/matthew.jpg',
    caption: 'Cheese',
    likes: 0,
    date: '2024-01-20'
  }
];