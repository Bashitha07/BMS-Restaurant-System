import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { formatPrice } from '../../utils/currency';
import adminService from '../../services/adminService';
import { orderService } from '../../services/api';
import axios from '../../utils/axios';
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
  const [groupedOrders, setGroupedOrders] = useState({
    notDelivered: [],
    recentlyDelivered: [],
    others: []
  });
  const [activeTab, setActiveTab] = useState('notDelivered');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  const tabs = [
    { 
      id: 'notDelivered', 
      label: 'Active Orders', 
      icon: Clock,
      description: 'Orders pending, confirmed, or in progress'
    },
    { 
      id: 'recentlyDelivered', 
      label: 'Recent Deliveries', 
      icon: CheckCircle,
      description: 'Delivered in last 7 days'
    },
    { 
      id: 'others', 
      label: 'Order History', 
      icon: ClipboardList,
      description: 'All other orders (cancelled, refunded, old deliveries)'
    }
  ];

  const orderStatuses = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'preparing', label: 'Preparing', color: 'orange' },
    { value: 'ready_for_pickup', label: 'Ready', color: 'purple' },
    { value: 'out_for_delivery', label: 'Out for Delivery', color: 'indigo' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'cancelled', label: 'Cancelled', color: 'red' },
    { value: 'refunded', label: 'Refunded', color: 'gray' }
  ];

  useEffect(() => {
    loadGroupedOrders();
  }, []);

  const loadGroupedOrders = async () => {
    console.log('🔍 [ADMIN] Loading all orders for admin view...');
    setLoading(true);
    try {
      // Use the simple GET all orders endpoint instead of grouped
      const response = await axios.get('/api/orders');
      const allOrders = response.data;
      
      console.log('📦 [ADMIN] Received orders from API:', allOrders);
      
      // Group orders on the client side
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const notDeliveredStatuses = ['PENDING', 'CONFIRMED', 'PREPARING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'];
      const completedStatuses = ['DELIVERED', 'CANCELLED', 'REFUNDED'];
      
      const notDelivered = allOrders.filter(order => 
        notDeliveredStatuses.includes(order.status)
      );
      
      const recentlyDelivered = allOrders.filter(order => {
        if (order.status !== 'DELIVERED') return false;
        const orderDate = new Date(order.updatedAt || order.createdAt || order.orderDate);
        return orderDate >= sevenDaysAgo;
      });
      
      const others = allOrders.filter(order => {
        if (order.status === 'CANCELLED' || order.status === 'REFUNDED') return true;
        if (order.status === 'DELIVERED') {
          const orderDate = new Date(order.updatedAt || order.createdAt || order.orderDate);
          return orderDate < sevenDaysAgo;
        }
        return false;
      });
      
      const transformGroup = (orders) => orders.map(order => ({
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
        subtotal: order.subtotal || order.totalAmount,
        taxAmount: order.taxAmount || 0,
        deliveryFee: order.deliveryFee || 0,
        orderType: order.orderType || 'DELIVERY',
        orderDate: new Date(order.orderDate),
        estimatedDelivery: order.estimatedDeliveryTime ? new Date(order.estimatedDeliveryTime) : null,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || 'PENDING',
        deliveryType: order.orderType?.toLowerCase() === 'delivery' ? 'delivery' : 'pickup'
      }));
      
      const transformed = {
        notDelivered: transformGroup(notDelivered),
        recentlyDelivered: transformGroup(recentlyDelivered),
        others: transformGroup(others)
      };
      
      setGroupedOrders(transformed);
      console.log('✅ [ADMIN] Successfully loaded grouped orders:', {
        notDelivered: transformed.notDelivered.length,
        recentlyDelivered: transformed.recentlyDelivered.length,
        others: transformed.others.length
      });
      
      toast.success('Orders loaded successfully');
    } catch (error) {
      console.error('❌ [ADMIN] Failed to load grouped orders:', error);
      toast.error(`Failed to load orders: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentOrders = () => {
    const orders = groupedOrders[activeTab] || [];
    if (!searchTerm) return orders;
    
    return orders.filter(order =>
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer.phone && order.customer.phone.includes(searchTerm))
    );
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    console.log(`🔄 [ADMIN] Updating order ${orderId} status to ${newStatus}`);
    setUpdating(true);
    try {
      await adminService.updateOrderStatus(orderId, newStatus.toUpperCase());
      console.log(`✅ [ADMIN] Successfully updated order ${orderId} status via backend`);
      toast.success('Order status updated successfully');
      
      // Reload grouped orders to reflect the change
      await loadGroupedOrders();
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
      case 'ready_for_pickup': return <CheckCircle className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'refunded': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Calculate statistics from all groups
  const allOrders = [...groupedOrders.notDelivered, ...groupedOrders.recentlyDelivered, ...groupedOrders.others];
  const stats = {
    total: allOrders.length,
    notDelivered: groupedOrders.notDelivered.length,
    recentlyDelivered: groupedOrders.recentlyDelivered.length,
    others: groupedOrders.others.length,
    totalRevenue: allOrders.reduce((sum, order) => sum + order.total, 0)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
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
              <p className="text-sm font-medium text-gray-500">Active Orders</p>
              <p className="text-2xl font-bold text-gray-900">{stats.notDelivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Recent Deliveries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentlyDelivered}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <ClipboardList className="w-8 h-8 text-gray-500" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Order History</p>
              <p className="text-2xl font-bold text-gray-900">{stats.others}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.totalRevenue)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Search */}
      <div className="bg-white rounded-lg shadow mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const count = groupedOrders[tab.id]?.length || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-amber-500 text-amber-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <div className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">{tabs.find(t => t.id === activeTab)?.description}</p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        {getCurrentOrders().length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>No orders found in this category</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {getCurrentOrders().map((order) => (
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
                    
                    <div className="flex items-center gap-2">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800 flex items-center`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status.replace(/_/g, ' ')}</span>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-800' :
                        order.orderType === 'PICKUP' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.orderType === 'DELIVERY' ? <Truck className="w-3 h-3 inline mr-1" /> : <Package className="w-3 h-3 inline mr-1" />}
                        {order.orderType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">{formatPrice(order.total)}</p>
                      <p className="text-sm text-gray-600 capitalize">{order.deliveryType}</p>
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
                          <div className="pt-2 mt-2 border-t border-gray-200 space-y-1.5">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Subtotal</span>
                              <span className="font-medium">{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Tax</span>
                              <span className="font-medium">{formatPrice(order.taxAmount)}</span>
                            </div>
                            {order.deliveryFee > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Delivery Fee</span>
                                <span className="font-medium">{formatPrice(order.deliveryFee)}</span>
                              </div>
                            )}
                            <div className="flex justify-between pt-2 mt-2 border-t border-gray-200 font-bold text-base">
                              <span>Total</span>
                              <span className="text-indigo-600">{formatPrice(order.total)}</span>
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
                            {order.estimatedDelivery && (
                              <p>
                                <span className="font-medium">Est. Delivery:</span> {order.estimatedDelivery.toLocaleString()}
                              </p>
                            )}
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
