import React, { useState, createContext, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from './AuthContext';
import { notificationService } from '../services/api';

const NotificationContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const loadNotifications = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      console.log('Loading notifications from backend for user:', user.id);
      const data = await notificationService.getMyNotifications();
      setNotifications(data || []);
      console.log(`Loaded ${data?.length || 0} notifications from database`);
    } catch (error) {
      // Notifications API not yet implemented on backend, use empty array
      console.warn('Notification API not available, using empty notifications list');
      setNotifications([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load notifications from backend when user logs in
  useEffect(() => {
    if (!user) {
      setNotifications([]); // Clear notifications when user logs out
      return;
    }

    let isMounted = true;

    const fetchNotifications = async () => {
      if (!isMounted) return;
      await loadNotifications();
    };

    fetchNotifications();

    // Cleanup function to prevent setting state on unmounted component
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only reload when user ID changes

  const addNotification = async (message, type = 'info', extra = {}) => {
    // Only add notifications if user is logged in
    if (!user) return;

    // For now, add to local state immediately for real-time feedback
    const tempNotification = {
      id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      message: String(message),
      type,
      status: 'UNREAD',
      read: false,
      timestamp: new Date(),
      referenceId: extra.referenceId || null,
      referenceType: extra.referenceType || null,
      ...extra
    };
    
    setNotifications((prev) => [tempNotification, ...prev]);
    
    // Show toast for real-time notifications
    if (extra.showToast !== false) {
      toast.success(extra.title || message, { duration: 4000 });
    }

    // TODO: Send to backend when notification API is implemented
    // try {
    //   await notificationService.createNotification(tempNotification);
    //   loadNotifications(); // Reload to get server-assigned ID
    // } catch (error) {
    //   console.error('Failed to save notification to backend:', error);
    // }
  };

  const markAsRead = async (id) => {
    // Update local state immediately
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id 
          ? { ...notification, read: true, status: 'READ' } 
          : notification,
      ),
    );

    // Update backend
    try {
      await notificationService.markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // Revert on error
      loadNotifications();
    }
  };

  const markAsDismissed = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id 
          ? { ...notification, status: 'DISMISSED' } 
          : notification,
      ),
    );
  };

  const deleteNotification = async (id) => {
    // Update local state immediately
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));

    // Delete from backend
    try {
      await notificationService.deleteNotification(id);
    } catch (error) {
      console.error('Failed to delete notification from backend:', error);
      // Reload on error
      loadNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((notification) => ({ 
      ...notification, 
      read: true, 
      status: notification.status === 'UNREAD' ? 'READ' : notification.status 
    })));

    // TODO: Implement backend batch update when API is available
  };

  const clearNotifications = () => {
    setNotifications([]);
    // TODO: Implement backend clear when API is available
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
          userId: user.id,
          referenceId: orderId,
          referenceType: 'ORDER'
        };
        break;
      case 'order_preparing':
        notification = {
          type: 'order_preparing', 
          title: 'Order Being Prepared',
          message: 'Your order is now being prepared in our kitchen',
          orderId,
          userId: user.id,
          referenceId: orderId,
          referenceType: 'ORDER'
        };
        break;
      case 'driver_assigned':
        notification = {
          type: 'driver_assigned',
          title: 'Driver Assigned',
          message: `Driver ${String(driverInfo?.name || '')} (${String(driverInfo?.vehicle || '')}) has been assigned`,
          orderId,
          driverInfo,
          userId: user.id,
          referenceId: orderId,
          referenceType: 'ORDER'
        };
        break;
      case 'out_for_delivery':
        notification = {
          type: 'out_for_delivery',
          title: 'Out for Delivery',
          message: `Your order is on the way! Driver: ${String(driverInfo?.name || '')}`,
          orderId,
          driverInfo,
          userId: user.id,
          referenceId: orderId,
          referenceType: 'ORDER'
        };
        break;
      case 'delivered':
        notification = {
          type: 'delivered',
          title: 'Order Delivered',
          message: 'Your order has been delivered successfully',
          orderId,
          userId: user.id,
          referenceId: orderId,
          referenceType: 'ORDER'
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
          referenceId: reservationId,
          referenceType: 'RESERVATION',
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
          referenceId: reservationId,
          referenceType: 'RESERVATION',
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
          referenceId: reservationId,
          referenceType: 'RESERVATION',
          ...details
        };
        break;
      default:
        return;
    }
    
    addNotification(notification.message, notification.type, notification);
  };

  // Filter notifications to only show user's notifications (exclude dismissed)
  const userNotifications = user && user.id 
    ? notifications.filter(n => String(n.userId) === String(user.id) && n.status !== 'DISMISSED') 
    : [];
  const unreadCount = userNotifications.filter(n => n.status === 'UNREAD').length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications, // Return only user-specific notifications
        addNotification,
        markAsRead,
        markAsDismissed,
        deleteNotification,
        markAllAsRead,
        clearNotifications,
        notifySuccess,
        notifyError,
        notifyInfo,
        notifyWarning,
        sendOrderUpdate,
        sendReservationUpdate,
        unreadCount,
        isLoading,
        refreshNotifications: loadNotifications // Add refresh function
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