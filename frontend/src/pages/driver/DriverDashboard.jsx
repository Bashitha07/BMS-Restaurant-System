import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { MapPin, Phone, CheckCircle, Clock, Navigation, User, Car } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const DriverDashboard = () => {
  const { sendOrderUpdate } = useNotifications();
  
  const [driverInfo] = useState({
    id: 'DRV001',
    name: 'Kamal Perera',
    vehicle: 'CAR-1234',
    phone: '+94 77 123 4567',
    status: 'available' // available, busy, offline
  });

  const [assignedOrders, setAssignedOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock assigned orders - replace with API calls
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD-001',
        orderId: '1759420941032',
        userId: 2, // Customer user ID for notifications
        customerName: 'John Doe',
        customerPhone: '+94 71 234 5678',
        deliveryAddress: 'No 45, Galle Road, Colombo 03',
        items: [
          { name: 'Chicken Kottu', quantity: 2, price: 800 },
          { name: 'Fish Curry', quantity: 1, price: 650 }
        ],
        total: 2250,
        status: 'assigned', // assigned, picked_up, delivered
        assignedAt: new Date(Date.now() - 15 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000),
        specialInstructions: 'Ring the bell twice, apartment 3A'
      },
      {
        id: 'ORD-002',
        orderId: '1759420941033',
        userId: 3, // Customer user ID for notifications
        customerName: 'Jane Smith',
        customerPhone: '+94 77 987 6543',
        deliveryAddress: 'No 12, Kandy Road, Malabe',
        items: [
          { name: 'Rice & Curry', quantity: 1, price: 450 }
        ],
        total: 450,
        status: 'picked_up',
        assignedAt: new Date(Date.now() - 45 * 60 * 1000),
        pickedUpAt: new Date(Date.now() - 20 * 60 * 1000),
        estimatedDelivery: new Date(Date.now() + 15 * 60 * 1000)
      }
    ];
    
    setTimeout(() => {
      setAssignedOrders(mockOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const confirmPickup = async (orderId) => {
    try {
      const order = assignedOrders.find(o => o.id === orderId);
      
      setAssignedOrders(orders =>
        orders.map(order =>
          order.id === orderId
            ? { ...order, status: 'picked_up', pickedUpAt: new Date() }
            : order
        )
      );
      
      // Send notification update to customer only (not to all users)
      sendOrderUpdate(order.orderId, 'out_for_delivery', {
        name: driverInfo.name,
        vehicle: driverInfo.vehicle,
        phone: driverInfo.phone
      }, order.userId); // Pass customer's userId to target notifications
      
      toast.success('Order pickup confirmed and customer notified');
    } catch (error) {
      toast.error('Failed to confirm pickup');
    }
  };

  const confirmDelivery = async (orderId) => {
    try {
      const order = assignedOrders.find(o => o.id === orderId);
      
      setAssignedOrders(orders =>
        orders.map(order =>
          order.id === orderId
            ? { ...order, status: 'delivered', deliveredAt: new Date() }
            : order
        )
      );
      
      // Send delivery completion notification to customer only (not to all users)
      sendOrderUpdate(order.orderId, 'delivered', null, order.userId); // Pass customer's userId to target notifications
      
      toast.success('Order delivery confirmed and customer notified');
    } catch (error) {
      toast.error('Failed to confirm delivery');
    }
  };

  // Demo function to simulate new order assignment
  const simulateNewOrder = () => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderId: `${Date.now()}`,
      customerName: 'Demo Customer',
      customerPhone: '+94 71 555 0123',
      deliveryAddress: 'No 123, Demo Street, Colombo 07',
      items: [
        { name: 'Chicken Rice', quantity: 1, price: 750 }
      ],
      total: 750,
      status: 'assigned',
      assignedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
      specialInstructions: 'Test order for demonstration'
    };
    
    setAssignedOrders(prev => [newOrder, ...prev]);
    toast.success('New order assigned for demo!');
  };

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'assigned': return 'text-yellow-600 bg-yellow-100';
      case 'picked_up': return 'text-blue-600 bg-blue-100';
      case 'delivered': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'assigned': return 'Ready for Pickup';
      case 'picked_up': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

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
                <p className="text-xs text-gray-500">ID: {driverInfo.id} | {driverInfo.vehicle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Demo Testing Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">🚗 Driver Workflow Demo</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">How to Test Driver Updates:</h4>
              <ol className="space-y-1 text-blue-700">
                <li>1. Click "Confirm Pickup" on assigned orders</li>
                <li>2. Status changes to "Out for Delivery"</li>
                <li>3. Click "Confirm Delivery" to complete</li>
                <li>4. Customer gets real-time notifications</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">System Updates:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Automatic customer notifications</li>
                <li>• Real-time status tracking</li>
                <li>• Driver info shared with customer</li>
                <li>• Toast confirmations for driver</li>
              </ul>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={simulateNewOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
            >
              🎯 Add Demo Order for Testing
            </button>
          </div>
        </div>

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
                    {driverInfo.vehicle}
                  </span>
                  <span className="flex items-center">
                    <Phone className="w-4 h-4 mr-1" />
                    {driverInfo.phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                Available
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {assignedOrders.filter(o => o.status !== 'delivered').length} active deliveries
              </p>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Assigned Orders</h3>
          </div>

          {assignedOrders.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {assignedOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            Order #{order.orderId}
                          </h4>
                          <p className="text-sm text-gray-600">{order.customerName}</p>
                        </div>
                        <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Delivery Details</h5>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-start">
                              <MapPin className="w-4 h-4 mt-0.5 mr-2 text-gray-400" />
                              <span>{order.deliveryAddress}</span>
                            </div>
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-2 text-gray-400" />
                              <span>{order.customerPhone}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              <span>ETA: {order.estimatedDelivery.toLocaleTimeString()}</span>
                            </div>
                            {order.specialInstructions && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded border-l-4 border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                  <strong>Special Instructions:</strong> {order.specialInstructions}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h5 className="font-medium text-gray-900 mb-2">Order Items</h5>
                          <div className="space-y-1 text-sm">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{formatPrice(item.price)}</span>
                              </div>
                            ))}
                            <div className="border-t pt-2 mt-2">
                              <div className="flex justify-between font-medium">
                                <span>Total:</span>
                                <span>{formatPrice(order.total)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex space-x-3">
                        {order.status === 'assigned' && (
                          <button
                            onClick={() => confirmPickup(order.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm Pickup</span>
                          </button>
                        )}
                        
                        {order.status === 'picked_up' && (
                          <button
                            onClick={() => confirmDelivery(order.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Confirm Delivery</span>
                          </button>
                        )}

                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                          <Navigation className="w-5 h-5" />
                          <span>Navigate</span>
                        </button>

                        <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                          <Phone className="w-5 h-5" />
                          <span>Call Customer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Car className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders assigned</h3>
              <p>You'll see new delivery assignments here when they become available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;