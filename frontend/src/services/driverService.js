import api from './api';

const DRIVER_ENDPOINTS = {
  // Driver authentication
  LOGIN: '/api/drivers/auth/login',
  LOGOUT: '/api/drivers/auth/logout',
  
  // Driver orders
  AVAILABLE_DELIVERIES: (driverId) => `/api/drivers/${driverId}/available-deliveries`,
  ACCEPT_DELIVERY: (driverId, deliveryId) => `/api/drivers/${driverId}/deliveries/${deliveryId}/accept`,
  UPDATE_STATUS: (driverId, deliveryId) => `/api/drivers/${driverId}/deliveries/${deliveryId}/status`,
  COMPLETE_DELIVERY: (driverId, deliveryId) => `/api/drivers/${driverId}/deliveries/${deliveryId}/complete`,
  UPDATE_LOCATION: (driverId) => `/api/drivers/${driverId}/location`,
  
  // Driver admin endpoints
  ADMIN_DRIVERS: '/api/admin/drivers',
  ADMIN_REGISTER: '/api/admin/drivers/register',
  ADMIN_DRIVER_BY_ID: (id) => `/api/admin/drivers/${id}`,
  ADMIN_UPDATE_STATUS: (id) => `/api/admin/drivers/${id}/status`,
  ADMIN_PERFORMANCE: (id) => `/api/admin/drivers/${id}/performance`,
  ADMIN_STATISTICS: '/api/admin/drivers/statistics'
};

export const driverService = {
  // Driver Authentication
  login: async (credentials) => {
    try {
      const response = await api.post(DRIVER_ENDPOINTS.LOGIN, credentials);
      if (response.data.token) {
        localStorage.setItem('driverToken', response.data.token);
        localStorage.setItem('driver', JSON.stringify(response.data.driver));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Driver login failed';
    }
  },

  logout: async (driverId) => {
    try {
      await api.post(DRIVER_ENDPOINTS.LOGOUT, { driverId });
      localStorage.removeItem('driverToken');
      localStorage.removeItem('driver');
    } catch (error) {
      // Log out locally even if server request fails
      localStorage.removeItem('driverToken');
      localStorage.removeItem('driver');
      throw error.response?.data || 'Logout failed';
    }
  },

  // Driver Operations
  getAvailableDeliveries: async (driverId) => {
    try {
      const response = await api.get(DRIVER_ENDPOINTS.AVAILABLE_DELIVERIES(driverId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch available deliveries';
    }
  },

  acceptDelivery: async (driverId, deliveryId) => {
    try {
      const response = await api.post(DRIVER_ENDPOINTS.ACCEPT_DELIVERY(driverId, deliveryId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to accept delivery';
    }
  },

  updateDeliveryStatus: async (driverId, deliveryId, status) => {
    try {
      const response = await api.put(DRIVER_ENDPOINTS.UPDATE_STATUS(driverId, deliveryId), { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update delivery status';
    }
  },

  completeDelivery: async (driverId, deliveryId, completionData) => {
    try {
      const response = await api.post(DRIVER_ENDPOINTS.COMPLETE_DELIVERY(driverId, deliveryId), completionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to complete delivery';
    }
  },

  updateLocation: async (driverId, latitude, longitude) => {
    try {
      const response = await api.put(DRIVER_ENDPOINTS.UPDATE_LOCATION(driverId), {
        latitude,
        longitude
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update location';
    }
  },

  // Admin Driver Management
  getAllDrivers: async () => {
    try {
      const response = await api.get(DRIVER_ENDPOINTS.ADMIN_DRIVERS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch drivers';
    }
  },

  registerDriver: async (driverData) => {
    try {
      const response = await api.post(DRIVER_ENDPOINTS.ADMIN_REGISTER, driverData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to register driver';
    }
  },

  getDriverById: async (id) => {
    try {
      const response = await api.get(DRIVER_ENDPOINTS.ADMIN_DRIVER_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch driver details';
    }
  },

  updateDriverStatus: async (id, status) => {
    try {
      const response = await api.put(DRIVER_ENDPOINTS.ADMIN_UPDATE_STATUS(id), { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update driver status';
    }
  },

  getDriverPerformance: async (id) => {
    try {
      const response = await api.get(DRIVER_ENDPOINTS.ADMIN_PERFORMANCE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch driver performance';
    }
  },

  getDriverStatistics: async () => {
    try {
      const response = await api.get(DRIVER_ENDPOINTS.ADMIN_STATISTICS);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch driver statistics';
    }
  },

  // Utility functions
  getCurrentDriver: () => {
    const driver = localStorage.getItem('driver');
    return driver ? JSON.parse(driver) : null;
  },

  isDriverAuthenticated: () => {
    return !!localStorage.getItem('driverToken');
  },

  getDriverToken: () => {
    return localStorage.getItem('driverToken');
  }
};

export default driverService;
