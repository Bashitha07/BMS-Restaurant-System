import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    setLoading(true);
    try {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Transform orders into payment records
      const paymentRecords = orders
        .filter(order => order.paymentMethod === 'deposit')
        .map(order => ({
          id: order.id,
          orderId: order.id,
          customerName: order.deliveryInfo.fullName,
          customerEmail: order.deliveryInfo.email,
          amount: order.total,
          reference: `Order ID - ${order.id}`,
          depositSlip: order.depositSlip,
          depositSlipName: order.depositSlipName,
          status: order.paymentStatus === 'verified' ? 'verified' : 
                 order.paymentStatus === 'failed' ? 'rejected' : 'pending',
          uploadedAt: order.orderDate,
          verifiedAt: order.trackingUpdates?.find(u => u.status === 'payment_verified')?.timestamp,
          rejectedAt: order.trackingUpdates?.find(u => u.status === 'payment_failed')?.timestamp,
          deliveryInfo: order.deliveryInfo,
          items: order.items
        }))
        .filter(payment => filter === 'all' || payment.status === filter);

      setPayments(paymentRecords);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (payment) => {
    try {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Find and update the order
      const updatedOrders = orders.map(order => {
        if (order.id === payment.orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: 'confirmed',
            paymentStatus: 'verified',
            trackingUpdates: [
              ...order.trackingUpdates,
              {
                status: 'payment_verified',
                title: 'Payment Verified',
                description: 'Bank deposit has been verified by admin',
                timestamp: now,
                completed: true
              }
            ]
          };
        }
        return order;
      });
      
      // Save updated orders
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      toast.success('Payment verified successfully');
      loadPayments();
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const handleRejectPayment = async (payment, reason = 'Payment verification failed') => {
    try {
      // Get orders from localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      
      // Find and update the order
      const updatedOrders = orders.map(order => {
        if (order.id === payment.orderId) {
          const now = new Date().toISOString();
          return {
            ...order,
            status: 'payment_failed',
            paymentStatus: 'failed',
            trackingUpdates: [
              ...order.trackingUpdates,
              {
                status: 'payment_failed',
                title: 'Payment Rejected',
                description: reason,
                timestamp: now,
                completed: true
              }
            ]
          };
        }
        return order;
      });
      
      // Save updated orders
      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      toast.success('Payment rejected');
      loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const downloadDepositSlip = (payment) => {
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = payment.depositSlip;
    link.download = payment.depositSlipName || 'deposit-slip.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-LK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={loadPayments}
            className="flex items-center gap-2 px-4 py-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No payments found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
          {payments.map((payment) => (
            <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{payment.orderId}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(payment.uploadedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    payment.status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : payment.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {payment.status === 'verified' && <CheckCircle className="w-4 h-4" />}
                    {payment.status === 'rejected' && <XCircle className="w-4 h-4" />}
                    {payment.status === 'pending' && <Clock className="w-4 h-4" />}
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer and Order Info */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Customer Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{payment.customerName}</p>
                      <p>{payment.customerEmail}</p>
                      <p>{payment.deliveryInfo?.phone}</p>
                      <p>{payment.deliveryInfo?.address}, {payment.deliveryInfo?.city}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Order Summary</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Total Amount: <span className="font-semibold">{formatPrice(payment.amount)}</span></p>
                      <p>Items: {payment.items?.length || 0}</p>
                      <p>Reference: {payment.reference}</p>
                    </div>
                  </div>
                </div>

                {/* Deposit Slip and Actions */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Deposit Slip</h4>
                  {payment.depositSlip ? (
                    <div>
                      <div className="mb-4">
                        <img 
                          src={payment.depositSlip} 
                          alt="Deposit slip" 
                          className="max-w-full h-48 object-cover rounded-lg border"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => downloadDepositSlip(payment)}
                          className="flex items-center gap-2 px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        {payment.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleVerifyPayment(payment)}
                              className="flex items-center gap-2 px-4 py-2 text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Verify
                            </button>
                            <button
                              onClick={() => handleRejectPayment(payment)}
                              className="flex items-center gap-2 px-4 py-2 text-red-600 border border-red-600 rounded-md hover:bg-red-50 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No deposit slip uploaded</p>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              {(payment.verifiedAt || payment.rejectedAt) && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-medium text-gray-700 mb-2">Status Updates</h4>
                  <div className="text-sm text-gray-600">
                    {payment.verifiedAt && (
                      <p className="flex items-center gap-2 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Verified at {formatDate(payment.verifiedAt)}
                      </p>
                    )}
                    {payment.rejectedAt && (
                      <p className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        Rejected at {formatDate(payment.rejectedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}