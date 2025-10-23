import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, Users, Menu, ShoppingBag, CreditCard, Calendar, Truck, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import NotificationDropdown from '../ui/NotificationDropdown';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
      toast.success('Admin session ended. Logged out successfully.');
      navigate('/', { replace: true });
    }
  };

  const navItems = [
    { path: '/admin/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/menus', icon: Menu, label: 'Menu Management' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/payment-slips', icon: CreditCard, label: 'Payment Slips' },
    { path: '/admin/reservations', icon: Calendar, label: 'Reservations' },
    { path: '/admin/delivery', icon: Truck, label: 'Deliveries' },
  ];

  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
  <header className="bg-black shadow-sm border-b border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-orange-500">BMS Kingdom of Taste - Admin Panel</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <span className="text-sm text-orange-500 font-semibold">Welcome, {user?.username}</span>
              <button
                onClick={() => navigate('/')}
                className="text-sm bg-black text-orange-500 hover:bg-orange-500 hover:text-black px-3 py-1 rounded-md transition-colors font-medium border border-orange-500"
              >
                Exit Admin Panel
              </button>
              <button
                onClick={handleLogout}
                className="text-sm bg-orange-500 text-black hover:bg-orange-400 px-3 py-1 rounded-md transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
  <nav className="bg-primary-500 shadow-sm border-b border-accent-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-1 py-4 border-b-2 font-medium text-sm border-transparent text-black bg-white hover:text-orange-500 hover:border-orange-500 hover:bg-orange-100`}
                >
                  <Icon className="h-5 w-5 mr-2 text-black" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
  <footer className="bg-black border-t border-orange-500 mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-orange-500">
            <p>Contact: +94 11 217 1944 | Address: No 187/1/B, Hokandara 10230</p>
            <p>
              <a href="https://www.facebook.com/share/1749XW4KBV/" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline hover:text-orange-400">
                Facebook
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminLayout;
