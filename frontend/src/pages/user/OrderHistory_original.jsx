import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle, 
  Eye, 
  RotateCcw, 
  Download, 
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Truck
} from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'ready', label: 'Ready', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const loadOrders = () => {
    setLoading(true);
    try {
      // Load orders from localStorage (demo data)
      const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Add some demo tracking statuses
      const ordersWithTracking = storedOrders.map(order => ({
        ...order,
        status: order.status || getRandomStatus(),
        trackingUpdates: generateTrackingUpdates(order.orderDate, order.status || getRandomStatus()),
        estimatedDelivery: order.estimatedDelivery || new Date(Date.now() + 45 * 60 * 1000).toISOString()
      }));

      setOrders(ordersWithTracking);
    } catch (error) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const getRandomStatus = () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const generateTrackingUpdates = (orderDate, currentStatus) => {
    const baseDate = new Date(orderDate);
    const updates = [
      {
        status: 'pending',
        title: 'Order Placed',
        description: 'Your order has been received and is being processed',
        timestamp: baseDate.toISOString(),
        completed: true
      }
    ];

    if (['confirmed', 'preparing', 'ready', 'delivered'].includes(currentStatus)) {
      updates.push({
        status: 'confirmed',
        title: 'Order Confirmed',
        description: 'Restaurant has confirmed your order',
        timestamp: new Date(baseDate.getTime() + 5 * 60 * 1000).toISOString(),
        completed: true
      });
    }

    if (['preparing', 'ready', 'delivered'].includes(currentStatus)) {
      updates.push({
        status: 'preparing',
        title: 'Preparing Your Food',
        description: 'Our chefs are preparing your delicious meal',
        timestamp: new Date(baseDate.getTime() + 15 * 60 * 1000).toISOString(),
        completed: true
      });
    }

    if (['ready', 'delivered'].includes(currentStatus)) {
      updates.push({
        status: 'ready',
        title: 'Order Ready',
        description: 'Your order is ready for delivery',
        timestamp: new Date(baseDate.getTime() + 35 * 60 * 1000).toISOString(),
        completed: true
      });
    }

    if (currentStatus === 'delivered') {
      updates.push({
        status: 'delivered',
        title: 'Order Delivered',
        description: 'Your order has been delivered successfully',
        timestamp: new Date(baseDate.getTime() + 50 * 60 * 1000).toISOString(),
        completed: true
      });
    }

    return updates;
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status) => {
    const statusConfig = orderStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'gray';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'preparing': return Package;
      case 'ready': return Package;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Clock;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const reorderItems = (order) => {
    order.items.forEach(item => {
      addItem({ ...item, quantity: item.quantity });
    });
    toast.success(`Added ${order.items.length} items to cart for reorder`);
    navigate('/cart');
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const downloadInvoice = (order) => {
    // Simulate invoice download
    toast.success(`Invoice for order #${order.id} downloaded`);
  };

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-orange-100 text-orange-800';
      case 'READY':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600">Track your orders and reorder your favorites</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="relative min-w-[200px]">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
              >
                {orderStatuses.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet" 
                : "No orders match your search criteria"
              }
            </p>
            <button
              onClick={() => navigate('/menu')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = getStatusColor(order.status);
              
              return (
                <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div className="flex items-center gap-4 mb-2 md:mb-0">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                          <StatusIcon className="w-4 h-4" />
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-purple-600">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </p>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            {item.quantity}x {item.name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{order.deliveryInfo?.city}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CreditCard className="w-4 h-4" />
                        <span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Deposit'}</span>
                      </div>
                      {order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>ETA: {formatDate(order.estimatedDelivery)}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => reorderItems(order)}
                        className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reorder
                      </button>
                      <button
                        onClick={() => downloadInvoice(order)}
                        className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Order Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Order Information</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Order ID:</strong> #{selectedOrder.id}</p>
                      <p><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</p>
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Deposit'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Delivery Information</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><strong>Name:</strong> {selectedOrder.deliveryInfo?.fullName}</p>
                      <p><strong>Phone:</strong> {selectedOrder.deliveryInfo?.phone}</p>
                      <p><strong>Address:</strong> {selectedOrder.deliveryInfo?.address}</p>
                      <p><strong>City:</strong> {selectedOrder.deliveryInfo?.city}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Order Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (15%)</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-purple-600">{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Tracking */}
                <div>
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Order Tracking
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.trackingUpdates?.map((update, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className={`w-3 h-3 rounded-full mt-1 ${
                          update.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium">{update.title}</p>
                          <p className="text-sm text-gray-600">{update.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(update.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
