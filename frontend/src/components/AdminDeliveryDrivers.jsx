import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Car, Phone, User, Clock, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export default function AdminDeliveryDrivers() {
  const { sendOrderUpdate } = useNotifications();
  const [drivers, setDrivers] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    vehicleNumber: '',
    status: 'AVAILABLE'
  });

  // Mock data initialization
  useEffect(() => {
    const mockDrivers = [
      {
        id: 'DRV001',
        name: 'Kamal Perera',
        phoneNumber: '+94 77 123 4567',
        vehicleNumber: 'CAR-1234',
        status: 'AVAILABLE',
        currentOrders: 0,
        totalDeliveries: 45,
        rating: 4.8,
        joinedDate: '2024-01-15'
      },
      {
        id: 'DRV002', 
        name: 'Sunil Silva',
        phoneNumber: '+94 71 987 6543',
        vehicleNumber: 'BIKE-5678',
        status: 'BUSY',
        currentOrders: 2,
        totalDeliveries: 78,
        rating: 4.9,
        joinedDate: '2023-11-20'
      },
      {
        id: 'DRV003',
        name: 'Ravi Fernando',
        phoneNumber: '+94 76 555 0123',
        vehicleNumber: 'CAR-9876',
        status: 'AVAILABLE',
        currentOrders: 0,
        totalDeliveries: 32,
        rating: 4.7,
        joinedDate: '2024-03-10'
      },
      {
        id: 'DRV004',
        name: 'Nimal Jayasinghe',
        phoneNumber: '+94 70 444 5678',
        vehicleNumber: 'BIKE-2468',
        status: 'OFFLINE',
        currentOrders: 0,
        totalDeliveries: 89,
        rating: 4.6,
        joinedDate: '2023-08-05'
      }
    ];

    const mockPendingOrders = [
      {
        id: 'ORD-001',
        orderId: '1759420941032',
        userId: 2, // Customer user ID for notifications
        customerName: 'John Doe',
        customerPhone: '+94 71 234 5678',
        deliveryAddress: 'No 45, Galle Road, Colombo 03',
        items: [
          { name: 'Chicken Kottu', quantity: 2, price: 1600 },
          { name: 'Fish Curry', quantity: 1, price: 650 }
        ],
        total: 2250,
        status: 'READY_FOR_DELIVERY',
        orderTime: new Date(Date.now() - 30 * 60 * 1000),
        priority: 'HIGH',
        distance: '3.2 km',
        estimatedTime: '25 min'
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
        status: 'READY_FOR_DELIVERY',
        orderTime: new Date(Date.now() - 45 * 60 * 1000),
        priority: 'NORMAL',
        distance: '8.5 km',
        estimatedTime: '35 min'
      },
      {
        id: 'ORD-003',
        orderId: '1759420941034',
        userId: 4, // Customer user ID for notifications
        customerName: 'Mike Johnson',
        customerPhone: '+94 75 123 9876',
        deliveryAddress: 'No 78, Nugegoda Road, Nugegoda',
        items: [
          { name: 'Pizza Special', quantity: 2, price: 3200 },
          { name: 'Coke', quantity: 2, price: 300 }
        ],
        total: 3500,
        status: 'READY_FOR_DELIVERY',
        orderTime: new Date(Date.now() - 15 * 60 * 1000),
        priority: 'HIGH',
        distance: '5.1 km',
        estimatedTime: '20 min'
      }
    ];

    setTimeout(() => {
      setDrivers(mockDrivers);
      setPendingOrders(mockPendingOrders);
      setLoading(false);
    }, 1000);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDriver = {
      id: `DRV${String(drivers.length + 1).padStart(3, '0')}`,
      ...formData,
      currentOrders: 0,
      totalDeliveries: 0,
      rating: 5.0,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    
    setDrivers(prev => [...prev, newDriver]);
    toast.success('Driver added successfully');
    setFormData({
      name: '',
      phoneNumber: '',
      vehicleNumber: '',
      status: 'AVAILABLE'
    });
  };

  const assignOrderToDriver = (orderId, driverId) => {
    const order = pendingOrders.find(o => o.id === orderId);
    const driver = drivers.find(d => d.id === driverId);
    
    if (!order || !driver) {
      toast.error('Invalid order or driver selection');
      return;
    }

    if (driver.status !== 'AVAILABLE') {
      toast.error('Driver is not available for assignment');
      return;
    }

    // Update driver status
    setDrivers(prev => prev.map(d => 
      d.id === driverId 
        ? { ...d, status: 'BUSY', currentOrders: d.currentOrders + 1 }
        : d
    ));

    // Remove order from pending list
    setPendingOrders(prev => prev.filter(o => o.id !== orderId));

    // Send notification to customer only (not to all users)
    sendOrderUpdate(order.orderId, 'driver_assigned', {
      name: driver.name,
      vehicle: driver.vehicleNumber,
      phone: driver.phoneNumber
    }, order.userId); // Pass customer's userId to target notifications

    toast.success(`Order #${order.orderId} assigned to ${driver.name}`);
    setSelectedOrder(null);
    setSelectedDriver('');
  };

  const updateDriverStatus = (driverId, newStatus) => {
    setDrivers(prev => prev.map(driver => 
      driver.id === driverId 
        ? { ...driver, status: newStatus }
        : driver
    ));
    toast.success('Driver status updated');
  };

  const formatPrice = (price) => `Rs ${price.toLocaleString()}`;

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'text-green-800 bg-green-100';
      case 'BUSY': return 'text-blue-800 bg-blue-100';
      case 'OFFLINE': return 'text-gray-800 bg-gray-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'text-red-800 bg-red-100';
      case 'NORMAL': return 'text-yellow-800 bg-yellow-100';
      case 'LOW': return 'text-green-800 bg-green-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Driver Management & Order Assignment</h1>
        <p className="mt-2 text-gray-600">Manage drivers and assign delivery tasks efficiently</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available Drivers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {drivers.filter(d => d.status === 'AVAILABLE').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <Car className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Busy Drivers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {drivers.filter(d => d.status === 'BUSY').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Drivers</p>
              <p className="text-2xl font-semibold text-gray-900">{drivers.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Orders for Assignment */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Orders Ready for Delivery</h2>
            <p className="text-sm text-gray-600">Assign these orders to available drivers</p>
          </div>
          
          <div className="p-6">
            {pendingOrders.length > 0 ? (
              <div className="space-y-4">
                {pendingOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-medium text-gray-900">Order #{order.orderId}</h3>
                        <p className="text-sm text-gray-600">{order.customerName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                          {order.priority}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</span>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-3">
                      <div className="flex items-center mb-1">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{order.deliveryAddress}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{order.distance} • {order.estimatedTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Ordered {order.orderTime.toLocaleTimeString()}
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Assign Driver
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>No orders pending assignment</p>
              </div>
            )}
          </div>
        </div>

        {/* Available Drivers */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Driver Status</h2>
            <p className="text-sm text-gray-600">Current driver availability and performance</p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {drivers.map((driver) => (
                <div key={driver.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">{driver.name}</h3>
                      <p className="text-sm text-gray-600">{driver.vehicleNumber}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(driver.status)}`}>
                      {driver.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{driver.phoneNumber}</span>
                    </div>
                    <div>
                      <span>Current Orders: {driver.currentOrders}</span>
                    </div>
                    <div>
                      <span>Total Deliveries: {driver.totalDeliveries}</span>
                    </div>
                    <div>
                      <span>Rating: ⭐ {driver.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      Joined: {driver.joinedDate}
                    </div>
                    <div className="flex space-x-2">
                      {driver.status === 'OFFLINE' && (
                        <button
                          onClick={() => updateDriverStatus(driver.id, 'AVAILABLE')}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Set Available
                        </button>
                      )}
                      {driver.status === 'AVAILABLE' && (
                        <button
                          onClick={() => updateDriverStatus(driver.id, 'OFFLINE')}
                          className="bg-gray-600 text-white px-2 py-1 rounded text-xs hover:bg-gray-700"
                        >
                          Set Offline
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Order Assignment Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Assign Driver to Order</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Available Driver
              </label>
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              >
                <option value="">Choose a driver...</option>
                {drivers
                  .filter(driver => driver.status === 'AVAILABLE')
                  .map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} ({driver.vehicleNumber}) - {driver.totalDeliveries} deliveries
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedOrder(null);
                  setSelectedDriver('');
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => assignOrderToDriver(selectedOrder, selectedDriver)}
                disabled={!selectedDriver}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Driver Form */}
      <div className="bg-white shadow rounded-lg p-6 mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Driver</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div>
            <label htmlFor="vehicleNumber" className="block text-sm font-medium text-gray-700">
              Vehicle Number
            </label>
            <input
              type="text"
              name="vehicleNumber"
              id="vehicleNumber"
              value={formData.vehicleNumber}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Driver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}