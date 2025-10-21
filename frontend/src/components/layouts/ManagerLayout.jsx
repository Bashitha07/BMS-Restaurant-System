      <footer className="bg-primary-500 border-t mt-12">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-white">
            <p>Manager Panel Footer</p>
          </div>
        </div>
      </footer>
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Bell, UserCog, BarChart3, Users, Menu, ShoppingBag, CreditCard, Calendar, Truck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import NotificationDropdown from '../ui/NotificationDropdown';

const ManagerLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (confirmed) {
      logout();
      toast.success('Manager session ended. Logged out successfully.');
      navigate('/', { replace: true });
    }
  };

  const navItems = [
    { path: '/manager/dashboard', icon: BarChart3, label: 'Manager Dashboard' },
  ];

  return (
  <div className="min-h-screen bg-white">
      {/* Header */}
  <header className="bg-primary-500 shadow-sm border-b border-accent-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-accent">BMS Kingdom of Taste - Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <NotificationDropdown />
              <span className="text-sm text-accent">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-primary bg-accent hover:bg-accent/80 px-3 py-1 rounded-md transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
  <nav className="w-64 bg-white shadow-sm min-h-[calc(100vh-4rem)] border-r border-accent-100">
          <div className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-accent/10 text-accent'
                        : 'text-accent/80 hover:bg-accent/10'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ManagerLayout;