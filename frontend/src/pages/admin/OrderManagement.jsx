import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';
import adminService from '../../services/adminService';
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  Calendar,
  MapPin,
  Phone,
  CreditCard,
  Truck,
  Edit,
  Users,
  DollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ClipboardList
} from 'lucide-react';

const OrderManagement = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'ready', label: 'Ready', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' }
  ];

  const dateFilters = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  useEffect(() => {
    loadAllOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, dateFilter]);

  const loadAllOrders = async () => {
    console.log('🔍 [ADMIN] Loading all orders for admin view...');
    setLoading(true);
    try {
      // Try to fetch real orders from backend first
      const backendOrders = await adminService.getAllOrders();
      const transformedOrders = backendOrders.map(order => ({
        id: order.id,
        orderNumber: `ORD-${String(order.id).padStart(4, '0')}`,
        customer: {
          name: order.userName,
          email: order.userEmail,
          phone: order.deliveryPhone,
          address: order.deliveryAddress
        },
        items: order.items.map(item => ({
          name: item.menuName,
          quantity: item.quantity,
          price: item.unitPrice
        })),
        status: order.status.toLowerCase(),
        total: order.totalAmount,
        orderDate: new Date(order.orderDate),
        estimatedDelivery: new Date(order.estimatedDeliveryTime),
        paymentMethod: order.paymentMethod,
        deliveryType: order.orderType.toLowerCase() === 'delivery' ? 'delivery' : 'pickup'
      }));
      setOrders(transformedOrders);
      console.log('✅ [ADMIN] Successfully loaded orders from backend:', { count: transformedOrders.length });
      toast.success(`Loaded ${transformedOrders.length} orders from database`);
    } catch (error) {
      console.warn('⚠️ [ADMIN] Backend API failed, using mock data:', error);
      // Fallback to mock data for demonstration
      const mockOrders = generateMockOrders();
      setOrders(mockOrders);
      console.log('✅ [ADMIN] Successfully loaded mock orders:', { count: mockOrders.length });
      toast.success(`Loaded ${mockOrders.length} orders (demo data)`);
    } finally {
      setLoading(false);
    }
  };

  const generateMockOrders = () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    const customers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'David Brown', 'Lisa Davis'];
    const orders = [];

    for (let i = 1; i <= 25; i++) {
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 30));
      
      orders.push({
        id: i,
        orderNumber: `ORD-${String(i).padStart(4, '0')}`,
        customer: {
          name: customer,
          email: `${customer.toLowerCase().replace(' ', '.')}@example.com`,
          phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
          address: `${Math.floor(Math.random() * 999) + 1} Main St, City, State`
        },
        items: [
          {
            name: 'Margherita Pizza',
            quantity: Math.floor(Math.random() * 3) + 1,
            price: 12.99
          },
          {
            name: 'Caesar Salad',
            quantity: 1,
            price: 8.99
          }
        ],
        status,
        total: Math.floor(Math.random() * 50) + 15,
        orderDate: date,
        estimatedDelivery: new Date(date.getTime() + (30 + Math.random() * 60) * 60 * 1000),
        paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Cash on Delivery',
        deliveryType: Math.random() > 0.3 ? 'delivery' : 'pickup'
      });
    }
    return orders.sort((a, b) => b.orderDate - a.orderDate);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'week':
            const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            return orderDate >= weekAgo;
          case 'month':
            const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
            return orderDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(`🔄 [ADMIN] Updating order ${orderId} status to ${newStatus}`);
    setUpdating(true);
    try {
      // Try to update via backend API first
      try {
        await adminService.updateOrderStatus(orderId, newStatus);
        console.log(`✅ [ADMIN] Successfully updated order ${orderId} status via backend`);
        toast.success('Order status updated successfully');
      } catch (apiError) {
        console.warn('⚠️ [ADMIN] Backend update failed, updating locally:', apiError);
        // Fallback to local update for demo
        await new Promise(resolve => setTimeout(resolve, 500));
        toast.success('Order status updated (demo mode)');
      }
      
      // Update local state regardless
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error(`❌ [ADMIN] Failed to update order ${orderId}:`, error);
      toast.error('Failed to update order status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    const statusObj = orderStatuses.find(s => s.value === status);
    return statusObj ? statusObj.color : 'gray';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'ready': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
    preparing: filteredOrders.filter(o => o.status === 'preparing').length,
    delivered: filteredOrders.filter(o => o.status === 'delivered').length,
    totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-amber-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-blue-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Package className="w-8 h-8 text-orange-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Preparing</p>
              <p className="text-2xl font-bold text-gray-900">{stats.preparing}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
            >
              {orderStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white"
            >
              {dateFilters.map(filter => (
                <option key={filter.value} value={filter.value}>{filter.label}</option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={loadAllOrders}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">No orders match your current filters.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {order.customer.name} • {order.orderDate.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 flex items-center`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-600">{order.deliveryType}</p>
                    </div>

                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {expandedOrder === order.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Users className="w-4 h-4 mr-2" />
                          Customer Information
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                          <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                          <p className="flex items-center">
                            <Phone className="w-4 h-4 mr-1" />
                            {order.customer.phone}
                          </p>
                          <p className="flex items-start">
                            <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                            {order.customer.address}
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          Order Items
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{item.quantity}x {item.name}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </div>
                          ))}
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between font-medium">
                              <span>Total</span>
                              <span>{formatPrice(order.total)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Management */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                          <Edit className="w-4 h-4 mr-2" />
                          Order Management
                        </h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Update Status
                            </label>
                            <select
                              value={order.status}
                              onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                              disabled={updating}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                            >
                              {orderStatuses.filter(s => s.value !== 'all').map(status => (
                                <option key={status.value} value={status.value}>
                                  {status.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="text-sm text-gray-600">
                            <p className="flex items-center mb-1">
                              <CreditCard className="w-4 h-4 mr-1" />
                              {order.paymentMethod}
                            </p>
                            <p>
                              <span className="font-medium">Est. Delivery:</span> {order.estimatedDelivery.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
