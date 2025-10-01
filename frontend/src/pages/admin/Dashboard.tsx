import { Link } from 'react-router-dom';
import { CreditCardIcon, ShoppingCartIcon, UsersIcon, CalendarIcon, DollarSignIcon, TrendingUpIcon, ClockIcon } from 'lucide-react';
export function AdminDashboard() {
  // Mock data for dashboard stats
  const stats = {
    totalSales: 285000,
    totalOrders: 124,
    pendingOrders: 18,
    newCustomers: 37,
    pendingPayments: 12,
    totalReservations: 45
  };
  // Mock data for recent orders
  const recentOrders = [{
    id: 'ORD-1234',
    customer: 'John Smith',
    total: 4500,
    status: 'delivered',
    date: '2023-05-20 12:15'
  }, {
    id: 'ORD-1235',
    customer: 'Sarah Johnson',
    total: 3200,
    status: 'processing',
    date: '2023-05-18 19:45'
  }, {
    id: 'ORD-1236',
    customer: 'Michael Chen',
    total: 2800,
    status: 'pending',
    date: '2023-05-15 14:30'
  }, {
    id: 'ORD-1237',
    customer: 'Emily Rodriguez',
    total: 5100,
    status: 'pending',
    date: '2023-05-15 10:20'
  }];
  // Get status color based on order status
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-500';
      case 'processing':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };
  return <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">Total Sales</h3>
              <div className="bg-indigo-100 rounded-full p-2">
                <DollarSignIcon size={20} className="text-indigo-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">
              Rs. {stats.totalSales.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <TrendingUpIcon size={16} className="mr-1 text-green-500" />
              <span>12% increase from last month</span>
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Total Orders
              </h3>
              <div className="bg-orange-100 rounded-full p-2">
                <ShoppingCartIcon size={20} className="text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Pending: {stats.pendingOrders}</span>
              <Link to="/admin/orders" className="text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                New Customers
              </h3>
              <div className="bg-green-100 rounded-full p-2">
                <UsersIcon size={20} className="text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.newCustomers}</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Pending Payments
              </h3>
              <div className="bg-red-100 rounded-full p-2">
                <CreditCardIcon size={20} className="text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.pendingPayments}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Needs verification</span>
              <Link to="/admin/payments" className="text-indigo-600 hover:underline">
                Review
              </Link>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-700">
                Total Reservations
              </h3>
              <div className="bg-purple-100 rounded-full p-2">
                <CalendarIcon size={20} className="text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.totalReservations}</p>
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>This month</span>
              <Link to="/admin/reservations" className="text-indigo-600 hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Quick Actions</h3>
              <div className="bg-white/20 rounded-full p-2">
                <ClockIcon size={20} className="text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <Link to="/admin/orders" className="block bg-white/20 hover:bg-white/30 rounded-md px-4 py-2 transition-colors">
                Manage Orders
              </Link>
              <Link to="/admin/menu" className="block bg-white/20 hover:bg-white/30 rounded-md px-4 py-2 transition-colors">
                Update Menu
              </Link>
              <Link to="/admin/payments" className="block bg-white/20 hover:bg-white/30 rounded-md px-4 py-2 transition-colors">
                Review Payments
              </Link>
            </div>
          </div>
        </div>
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-indigo-600 hover:underline text-sm">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map(order => <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      Rs. {order.total.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {order.date}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
}

export default AdminDashboard;
