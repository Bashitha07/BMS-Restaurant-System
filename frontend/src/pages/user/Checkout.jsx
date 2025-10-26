import React, { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { downloadInvoice } from '../../utils/invoiceGenerator';
import { orderService, paymentService } from '../../services/api';
import Invoice from '../../components/common/Invoice';
import AuthModal from '../../components/auth/AuthModal';
import DeliveryDistanceValidator from '../../components/common/DeliveryDistanceValidator';
import { formatPrice } from '../../utils/currency';
import { 
  CreditCard, 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  Mail, 
  Upload, 
  ShoppingBag,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Download,
  UserPlus
} from 'lucide-react';

const Checkout = () => {
  const { items, subtotal, tax, total, clearCart, getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();

  // Delivery fee constant (LKR 400 flat rate)
  const DELIVERY_FEE = 400;

  // Logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout? Your cart will be saved for later.')) {
      logout();
      toast.success('Logged out successfully. Your cart has been saved!');
      navigate('/', { replace: true });
    }
  };

  // Form states
  const [step, setStep] = useState(1); // 1: Address, 2: Payment, 3: Confirmation
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    postalCode: '',
    instructions: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'deposit'
  const [depositSlip, setDepositSlip] = useState(null);
  const [depositSlipPreview, setDepositSlipPreview] = useState(null);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showInvoice, setShowInvoice] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [paymentVerificationStatus, setPaymentVerificationStatus] = useState('pending');

  // Helper function to check payment status
  const checkPaymentStatus = async (orderId) => {
    // In a real implementation, this would make an API call
    // For demo, we'll simulate a check after 5 seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    // Simulate successful verification 80% of the time
    const isVerified = Math.random() < 0.8;
    setPaymentVerificationStatus(isVerified ? 'verified' : 'failed');
    return isVerified;
  };

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/menu');
    }
  }, [items, navigate]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!deliveryInfo.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!deliveryInfo.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(deliveryInfo.email)) newErrors.email = 'Invalid email format';
    if (!deliveryInfo.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^[\+]?[0-9\-\(\)\s]*$/.test(deliveryInfo.phone)) newErrors.phone = 'Invalid phone number';
    if (!deliveryInfo.address.trim()) newErrors.address = 'Address is required';
    if (!deliveryInfo.city.trim()) newErrors.city = 'City is required';
    
    // Validate delivery distance
    if (deliveryDistance > 7.0) {
      newErrors.distance = 'Delivery distance cannot exceed 7km';
      toast.error('Delivery distance exceeds our maximum delivery range of 7km');
    } else if (deliveryDistance <= 0) {
      newErrors.distance = 'Please enter a valid delivery distance';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (paymentMethod === 'deposit' && !depositSlip) {
      setErrors({ depositSlip: 'Please upload deposit slip' });
      return false;
    }
    setErrors({});
    return true;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
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
      
      setDepositSlip(file);
      const reader = new FileReader();
      reader.onload = (e) => setDepositSlipPreview(e.target.result);
      reader.readAsDataURL(file);
      
      if (errors.depositSlip) {
        setErrors(prev => ({ ...prev, depositSlip: '' }));
      }
    }
  };

  const removeDepositSlip = () => {
    setDepositSlip(null);
    setDepositSlipPreview(null);
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      // Check if user is logged in for backend order creation
      if (!user) {
        toast.error('Please log in to place an order');
        setShowAuthModal(true);
        setLoading(false);
        return;
      }

      // Convert items to order items format expected by backend
      const orderItems = items.map(item => ({
        menuId: item.id,
        quantity: item.quantity,
        specialInstructions: item.notes || ''
      }));

      const orderData = {
        userId: user.id,
        items: orderItems,
        paymentMethod: paymentMethod === 'cash' ? 'CASH_ON_DELIVERY' : 'DEPOSIT_SLIP',
        deliveryAddress: `${deliveryInfo.address}, ${deliveryInfo.city}, ${deliveryInfo.postalCode}`,
        deliveryPhone: deliveryInfo.phone,
        specialInstructions: deliveryInfo.instructions || '',
        orderType: 'DELIVERY'
      };

      console.log('Creating order with data:', orderData);

      // Create order via API
      const createdOrder = await orderService.createOrder(orderData);
      console.log('Order created successfully:', createdOrder);

      // Upload deposit slip if payment method is deposit
      if (paymentMethod === 'deposit' && depositSlip) {
        try {
          console.log('Uploading deposit slip for order:', createdOrder.id);
          const paymentSlipData = await paymentService.uploadPaymentSlip(
            createdOrder.id,
            user.id,
            depositSlip,
            total + DELIVERY_FEE, // payment amount includes delivery fee
            new Date().toISOString(), // payment date
            'Bank Transfer', // bank name - you can make this a form field if needed
            '' // transaction reference - optional
          );
          console.log('Deposit slip uploaded successfully:', paymentSlipData);
          toast.success('Payment slip uploaded successfully!');
        } catch (slipError) {
          console.error('Failed to upload deposit slip:', slipError);
          toast.error('Order created but failed to upload payment slip. Please upload it from order history.');
        }
      }

      // Send notification to admin about new order
      addNotification(
        `New order #${createdOrder.id} placed by ${user.username || user.email} - Total: LKR ${(total + DELIVERY_FEE).toFixed(2)}`,
        'success',
        {
          title: 'New Order Received',
          orderId: createdOrder.id,
          orderTotal: total + DELIVERY_FEE,
          customerName: deliveryInfo.fullName,
          isAdminCopy: false,
          showToast: false // Don't show toast for user
        }
      );

      setCompletedOrder(createdOrder);
      clearCart();
      
      if (paymentMethod === 'deposit') {
        toast.success('Order placed! Payment verification required.');
        setShowInvoice(false);
        setPaymentVerificationStatus('pending');
      } else {
        toast.success('Order placed successfully!');
        // Show invoice option
        setTimeout(() => {
          setShowInvoice(true);
        }, 1000);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error(`Failed to place order: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    if (completedOrder) {
      const success = await downloadInvoice(completedOrder);
      if (success) {
        toast.success('Invoice downloaded successfully!');
      } else {
        toast.error('Failed to download invoice. Please try again.');
      }
    }
  };

  const handleViewOrderHistory = () => {
    navigate('/order-history');
  };

  const handleNewOrder = () => {
    setShowInvoice(false);
    setCompletedOrder(null);
    navigate('/menu');
  };

  const handleShowLogin = () => {
    setAuthModalMode('login');
    setShowAuthModal(true);
  };

  const handleShowRegister = () => {
    setAuthModalMode('register');
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  // Update delivery info when user logs in or registers
  useEffect(() => {
    if (user) {
      setDeliveryInfo(prev => ({
        ...prev,
        fullName: user.name || user.username || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  if (items.length === 0) {
    return <div>Redirecting...</div>;
  }

  // Show invoice screen after successful order
  if (showInvoice && completedOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header with Logout */}
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleShowLogin}
                      className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      Login
                    </button>
                    <button
                      onClick={handleShowRegister}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className={`border rounded-lg p-6 ${
              paymentMethod === 'deposit' 
                ? paymentVerificationStatus === 'verified'
                  ? 'bg-green-50 border-green-200'
                  : paymentVerificationStatus === 'failed'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}>
              {paymentMethod === 'deposit' ? (
                <>
                  {paymentVerificationStatus === 'verified' ? (
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  ) : paymentVerificationStatus === 'failed' ? (
                    <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                  ) : (
                    <Clock className="w-16 h-16 text-yellow-600 mx-auto mb-4 animate-spin" />
                  )}
                  <h2 className={`text-2xl font-bold mb-2 ${
                    paymentVerificationStatus === 'verified'
                      ? 'text-green-800'
                      : paymentVerificationStatus === 'failed'
                      ? 'text-red-800'
                      : 'text-yellow-800'
                  }`}>
                    {paymentVerificationStatus === 'verified'
                      ? 'Payment Verified & Order Confirmed!'
                      : paymentVerificationStatus === 'failed'
                      ? 'Payment Verification Failed'
                      : 'Verifying Payment...'}
                  </h2>
                  <p className={`${
                    paymentVerificationStatus === 'verified'
                      ? 'text-green-700'
                      : paymentVerificationStatus === 'failed'
                      ? 'text-red-700'
                      : 'text-yellow-700'
                  }`}>
                    {paymentVerificationStatus === 'verified'
                      ? `Your order #${completedOrder.id} has been confirmed and is being prepared.`
                      : paymentVerificationStatus === 'failed'
                      ? 'Please upload a new deposit slip or choose a different payment method.'
                      : 'Your order will be confirmed once payment is verified.'}
                  </p>
                  <p className="text-sm mt-2">
                    {paymentVerificationStatus === 'verified' && (
                      <span className="text-green-600">
                        Estimated delivery: 45-60 minutes
                      </span>
                    )}
                  </p>
                </>
              ) : (
                <>
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
                  <p className="text-green-700">
                    Your order #{completedOrder.id} has been confirmed and is being prepared.
                  </p>
                  <p className="text-sm text-green-600 mt-2">
                    Estimated delivery: 45-60 minutes
                  </p>
                </>
              )}
              {!user && (
                <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <UserPlus className="w-5 h-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">🎉 Complete Your Experience!</h4>
                      <p className="text-sm text-green-700 mb-3">
                        Create an account now to track this order and enjoy faster checkout for future orders!
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleShowRegister}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Create Account - It's Free!
                        </button>
                        <button
                          onClick={handleShowLogin}
                          className="px-4 py-2 text-green-700 text-sm border border-green-300 rounded-lg hover:bg-green-50 transition-colors"
                        >
                          I Have an Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleDownloadInvoice}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Invoice
              </button>
              <button
                onClick={handleViewOrderHistory}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FileText className="w-5 h-5" />
                View Order History
              </button>
              <button
                onClick={handleNewOrder}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <ShoppingBag className="w-5 h-5" />
                Place New Order
              </button>
            </div>
          </div>

          {/* Invoice Preview */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <Invoice 
              orderData={completedOrder} 
              onDownload={handleDownloadInvoice}
            />
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={handleCloseAuthModal}
          initialMode={authModalMode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleShowLogin}
                  className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={handleShowRegister}
                  className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  Register
                </button>
              </>
            )}
          </div>
        </div>

        {/* Guest Checkout Notice */}
        {!user && (
          <div className="mb-6">
            {/* Main Guest Notice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">Checkout as Guest</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    You're checking out as a guest. For faster checkout and order tracking, consider creating an account.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShowLogin}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Already have an account? Login
                    </button>
                    <span className="text-blue-400">|</span>
                    <button
                      onClick={handleShowRegister}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      Create new account
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Benefits Card */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-purple-800 mb-2">🎯 Why Create an Account?</h3>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Track your orders in real-time</li>
                    <li>• Save delivery addresses for faster checkout</li>
                    <li>• Access order history and reorder favorites</li>
                    <li>• Get exclusive member discounts</li>
                  </ul>
                </div>
                <div className="ml-4">
                  <button
                    onClick={handleShowRegister}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    Sign Up Free
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step >= stepNum ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step > stepNum ? <CheckCircle className="w-6 h-6" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`h-1 w-16 mx-2 ${
                    step > stepNum ? 'bg-purple-600' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-16 text-sm">
              <span className={step >= 1 ? 'text-purple-600 font-medium' : 'text-gray-500'}>
                Delivery Info
              </span>
              <span className={step >= 2 ? 'text-purple-600 font-medium' : 'text-gray-500'}>
                Payment
              </span>
              <span className={step >= 3 ? 'text-purple-600 font-medium' : 'text-gray-500'}>
                Confirmation
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              {step === 1 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-purple-600" />
                    Delivery Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <User className="w-4 h-4 inline mr-2" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={deliveryInfo.fullName}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.fullName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your full name"
                      />
                      {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={deliveryInfo.email}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="w-4 h-4 inline mr-2" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="+92 300 1234567"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={deliveryInfo.city}
                        onChange={handleInputChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MapPin className="w-4 h-4 inline mr-2" />
                        Full Address *
                      </label>
                      <textarea
                        name="address"
                        value={deliveryInfo.address}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                          errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="House#, Street, Area, Landmark"
                      />
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={deliveryInfo.postalCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="12345"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        name="instructions"
                        value={deliveryInfo.instructions}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Special instructions for delivery..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <DeliveryDistanceValidator
                        distance={deliveryDistance}
                        onDistanceChange={setDeliveryDistance}
                        preparationTime={30}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-purple-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* Cash on Delivery */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'cash' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Truck className="w-6 h-6 text-green-600" />
                          <div>
                            <h3 className="font-semibold">Cash on Delivery</h3>
                            <p className="text-gray-600 text-sm">Pay when your order arrives</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'cash' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'cash' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bank Deposit */}
                    <div 
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        paymentMethod === 'deposit' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                      }`}
                      onClick={() => setPaymentMethod('deposit')}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-6 h-6 text-blue-600" />
                          <div>
                            <h3 className="font-semibold">Bank Deposit</h3>
                            <p className="text-gray-600 text-sm">Upload deposit slip for confirmation</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === 'deposit' ? 'border-purple-500 bg-purple-500' : 'border-gray-300'
                        }`}>
                          {paymentMethod === 'deposit' && (
                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bank Deposit Details */}
                    {paymentMethod === 'deposit' && (
                      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-6 mt-4">
                        <h4 className="font-bold text-orange-800 mb-4 text-lg flex items-center">
                          <CreditCard className="w-5 h-5 mr-2" />
                          Restaurant Bank Details
                        </h4>
                        
                        <div className="bg-white rounded-lg p-4 border border-orange-100 mb-4">
                          <div className="text-sm text-orange-700 space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Bank Name:</span>
                              <span className="font-bold">HBL Bank Limited</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Account Number:</span>
                              <span className="font-bold text-lg">00123-456-789123</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Account Branch:</span>
                              <span className="font-bold">Battaramulla</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Order ID:</span>
                              <span className="font-bold">Order-{Date.now()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Amount to Pay:</span>
                              <span className="font-bold text-lg text-green-600">{formatPrice(total + DELIVERY_FEE)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-orange-100 rounded-lg p-3 mb-4">
                          <h5 className="font-semibold text-orange-800 mb-2">💡 Payment Instructions:</h5>
                          <ul className="text-sm text-orange-700 space-y-1">
                            <li>• Transfer the exact amount: <strong>{formatPrice(total + DELIVERY_FEE)}</strong></li>
                            <li>• Use the reference number for easy tracking</li>
                            <li>• Take a clear photo of your deposit slip</li>
                            <li>• Upload the deposit slip below to complete your order</li>
                            <li>• Your order will be confirmed once payment is verified</li>
                          </ul>
                        </div>
                        
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Upload className="w-4 h-4 inline mr-2" />
                            Upload Deposit Slip *
                          </label>
                          
                          {!depositSlipPreview ? (
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
                          ) : (
                            <div className="relative">
                              <img 
                                src={depositSlipPreview} 
                                alt="Deposit slip" 
                                className="w-full max-w-md h-48 object-cover rounded-lg border"
                              />
                              <button
                                onClick={removeDepositSlip}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          
                          {errors.depositSlip && (
                            <p className="text-red-500 text-sm mt-1">{errors.depositSlip}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Order Confirmation
                  </h2>

                  <div className="space-y-6">
                    {/* Delivery Info Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Delivery Information
                      </h3>
                      <div className="space-y-1 text-sm">
                        <p><strong>Name:</strong> {deliveryInfo.fullName}</p>
                        <p><strong>Phone:</strong> {deliveryInfo.phone}</p>
                        <p><strong>Address:</strong> {deliveryInfo.address}, {deliveryInfo.city}</p>
                        {deliveryInfo.instructions && (
                          <p><strong>Instructions:</strong> {deliveryInfo.instructions}</p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Summary */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <CreditCard className="w-5 h-5" />
                        Payment Method
                      </h3>
                      <p className="text-sm">
                        {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Deposit'}
                      </p>
                    </div>

                    {/* Estimated Delivery */}
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-purple-700">
                        <Clock className="w-5 h-5" />
                        <span className="font-semibold">Estimated Delivery: 45-60 minutes</span>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="text-sm text-gray-600">
                      <p>By placing this order, you agree to our terms and conditions. 
                      Orders cannot be cancelled once confirmed.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <button
                    onClick={prevStep}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Previous
                  </button>
                )}
                
                <div className="ml-auto">
                  {step < 3 ? (
                    <button
                      onClick={nextStep}
                      className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={submitOrder}
                      disabled={loading}
                      className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Placing Order...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Place Order
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Order Summary
              </h2>

              {/* User Status */}
              {user ? (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Logged in as {user.username}
                  </p>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-700 mb-2">Checking out as guest</p>
                  <button
                    onClick={handleShowRegister}
                    className="text-xs text-yellow-600 hover:text-yellow-800 underline"
                  >
                    Create account for order tracking →
                  </button>
                </div>
              )}
              
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-gray-600 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-medium text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (6%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(DELIVERY_FEE)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-purple-600">{formatPrice(total + DELIVERY_FEE)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default Checkout;
