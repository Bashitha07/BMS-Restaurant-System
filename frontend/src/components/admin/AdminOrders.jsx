import { useState, useEffect } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-hot-toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [deliveryFee, setDeliveryFee] = useState(400);
  const [editingDeliveryFee, setEditingDeliveryFee] = useState(false);
  const [newDeliveryFee, setNewDeliveryFee] = useState(400);

  useEffect(() => {
    fetchOrders();
    fetchDrivers();
    fetchDeliveryFee();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders');
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load orders');
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await axios.get('/api/orders/admin/drivers');
      setDrivers(response.data);
    } catch (error) {
      console.error('Failed to load drivers', error);
    }
  };

  const fetchDeliveryFee = async () => {
    try {
      const response = await axios.get('/api/admin/settings/delivery-fee');
      setDeliveryFee(Number(response.data.deliveryFee));
      setNewDeliveryFee(Number(response.data.deliveryFee));
    } catch (error) {
      console.error('Failed to load delivery fee', error);
    }
  };

  const updateDeliveryFee = async () => {
    try {
      await axios.put('/api/admin/settings/delivery-fee', { 
        deliveryFee: newDeliveryFee.toString() 
      });
      setDeliveryFee(newDeliveryFee);
      setEditingDeliveryFee(false);
      toast.success('Delivery fee updated successfully');
    } catch (error) {
      toast.error('Failed to update delivery fee');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const assignDriver = async (orderId, driverId) => {
    try {
      await axios.put(`/api/orders/${orderId}/assign-driver`, { 
        driverId: driverId ? Number(driverId) : null 
      });
      toast.success(driverId ? 'Driver assigned & status updated to Out for Delivery' : 'Driver unassigned successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to assign driver');
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'ALL' || order.status === filter;
    const matchesSearch = 
      order.id.toString().includes(searchTerm) ||
      order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    preparing: orders.filter(o => o.status === 'PREPARING').length,
    outForDelivery: orders.filter(o => o.status === 'OUT_FOR_DELIVERY').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length,
    cancelled: orders.filter(o => o.status === 'CANCELLED').length,
    withDriver: orders.filter(o => o.driverId).length,
    withoutDriver: orders.filter(o => !o.driverId && o.orderType === 'DELIVERY').length,
  };

  const formatStatus = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Management</h2>
        <p className="text-gray-600">Manage orders and assign delivery drivers</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-500">Total Orders</div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <div className="text-sm text-yellow-700">Pending</div>
          <div className="text-2xl font-bold text-yellow-900">{stats.pending}</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg shadow">
          <div className="text-sm text-blue-700">Confirmed</div>
          <div className="text-2xl font-bold text-blue-900">{stats.confirmed}</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg shadow">
          <div className="text-sm text-purple-700">Preparing</div>
          <div className="text-2xl font-bold text-purple-900">{stats.preparing}</div>
        </div>
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <div className="text-sm text-indigo-700">Out for Delivery</div>
          <div className="text-2xl font-bold text-indigo-900">{stats.outForDelivery}</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <div className="text-sm text-green-700">Delivered</div>
          <div className="text-2xl font-bold text-green-900">{stats.delivered}</div>
        </div>
      </div>

      {/* Driver Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Available Drivers</div>
              <div className="text-2xl font-bold text-gray-900">{drivers.length}</div>
            </div>
            <div className="text-blue-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Orders with Driver</div>
              <div className="text-2xl font-bold text-gray-900">{stats.withDriver}</div>
            </div>
            <div className="text-green-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Unassigned Deliveries</div>
              <div className="text-2xl font-bold text-gray-900">{stats.withoutDriver}</div>
            </div>
            <div className="text-orange-500">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Fee Configuration */}
      <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-purple-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-purple-500">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Default Delivery Charge</h3>
              <p className="text-sm text-gray-600">Set the standard delivery fee for all delivery orders</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!editingDeliveryFee ? (
              <>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Current Fee</div>
                  <div className="text-3xl font-bold text-purple-600">LKR {deliveryFee.toFixed(2)}</div>
                </div>
                <button
                  onClick={() => setEditingDeliveryFee(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  Edit Fee
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Delivery Fee (LKR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newDeliveryFee}
                    onChange={(e) => setNewDeliveryFee(Number(e.target.value))}
                    className="px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500 w-40"
                  />
                </div>
                <div className="flex space-x-2 mt-6">
                  <button
                    onClick={updateDeliveryFee}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditingDeliveryFee(false);
                      setNewDeliveryFee(deliveryFee);
                    }}
                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 p-3 bg-purple-50 rounded-md">
          <p className="text-sm text-purple-800">
            <span className="font-semibold">Note:</span> This delivery fee will be applied to all new delivery orders. 
            Existing orders will retain their original delivery fees.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by order ID, customer name, or email..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="md:w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">All Orders</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PREPARING">Preparing</option>
              <option value="READY_FOR_PICKUP">Ready for Pickup</option>
              <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assign Driver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <p className="text-lg font-medium">No orders found</p>
                      <p className="text-sm">Try adjusting your search or filter criteria</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.userName}</div>
                      <div className="text-xs text-gray-500">{order.userEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-800' :
                          order.orderType === 'PICKUP' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'}`}>
                        {formatStatus(order.orderType)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index}>{item.quantity}x {item.menuName}</div>
                        ))}
                        {order.items.length > 2 && (
                          <div className="text-gray-400">+{order.items.length - 2} more...</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        LKR {order.totalAmount?.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.paymentMethod === 'CASH_ON_DELIVERY' ? 'COD' : 'Bank Deposit'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'PREPARING' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'READY_FOR_PICKUP' ? 'bg-cyan-100 text-cyan-800' :
                          order.status === 'OUT_FOR_DELIVERY' ? 'bg-indigo-100 text-indigo-800' :
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {formatStatus(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.orderType === 'DELIVERY' ? (
                        <div className="min-w-[200px]">
                          <select
                            className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                              order.driverId 
                                ? 'border-green-300 bg-green-50' 
                                : 'border-orange-300 bg-orange-50'
                            }`}
                            value={order.driverId || ''}
                            onChange={(e) => assignDriver(order.id, e.target.value)}
                          >
                            <option value="">🔴 Unassigned</option>
                            {drivers.map((driver) => (
                              <option key={driver.id} value={driver.id}>
                                🚗 {driver.username} - {driver.phone}
                              </option>
                            ))}
                          </select>
                          {order.driverId && order.driverName ? (
                            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
                              <div className="text-xs font-semibold text-green-800">
                                ✓ Assigned Driver:
                              </div>
                              <div className="text-sm font-bold text-green-900">
                                {order.driverName}
                              </div>
                              <div className="text-xs text-green-700">
                                Driver ID: #{order.driverId}
                              </div>
                            </div>
                          ) : (
                            <div className="mt-1 text-xs text-orange-600 font-medium">
                              ⚠️ No driver assigned
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">N/A (Not Delivery)</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="CONFIRMED">Confirmed</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="READY_FOR_PICKUP">Ready for Pickup</option>
                        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}