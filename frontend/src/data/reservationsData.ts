export interface Reservation {
  id: string;
  userId: string;
  date: string;
  time: string;
  guests: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  specialRequests?: string;
}

export const reservations: Reservation[] = [
  {
    id: '1',
    userId: '1', // Assuming user ID 1
    date: '2023-12-25',
    time: '19:00',
    guests: 4,
    status: 'confirmed',
    specialRequests: 'Window seat preferred',
  },
  {
    id: '2',
    userId: '1',
    date: '2023-12-30',
    time: '20:00',
    guests: 2,
    status: 'pending',
  },
  {
    id: '3',
    userId: '2', // Another user
    date: '2024-01-05',
    time: '18:30',
    guests: 6,
    status: 'confirmed',
  },
];
