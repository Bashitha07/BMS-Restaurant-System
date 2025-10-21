import React, { useState, createContext, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  // Clear notifications when user changes (login/logout)
  useEffect(() => {
    if (!user) {
      setNotifications([]); // Clear notifications when user logs out
      return;
    }

    // Load user-specific notifications from localStorage
    const userNotificationsKey = `notifications_${user.id}`;
    const savedNotifications = localStorage.getItem(userNotificationsKey);
    
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotifications(parsedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
        setNotifications([]);
      }
    } else {
      // Initialize with empty array for new users
      setNotifications([]);
    }
  }, [user]);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (user && notifications.length >= 0) {
      const userNotificationsKey = `notifications_${user.id}`;
      localStorage.setItem(userNotificationsKey, JSON.stringify(notifications));
    }
  }, [notifications, user]);

  const addNotification = (message, type = 'info', extra = {}) => {
    // Only add notifications if user is logged in
    if (!user) return;

    const newNotification = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id, // Associate notification with current user
      message: String(message),
      type,
      read: false,
      timestamp: new Date(),
      originalUserId: extra.originalUserId || user.id, // Track original user for admin view
      isAdminCopy: extra.isAdminCopy || false,
      ...extra
    };
    
    setNotifications((prev) => [newNotification, ...prev]);
    
    // If this is not an admin copy and user is not admin, also send to admin
    if (!extra.isAdminCopy && user.role !== 'admin') {
      broadcastToAdmin(newNotification);
    }
    
    // Show toast for real-time notifications
    if (extra.showToast !== false) {
      toast.success(extra.title || message, { duration: 4000 });
    }
  };

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  // Function to broadcast notifications to admin
  const broadcastToAdmin = (notification) => {
    // Store notification for admin with special marking
    const adminNotificationKey = 'notifications_admin_global';
    const existingAdminNotifications = localStorage.getItem(adminNotificationKey);
    
    let adminNotifications = [];
    if (existingAdminNotifications) {
      try {
        adminNotifications = JSON.parse(existingAdminNotifications);
      } catch (error) {
        console.error('Error parsing admin notifications:', error);
      }
    }
    
    const adminNotification = {
      ...notification,
      id: `admin_${notification.id}_${Math.random().toString(36).substr(2, 5)}`,
      isAdminCopy: true,
      adminMessage: `User notification from ${user.username || user.email}: ${notification.message}`,
      originalUser: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    };
    
    adminNotifications.unshift(adminNotification);
    
    // Keep only last 100 admin notifications to prevent storage overflow
    if (adminNotifications.length > 100) {
      adminNotifications = adminNotifications.slice(0, 100);
    }
    
    localStorage.setItem(adminNotificationKey, JSON.stringify(adminNotifications));
  };

  // Load admin notifications if user is admin
  useEffect(() => {
    if (user && user.role === 'admin') {
      const adminNotificationKey = 'notifications_admin_global';
      const adminNotifications = localStorage.getItem(adminNotificationKey);
      
      if (adminNotifications) {
        try {
          const parsedAdminNotifications = JSON.parse(adminNotifications);
          // Merge admin notifications with personal notifications
          setNotifications(prev => {
            const userNotifications = prev.filter(n => !n.isAdminCopy);
            return [...userNotifications, ...parsedAdminNotifications];
          });
        } catch (error) {
          console.error('Error loading admin notifications:', error);
        }
      }
    }
  }, [user]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const notifySuccess = (message) => {
    addNotification(String(message), 'success');
  };

  const notifyError = (message) => {
    addNotification(String(message), 'error');
  };

  const notifyInfo = (message) => {
    addNotification(String(message), 'info');
  };

  const notifyWarning = (message) => {
    addNotification(String(message), 'warning');
  };

  // Order-specific notification functions
  const sendOrderUpdate = (orderId, status, driverInfo = null, targetUserId = null) => {
    // Only send notification if user is logged in and it's for them
    if (!user) return;
    
    // If targetUserId is specified, only send to that user
    if (targetUserId && targetUserId !== user.id) return;
    
    let notification;
    
    switch (status) {
      case 'payment_confirmed':
        notification = {
          type: 'payment_confirmed',
          title: 'Payment Confirmed',
          message: `Your payment for Order #${String(orderId)} has been verified`,
          orderId,
          userId: user.id
        };
        break;
      case 'order_preparing':
        notification = {
          type: 'order_preparing', 
          title: 'Order Being Prepared',
          message: 'Your order is now being prepared in our kitchen',
          orderId,
          userId: user.id
        };
        break;
      case 'driver_assigned':
        notification = {
          type: 'driver_assigned',
          title: 'Driver Assigned',
          message: `Driver ${String(driverInfo?.name || '')} (${String(driverInfo?.vehicle || '')}) has been assigned`,
          orderId,
          driverInfo,
          userId: user.id
        };
        break;
      case 'out_for_delivery':
        notification = {
          type: 'out_for_delivery',
          title: 'Out for Delivery',
          message: `Your order is on the way! Driver: ${String(driverInfo?.name || '')}`,
          orderId,
          driverInfo,
          userId: user.id
        };
        break;
      case 'delivered':
        notification = {
          type: 'delivered',
          title: 'Order Delivered',
          message: 'Your order has been delivered successfully',
          orderId,
          userId: user.id
        };
        break;
      default:
        return;
    }
    
    addNotification(notification.message, notification.type, notification);
  };

  // Reservation-specific notification functions
  const sendReservationUpdate = (reservationId, status, details = {}) => {
    if (!user) return;
    
    let notification;
    
    switch (status) {
      case 'confirmed':
        notification = {
          type: 'reservation_confirmed',
          title: 'Reservation Confirmed',
          message: `Your reservation #${String(reservationId)} has been confirmed`,
          reservationId,
          userId: user.id,
          ...details
        };
        break;
      case 'cancelled':
        notification = {
          type: 'reservation_cancelled',
          title: 'Reservation Cancelled',
          message: `Your reservation #${String(reservationId)} has been cancelled`,
          reservationId,
          userId: user.id,
          ...details
        };
        break;
      case 'reminder':
        notification = {
          type: 'reservation_reminder',
          title: 'Reservation Reminder',
          message: `Reminder: Your reservation is in 1 hour`,
          reservationId,
          userId: user.id,
          ...details
        };
        break;
      default:
        return;
    }
    
    addNotification(notification.message, notification.type, notification);
  };

  // Filter notifications to only show user's notifications
  const userNotifications = user && user.id ? notifications.filter(n => String(n.userId) === String(user.id)) : [];
  const unreadCount = userNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications, // Return only user-specific notifications
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
        sendOrderUpdate,
        sendReservationUpdate,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;