import React from 'react';
import { menuItems, menuCategories } from '../data/menuData';

const MenuDebug = () => {
  console.log('=== MENU DEBUG COMPONENT ===');
  console.log('Total menu items:', menuItems?.length || 'undefined');
  console.log('Menu categories:', menuCategories);
  
  const categoryCounts = {};
  if (menuItems) {
    menuItems.forEach(item => {
      if (!categoryCounts[item.category]) {
        categoryCounts[item.category] = 0;
      }
      categoryCounts[item.category]++;
    });
  }
  
  console.log('Category distribution:', categoryCounts);
  
  const pastaItems = menuItems?.filter(item => item.category === 'Pasta') || [];
  const submarineItems = menuItems?.filter(item => item.category === 'Submarines') || [];
  const mainCourseItems = menuItems?.filter(item => item.category === 'Main Course') || [];
  
  console.log('Pasta items:', pastaItems.length);
  console.log('Submarine items:', submarineItems.length);
  console.log('Main Course items:', mainCourseItems.length);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Menu Data Debug</h1>
      
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Data Overview</h2>
        <p><strong>Total Items:</strong> {menuItems?.length || 'undefined'}</p>
        <p><strong>Categories:</strong> {menuCategories?.length || 'undefined'}</p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Category Distribution</h2>
        {Object.entries(categoryCounts).map(([category, count]) => (
          <p key={category}><strong>{category}:</strong> {count} items</p>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-2">Problematic Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-purple-600">Pasta ({pastaItems.length} items)</h3>
            {pastaItems.map(item => (
              <p key={item.id} className="text-sm">• {item.name}</p>
            ))}
          </div>
          <div>
            <h3 className="font-medium text-purple-600">Submarines ({submarineItems.length} items)</h3>
            {submarineItems.map(item => (
              <p key={item.id} className="text-sm">• {item.name}</p>
            ))}
          </div>
          <div>
            <h3 className="font-medium text-purple-600">Main Course ({mainCourseItems.length} items)</h3>
            {mainCourseItems.map(item => (
              <p key={item.id} className="text-sm">• {item.name}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-2">Available Categories</h2>
        <div className="flex flex-wrap gap-2">
          {menuCategories?.map(category => (
            <span key={category} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuDebug;