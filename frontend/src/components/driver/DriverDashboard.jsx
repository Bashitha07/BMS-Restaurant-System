import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import driverService from '../../services/driverService';

const DriverDashboard = ({ driver, onLogout }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationEnabled, setLocationEnabled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (driver) {
      fetchAvailableDeliveries();
      if (navigator.geolocation) {
        setLocationEnabled(true);
        startLocationTracking();
      }
    }
  }, [driver]);

  const fetchAvailableDeliveries = async () => {
    try {
      setLoading(true);
      const response = await driverService.getAvailableDeliveries(driver.id);
      setDeliveries(response);
    } catch (err) {
      setError('Failed to fetch deliveries');
    } finally {
      setLoading(false);
    }
  };

  const startLocationTracking = () => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          driverService.updateLocation(driver.id, latitude, longitude)
            .catch(console.error);
        },
        (error) => console.error('Location error:', error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    }
  };

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await driverService.acceptDelivery(driver.id, deliveryId);
      fetchAvailableDeliveries();
    } catch (err) {
      setError('Failed to accept delivery');
    }
  };

  const handleUpdateStatus = async (deliveryId, status) => {
    try {
      await driverService.updateDeliveryStatus(driver.id, deliveryId, status);
      fetchAvailableDeliveries();
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleCompleteDelivery = async (deliveryId, notes = '') => {
    try {
      await driverService.completeDelivery(driver.id, deliveryId, {
        notes,
        proofOfDelivery: 'Delivered successfully'
      });
      fetchAvailableDeliveries();
    } catch (err) {
      setError('Failed to complete delivery');
    }
  };

  const handleLogout = () => {
    // Clear ALL storage IMMEDIATELY
    localStorage.clear();
    sessionStorage.clear();
    
    // Dispatch logout event
    window.dispatchEvent(new CustomEvent('auth-logout'));
    
    // Call onLogout callback if provided
    if (onLogout) {
      onLogout();
    }
    
    // Immediate redirect - no async, no waiting
    window.location.replace('/driver/login');
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      PICKED_UP: 'bg-purple-100 text-purple-800',
      IN_TRANSIT: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
              <p className="text-gray-600">Welcome back, {driver?.name || driver?.username}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  driver?.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' : 
                  driver?.status === 'BUSY' ? 'bg-orange-100 text-orange-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {driver?.status}
                </span>
                {locationEnabled && (
                  <span className="text-green-600 text-xs">📍 GPS Active</span>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
            <button
              onClick={() => setError('')}
              className="float-right text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">📦</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Deliveries
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {driver?.totalDeliveries || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">⭐</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Rating
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {driver?.rating ? `${driver.rating}/5.0` : 'N/A'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Earnings
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      LKR {driver?.totalEarnings?.toLocaleString() || '0'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm">🎯</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Available Orders
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {deliveries.length}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Deliveries */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Available Deliveries
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Orders ready for pickup and delivery
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {deliveries.length === 0 ? (
              <li className="px-4 py-4 text-center text-gray-500">
                No deliveries available at the moment
              </li>
            ) : (
              deliveries.map((delivery) => (
                <li key={delivery.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          Order #{delivery.orderId}
                        </p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-500">
                        <p>📍 {delivery.deliveryAddress}</p>
                        <p>💰 Delivery Fee: LKR {delivery.deliveryFee}</p>
                        <p>📞 Customer: {delivery.customerPhone}</p>
                      </div>
                    </div>
                    <div className="ml-4 flex space-x-2">
                      {delivery.status === 'PENDING' && (
                        <button
                          onClick={() => handleAcceptDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Accept
                        </button>
                      )}
                      {delivery.status === 'ASSIGNED' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'PICKED_UP')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {delivery.status === 'PICKED_UP' && (
                        <button
                          onClick={() => handleUpdateStatus(delivery.id, 'IN_TRANSIT')}
                          className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1 rounded text-sm"
                        >
                          In Transit
                        </button>
                      )}
                      {delivery.status === 'IN_TRANSIT' && (
                        <button
                          onClick={() => handleCompleteDelivery(delivery.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;