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
import { paymentService } from '../../services/api';
import axios from '../../utils/axios';

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
      // Fetch payments from backend API
      console.log('Fetching payments from backend...');
      const paymentsData = await paymentService.getAllPayments();
      
      // Filter by status if needed
      const filteredPayments = filter === 'all' 
        ? paymentsData 
        : paymentsData.filter(payment => payment.status.toLowerCase() === filter);
      
      setPayments(filteredPayments);
      console.log(`Loaded ${filteredPayments.length} payments from database`);
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments from database');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (payment) => {
    try {
      console.log('Verifying payment:', payment.id);
      
      // Update payment status via backend API
      await paymentService.updatePayment(payment.id, {
        ...payment,
        status: 'COMPLETED',
        processedDate: new Date().toISOString(),
        approvedDate: new Date().toISOString()
      });
      
      // Also update associated order status if needed
      if (payment.orderId) {
        await axios.patch(`/api/orders/${payment.orderId}/status`, { status: 'CONFIRMED' });
      }
      
      toast.success('Payment verified successfully');
      loadPayments(); // Reload from backend
    } catch (error) {
      console.error('Error verifying payment:', error);
      toast.error('Failed to verify payment');
    }
  };

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [paymentToReject, setPaymentToReject] = useState(null);
  
  const openRejectDialog = (payment) => {
    setPaymentToReject(payment);
    setRejectionReason('');
    setRejectDialogOpen(true);
  };
  
  const closeRejectDialog = () => {
    setRejectDialogOpen(false);
    setPaymentToReject(null);
  };
  
  const handleRejectPayment = async (payment, reason = 'Payment verification failed') => {
    try {
      console.log('Rejecting payment:', payment.id);
      
      // Update payment status via backend API
      await paymentService.updatePayment(payment.id, {
        ...payment,
        status: 'FAILED',
        failureReason: reason,
        processedDate: new Date().toISOString()
      });
      
      // Also update associated order status if needed
      if (payment.orderId) {
        await axios.patch(`/api/orders/${payment.orderId}/status`, { status: 'CANCELLED' });
      }
      
      toast.success('Payment rejected');
      loadPayments(); // Reload from backend
      closeRejectDialog();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const downloadDepositSlip = (payment) => {
    // For backend API-based slips
    if (payment.depositSlip && payment.depositSlip.startsWith('/uploads/')) {
      // For API-based URLs, use the full server URL
      const baseUrl = import.meta.env.VITE_API_URL || window.location.origin;
      const fullUrl = `${baseUrl}${payment.depositSlip}`;
      
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = payment.depositSlipName || 'deposit-slip.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // For local mock data
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
          {/* Rejection Dialog */}
          {rejectDialogOpen && paymentToReject && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-medium text-gray-900 mb-4">Reject Payment</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please provide a reason for rejecting this payment.
                </p>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Reason for rejection..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none mb-4"
                  rows="3"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={closeRejectDialog}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleRejectPayment(paymentToReject, rejectionReason || 'Payment verification failed')}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-300"
                  >
                    Reject Payment
                  </button>
                </div>
              </div>
            </div>
          )}
          
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
                          src={payment.depositSlip.startsWith('/uploads/') 
                            ? `${import.meta.env.VITE_API_URL || ''}${payment.depositSlip}` 
                            : payment.depositSlip} 
                          alt="Deposit slip" 
                          className="max-w-full h-48 object-cover rounded-lg border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/images/placeholder-image.png';
                            console.error('Error loading image:', payment.depositSlip);
                          }}
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
                              onClick={() => openRejectDialog(payment)}
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