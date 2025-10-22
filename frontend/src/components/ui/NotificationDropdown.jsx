import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Clock, CheckCircle, Truck, ChefHat } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';

const NotificationDropdown = ({ iconColor = "accent-400", badgeColor = "red-500" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { notifications = [], unreadCount = 0, markAsRead, markAllAsRead, clearNotifications } = useNotifications() || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'payment_confirmed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'order_preparing':
        return <ChefHat className="w-5 h-5 text-orange-500" />;
      case 'driver_assigned':
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return time.toLocaleDateString();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors text-${iconColor} hover:bg-orange-400 group`}
        aria-label="View notifications"
      >
        <Bell className={`h-6 w-6 stroke-${iconColor} group-hover:stroke-black group-hover:fill-none`} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 bg-${badgeColor} text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium`}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-amber-600 hover:text-amber-800 font-medium"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title || 'Notification'}
                          </p>
                          <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mt-1`}>
                            {notification.message}
                          </p>
                          {notification.orderId && (
                            <p className="text-xs text-gray-500 mt-1">
                              Order #{notification.orderId}
                            </p>
                          )}
                          {notification.driverInfo && (
                            <div className="text-xs text-gray-600 mt-1 bg-gray-100 rounded p-2">
                              <p><strong>Driver:</strong> {notification.driverInfo.name}</p>
                              <p><strong>Vehicle:</strong> {notification.driverInfo.vehicle}</p>
                              {notification.driverInfo.phone && (
                                <p><strong>Phone:</strong> {notification.driverInfo.phone}</p>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                          <span className="text-xs text-gray-400 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No notifications yet</p>
                <p className="text-xs text-gray-400 mt-1">We'll notify you about order updates</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  clearNotifications();
                  setIsOpen(false);
                }}
                className="w-full text-sm text-gray-600 hover:text-gray-800 font-medium"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;