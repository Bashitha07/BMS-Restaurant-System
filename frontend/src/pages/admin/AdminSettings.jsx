import { useState, useEffect } from 'react';
import axios from '../../utils/axios';

export default function AdminSettings() {
  const [deliveryFee, setDeliveryFee] = useState('400.00');
  const [taxRate, setTaxRate] = useState('0.10');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const [deliveryResponse, taxResponse] = await Promise.all([
        axios.get('/api/admin/settings/delivery-fee'),
        axios.get('/api/admin/settings/tax-rate')
      ]);
      
      setDeliveryFee(deliveryResponse.data.deliveryFee);
      setTaxRate(taxResponse.data.taxRate);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDeliveryFee = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put('/api/admin/settings/delivery-fee', {
        deliveryFee: deliveryFee
      });

      setMessage({ 
        type: 'success', 
        text: `Delivery fee updated to LKR ${response.data.deliveryFee}` 
      });
    } catch (error) {
      console.error('Error updating delivery fee:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update delivery fee' 
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTaxRate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.put('/api/admin/settings/tax-rate', {
        taxRate: taxRate
      });

      setMessage({ 
        type: 'success', 
        text: `Tax rate updated to ${(response.data.taxRate * 100).toFixed(2)}%` 
      });
    } catch (error) {
      console.error('Error updating tax rate:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.error || 'Failed to update tax rate' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage restaurant system configuration
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Message Display */}
            {message.text && (
              <div
                className={`p-4 rounded-md ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Delivery Fee Settings */}
            <form onSubmit={handleUpdateDeliveryFee} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label htmlFor="deliveryFee" className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Fee (LKR)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Flat delivery charge applied to all delivery orders
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative rounded-md shadow-sm flex-1 max-w-xs">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">LKR</span>
                      </div>
                      <input
                        type="number"
                        id="deliveryFee"
                        value={deliveryFee}
                        onChange={(e) => setDeliveryFee(e.target.value)}
                        step="0.01"
                        min="0"
                        required
                        className="block w-full rounded-md border-gray-300 pl-12 pr-4 py-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="400.00"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                </div>
              </div>
            </form>

            {/* Tax Rate Settings */}
            <form onSubmit={handleUpdateTaxRate} className="bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Tax Rate (%)
                  </label>
                  <p className="text-sm text-gray-500 mb-4">
                    Tax percentage applied to all orders (currently {(taxRate * 100).toFixed(2)}%)
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="relative rounded-md shadow-sm flex-1 max-w-xs">
                      <input
                        type="number"
                        id="taxRate"
                        value={taxRate}
                        onChange={(e) => setTaxRate(e.target.value)}
                        step="0.01"
                        min="0"
                        max="1"
                        required
                        className="block w-full rounded-md border-gray-300 pr-12 py-2 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder="0.10"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">
                          ({(taxRate * 100).toFixed(2)}%)
                        </span>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Updating...' : 'Update'}
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Enter as decimal (e.g., 0.10 for 10%, 0.15 for 15%)
                  </p>
                </div>
              </div>
            </form>

            {/* Information Panel */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Important Information
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Changes to delivery fee apply to new orders only</li>
                      <li>Tax rate changes affect all new order calculations</li>
                      <li>Existing orders retain their original fee structure</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
