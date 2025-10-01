import React from 'react';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Restaurant</h1>
      <p className="text-lg text-gray-600 mb-8">Discover delicious food and make reservations</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Browse Menu</h2>
          <p className="text-gray-600">Explore our delicious menu items</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Make Reservation</h2>
          <p className="text-gray-600">Book a table for your special occasion</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Order Online</h2>
          <p className="text-gray-600">Place your order for pickup or delivery</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
