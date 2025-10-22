import axios from '../utils/axios';

const ADMIN_ENDPOINTS = {
  // User Management
  USERS: '/api/admin/users',
  USER_BY_ID: (id) => `/api/admin/users/${id}`,
  UPDATE_ROLE: (id) => `/api/admin/users/${id}/role`,
  UPDATE_STATUS: (id) => `/api/admin/users/${id}/status`,
  USERS_BY_ROLE: (role) => `/api/admin/users/by-role/${role}`,
  USER_STATISTICS: '/api/admin/users/statistics',

  // Order Management
  ORDERS: '/api/orders',
  ORDER_BY_ID: (id) => `/api/orders/${id}`,
  UPDATE_ORDER_STATUS: (id) => `/api/admin/orders/${id}/status`,
  ORDERS_BY_STATUS: (status) => `/api/orders/status/${status}`,
  ORDERS_BY_DATE: '/api/orders/by-date',
  ORDER_STATISTICS: '/api/orders/statistics',

  // Menu Management
  MENU: '/api/admin/menu',
  MENU_BY_ID: (id) => `/api/admin/menu/${id}`,
  MENU_AVAILABILITY: (id) => `/api/admin/menu/${id}/availability`,
  MENU_BY_CATEGORY: (category) => `/api/admin/menu/category/${category}`,
  MENU_STATISTICS: '/api/admin/menu/statistics',
  BULK_AVAILABILITY: '/api/admin/menu/bulk-availability',
  UPLOAD_MENU_IMAGE: '/api/admin/menu/upload-image',

  // Reservation Management
  RESERVATIONS: '/api/admin/reservations',
  RESERVATION_BY_ID: (id) => `/api/admin/reservations/${id}`,
  CONFIRM_RESERVATION: (id) => `/api/admin/reservations/${id}/confirm`,
  RESERVATION_STATUS: (id) => `/api/admin/reservations/${id}/status`,
  RESERVATIONS_BY_DATE: '/api/admin/reservations/by-date',
  RESERVATION_STATISTICS: '/api/admin/reservations/statistics',

  // Payment Slip Management
  PAYMENT_SLIPS: '/api/admin/payment-slips',
  PAYMENT_SLIP_BY_ID: (id) => `/api/admin/payment-slips/${id}`,
  CONFIRM_PAYMENT: (id) => `/api/admin/payment-slips/${id}/confirm`,
  REJECT_PAYMENT: (id) => `/api/admin/payment-slips/${id}/reject`,
  PAYMENT_STATISTICS: '/api/admin/payment-slips/statistics',

  // Delivery Driver Management
  DELIVERY_DRIVERS: '/api/admin/drivers',
  PENDING_DRIVERS: '/api/delivery-drivers/pending',
  APPROVE_DRIVER: (id) => `/api/delivery-drivers/${id}/approve`,
  REJECT_DRIVER: (id) => `/api/delivery-drivers/${id}/reject`
};

