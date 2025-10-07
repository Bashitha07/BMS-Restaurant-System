import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AdminMenu from '../components/AdminMenu';
import AdminOrders from '../components/AdminOrders';
import AdminReservations from '../components/AdminReservations';
import AdminDeliveryDrivers from '../components/AdminDeliveryDrivers';

export default function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('menu');

  const tabs = [
    { id: 'menu', name: 'Menu Management', href: '/admin/menu' },
    { id: 'orders', name: 'Order Management', href: '/admin/orders' },
    { id: 'reservations', name: 'Reservation Management', href: '/admin/reservations' },
    { id: 'drivers', name: 'Delivery Drivers', href: '/admin/drivers' },
  ];

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    navigate(tab.href);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="py-4">
        <Routes>
          <Route index element={<AdminMenu />} />
          <Route path="menu" element={<AdminMenu />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="drivers" element={<AdminDeliveryDrivers />} />
        </Routes>
      </div>
    </div>
  );
}