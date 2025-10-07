// Helper script to update menuData.js with consistent reliable images
import { getConsistentImage } from '../utils/enhancedImageUtils.js';

// Sample of how images should be updated
const sampleUpdatedItems = [
  {
    id: '2',
    name: 'Spaghetti Carbonara',
    description: 'Classic Italian pasta with eggs, cheese, pancetta, and black pepper',
    price: 1150,
    image: getConsistentImage('Spaghetti Carbonara', 'Pasta'),
    category: 'Pasta',
    available: true,
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Chicken Alfredo Pasta',
    description: 'Fettuccine pasta with creamy Alfredo sauce and grilled chicken',
    price: 1900,
    image: getConsistentImage('Chicken Alfredo Pasta', 'Pasta'),
    category: 'Pasta',
    available: true,
    rating: 4.6,
  },
  // Add more items as needed...
];

export { sampleUpdatedItems };