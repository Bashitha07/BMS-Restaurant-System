import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../../components/ui/Button';
import api from '../../services/api';

export default function OrderHistory() {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotifications();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders');
        notifyError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const downloadInvoice = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      notifySuccess('Invoice downloaded successfully!');
    } catch (error) {
      notifyError('Failed to download invoice');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <div className="text-center py-8">Loading orders...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-600 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Your order history will appear here</p>
            <a href="/" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-full hover:shadow-lg transition-all">
              Browse Menu
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Order ID</span>
                    <h3 className="font-medium">#{order.id}</h3>
                  </div>
                  <div className="text-right flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-gray-500">Date</span>
                      <p>{new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Items</span>
                    <ul className="divide-y">
                      {order.items && order.items.map((item, index) => (
                        <li key={index} className="py-2 flex justify-between">
                          <div>
                            <span className="font-medium">{item.quantity}x </span>
                            {item.name}
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <span className="text-sm text-gray-500">Payment Method</span>
                      <p className="font-medium">{order.paymentMethod}</p>
                    </div>
                    <div className="text-right flex items-center space-x-4">
                      <div>
                        <span className="text-sm text-gray-500">Total</span>
                        <p className="font-bold text-lg">${order.totalAmount.toFixed(2)}</p>
                      </div>
                      <Button
                        onClick={() => downloadInvoice(order.id)}
                        variant="outline"
                        className="ml-4"
                      >
                        Download Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
