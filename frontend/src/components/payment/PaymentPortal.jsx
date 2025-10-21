import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import {
  CreditCard,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCcw,
  ArrowLeft,
  Download,
  AlertCircle
} from 'lucide-react';

export default function PaymentPortal({ orderId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [newDepositSlip, setNewDepositSlip] = useState(null);
  const [depositSlipPreview, setDepositSlipPreview] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = () => {
    // In a real app, this would be an API call
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const foundOrder = orders.find(o => o.id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    } else {
      toast.error('Order not found');
      navigate('/orders');
    }
  };

  const handleDepositSlipUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
      
      setNewDepositSlip(file);
      const reader = new FileReader();
      reader.onload = (e) => setDepositSlipPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const submitNewDepositSlip = async () => {
    if (!newDepositSlip) {
      toast.error('Please upload a deposit slip');
      return;
    }

    setLoading(true);
    try {
      // Convert deposit slip to base64
      const reader = new FileReader();
      const depositSlipData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(newDepositSlip);
      });

      // In a real app, this would be an API call
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const updatedOrders = orders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            depositSlip: depositSlipData,
            depositSlipName: newDepositSlip.name,
            status: 'awaiting_payment',
            paymentStatus: 'awaiting_verification',
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status: 'new_deposit_slip',
                title: 'New Deposit Slip Uploaded',
                description: 'Your payment proof is being verified',
                timestamp: new Date().toISOString(),
                completed: true
              }
            ]
          };
        }
        return o;
      });

      localStorage.setItem('orders', JSON.stringify(updatedOrders));
      loadOrder();
      toast.success('Deposit slip uploaded successfully');
      
      // Clear upload form
      setNewDepositSlip(null);
      setDepositSlipPreview(null);
      
      // Simulate payment verification
      await new Promise(resolve => setTimeout(resolve, 5000));
      const isVerified = Math.random() < 0.8;
      
      const finalOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const finalUpdatedOrders = finalOrders.map(o => {
        if (o.id === orderId) {
          return {
            ...o,
            status: isVerified ? 'confirmed' : 'payment_failed',
            paymentStatus: isVerified ? 'verified' : 'failed',
            trackingUpdates: [
              ...o.trackingUpdates,
              {
                status: isVerified ? 'payment_verified' : 'payment_failed',
                title: isVerified ? 'Payment Verified' : 'Payment Verification Failed',
                description: isVerified 
                  ? 'Your payment has been verified successfully'
                  : 'Please upload a new deposit slip or contact support',
                timestamp: new Date().toISOString(),
                completed: true
              }
            ]
          };
        }
        return o;
      });

      localStorage.setItem('orders', JSON.stringify(finalUpdatedOrders));
      loadOrder();
      
      if (isVerified) {
        toast.success('Payment verified successfully!');
      } else {
        toast.error('Payment verification failed. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading deposit slip:', error);
      toast.error('Failed to upload deposit slip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-purple-600" />
            Payment Details
          </h2>
          <button
            onClick={() => navigate('/orders')}
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </button>
        </div>
      </div>

      {/* Order Info */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Order ID:</strong> #{order.id}</p>
              <p><strong>Total Amount:</strong> {formatPrice(order.total)}</p>
              <p><strong>Payment Method:</strong> Bank Deposit</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  order.paymentStatus === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.paymentStatus === 'verified' && <CheckCircle className="w-3 h-3" />}
                  {order.paymentStatus === 'failed' && <XCircle className="w-3 h-3" />}
                  {order.paymentStatus === 'awaiting_verification' && <Clock className="w-3 h-3" />}
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1).replace('_', ' ')}
                </span>
              </p>
            </div>
          </div>

          {/* Bank Details */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h3 className="font-semibold mb-3">Bank Details</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Bank Name:</strong> HBL Bank Limited</p>
              <p><strong>Account Number:</strong> 00123-456-789123</p>
              <p><strong>Branch:</strong> Battaramulla</p>
              <p><strong>Amount to Pay:</strong> {formatPrice(order.total)}</p>
            </div>
          </div>
        </div>

        {/* Current Payment Status */}
        <div className={`rounded-lg p-6 mb-6 ${
          order.paymentStatus === 'verified'
            ? 'bg-green-50 border border-green-200'
            : order.paymentStatus === 'failed'
            ? 'bg-red-50 border border-red-200'
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-start gap-4">
            {order.paymentStatus === 'verified' && (
              <CheckCircle className="w-8 h-8 text-green-600 mt-1" />
            )}
            {order.paymentStatus === 'failed' && (
              <XCircle className="w-8 h-8 text-red-600 mt-1" />
            )}
            {order.paymentStatus === 'awaiting_verification' && (
              <Clock className="w-8 h-8 text-yellow-600 mt-1 animate-spin" />
            )}
            <div>
              <h3 className={`font-semibold text-lg ${
                order.paymentStatus === 'verified'
                  ? 'text-green-800'
                  : order.paymentStatus === 'failed'
                  ? 'text-red-800'
                  : 'text-yellow-800'
              }`}>
                {order.paymentStatus === 'verified'
                  ? 'Payment Verified'
                  : order.paymentStatus === 'failed'
                  ? 'Payment Verification Failed'
                  : 'Verifying Payment'}
              </h3>
              <p className={`mt-1 ${
                order.paymentStatus === 'verified'
                  ? 'text-green-700'
                  : order.paymentStatus === 'failed'
                  ? 'text-red-700'
                  : 'text-yellow-700'
              }`}>
                {order.paymentStatus === 'verified'
                  ? 'Your payment has been verified. Your order is being prepared.'
                  : order.paymentStatus === 'failed'
                  ? 'We could not verify your payment. Please upload a new deposit slip.'
                  : 'We are verifying your payment. This usually takes a few minutes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Upload New Deposit Slip */}
        {order.paymentStatus !== 'verified' && (
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-purple-600" />
              Upload New Deposit Slip
            </h3>
            
            {depositSlipPreview ? (
              <div className="mb-4">
                <div className="relative inline-block">
                  <img 
                    src={depositSlipPreview} 
                    alt="New deposit slip" 
                    className="max-w-md h-48 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => {
                      setNewDepositSlip(null);
                      setDepositSlipPreview(null);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <label className="cursor-pointer">
                    <span className="text-purple-600 hover:text-purple-500">
                      Click to upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDepositSlipUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-gray-500 text-sm mt-1">PNG, JPG up to 5MB</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Please ensure the deposit slip is clear and legible
              </p>
              <button
                onClick={submitNewDepositSlip}
                disabled={!newDepositSlip || loading}
                className={`px-6 py-2 rounded-md text-white flex items-center gap-2 ${
                  newDepositSlip && !loading
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Slip
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Payment History */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">Payment History</h3>
          <div className="space-y-4">
            {order.trackingUpdates
              .filter(update => update.status.includes('payment'))
              .map((update, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    update.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="font-medium">{update.title}</p>
                    <p className="text-sm text-gray-600">{update.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(update.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}