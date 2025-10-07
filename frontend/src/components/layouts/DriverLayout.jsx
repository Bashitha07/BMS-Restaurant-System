import React from 'react';
import { useNavigate } from 'react-router-dom';
import driverService from '../../services/driverService';

const DriverLayout = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await driverService.logout();
      navigate('/driver/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      localStorage.removeItem('driverToken');
      localStorage.removeItem('driver');
      navigate('/driver/login');
    }
  };

  const driver = JSON.parse(localStorage.getItem('driver') || '{}');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Driver Navigation */}
      <nav className="bg-blue-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white text-xl font-bold">🚗 Driver Portal</h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    onClick={() => navigate('/driver/dashboard')}
                    className="text-gray-300 hover:bg-blue-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-white text-sm">
                <span className="font-medium">{driver.name || 'Driver'}</span>
                <span className="text-gray-300 ml-2">ID: {driver.driverId}</span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DriverLayout;
