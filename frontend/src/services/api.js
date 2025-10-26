import axios from '../utils/axios';
import { handleAPIError } from '../utils/errorUtils';

// Menu Service
export const menuService = {
  getAllMenus: async () => {
    try {
      const response = await axios.get('/api/menus');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getMenusByCategory: async (category) => {
    try {
      const response = await axios.get(`/api/menus/category/${category}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Order Service
export const orderService = {
  createOrder: async (orderData) => {
    try {
      console.log('Creating order via API:', orderData);
      const response = await axios.post('/api/orders', orderData);
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw handleAPIError(error);
    }
  },
  getMyOrders: async () => {
    try {
      console.log('Fetching user orders from backend...');
      const response = await axios.get('/api/orders/my-orders');
      console.log(`Retrieved ${response.data.length} orders from database`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders from backend:', error);
      throw handleAPIError(error);
    }
  }
};

// Reservation Service
export const reservationService = {
  createReservation: async (reservationData) => {
    try {
      const response = await axios.post('/api/reservations', reservationData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getMyReservations: async () => {
    try {
      const response = await axios.get('/api/reservations/my-reservations');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Delivery Service
export const deliveryService = {
  getAllDeliveries: async () => {
    try {
      const response = await axios.get('/api/deliveries');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  updateDeliveryStatus: async (deliveryId, status) => {
    try {
      const response = await axios.patch(`/api/deliveries/${deliveryId}/status`, { status });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Admin Service
export const adminService = {
  getDashboard: async () => {
    try {
      const response = await axios.get('/api/admin/dashboard');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getUsers: async () => {
    try {
      const response = await axios.get('/api/admin/users');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  updateUserRole: async (userId, role) => {
    try {
      const response = await axios.patch(`/api/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  // Gets all orders - primarily for admins
  getOrders: async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch orders from backend:', error);
      throw handleAPIError(error);
    }
  },
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await axios.put(`/api/admin/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  removeOrder: async (orderId) => {
    try {
      const response = await axios.delete(`/api/admin/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Payments Service
export const paymentService = {
  getAllPayments: async () => {
    try {
      const response = await axios.get('/api/payments');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getPaymentById: async (id) => {
    try {
      const response = await axios.get(`/api/payments/${id}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  createPayment: async (paymentData) => {
    try {
      const response = await axios.post('/api/payments', paymentData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  updatePayment: async (id, paymentData) => {
    try {
      const response = await axios.put(`/api/payments/${id}`, paymentData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  uploadPaymentSlip: async (orderId, userId, file, paymentAmount, paymentDate, bankName, transactionReference) => {
    try {
      const formData = new FormData();
      formData.append('orderId', orderId);
      formData.append('userId', userId);
      formData.append('file', file);
      formData.append('paymentAmount', paymentAmount);
      formData.append('paymentDate', paymentDate);
      if (bankName) formData.append('bankName', bankName);
      if (transactionReference) formData.append('transactionReference', transactionReference);

      console.log('Uploading payment slip for order:', orderId);
      const response = await axios.post('/api/payment-slips/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Payment slip uploaded successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to upload payment slip:', error);
      throw handleAPIError(error);
    }
  }
};

// User Service
export const userService = {
  login: async (credentials) => {
    try {
      console.log('Attempting real backend login for user:', credentials.username);
      const response = await axios.post('/api/auth/login', credentials);
      console.log('Login successful, received token from backend');
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw handleAPIError(error);
    }
  },
  register: async (userData) => {
    try {
      const response = await axios.post('/api/users/register', userData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  updateProfile: async (userId, userData) => {
    try {
      const response = await axios.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  getCurrentUser: async () => {
    try {
      const response = await axios.get('/api/users/current');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Notification Service
export const notificationService = {
  getAllNotifications: async () => {
    try {
      console.log('Fetching notifications from backend...');
      const response = await axios.get('/api/notifications');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      throw handleAPIError(error);
    }
  },
  getMyNotifications: async () => {
    try {
      const response = await axios.get('/api/notifications/my-notifications');
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  markAsRead: async (notificationId) => {
    try {
      const response = await axios.patch(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  },
  deleteNotification: async (notificationId) => {
    try {
      const response = await axios.delete(`/api/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw handleAPIError(error);
    }
  }
};

// Function to generate mock orders for development
// Import mock data helper
// Mock data generation removed as per requirements

// Default export for ESM compatibility
export default {
  menuService,
  orderService,
  reservationService,
  userService,
  adminService,
  paymentService,
  deliveryService,
  notificationService
};