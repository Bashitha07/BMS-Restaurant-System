import React from 'react';
import { ClockIcon, TruckIcon, CheckIcon } from 'lucide-react';
type Order = {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'delivered';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
};
export function Orders() {
  // Mock orders data
  const orders: Order[] = [{
    id: 'ORD-1234',
    date: '2023-05-15 14:30',
    total: 24.98,
    status: 'delivered',
    items: [{
      name: 'Chicken Burger',
      quantity: 2,
      price: 8.99
    }, {
      name: 'French Fries',
      quantity: 1,
      price: 3.99
    }, {
      name: 'Chocolate Milkshake',
      quantity: 1,
      price: 3.99
    }]
  }, {
    id: 'ORD-1235',
    date: '2023-05-18 19:45',
    total: 32.97,
    status: 'processing',
    items: [{
      name: 'Pepperoni Pizza',
      quantity: 1,
      price: 14.99
    }, {
      name: 'Garlic Bread',
      quantity: 1,
      price: 5.99
    }, {
      name: 'Chicken Wings',
      quantity: 1,
      price: 9.99
    }, {
      name: 'Soda',
      quantity: 1,
      price: 1.99
    }]
  }, {
    id: 'ORD-1236',
    date: '2023-05-20 12:15',
    total: 18.98,
    status: 'pending',
    items: [{
      name: 'Vegetable Fried Rice',
      quantity: 1,
      price: 9.99
    }, {
      name: 'Spring Rolls',
      quantity: 1,
      price: 5.99
    }, {
      name: 'Watermelon Juice',
      quantity: 1,
      price: 2.99
    }]
  }];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon size={20} className="text-yellow-500" />;
      case 'processing':
        return <TruckIcon size={20} className="text-blue-500" />;
      case 'delivered':
        return <CheckIcon size={20} className="text-green-500" />;
      default:
        return null;
    }
  };
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'On the Way';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">My Orders</h1>
        {orders.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Your order history will appear here
            </p>
            <a href="/" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-2 px-6 rounded-full hover:shadow-lg transition-all">
              Browse Menu
            </a>
          </div> : <div className="space-y-6">
            {orders.map(order => <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500">Order ID</span>
                    <h3 className="font-medium">{order.id}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">Date</span>
                    <p>{order.date}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <span className="text-sm text-gray-500">Items</span>
                    <ul className="divide-y">
                      {order.items.map((item, index) => <li key={index} className="py-2 flex justify-between">
                          <div>
                            <span className="font-medium">
                              {item.quantity}x{' '}
                            </span>
                            {item.name}
                          </div>
                          <div>${(item.price * item.quantity).toFixed(2)}</div>
                        </li>)}
                    </ul>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="flex items-center">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${getStatusClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="font-medium">
                          {getStatusText(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-500">Total</span>
                      <p className="font-bold text-lg">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>}
      </div>
    </div>;
}