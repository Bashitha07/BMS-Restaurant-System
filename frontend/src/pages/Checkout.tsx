import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CreditCardIcon, ChevronRightIcon, UploadIcon } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Notification } from '../components/ui/Notification';
type CheckoutFormData = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cash' | 'bank';
  paymentProof?: FileList;
};
export function Checkout() {
  const {
    items,
    getSubtotal,
    getTax,
    getTotal,
    clearCart
  } = useCart();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('cash');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const {
    register,
    handleSubmit,
    formState: {
      errors
    },
    watch
  } = useForm<CheckoutFormData>({
    defaultValues: {
      fullName: user?.name || '',
      paymentMethod: 'cash'
    }
  });
  const selectedPaymentMethod = watch('paymentMethod');
  const onSubmit = async (data: CheckoutFormData) => {
    if (!user) {
      setNotificationType('error');
      setNotificationMessage('Please log in to place an order');
      setShowNotification(true);
      return;
    }
    if (items.length === 0) {
      setNotificationType('error');
      setNotificationMessage('Your cart is empty');
      setShowNotification(true);
      return;
    }
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Generate random order ID
      const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderId(newOrderId);
      // Clear cart and show success
      setOrderPlaced(true);
      clearCart();
      setNotificationType('success');
      setNotificationMessage('Order placed successfully!');
      setShowNotification(true);
    } catch (error) {
      setNotificationType('error');
      setNotificationMessage('Failed to place order. Please try again.');
      setShowNotification(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  if (orderPlaced) {
    return <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order Placed Successfully!
              </h2>
              <p className="text-gray-600 mb-6">
                Thank you for your order. Your order ID is{' '}
                <span className="font-semibold">{orderId}</span>
              </p>
              <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Total Amount: Rs. {getTotal().toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Payment Method:{' '}
                  {paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Transfer'}
                </p>
                <p className="text-sm text-gray-600">
                  Status:{' '}
                  {paymentMethod === 'cash' ? 'Pending payment' : 'Pending payment verification'}
                </p>
              </div>
              {paymentMethod === 'bank' && <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Your payment proof has been submitted and is pending
                    verification. You will receive a confirmation once it's
                    approved.
                  </p>
                </div>}
              <div className="flex flex-col space-y-3">
                <Button onClick={() => navigate('/orders')} className="flex items-center justify-center">
                  <span>View Order Details</span>
                  <ChevronRightIcon size={16} className="ml-1" />
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>
        {showNotification && <Notification type={notificationType} message={notificationMessage} onClose={() => setShowNotification(false)} />}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {items.length === 0 ? <p className="text-gray-500">Your cart is empty</p> : <>
                  <div className="space-y-4 mb-6">
                    {items.map(item => <div key={item.menuItem.id} className="flex justify-between items-center pb-3 border-b">
                        <div>
                          <p className="font-medium">{item.menuItem.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × Rs.{' '}
                            {item.menuItem.price.toFixed(2)}
                          </p>
                        </div>
                        <p className="font-medium">
                          Rs. {(item.menuItem.price * item.quantity).toFixed(2)}
                        </p>
                      </div>)}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>Rs. {getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Tax (10%)</span>
                      <span>Rs. {getTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total</span>
                      <span>Rs. {getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </>}
            </div>
          </div>
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>
              {!user && <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    Please{' '}
                    <button className="font-medium underline" onClick={() => navigate('/login')}>
                      log in
                    </button>{' '}
                    to place an order
                  </p>
                </div>}
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" placeholder="Enter your full name" error={errors.fullName?.message} required {...register('fullName', {
                  required: 'Full name is required'
                })} />
                  <Input label="Phone Number" placeholder="Enter your phone number" error={errors.phone?.message} required {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9+\s-]+$/,
                    message: 'Please enter a valid phone number'
                  }
                })} />
                </div>
                <Input label="Delivery Address" placeholder="Enter your street address" error={errors.address?.message} required {...register('address', {
                required: 'Address is required'
              })} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="City" placeholder="Enter your city" error={errors.city?.message} required {...register('city', {
                  required: 'City is required'
                })} />
                  <Input label="Postal Code" placeholder="Enter your postal code" error={errors.postalCode?.message} required {...register('postalCode', {
                  required: 'Postal code is required'
                })} />
                </div>
                <h2 className="text-xl font-semibold mt-8 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <input type="radio" id="cash" value="cash" className="mr-2" {...register('paymentMethod')} onChange={() => setPaymentMethod('cash')} checked={paymentMethod === 'cash'} />
                    <label htmlFor="cash" className="flex items-center cursor-pointer">
                      <div size={20} className="mr-2 text-gray-700" />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="bank" value="bank" className="mr-2" {...register('paymentMethod')} onChange={() => setPaymentMethod('bank')} checked={paymentMethod === 'bank'} />
                    <label htmlFor="bank" className="flex items-center cursor-pointer">
                      <CreditCardIcon size={20} className="mr-2 text-gray-700" />
                      <span>Bank Transfer</span>
                    </label>
                  </div>
                </div>
                {paymentMethod === 'bank' && <div className="mb-6">
                    <div className="p-4 bg-gray-50 rounded-md mb-4">
                      <h3 className="font-medium mb-2">Bank Details</h3>
                      <p className="text-sm text-gray-600 mb-1">
                        Bank: People's Bank
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Account Name: BMS Kingdom of taste
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        Account Number: 1234567890
                      </p>
                      <p className="text-sm text-gray-600">Branch: Colombo</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Payment Slip{' '}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <UploadIcon size={24} className="mx-auto text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                              <span>Upload a file</span>
                              <input id="file-upload" type="file" className="sr-only" accept=".jpg,.jpeg,.png,.pdf" {...register('paymentProof', {
                            required: paymentMethod === 'bank' ? 'Payment proof is required' : false
                          })} />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, PDF up to 10MB
                          </p>
                        </div>
                      </div>
                      {errors.paymentProof && <p className="mt-1 text-sm text-red-600">
                          {errors.paymentProof.message}
                        </p>}
                    </div>
                  </div>}
                <Button type="submit" fullWidth isLoading={isSubmitting} disabled={!user || items.length === 0 || isSubmitting} className="mt-6">
                  Place Order
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>;
}