import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Invoice from '../../components/common/Invoice';
import { formatPrice } from '../../utils/currency';
import { orderService } from '../../services/api';
import {
  Clock,
  Package,
  CheckCircle,
  XCircle,
  Eye,
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  // Helper functions for safely displaying order information
  const extractCity = (address) => {
    if (!address || typeof address !== 'string') return '';
    // Try to extract city from address string (assuming format: "street, city")
    const parts = address.split(',');
    if (parts.length >= 2) {
      return parts[parts.length - 1].trim();
    }
    return '';
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString(undefined, {
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  const getStatusIcon = (status) => {
    try {
      status = String(status || 'pending').toLowerCase();
      switch (status) {
        case 'pending':
          return Clock;
        case 'confirmed':
          return CheckCircle;
        case 'preparing':
          return Package;
        case 'ready':
          return Package;
        case 'delivered':
          return Truck;
        case 'cancelled':
          return XCircle;
        default:
          return Clock;
      }
    } catch (error) {
      console.error('Error getting status icon:', error);
      return Clock;
    }
  };
  
  const getStatusColor = (status) => {
    try {
      status = String(status || 'pending').toLowerCase();
      switch (status) {
        case 'pending':
          return 'yellow';
        case 'confirmed':
          return 'blue';
        case 'preparing':
          return 'orange';
        case 'ready':
          return 'purple';
        case 'delivered':
          return 'green';
        case 'cancelled':
          return 'red';
        default:
          return 'gray';
      }
    } catch (error) {
      console.error('Error getting status color:', error);
      return 'gray';
    }
  };

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

  const loadOrders = async () => {
    setLoading(true);
    try {
      console.log('Fetching orders...');
      
      // Make sure we have a user before trying to load orders
      if (!user || !user.id) {
        console.log('No user found, cannot load orders');
        setOrders([]);
        setLoading(false);
        return;
      }
      
      // Fetch orders from service (which handles API or localStorage)
      const response = await orderService.getMyOrders();
      console.log('Orders response:', response);
      
      // Show toast message if there's a message in the response
      if (response.message && response.success) {
        toast.success(response.message);
      } else if (response.message && !response.success) {
        toast.error(response.message);
      }
      
      // Extract orders data (ensure it's an array)
      // API returns array directly, not wrapped in {data: [...]}
      const ordersData = Array.isArray(response) ? response : [];
      console.log(`Processing ${ordersData.length} orders for user ${user.id}`);

      // Process orders with robust error handling for each order
      const processedOrders = ordersData.map(order => {
        try {
          if (!order) return null;
          
          // Safely access items array and handle potential issues
          const items = Array.isArray(order.items) ? order.items : [];
          
          // Calculate totals with safeguards against NaN values
          let subtotal = 0;
          if (typeof order.subtotal === 'number') {
            subtotal = order.subtotal;
          } else {
            // Calculate from items with safety checks
            subtotal = items.reduce((sum, item) => {
              const price = typeof item?.price === 'number' ? item.price : 0;
              const quantity = typeof item?.quantity === 'number' ? item.quantity : 0;
              return sum + (price * quantity);
            }, 0);
          }
          
          const tax = typeof order.tax === 'number' ? order.tax : subtotal * 0.06;
          const deliveryFee = typeof order.deliveryFee === 'number' ? order.deliveryFee : 0;
          const total = typeof order.total === 'number' ? order.total : (subtotal + tax + deliveryFee);
          
          // Ensure order status is a string
          const status = typeof order.status === 'string' ? order.status : 'pending';
          
          // Ensure orderDate is a valid date string
          const orderDate = order.orderDate && !isNaN(new Date(order.orderDate).getTime()) 
            ? order.orderDate 
            : new Date().toISOString();
          
          return {
            id: String(order.id || `unknown-${Date.now()}`),
            userId: String(order.userId || user.id || '0'),
            orderDate,
            status,
            items: items.map(item => ({
              id: item.id || Math.random().toString(36).substr(2, 9),
              name: String(item.menuName || item.name || 'Unknown Item'),
              price: typeof item.unitPrice === 'number' ? item.unitPrice : (typeof item.price === 'number' ? item.price : 0),
              quantity: typeof item.quantity === 'number' ? item.quantity : 0,
              image: item.menuImageUrl || item.imageUrl || item.image || null
            })),
            subtotal,
            tax,
            deliveryFee,
            total,
            paymentMethod: String(order.paymentMethod || 'Not specified'),
            deliveryAddress: order.deliveryAddress || { street: '', city: '', state: '', zipCode: '' },
            // Add deliveryInfo object for UI display using correct backend field names
            deliveryInfo: {
              fullName: order.userName || user.username || 'Customer',
              email: order.userEmail || user.email || 'Not provided',
              phone: order.deliveryPhone || user.phone || 'Not provided',
              address: order.deliveryAddress || 'Not provided',
              city: extractCity(order.deliveryAddress) || 'Not provided',
              instructions: order.specialInstructions || ''
            },
            customerName: String(order.userName || user.username || 'Customer'),
            customerPhone: String(order.deliveryPhone || user.phone || 'Not provided'),
            trackingUpdates: generateTrackingUpdates(orderDate, status),
            estimatedDelivery: order.estimatedDeliveryTime || order.estimatedDelivery || new Date(Date.now() + 45 * 60 * 1000).toISOString()
          };
        } catch (orderError) {
          console.error('Error processing order:', orderError, order);
          return null; // Skip invalid orders
        }
      }).filter(order => order !== null); // Remove any null entries

      setOrders(processedOrders);
      console.log(`Loaded ${processedOrders.length} orders from database`);
    } catch (error) {
      console.error('Failed to load orders from backend:', error);
      toast.error('Failed to load order history from database');
      
      // Set empty orders array as a last resort
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getRandomStatus = () => {
    const statuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const generateTrackingUpdates = (orderDate, currentStatus) => {
    try {
      // Validate inputs
      if (!orderDate) {
        orderDate = new Date().toISOString();
      }
      
      // Convert to string if not already
      currentStatus = String(currentStatus || 'pending').toLowerCase();
      
      // Parse date safely
      let baseDate;
      try {
        baseDate = new Date(orderDate);
        if (isNaN(baseDate.getTime())) {
          // If invalid date, use current date
          baseDate = new Date();
        }
      } catch (e) {
        baseDate = new Date();
      }
      
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
    } catch (error) {
      console.error('Error generating tracking updates:', error);
      // Return basic update as fallback
      return [
        {
          status: 'pending',
          title: 'Order Placed',
          description: 'Your order has been received',
          timestamp: new Date().toISOString(),
          completed: true
        }
      ];
    }
  };

  const filterOrders = () => {
    if (!Array.isArray(orders)) {
      console.error('Orders is not an array:', orders);
      setFilteredOrders([]);
      return;
    }
    
    try {
      let filtered = [...orders];

      // Filter by search term with safety checks
      if (searchTerm) {
        filtered = filtered.filter(order => {
          try {
            // Safety check for order ID
            const idMatch = order.id && typeof order.id === 'string' && 
              order.id.toLowerCase().includes(searchTerm.toLowerCase());
              
            // Safety check for items array
            const itemsMatch = Array.isArray(order.items) && order.items.some(item => 
              item && item.name && typeof item.name === 'string' && 
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return idMatch || itemsMatch;
          } catch (err) {
            console.error('Error filtering order:', err, order);
            return false;
          }
        });
      }

      // Filter by status with safety check
      if (statusFilter !== 'all') {
        filtered = filtered.filter(order => 
          order && order.status && order.status === statusFilter
        );
      }

      // Sort by date with safety checks
      filtered.sort((a, b) => {
        try {
          const dateA = new Date(a.orderDate);
          const dateB = new Date(b.orderDate);
          
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            return 0; // If either date is invalid, don't change order
          }
          
          return dateB - dateA; // Most recent first
        } catch (err) {
          console.error('Error sorting orders:', err);
          return 0;
        }
      });

      setFilteredOrders(filtered);
    } catch (error) {
      console.error('Error in filterOrders:', error);
      setFilteredOrders([]);
    }
  };

  // These helper functions have been moved to the top of the component

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const downloadInvoice = (order) => {
    // Create a new popup window for the invoice
    const popup = window.open('', '_blank', 'width=800,height=900,scrollbars=yes,resizable=yes');
    
    if (popup) {
      // Create HTML content for the invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice #${order.id} - BMS Kingdom of taste</title>
          <meta charset="utf-8">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 30px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .header {
              border-bottom: 3px solid #f97316;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .restaurant-name {
              font-size: 28px;
              font-weight: bold;
              color: #f97316;
              margin-bottom: 5px;
            }
            .restaurant-info {
              color: #666;
              font-size: 14px;
            }
            .invoice-title {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              text-align: right;
              margin-top: -40px;
            }
            .invoice-details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
            }
            .customer-info, .order-info {
              flex: 1;
            }
            .section-title {
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .info-item {
              margin-bottom: 5px;
              color: #555;
            }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .items-table th,
            .items-table td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            .items-table th {
              background-color: #f8f9fa;
              font-weight: bold;
              color: #333;
            }
            .total-section {
              text-align: right;
              margin-top: 20px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
            }
            .total-final {
              font-weight: bold;
              font-size: 18px;
              color: #f97316;
              border-top: 2px solid #f97316;
              padding-top: 10px;
              margin-top: 10px;
            }
            .status-badge {
              display: inline-block;
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .status-completed { background: #dcfce7; color: #166534; }
            .status-pending { background: #fef3c7; color: #92400e; }
            .status-cancelled { background: #fecaca; color: #991b1b; }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #666;
              font-size: 12px;
              border-top: 1px solid #eee;
              padding-top: 20px;
            }
            @media print {
              body { margin: 0; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div class="restaurant-name">BMS Kingdom of taste</div>
              <div class="restaurant-info">Premium Dining Experience</div>
              <div class="restaurant-info">📍 123 Food Street, Taste City, TC 12345</div>
              <div class="restaurant-info">📞 +94 (11) 123-4567 | 📧 info@bmskingdomoftaste.com</div>
              <div class="invoice-title">INVOICE</div>
            </div>
            
            <div class="invoice-details">
              <div class="customer-info">
                <div class="section-title">Bill To:</div>
                <div class="info-item"><strong>${order.deliveryInfo?.fullName || 'Customer'}</strong></div>
                <div class="info-item">${order.deliveryInfo?.email || ''}</div>
                <div class="info-item">${order.deliveryInfo?.phone || ''}</div>
                <div class="info-item">${order.deliveryInfo?.address || ''}</div>
                <div class="info-item">${order.deliveryInfo?.city || ''}</div>
              </div>
              
              <div class="order-info">
                <div class="section-title">Order Details:</div>
                <div class="info-item"><strong>Invoice #:</strong> ${order.id}</div>
                <div class="info-item"><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</div>
                <div class="info-item"><strong>Time:</strong> ${new Date(order.orderDate).toLocaleTimeString()}</div>
                <div class="info-item"><strong>Status:</strong> 
                  <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="info-item"><strong>Payment:</strong> ${order.paymentMethod || 'Cash on Delivery'}</div>
              </div>
            </div>
            
            <table class="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>
                      <strong>${item.name}</strong>
                      ${item.description ? `<br><small style="color: #666;">${item.description}</small>` : ''}
                    </td>
                    <td>${item.quantity}</td>
                    <td>Rs ${item.price.toLocaleString()}</td>
                    <td>Rs ${(item.quantity * item.price).toLocaleString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            
            <div class="total-section">
              <div style="max-width: 300px; margin-left: auto;">
                <div class="total-row">
                  <span>Subtotal:</span>
                  <span>LKR ${order.subtotal.toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>Tax (${((order.tax / order.subtotal) * 100).toFixed(1)}%):</span>
                  <span>LKR ${order.tax.toLocaleString()}</span>
                </div>
                <div class="total-row">
                  <span>Delivery Fee:</span>
                  <span>LKR ${(order.deliveryFee || 0).toLocaleString()}</span>
                </div>
                <div class="total-row total-final">
                  <span>Total Amount:</span>
                  <span>LKR ${order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            ${order.deliveryInfo?.instructions ? `
              <div style="margin-top: 30px;">
                <div class="section-title">Special Instructions:</div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; color: #555;">
                  ${order.deliveryInfo.instructions}
                </div>
              </div>
            ` : ''}
            
            <div class="footer">
              <p>Thank you for choosing BMS Kingdom of taste!</p>
              <p>For any queries, please contact us at info@bmskingdomoftaste.com or +94 (11) 123-4567</p>
              <p style="margin-top: 10px;"><em>This is a computer-generated invoice.</em></p>
            </div>
          </div>
          
          <script>
            // Auto-focus the popup window
            window.focus();
            
            // Add print functionality
            document.addEventListener('keydown', function(e) {
              if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                window.print();
              }
            });
            
            // Add a print button
            setTimeout(() => {
              if (confirm('Would you like to print this invoice?')) {
                window.print();
              }
            }, 1000);
          </script>
        </body>
        </html>
      `;
      
      popup.document.write(invoiceHTML);
      popup.document.close();
      
      toast.success(`Invoice for order #${order.id} opened in new window`);
    } else {
      toast.error('Please allow popups to view the invoice');
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
          <p className="text-gray-600">Track your orders and view order details</p>
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
        {!Array.isArray(filteredOrders) || filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6">
              {!Array.isArray(orders) || orders.length === 0 
                ? "You haven't placed any orders yet" 
                : "No orders match your search criteria"
              }
            </p>
            <button
            onClick={() => navigate('/menu')}
            className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              if (!order || typeof order !== 'object') {
                return null; // Skip invalid orders
              }
              
              try {
                // Safely get status icon and color
                const StatusIcon = getStatusIcon(order.status || 'pending');
                const statusColor = getStatusColor(order.status || 'pending');
                const orderId = String(order.id || 'unknown');
                const orderDate = order.orderDate || new Date().toISOString();
                const status = String(order.status || 'pending');
                
                return (
                  <div key={orderId} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                      {/* Order Header */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-4 mb-2 md:mb-0">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Order #{orderId}
                            </h3>
                            <p className="text-gray-600 text-sm flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(orderDate)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
                              <StatusIcon className="w-4 h-4" />
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                            {order.orderType && (
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                                order.orderType === 'DELIVERY' ? 'bg-blue-100 text-blue-800' :
                                order.orderType === 'PICKUP' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.orderType === 'DELIVERY' ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                                {order.orderType}
                              </span>
                            )}
                          </div>
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
                        <span>{order.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Bank Deposit'}</span>
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
                      {order.paymentMethod === 'DEPOSIT_SLIP' && 
                        (order.paymentStatus === 'failed' || order.paymentStatus === 'awaiting_verification') && (
                          <button
                            onClick={() => navigate(`/payment/${order.id}`)}
                            className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-600 rounded-md hover:bg-orange-50 transition-colors"
                          >
                            <CreditCard className="w-4 h-4" />
                            Manage Payment
                          </button>
                        )
                      }
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
              } catch (error) {
                console.error('Error rendering order:', error, order);
                return null; // Skip orders that can't be rendered
              }
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
                      <p><strong>Payment:</strong> {selectedOrder.paymentMethod === 'CASH_ON_DELIVERY' ? 'Cash on Delivery' : 'Bank Deposit'}</p>
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
                      <span>Tax (6%)</span>
                      <span>{formatPrice(selectedOrder.tax)}</span>
                    </div>
                    {selectedOrder.deliveryFee > 0 && (
                      <div className="flex justify-between">
                        <span>Delivery Fee</span>
                        <span>{formatPrice(selectedOrder.deliveryFee)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span className="text-purple-600">{formatPrice(selectedOrder.total)}</span>
                    </div>
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