import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, Calendar, CreditCard, TrendingUp, DollarSign } from 'lucide-react';
import adminService from '../../services/adminService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalReservations: 0,
    totalMenuItems: 0,
    pendingOrders: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [users, orders, reservations, menuItems, paymentSlips] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllOrders(),
        adminService.getAllReservations(),
        adminService.getAllMenuItems(),
        adminService.getAllPaymentSlips(),
      ]);

      // Count pending orders (PENDING, CONFIRMED, PREPARING statuses)
      const pendingOrders = orders.filter(
        order => ['PENDING', 'CONFIRMED', 'PREPARING'].includes(order.status)
      ).length;

      // Count pending payments (PENDING, PROCESSING statuses)
      const pendingPayments = paymentSlips.filter(
        slip => ['PENDING', 'PROCESSING'].includes(slip.status)
      ).length;
      
      setStats({
        totalUsers: users.length,
        totalOrders: orders.length,
        totalReservations: reservations.length,
        totalMenuItems: menuItems.length,
        pendingOrders: pendingOrders,
        pendingPayments: pendingPayments,
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      link: '/admin/users',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: 'green',
      link: '/admin/orders',
    },
    {
      title: 'Reservations',
      value: stats.totalReservations,
      icon: Calendar,
      color: 'purple',
      link: '/admin/reservations',
    },
    {
      title: 'Menu Items',
      value: stats.totalMenuItems,
      icon: TrendingUp,
      color: 'orange',
      link: '/admin/menus',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: ShoppingBag,
      color: 'yellow',
      link: '/admin/orders',
    },
    {
      title: 'Pending Payments',
      value: stats.pendingPayments,
      icon: CreditCard,
      color: 'red',
      link: '/admin/payment-slips',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    red: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to the admin dashboard. Here's an overview of your restaurant system.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className={`p-6 rounded-lg border-2 ${colorClasses[stat.color]} hover:shadow-lg transition-all duration-200 hover:scale-105`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon className={`h-12 w-12 ${iconColorClasses[stat.color]}`} />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/menus"
            className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-center font-medium"
          >
            Manage Menu
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-center font-medium"
          >
            View Orders
          </Link>
          <Link
            to="/admin/payment-slips"
            className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-center font-medium"
          >
            Verify Payments
          </Link>
          <Link
            to="/admin/settings"
            className="px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-center font-medium"
          >
            System Settings
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">System Status</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Online
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Database Connection</span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Connected
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Active Users</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {stats.totalUsers} Registered
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
