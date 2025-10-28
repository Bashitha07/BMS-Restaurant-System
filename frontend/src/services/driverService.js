import axios from '../utils/axios';

/**
 * Driver Service - Updated for User-Based Driver System
 * 
 * IMPORTANT: Drivers are now regular Users with role='DRIVER'
 * - Driver authentication uses /api/auth/login (regular user auth)
 * - Driver operations query orders by user ID
 * - Admin assigns drivers via User ID (users with DRIVER role)
 * 
 * Database Structure:
 * - users table: Contains driver accounts (role='DRIVER')
 * - drivers table: Additional driver info linked via user_id
 * - orders table: References drivers via User entity
 */

const DRIVER_ENDPOINTS = {
  // NOTE: Driver authentication now uses regular user auth
  // Drivers should login via /api/auth/login
  // These endpoints are deprecated and removed from backend:
  // LOGIN: '/api/driver/auth/login',  // ❌ REMOVED
  // LOGOUT: '/api/driver/auth/logout', // ❌ REMOVED
  // REGISTER: '/api/delivery-drivers/register', // ❌ REMOVED
  
  // Orders assigned to driver (use regular order endpoints)
  MY_ORDERS: (userId) => `/api/orders/user/${userId}`,
  ALL_ORDERS: '/api/orders',
  
  // Admin driver management (working)
  ADMIN_DRIVERS: '/api/orders/admin/drivers', // Get all drivers (Users with DRIVER role)
  ASSIGN_DRIVER_TO_ORDER: (orderId) => `/api/orders/${orderId}/assign-driver`,
  UPDATE_ORDER_STATUS: (orderId) => `/api/orders/${orderId}/status`,
  
  // Delivery management (working)
  ADMIN_DELIVERIES: '/api/admin/deliveries',
  ASSIGN_DRIVER_TO_DELIVERY: (deliveryId, driverId) => `/api/admin/deliveries/${deliveryId}/assign-driver/${driverId}`,
  UNASSIGN_DRIVER_FROM_DELIVERY: (deliveryId) => `/api/admin/deliveries/${deliveryId}/unassign-driver`,
  
  // Note: Driver-specific endpoints below are not implemented in backend
  // They reference the old standalone driver system
  // TODO: Implement these if needed, or use order-based queries
  // MY_DELIVERIES: (driverId) => `/api/driver/${driverId}/my-deliveries`,
  // AVAILABLE_DELIVERIES: (driverId) => `/api/driver/${driverId}/available-deliveries`,
  // ACCEPT_DELIVERY: (driverId, deliveryId) => `/api/driver/${driverId}/accept-delivery/${deliveryId}`,
  // UPDATE_DELIVERY_STATUS: (driverId, deliveryId) => `/api/driver/${driverId}/delivery/${deliveryId}/status`,
  // COMPLETE_DELIVERY: (driverId, deliveryId) => `/api/driver/${driverId}/delivery/${deliveryId}/complete`,
  // UPDATE_LOCATION: (driverId) => `/api/driver/${driverId}/location`,
  // UPDATE_AVAILABILITY: (driverId) => `/api/driver/${driverId}/availability`,
};

