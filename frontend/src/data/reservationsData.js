import React from 'react';
// Mock data for reservations
export const timeSlots = [
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
];

export const tables = [
  {
    id: 'T1',
    capacity: 2,
    section: 'Indoor',
  },
  {
    id: 'T2',
    capacity: 2,
    section: 'Indoor',
  },
  {
    id: 'T3',
    capacity: 4,
    section: 'Indoor',
  },
  {
    id: 'T4',
    capacity: 4,
    section: 'Indoor',
  },
  {
    id: 'T5',
    capacity: 6,
    section: 'Indoor',
  },
  {
    id: 'T6',
    capacity: 6,
    section: 'Outdoor',
  },
  {
    id: 'T7',
    capacity: 8,
    section: 'Outdoor',
  },
  {
    id: 'T8',
    capacity: 10,
    section: 'Private Room',
  },
];

export const reservations = [
  {
    id: 'RES-001',
    userId: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94712345678',
    date: '2023-05-25',
    time: '7:00 PM',
    guests: 4,
    tableId: 'T3',
    status: 'confirmed',
    createdAt: '2023-05-20T09:30:00Z',
  },
  {
    id: 'RES-002',
    userId: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+94712345678',
    date: '2023-06-05',
    time: '8:00 PM',
    guests: 2,
    tableId: 'T1',
    status: 'confirmed',
    createdAt: '2023-05-22T14:45:00Z',
  },
  {
    id: 'RES-003',
    userId: '3',
    name: 'Samantha Silva',
    email: 'samantha@example.com',
    phone: '+94723456789',
    date: '2023-06-05',
    time: '7:30 PM',
    guests: 6,
    tableId: 'T5',
    status: 'pending',
    createdAt: '2023-05-23T16:20:00Z',
  },
];

export const reservationStatuses = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
];

// Function to check availability
export const checkAvailability = (date, time, guests) => {
  // Get all reservations for the specified date and time
  const existingReservations = reservations.filter(
    (reservation) => reservation.date === date && reservation.time === time,
  );
  // Get IDs of tables already reserved
  const reservedTableIds = existingReservations.map((res) => res.tableId);
  // Find available tables that can accommodate the guests
  const availableTables = tables.filter(
    (table) => !reservedTableIds.includes(table.id) && table.capacity >= guests,
  );
  return availableTables.length > 0;
};
