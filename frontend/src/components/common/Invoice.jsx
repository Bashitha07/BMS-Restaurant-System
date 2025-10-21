import React from 'react';
import { 
  FileText, 
  Download, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard 
} from 'lucide-react';
import { formatPrice } from '../../utils/currency';

const Invoice = ({ orderData, onDownload }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white">
      {/* Invoice Container */}
      <div id="invoice-content" className="max-w-4xl mx-auto p-8">
        {/* Header */}
        <div className="border-b-2 border-purple-600 pb-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-purple-600">BMS Kingdom of Taste</h1>
              <p className="text-gray-600 mt-2">Premium Restaurant Services</p>
              <p className="text-sm text-gray-500">📍 123 Food Street, Taste City, TC 12345</p>
              <p className="text-sm text-gray-500">📞 +1 (555) 123-4567 | 📧 info@bmskingdom.com</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
              <div className="mt-4 text-sm">
                <p><span className="font-semibold">Invoice #:</span> {orderData.id}</p>
                <p><span className="font-semibold">Date:</span> {formatDate(orderData.orderDate)}</p>
                <p><span className="font-semibold">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                    orderData.status === 'completed' ? 'bg-green-100 text-green-800' :
                    orderData.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {orderData.status.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Bill To:
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">{orderData.deliveryInfo.fullName}</p>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4" />
                {orderData.deliveryInfo.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2 mt-1">
                <Phone className="w-4 h-4" />
                {orderData.deliveryInfo.phone}
              </p>
              <p className="text-gray-600 mt-2">{orderData.deliveryInfo.address}</p>
              <p className="text-gray-600">{orderData.deliveryInfo.city}</p>
              {orderData.deliveryInfo.postalCode && (
                <p className="text-gray-600">{orderData.deliveryInfo.postalCode}</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Details:
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-gray-800">
                {orderData.paymentMethod === 'cash' ? 'Cash on Delivery' : 'Bank Deposit'}
              </p>
              {orderData.estimatedDelivery && (
                <p className="text-gray-600 flex items-center gap-2 mt-2">
                  <Calendar className="w-4 h-4" />
                  Est. Delivery: {formatDate(orderData.estimatedDelivery)}
                </p>
              )}
              {orderData.deliveryInfo.instructions && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Special Instructions:</p>
                  <p className="text-sm text-gray-600">{orderData.deliveryInfo.instructions}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="border border-gray-300 px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.description.substring(0, 80)}
                            {item.description.length > 80 ? '...' : ''}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-center">
                      {item.quantity}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right">
                      {formatPrice(item.price)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full max-w-md">
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{formatPrice(orderData.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (6%):</span>
                  <span className="font-medium">{formatPrice(orderData.tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="border-t border-gray-300 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-purple-600">
                      {formatPrice(orderData.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-300 pt-6">
          <div className="text-center text-gray-600">
            <p className="text-lg font-semibold mb-2">Thank you for your business!</p>
            <p className="text-sm">BMS Kingdom of Taste - Serving excellence since 2025</p>
            <p className="text-xs mt-2">
              For any questions about this invoice, please contact us at info@bmskingdom.com
            </p>
          </div>
        </div>
      </div>

      {/* Download Button (outside of invoice content) */}
      {onDownload && (
        <div className="text-center py-6 bg-gray-100">
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Download className="w-5 h-5" />
            Download Invoice PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default Invoice;