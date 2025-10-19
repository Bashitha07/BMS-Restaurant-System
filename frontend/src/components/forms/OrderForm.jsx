import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';

export default function OrderForm() {
  const { menuItemId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    quantity: 1,
    specialInstructions: '',
    deliveryAddress: '',
    isDelivery: false,
  });

  const [menuItem, setMenuItem] = useState(null);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(`/api/menu/${menuItemId}`);
        setMenuItem(response.data);
      } catch (error) {
        toast.error('Failed to load menu item');
        navigate('/menu');
      }
    };

    if (menuItemId) {
      fetchMenuItem();
    }
  }, [menuItemId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const calculateTotal = () => {
    if (!menuItem) return 0;
    return menuItem.price * formData.quantity;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to place an order');
      navigate('/login');
      return;
    }

    try {
      const orderData = {
        ...formData,
        menuItemId,
        userId: user.id,
        total: calculateTotal(),
      };

      await axios.post('/api/orders', orderData);
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    }
  };

  if (!menuItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Place Order - {menuItem.name}
      </h2>
      <div className="mb-6">
        <p className="text-gray-600">Price: LKR {menuItem.price.toLocaleString()}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            required
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isDelivery"
              checked={formData.isDelivery}
              onChange={handleChange}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Delivery</span>
          </label>
        </div>

        {formData.isDelivery && (
          <div>
            <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
              Delivery Address
            </label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              required={formData.isDelivery}
              value={formData.deliveryAddress}
              onChange={handleChange}
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        )}

        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div className="border-t pt-4">
          <p className="text-lg font-semibold text-gray-900">
            Total: LKR {calculateTotal().toLocaleString()}
          </p>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Place Order
        </button>
      </form>
    </div>
  );
}