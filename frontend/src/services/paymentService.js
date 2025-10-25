import api from './api';

const PAYMENT_ENDPOINTS = {
  UPLOAD: '/api/payment-slips/upload',
  USER_SLIPS: (userId) => `/api/payment-slips/user/${userId}`,
  SLIP_BY_ID: (id) => `/api/payment-slips/${id}`,
  DOWNLOAD: (id) => `/api/payment-slips/${id}/download`,
  DELETE: (id) => `/api/payment-slips/${id}`
};

export const paymentService = {
  // Upload payment slip
  uploadPaymentSlip: async (formData) => {
    try {
      const response = await api.post(PAYMENT_ENDPOINTS.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to upload payment slip';
    }
  },

  // Get user's payment slips
  getUserPaymentSlips: async (userId) => {
    try {
      const response = await api.get(PAYMENT_ENDPOINTS.USER_SLIPS(userId));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch payment slips';
    }
  },

  // Get payment slip by ID
  getPaymentSlipById: async (id) => {
    try {
      const response = await api.get(PAYMENT_ENDPOINTS.SLIP_BY_ID(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch payment slip';
    }
  },

  // Download payment slip
  downloadPaymentSlip: async (id) => {
    try {
      const response = await api.get(PAYMENT_ENDPOINTS.DOWNLOAD(id), {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to download payment slip';
    }
  },

  // Delete payment slip
  deletePaymentSlip: async (id) => {
    try {
      const response = await api.delete(PAYMENT_ENDPOINTS.DELETE(id));
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to delete payment slip';
    }
  }
};

export default paymentService;