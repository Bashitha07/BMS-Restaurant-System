// Simple test to verify menu data structure
import { menuItems, menuCategories } from './menuData.js';

console.log('=== MENU DATA TEST ===');
console.log('Total menu items:', menuItems.length);
console.log('Available categories:', menuCategories);

// Count items per category
const categoryCounts = {};
menuItems.forEach(item => {
  if (!categoryCounts[item.category]) {
    categoryCounts[item.category] = 0;
  }
  categoryCounts[item.category]++;
});

console.log('\n=== CATEGORY DISTRIBUTION ===');
Object.entries(categoryCounts).sort((a, b) => a[1] - b[1]).forEach(([category, count]) => {
  console.log(`${category}: ${count} items`);
});

// Test specific problematic categories
console.log('\n=== PROBLEMATIC CATEGORIES TEST ===');
const pastaItems = menuItems.filter(item => item.category === 'Pasta');
console.log('Pasta items:', pastaItems.length);
pastaItems.forEach(item => console.log(`  - ${item.name} (ID: ${item.id})`));

const submarineItems = menuItems.filter(item => item.category === 'Submarines');
console.log('\nSubmarine items:', submarineItems.length);
submarineItems.forEach(item => console.log(`  - ${item.name} (ID: ${item.id})`));

const mainCourseItems = menuItems.filter(item => item.category === 'Main Course');
console.log('\nMain Course items:', mainCourseItems.length);
mainCourseItems.forEach(item => console.log(`  - ${item.name} (ID: ${item.id})`));

console.log('\n=== TEST COMPLETE ===');