import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, CheckCircle, Clock, Navigation, User, Car, LogOut } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import driverService from '../../services/driverService';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { sendOrderUpdate } = useNotifications();
  
  const [driverInfo, setDriverInfo] = useState(null);
  const [assignedDeliveries, setAssignedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get driver info from localStorage
  useEffect(() => {
    const driver = driverService.getCurrentDriver();
    const token = driverService.getDriverToken();
    
    if (!driver || !token) {
      toast.error('Please login to access the dashboard');
      navigate('/driver/login');
      return;
    }
    
    setDriverInfo(driver);
    // Use driver.id (user ID) to fetch deliveries
    console.log('👤 [DRIVER DASHBOARD] Loaded driver info:', driver);
    loadMyDeliveries(driver.id);
  }, [navigate]);

  const loadMyDeliveries = async (driverId) => {
    try {
      setLoading(true);
      const deliveries = await driverService.getMyDeliveries(driverId);
      setAssignedDeliveries(deliveries || []);
    } catch (error) {
      console.error('Failed to load deliveries:', error);
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await driverService.logout(driverInfo?.id);
      toast.success('Logged out successfully');
      navigate('/driver/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/driver/login');
    }
  };

  const confirmPickup = async (orderId) => {
    try {
      console.log('📦 [DRIVER] Confirming pickup for order:', orderId);
      
      // Update order status to OUT_FOR_DELIVERY
      await driverService.updateDeliveryStatus(orderId, 'OUT_FOR_DELIVERY');
      
      toast.success('Pickup confirmed! Order is now out for delivery');
      
      // Reload deliveries to get updated data
      loadMyDeliveries(driverInfo.id);
    } catch (error) {
      console.error('Failed to confirm pickup:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to confirm pickup');
    }
  };

  const confirmDelivery = async (orderId, isCOD = false) => {
    try {
      console.log('✅ [DRIVER] Confirming delivery for order:', orderId, 'COD:', isCOD);
      
      let cashCollected = null;
      
      // If COD, prompt for cash amount
      if (isCOD) {
        const order = assignedDeliveries.find(d => d.id === orderId);
        const totalAmount = order?.totalAmount || 0;
        
        const confirmed = window.confirm(
          `Cash on Delivery\n\nTotal Amount: Rs. ${totalAmount.toFixed(2)}\n\nHave you collected the payment from the customer?`
        );
        
        if (!confirmed) {
          toast.error('Please collect payment before confirming delivery');
          return;
        }
        
        cashCollected = totalAmount;
        toast.success(`Cash collected: Rs. ${cashCollected.toFixed(2)}`);
      }
      
      // Update order status to DELIVERED
      await driverService.updateDeliveryStatus(orderId, 'DELIVERED', cashCollected);
      
      toast.success('Delivery completed successfully!');
      
      // Reload deliveries to get updated data
      loadMyDeliveries(driverInfo.id);
    } catch (error) {
      console.error('Failed to confirm delivery:', error);
      toast.error(typeof error === 'string' ? error : 'Failed to confirm delivery');
    }
  };

  const formatPrice = (price) => `Rs ${price?.toLocaleString() || 0}`;

  const getStatusColor = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING':
      case 'ASSIGNED': return 'text-yellow-600 bg-yellow-100';
      case 'PICKED_UP':
      case 'IN_TRANSIT': return 'text-blue-600 bg-blue-100';
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case 'PENDING': return 'Pending';
      case 'ASSIGNED': return 'Ready for Pickup';
      case 'PICKED_UP': return 'Out for Delivery';
      case 'IN_TRANSIT': return 'Out for Delivery';
      case 'DELIVERED': return 'Delivered';
      case 'CANCELLED': return 'Cancelled';
      default: return status || 'Unknown';
    }
  };

  if (!driverInfo) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading driver dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{driverInfo.name}</p>
                <p className="text-xs text-gray-500">
                  {driverInfo.vehicleNumber || driverInfo.vehicleType} | {driverInfo.phone}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg border border-red-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Driver Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{driverInfo.name}</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    {driverInfo.vehicleType} - {driverInfo.vehicleModel || driverInfo.vehicleNumber}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {driverInfo.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                driverInfo.status === 'AVAILABLE' 
                  ? 'bg-green-100 text-green-800' 
                  : driverInfo.status === 'ON_DELIVERY'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {driverInfo.status || 'Available'}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {assignedDeliveries.filter(d => d.status !== 'DELIVERED').length} active deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Deliveries Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">My Deliveries</h3>
          </div>

          {assignedDeliveries.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {assignedDeliveries.map((delivery) => (
                <div key={delivery.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            Delivery #{delivery.id} (Order #{delivery.orderId})
                          </h4>
                          <p className="text-sm text-gray-600">
                            {delivery.assignedDate 
                              ? new Date(delivery.assignedDate).toLocaleString() 
                              : 'Just assigned'}
                          </p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {getStatusText(delivery.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Delivery Details</h5>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-0.5 mr-2 text-gray-400 flex-shrink-0" />
                              <span>{delivery.deliveryAddress}</span>
                            </div>
                            {delivery.deliveryPhone && (
                              <div className="flex items-center">
                                <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                <span>{delivery.deliveryPhone}</span>
                              </div>
                            )}
                            {delivery.estimatedDeliveryTime && (
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                                <span>ETA: {new Date(delivery.estimatedDeliveryTime).toLocaleTimeString()}</span>
                              </div>
                            )}
                            {delivery.deliveryInstructions && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                  <strong>Special Instructions:</strong> {delivery.deliveryInstructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Delivery Info</h5>
                          <div className="space-y-1 text-sm">
                            {delivery.deliveryFee && (
                              <div className="flex justify-between">
                                <span>Delivery Fee:</span>
                                <span className="font-medium">{formatPrice(delivery.deliveryFee)}</span>
                              </div>
                            )}
                            {delivery.distanceKm && (
                              <div className="flex justify-between">
                                <span>Distance:</span>
                                <span>{delivery.distanceKm} km</span>
                              </div>
                            )}
                            {delivery.pickupTime && (
                              <div className="flex justify-between">
                                <span>Picked up:</span>
                                <span>{new Date(delivery.pickupTime).toLocaleTimeString()}</span>
                              </div>
                            )}
                            {delivery.deliveryNotes && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-gray-600"><strong>Notes:</strong> {delivery.deliveryNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        {/* Ready for Pickup -> Out for Delivery */}
                        {delivery.status === 'READY_FOR_PICKUP' && (
                          <button
                            onClick={() => confirmPickup(delivery.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Start Delivery (Out for Delivery)</span>
                          </button>
                        )}
                        
                        {/* Out for Delivery -> Delivered */}
                        {delivery.status === 'OUT_FOR_DELIVERY' && (
                          <button
                            onClick={() => confirmDelivery(delivery.id, delivery.paymentMethod === 'CASH_ON_DELIVERY')}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>
                              {delivery.paymentMethod === 'CASH_ON_DELIVERY' 
                                ? `Mark Delivered (Collect Rs. ${delivery.totalAmount?.toFixed(2)})` 
                                : 'Mark as Delivered'}
                            </span>
                          </button>
                        )}

                        {/* Show payment method badge */}
                        {delivery.paymentMethod === 'CASH_ON_DELIVERY' && delivery.status !== 'DELIVERED' && (
                          <div className="flex items-center px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg border-2 border-yellow-300">
                            <span className="font-semibold">💰 COD: Rs. {delivery.totalAmount?.toFixed(2)}</span>
                          </div>
                        )}

                        {delivery.deliveryPhone && (
                          <a
                            href={`tel:${delivery.deliveryPhone}`}
                            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                          >
                            <Phone className="w-5 h-5" />
                            <span>Call Customer</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No deliveries assigned</h3>
              <p>You'll see new delivery assignments here when they become available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;