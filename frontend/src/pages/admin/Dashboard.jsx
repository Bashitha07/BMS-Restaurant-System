import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Total Orders</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Total Revenue</h2>
          <p className="text-3xl font-bold text-black">LKR 0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Total Users</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2 text-black">Total Menu Items</h2>
          <p className="text-3xl font-bold text-black">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
