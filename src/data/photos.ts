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
    caption: 'Met Matthew behind a 7-11',
    date: '05-08-2018',
    likes: 0
  },    
  {
    id: '2',
    url: '/photos/carp.jpg',
    caption: 'Holy Carp',
    date: '07-12-2015',
    likes: 0
  },
  {
    id: '3',
    url: '/photos/snowie.jpg',
    caption: 'Dawg',
    date: '07-12-2015',
    likes: 0
  },
  {
    id: '4',
    url: '/photos/kiss.jpg',
    caption: 'Big fish, big kiss',
    date: '08-23-2024',
    likes: 0
  },
  {
    id: '5',
    url: '/photos/peru.jpg',
    caption: 'Astonomer ruins in peru',
    date: '01-10-2024',
    likes: 0
  },
  {
    id: '6',
    url: '/photos/buddy.jpg',
    caption: 'Met HEB Buddy',
    date: '12-21-2017',
    likes: 0
  }
];
