import api from './api';

const PAYMENT_ENDPOINTS = {
  UPLOAD: '/payment-slips/upload',
  USER_SLIPS: (userId) => `/payment-slips/user/${userId}`,
  SLIP_BY_ID: (id) => `/payment-slips/${id}`
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
  }
};

export default paymentService;