export const driverService = {
  // NOTE: Driver Authentication now uses regular auth service
  // Use authService.login() instead - drivers login as regular users
  // This function is kept for backward compatibility but uses user auth
  login: async (credentials) => {
    try {
      // Use regular user authentication
      const response = await axios.post('/api/auth/login', credentials);
      console.log('🔍 [DRIVER SERVICE] Login response:', response.data);
      
      // API returns flat structure: {id, token, username, role, email, phone}
      const { id, token, username, role, email, phone } = response.data;
      
      if (!token || !role) {
        throw new Error('Invalid login response');
      }
      
      // Verify user is a driver
      if (role !== 'DRIVER') {
        throw new Error('User is not a driver');
      }
      
      // Store authentication data
      console.log('💾 [DRIVER SERVICE] Storing to localStorage - token:', token.substring(0, 20) + '...');
      localStorage.setItem('token', token);
      localStorage.setItem('driverToken', token); // For AppRouter check
      
      // Store user data
      const userData = { id, username, email, phone, role };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('driver', JSON.stringify(userData));
      
      console.log('✅ [DRIVER SERVICE] localStorage updated:', {
        hasToken: !!localStorage.getItem('token'),
        hasDriverToken: !!localStorage.getItem('driverToken'),
        hasUser: !!localStorage.getItem('user'),
        hasDriver: !!localStorage.getItem('driver')
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [DRIVER SERVICE] Login error:', error);
      throw error.response?.data || error.message || 'Driver login failed';
    }
  },

  logout: async () => {
    // Clear all auth tokens IMMEDIATELY and SYNCHRONOUSLY
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('driver');
    localStorage.removeItem('driverToken');
    
    // Trigger a custom event to notify AuthContext to clear user state
    // Using CustomEvent works in the same tab, unlike 'storage' event
    window.dispatchEvent(new CustomEvent('auth-logout'));
    
    // No try-catch - we want this to be synchronous and fast
    // The page reload will handle any cleanup needed
  },

  // Get orders assigned to this driver (by user ID)
  getMyOrders: async (userId) => {
    try {
      const response = await axios.get(DRIVER_ENDPOINTS.MY_ORDERS(userId));
      // Filter for delivery orders assigned to this driver
      const myOrders = response.data.filter(order => 
        order.orderType === 'DELIVERY' && order.driverId === userId
      );
      return myOrders;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch my orders';
    }
  },

  // Get deliveries assigned to this driver
  getMyDeliveries: async (userId) => {
    try {
      console.log('🚚 [DRIVER SERVICE] Fetching deliveries for user:', userId);
      
      // Get all orders and filter for deliveries assigned to this driver
      const response = await axios.get(DRIVER_ENDPOINTS.ALL_ORDERS);
      const allOrders = response.data;
      
      // Filter for orders that:
      // 1. Are delivery type
      // 2. Are assigned to this driver (driverId matches userId)
      // 3. Are not delivered/cancelled
      const myDeliveries = allOrders.filter(order => {
        const isDelivery = order.orderType === 'DELIVERY';
        const isAssignedToMe = order.driverId === userId;
        const isActive = !['DELIVERED', 'CANCELLED', 'REFUNDED'].includes(order.status);
        
        return isDelivery && isAssignedToMe && isActive;
      });
      
      console.log('✅ [DRIVER SERVICE] Found deliveries:', myDeliveries.length);
      return myDeliveries;
    } catch (error) {
      console.error('❌ [DRIVER SERVICE] Failed to fetch deliveries:', error);
      throw error.response?.data || 'Failed to fetch deliveries';
    }
  },

  // Get all orders (driver can see all to pick up available ones)
  getAllOrders: async () => {
    try {
      const response = await axios.get(DRIVER_ENDPOINTS.ALL_ORDERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch orders';
    }
  },

  // Get all available drivers (Admin function - uses working endpoint)
  getAllDrivers: async () => {
    try {
      const response = await axios.get(DRIVER_ENDPOINTS.ADMIN_DRIVERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch drivers';
    }
  },

  // Assign driver to order (Admin function - uses working endpoint)
  assignDriverToOrder: async (orderId, driverId) => {
    try {
      const response = await axios.put(
        DRIVER_ENDPOINTS.ASSIGN_DRIVER_TO_ORDER(orderId),
        { driverId: driverId ? Number(driverId) : null }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to assign driver to order';
    }
  },

  // Update order status (Admin function - uses working endpoint)
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await axios.patch(
        DRIVER_ENDPOINTS.UPDATE_ORDER_STATUS(orderId),
        { status }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update order status';
    }
  },

  // Driver: Update delivery status (uses order status endpoint)
  updateDeliveryStatus: async (orderId, newStatus, cashCollected = null) => {
    try {
      console.log('🔄 [DRIVER SERVICE] Updating order status:', { orderId, newStatus, cashCollected });
      
      // Update order status
      const response = await axios.patch(
        DRIVER_ENDPOINTS.UPDATE_ORDER_STATUS(orderId),
        { status: newStatus }
      );
      
      // If cash collected, update delivery record
      if (cashCollected !== null && cashCollected > 0) {
        console.log('💰 [DRIVER SERVICE] Recording cash collection:', cashCollected);
        // TODO: Add endpoint to record cash collection
        // For now, this would need a backend endpoint like:
        // await axios.patch(`/api/deliveries/${deliveryId}/cash-collected`, { amount: cashCollected });
      }
      
      console.log('✅ [DRIVER SERVICE] Status updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ [DRIVER SERVICE] Failed to update status:', error);
      throw error.response?.data || 'Failed to update delivery status';
    }
  },

  // Get all deliveries (Admin function)
  getAllDeliveries: async () => {
    try {
      const response = await axios.get(DRIVER_ENDPOINTS.ADMIN_DELIVERIES);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch deliveries';
    }
  },

  // Assign driver to delivery (Admin function)
  assignDriverToDelivery: async (deliveryId, driverId) => {
    try {
      const response = await axios.post(
        DRIVER_ENDPOINTS.ASSIGN_DRIVER_TO_DELIVERY(deliveryId, driverId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to assign driver to delivery';
    }
  },

  // Unassign driver from delivery (Admin function)
  unassignDriverFromDelivery: async (deliveryId) => {
    try {
      const response = await axios.delete(
        DRIVER_ENDPOINTS.UNASSIGN_DRIVER_FROM_DELIVERY(deliveryId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to unassign driver from delivery';
    }
  },
  
  // Utility functions
  getCurrentDriver: () => {
    // Try to get from user first (new system)
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      if (userData.role === 'DRIVER') {
        return userData;
      }
    }
    // Fallback to old driver storage
    const driver = localStorage.getItem('driver');
    return driver ? JSON.parse(driver) : null;
  },

  isDriverAuthenticated: () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.role === 'DRIVER' && !!localStorage.getItem('token');
    }
    // Fallback
    return !!localStorage.getItem('driverToken');
  },

  getDriverToken: () => {
    // Use regular user token
    return localStorage.getItem('token') || localStorage.getItem('driverToken');
  },

  // Driver Registration
  registerDriver: async (driverData) => {
    try {
      console.log('📝 Registering driver with data:', driverData);
      
      // Create user account with DRIVER role
      const userRegistration = {
        username: driverData.username,
        email: driverData.email,
        password: driverData.password,
        firstName: driverData.firstName,
        lastName: driverData.lastName,
        phone: driverData.phone,
        role: 'DRIVER' // Important: Set role to DRIVER
      };
      
      // Register as a user first
      const userResponse = await axios.post('/api/auth/register', userRegistration);
      console.log('✅ User account created:', userResponse.data);
      
      // Now create driver profile with additional info
      const driverProfile = {
        userId: userResponse.data.user.id,
        name: `${driverData.firstName} ${driverData.lastName}`,
        phone: driverData.phone,
        licenseNumber: driverData.licenseNumber,
        vehicleNumber: driverData.vehicleNumber,
        vehicleType: driverData.vehicleType,
        vehicleModel: driverData.vehicleModel,
        emergencyContact: driverData.emergencyContact,
        emergencyPhone: driverData.emergencyPhone
      };
      
      // Create driver profile (this should be handled by a proper endpoint)
      // For now, the driver will be created when they first login
      console.log('✅ Driver profile data prepared:', driverProfile);
      
      return {
        success: true,
        message: 'Driver registration successful',
        user: userResponse.data.user
      };
    } catch (error) {
      console.error('❌ Driver registration failed:', error);
      throw error;
    }
  }
};

export default driverService;
