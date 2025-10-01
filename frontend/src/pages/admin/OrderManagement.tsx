import React, { useEffect, useState } from 'react';
import { SearchIcon, FilterIcon, EyeIcon, XIcon, TruckIcon, FileTextIcon } from 'lucide-react';
import { Button } from '../../components/ui/Button';
type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}
interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  paymentMethod: 'cash' | 'bank';
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentProof?: string;
  createdAt: string;
}
export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('pending');
  // Mock data for orders
  useEffect(() => {
    const mockOrders: Order[] = [{
      id: 'ORD-1234',
      customer: {
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+94 77 123 4567',
        address: '123 Main St, Colombo 5'
      },
      items: [{
        id: '1',
        name: 'Chicken Kottu',
        price: 3900,
        quantity: 2
      }, {
        id: '5',
        name: 'French Fries',
        price: 1500,
        quantity: 1
      }],
      total: 9300,
      status: 'delivered',
      paymentMethod: 'cash',
      paymentStatus: 'completed',
      createdAt: '2023-05-20 12:15:00'
    }, {
      id: 'ORD-1235',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+94 77 234 5678',
        address: '456 Park Ave, Colombo 7'
      },
      items: [{
        id: '3',
        name: 'Beef Burger',
        price: 2500,
        quantity: 1
      }, {
        id: '6',
        name: 'Watermelon Juice',
        price: 1200,
        quantity: 2
      }],
      total: 4900,
      status: 'processing',
      paymentMethod: 'bank',
      paymentStatus: 'completed',
      paymentProof: 'https://example.com/payment-proof.jpg',
      createdAt: '2023-05-20 09:30:00'
    }, {
      id: 'ORD-1236',
      customer: {
        name: 'Michael Chen',
        email: 'michael@example.com',
        phone: '+94 77 345 6789',
        address: '789 Oak St, Nugegoda'
      },
      items: [{
        id: '2',
        name: 'Vegetable Fried Rice',
        price: 2800,
        quantity: 1
      }, {
        id: '4',
        name: 'Chicken Submarine',
        price: 3200,
        quantity: 1
      }],
      total: 6000,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      createdAt: '2023-05-20 08:45:00'
    }, {
      id: 'ORD-1237',
      customer: {
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        phone: '+94 77 456 7890',
        address: '101 Pine St, Battaramulla'
      },
      items: [{
        id: '8',
        name: 'Seafood Noodles',
        price: 4200,
        quantity: 1
      }, {
        id: '7',
        name: 'Chocolate Brownie',
        price: 2000,
        quantity: 2
      }],
      total: 8200,
      status: 'cancelled',
      paymentMethod: 'bank',
      paymentStatus: 'failed',
      createdAt: '2023-05-19 19:20:00'
    }, {
      id: 'ORD-1238',
      customer: {
        name: 'David Wilson',
        email: 'david@example.com',
        phone: '+94 77 567 8901',
        address: '222 Maple St, Rajagiriya'
      },
      items: [{
        id: '1',
        name: 'Chicken Kottu',
        price: 3900,
        quantity: 1
      }, {
        id: '3',
        name: 'Beef Burger',
        price: 2500,
        quantity: 1
      }, {
        id: '6',
        name: 'Watermelon Juice',
        price: 1200,
        quantity: 1
      }],
      total: 7600,
      status: 'pending',
      paymentMethod: 'cash',
      paymentStatus: 'pending',
      createdAt: '2023-05-19 14:10:00'
    }];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);
  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, paymentFilter, dateFilter, orders]);
  const applyFilters = () => {
    let filtered = [...orders];
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => order.id.toLowerCase().includes(query) || order.customer.name.toLowerCase().includes(query) || order.customer.email.toLowerCase().includes(query) || order.customer.phone.includes(query));
    }
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    // Apply payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentStatus === paymentFilter);
    }
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt);
        if (dateFilter === 'today') {
          return orderDate >= today;
        } else if (dateFilter === 'week') {
          const weekAgo = new Date(today);
          weekAgo.setDate(today.getDate() - 7);
          return orderDate >= weekAgo;
        } else if (dateFilter === 'month') {
          const monthAgo = new Date(today);
          monthAgo.setMonth(today.getMonth() - 1);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }
    setFilteredOrders(filtered);
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as OrderStatus | 'all');
  };
  const handlePaymentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPaymentFilter(e.target.value as 'all' | 'pending' | 'completed');
  };
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilter(e.target.value as 'today' | 'week' | 'month' | 'all');
  };
  const viewOrderDetails = (order: Order) => {
    setCurrentOrder(order);
    setIsViewModalOpen(true);
  };
  const openUpdateStatusModal = (order: Order) => {
    setCurrentOrder(order);
    setNewStatus(order.status);
    setIsUpdateStatusModalOpen(true);
  };
  const updateOrderStatus = () => {
    if (!currentOrder) return;
    const updatedOrders = orders.map(order => {
      if (order.id === currentOrder.id) {
        // Update payment status if order is delivered
        let paymentStatus = order.paymentStatus;
        if (newStatus === 'delivered' && paymentStatus === 'pending') {
          paymentStatus = 'completed';
        }
        return {
          ...order,
          status: newStatus,
          paymentStatus
        };
      }
      return order;
    });
    setOrders(updatedOrders);
    setIsUpdateStatusModalOpen(false);
  };
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getPaymentStatusColor = (status: 'pending' | 'completed' | 'failed') => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <Button onClick={() => applyFilters()} className="flex items-center gap-2">
            <FilterIcon size={16} />
            <span>Refresh</span>
          </Button>
        </div>
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search orders by ID, customer name, email or phone..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-500" value={searchQuery} onChange={handleSearch} />
            </div>
            <div className="flex flex-wrap gap-2">
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={statusFilter} onChange={handleStatusChange}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={paymentFilter} onChange={handlePaymentChange}>
                <option value="all">All Payments</option>
                <option value="pending">Payment Pending</option>
                <option value="completed">Payment Completed</option>
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" value={dateFilter} onChange={handleDateChange}>
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? <tr>
                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                      No orders found
                    </td>
                  </tr> : filteredOrders.map(order => <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {order.customer.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.customer.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          Rs. {order.total.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500">
                            {order.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}
                          </span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button onClick={() => viewOrderDetails(order)} className="text-indigo-600 hover:text-indigo-900" title="View Details">
                            <EyeIcon size={18} />
                          </button>
                          <button onClick={() => openUpdateStatusModal(order)} className="text-orange-600 hover:text-orange-900" title="Update Status">
                            <TruckIcon size={18} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900" title="Print Invoice">
                            <FileTextIcon size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {/* View Order Details Modal */}
        {isViewModalOpen && currentOrder && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  Order Details - {currentOrder.id}
                </h2>
                <button onClick={() => setIsViewModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Customer Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Name:</span>{' '}
                      {currentOrder.customer.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Email:</span>{' '}
                      {currentOrder.customer.email}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Phone:</span>{' '}
                      {currentOrder.customer.phone}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Address:</span>{' '}
                      {currentOrder.customer.address}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Order Information
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm">
                      <span className="font-medium">Date:</span>{' '}
                      {formatDate(currentOrder.createdAt)}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Status:</span>
                      <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentOrder.status)}`}>
                        {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                      </span>
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Method:</span>{' '}
                      {currentOrder.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Payment Status:</span>
                      <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(currentOrder.paymentStatus)}`}>
                        {currentOrder.paymentStatus.charAt(0).toUpperCase() + currentOrder.paymentStatus.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentOrder.items.map(item => <tr key={item.id}>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          Rs. {item.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900 text-right">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          Rs. {(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>)}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                        Total:
                      </td>
                      <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                        Rs. {currentOrder.total.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              {currentOrder.paymentMethod === 'bank' && currentOrder.paymentProof && <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">
                      Payment Proof
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-center">
                        <img src={currentOrder.paymentProof} alt="Payment Proof" className="max-h-64 object-contain rounded-md" />
                      </div>
                    </div>
                  </div>}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                  Close
                </Button>
                <Button className="flex items-center gap-2">
                  <FileTextIcon size={16} />
                  <span>Print Invoice</span>
                </Button>
              </div>
            </div>
          </div>}
        {/* Update Status Modal */}
        {isUpdateStatusModalOpen && currentOrder && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Update Order Status</h2>
                <button onClick={() => setIsUpdateStatusModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <XIcon size={20} />
                </button>
              </div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Order ID:{' '}
                  <span className="font-medium">{currentOrder.id}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Customer:{' '}
                  <span className="font-medium">
                    {currentOrder.customer.name}
                  </span>
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Update Status
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" value={newStatus} onChange={e => setNewStatus(e.target.value as OrderStatus)}>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                {newStatus === 'delivered' && currentOrder.paymentStatus === 'pending' && <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                      <p className="text-sm text-yellow-800">
                        <span className="font-medium">Note:</span> Marking this
                        order as delivered will also update the payment status
                        to "Completed".
                      </p>
                    </div>}
                {newStatus === 'cancelled' && <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-md">
                    <p className="text-sm text-red-800">
                      <span className="font-medium">Warning:</span> Cancelling
                      this order cannot be undone.
                    </p>
                  </div>}
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsUpdateStatusModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={updateOrderStatus}>Update Status</Button>
              </div>
            </div>
          </div>}
      </div>
    </div>;
}

export default OrderManagement;
