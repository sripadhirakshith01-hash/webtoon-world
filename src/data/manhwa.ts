export interface Manhwa {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genre: string[];
  status: 'ongoing' | 'completed';
  rating: number;
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  title: string;
  number: number;
  pages: string[];
  publishDate: string;
}

export const manhwaData: Manhwa[] = [
  {
    id: 'shadow-realm',
    title: 'Shadow Realm Chronicles',
    author: 'Kim Hana',
    description: 'A young warrior discovers mysterious powers that connect him to an ancient shadow realm. As dark forces threaten both worlds, he must master his abilities to save everything he holds dear.',
    coverImage: 'src/assets/manhwa-1.jpg',
    genre: ['Fantasy', 'Action', 'Supernatural'],
    status: 'ongoing',
    rating: 4.8,
    chapters: [
      {
        id: 'ch-1',
        title: 'The Awakening',
        number: 1,
        pages: ['src/assets/manhwa-1.jpg'],
        publishDate: '2024-01-15'
      },
      {
        id: 'ch-2',
        title: 'First Steps',
        number: 2,
        pages: ['src/assets/manhwa-1.jpg'],
        publishDate: '2024-01-22'
      },
      {
        id: 'ch-3',
        title: 'Dark Secrets',
        number: 3,
        pages: ['src/assets/manhwa-1.jpg'],
        publishDate: '2024-01-29'
      }
    ]
  },
  {
    id: 'neon-assassin',
    title: 'Neon Assassin',
    author: 'Park Jinho',
    description: 'In a cyberpunk future, a skilled assassin navigates the neon-lit streets while uncovering a conspiracy that threatens the entire city. Technology and martial arts collide in this thrilling adventure.',
    coverImage: 'src/assets/manhwa-2.jpg',
    genre: ['Cyberpunk', 'Action', 'Thriller'],
    status: 'ongoing',
    rating: 4.7,
    chapters: [
      {
        id: 'ch-1-na',
        title: 'Night Hunter',
        number: 1,
        pages: ['src/assets/manhwa-2.jpg'],
        publishDate: '2024-02-01'
      },
      {
        id: 'ch-2-na',
        title: 'Corporate Secrets',
        number: 2,
        pages: ['src/assets/manhwa-2.jpg'],
        publishDate: '2024-02-08'
      }
    ]
  },
  {
    id: 'elemental-academy',
    title: 'Elemental Academy',
    author: 'Lee Minseo',
    description: 'A prestigious magical academy trains young mages to master the elements. Follow the journey of a talented student as they navigate friendships, rivalries, and ancient mysteries.',
    coverImage: 'src/assets/manhwa-3.jpg',
    genre: ['Magic', 'School', 'Adventure'],
    status: 'completed',
    rating: 4.9,
    chapters: [
      {
        id: 'ch-1-ea',
        title: 'Welcome to Academy',
        number: 1,
        pages: ['src/assets/manhwa-3.jpg'],
        publishDate: '2024-01-10'
      },
      {
        id: 'ch-2-ea',
        title: 'Fire and Ice',
        number: 2,
        pages: ['src/assets/manhwa-3.jpg'],
        publishDate: '2024-01-17'
      },
      {
        id: 'ch-3-ea',
        title: 'The Final Test',
        number: 3,
        pages: ['src/assets/manhwa-3.jpg'],
        publishDate: '2024-01-24'
      }
    ]
  }
];