export const adminService = {
  // User Management
  getAllUsers: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.USERS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch users from backend:', error);
      throw error;
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user';
    }
  },

  updateUserRole: async (id, roleData) => {
    console.log('🌐 [API] Sending PUT request to update user role:', {
      endpoint: ADMIN_ENDPOINTS.UPDATE_ROLE(id),
      userId: id,
      roleData: roleData,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.UPDATE_ROLE(id), roleData);
      
      console.log('✅ [API] Successfully updated user role in backend:', {
        endpoint: ADMIN_ENDPOINTS.UPDATE_ROLE(id),
        userId: id,
        newRole: roleData.role,
        response: response.data,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to update user role in backend:', {
        endpoint: ADMIN_ENDPOINTS.UPDATE_ROLE(id),
        userId: id,
        attemptedRole: roleData.role,
        error: error.response?.data || error.message,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
      throw error.response?.data || 'Failed to update user role';
    }
  },

  updateUserStatus: async (id, enabled) => {
    console.log('🌐 [API] Sending PUT request to update user status:', {
      endpoint: `${ADMIN_ENDPOINTS.UPDATE_STATUS(id)}?enabled=${enabled}`,
      userId: id,
      newStatus: enabled ? 'ENABLED' : 'DISABLED',
      timestamp: new Date().toISOString()
    });
    
    try {
      // Send enabled as query parameter, not in body
      const response = await axios.put(`${ADMIN_ENDPOINTS.UPDATE_STATUS(id)}?enabled=${enabled}`);
      
      console.log('✅ [API] Successfully updated user status in backend:', {
        endpoint: `${ADMIN_ENDPOINTS.UPDATE_STATUS(id)}?enabled=${enabled}`,
        userId: id,
        newStatus: enabled ? 'ENABLED' : 'DISABLED',
        response: response.data,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to update user status in backend:', {
        endpoint: `${ADMIN_ENDPOINTS.UPDATE_STATUS(id)}?enabled=${enabled}`,
        userId: id,
        attemptedStatus: enabled ? 'ENABLED' : 'DISABLED',
        error: error.response?.data || error.message,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });
      throw error.response?.data || 'Failed to update user status';
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(ADMIN_ENDPOINTS.USER_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete user';
    }
  },

  getUsersByRole: async (role) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.USERS_BY_ROLE(role));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch users by role';
    }
  },

  getUserStatistics: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.USER_STATISTICS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch user statistics';
    }
  },

  // Menu Management
  getAllMenuItems: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.MENU);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch menu items';
    }
  },

  createMenuItem: async (menuData) => {
    try {
      const response = await axios.post(ADMIN_ENDPOINTS.MENU, menuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to create menu item';
    }
  },

  updateMenuItem: async (id, menuData) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.MENU_BY_ID(id), menuData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update menu item';
    }
  },

  deleteMenuItem: async (id) => {
    try {
      const response = await axios.delete(ADMIN_ENDPOINTS.MENU_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete menu item';
    }
  },

  updateMenuAvailability: async (id, available) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.MENU_AVAILABILITY(id), null, {
        params: { available }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update availability';
    }
  },

  getMenuByCategory: async (category) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.MENU_BY_CATEGORY(category));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch menu by category';
    }
  },

  getMenuStatistics: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.MENU_STATISTICS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch menu statistics';
    }
  },

  bulkUpdateAvailability: async (menuItemIds, available) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.BULK_AVAILABILITY, {
        menuItemIds,
        available
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to bulk update availability';
    }
  },

  // Reservation Management
  getAllReservations: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.RESERVATIONS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations';
    }
  },

  getReservationById: async (id) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.RESERVATION_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservation';
    }
  },

  confirmReservation: async (id, confirmationData) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.CONFIRM_RESERVATION(id), confirmationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to confirm reservation';
    }
  },

  updateReservationStatus: async (id, status) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.RESERVATION_STATUS(id), { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update reservation status';
    }
  },

  getReservationsByDate: async (startDate, endDate) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.RESERVATIONS_BY_DATE, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservations by date';
    }
  },

  getReservationStatistics: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.RESERVATION_STATISTICS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch reservation statistics';
    }
  },

  // Order Management
  getAllOrders: async () => {
    console.log('🌐 [API] Sending GET request to fetch all orders:', {
      endpoint: ADMIN_ENDPOINTS.ORDERS,
      timestamp: new Date().toISOString()
    });
    
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.ORDERS);
      
      console.log('✅ [API] Successfully received orders from backend:', {
        endpoint: ADMIN_ENDPOINTS.ORDERS,
        orderCount: response.data?.length || 0,
        data: response.data,
        timestamp: new Date().toISOString()
      });
      
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch orders:', {
        endpoint: ADMIN_ENDPOINTS.ORDERS,
        error: error.message,
        response: error.response?.data,
        timestamp: new Date().toISOString()
      });
      throw error.response?.data || 'Failed to fetch orders';
    }
  },

  getOrderById: async (id) => {
    console.log(`🌐 [API] Fetching order details for ID: ${id}`);
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.ORDER_BY_ID(id));
      console.log(`✅ [API] Successfully fetched order ${id}:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [API] Failed to fetch order ${id}:`, error);
      throw error.response?.data || 'Failed to fetch order';
    }
  },

  updateOrderStatus: async (id, status) => {
    console.log(`🔄 [API] Updating order ${id} status to ${status}`);
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.UPDATE_ORDER_STATUS(id), { status });
      console.log(`✅ [API] Successfully updated order ${id} status:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [API] Failed to update order ${id} status:`, error);
      throw error.response?.data || 'Failed to update order status';
    }
  },

  getOrdersByStatus: async (status) => {
    console.log(`🌐 [API] Fetching orders with status: ${status}`);
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.ORDERS_BY_STATUS(status));
      console.log(`✅ [API] Successfully fetched ${status} orders:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [API] Failed to fetch ${status} orders:`, error);
      throw error.response?.data || 'Failed to fetch orders by status';
    }
  },

  getOrdersByDate: async (dateRange) => {
    console.log('🌐 [API] Fetching orders by date range:', dateRange);
    try {
      const response = await axios.post(ADMIN_ENDPOINTS.ORDERS_BY_DATE, dateRange);
      console.log('✅ [API] Successfully fetched orders by date:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch orders by date:', error);
      throw error.response?.data || 'Failed to fetch orders by date';
    }
  },

  getOrderStatistics: async () => {
    console.log('🌐 [API] Fetching order statistics');
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.ORDER_STATISTICS);
      console.log('✅ [API] Successfully fetched order statistics:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch order statistics:', error);
      throw error.response?.data || 'Failed to fetch order statistics';
    }
  },

  // Payment Slip Management
  getAllPaymentSlips: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.PAYMENT_SLIPS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch payment slips';
    }
  },

  getPaymentSlipById: async (id) => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.PAYMENT_SLIP_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch payment slip';
    }
  },

  confirmPaymentSlip: async (id, confirmationData) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.CONFIRM_PAYMENT(id), confirmationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to confirm payment slip';
    }
  },

  rejectPaymentSlip: async (id, rejectionData) => {
    try {
      const response = await axios.put(ADMIN_ENDPOINTS.REJECT_PAYMENT(id), rejectionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to reject payment slip';
    }
  },

  getPaymentStatistics: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.PAYMENT_STATISTICS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch payment statistics';
    }
  },

  // Delivery Driver Management
  getPendingDrivers: async () => {
    try {
      const response = await axios.get(ADMIN_ENDPOINTS.PENDING_DRIVERS);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch pending drivers from backend:', error);
      throw error;
    }
  },

  approveDriver: async (id) => {
    try {
      const response = await axios.post(ADMIN_ENDPOINTS.APPROVE_DRIVER(id));
      return response.data;
    } catch (error) {
      console.error('Failed to approve driver:', error);
      throw error;
    }
  },

  rejectDriver: async (id) => {
    try {
      const response = await axios.post(ADMIN_ENDPOINTS.REJECT_DRIVER(id));
      return response.data;
    } catch (error) {
      console.error('Failed to reject driver:', error);
      throw error;
    }
  },

  uploadMenuImage: async (file) => {
    console.log('🌐 [API] Uploading menu image:', {
      endpoint: ADMIN_ENDPOINTS.UPLOAD_MENU_IMAGE,
      filename: file.name,
      size: file.size,
      timestamp: new Date().toISOString()
    });

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(ADMIN_ENDPOINTS.UPLOAD_MENU_IMAGE, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ [API] Successfully uploaded menu image:', {
        endpoint: ADMIN_ENDPOINTS.UPLOAD_MENU_IMAGE,
        response: response.data,
        timestamp: new Date().toISOString()
      });

      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to upload menu image:', {
        endpoint: ADMIN_ENDPOINTS.UPLOAD_MENU_IMAGE,
        error: error.response?.data || error.message,
        status: error.response?.status,
        timestamp: new Date().toISOString()
      });

      throw error.response?.data || 'Failed to upload image';
    }
  }
};

export default adminService;
