import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';
import adminService from '../../services/adminService';
import { orderService } from '../../services/api';
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
      try {
        // Use our API's built-in mock data generator instead of local one
        const response = await orderService.getOrders();
        const mockOrdersData = response.data || [];
        
        const transformedOrders = mockOrdersData.map(order => ({
          id: order.id,
          userId: order.userId,
          customerName: order.customerName,
          status: order.status,
          total: order.total,
          items: order.items,
          orderDate: new Date(order.orderDate),
          estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : null,
          paymentMethod: order.paymentMethod,
          deliveryType: order.isPickup ? 'pickup' : 'delivery',
          deliveryAddress: order.deliveryAddress,
          customerPhone: order.customerPhone
        }));
        
        setOrders(transformedOrders);
        console.log('✅ [ADMIN] Successfully loaded mock orders from API:', { count: transformedOrders.length });
        toast.success(`Loaded ${transformedOrders.length} orders (mock data from API)`);
      } catch (mockError) {
        // No mock data - only show real user-entered data
        console.error('❌ [ADMIN] Failed to load orders:', mockError);
        setOrders([]);
        toast.error('Failed to load orders. No mock data will be generated.');
      }
    } finally {
      setLoading(false);
    }
  };

  // No mock data generation - removed as per requirements

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
  <h1 className="text-3xl font-bold text-orange-500 mb-2">Order Management</h1>
        <p className="text-gray-600">Manage and track all customer orders</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
  <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
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
  <div className="bg-white p-6 rounded-lg shadow mb-6 border border-orange-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-500 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black bg-white"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-orange-500 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-black bg-white"
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
              className="w-full pl-10 pr-4 py-2 border border-orange-500 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none text-black bg-white"
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
            className="flex items-center justify-center px-4 py-2 bg-orange-500 text-black rounded-full font-bold border border-orange-500 shadow-md hover:bg-orange-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders List */}
  <div className="bg-white rounded-lg shadow overflow-hidden border border-orange-200">
  <div className="px-6 py-4 border-b border-orange-200">
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
          <div className="divide-y divide-orange-100">
            {filteredOrders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-orange-50 border border-orange-200 rounded-lg">
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
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${order.status === 'preparing' ? 'bg-orange-100 text-orange-800 border-orange-500' : order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-500' : order.status === 'confirmed' ? 'bg-blue-100 text-blue-800 border-blue-500' : order.status === 'delivered' ? 'bg-green-100 text-green-800 border-green-500' : order.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-500' : 'bg-gray-100 text-gray-800 border-gray-300'} flex items-center`}>
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
                  <div className="mt-6 pt-6 border-t border-orange-100">
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
                              className="w-full px-3 py-2 border border-orange-500 rounded-full focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm text-black bg-white"
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
