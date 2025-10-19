import axios from '../utils/axios';

const MANAGER_ENDPOINTS = {
  ORDERS: '/api/manager/orders',
  UPDATE_ORDER_STATUS: (id) => `/api/manager/orders/${id}/status`
};

export const managerService = {
  getAllOrders: async () => {
    console.log('🔄 [API] Fetching all orders for manager');
    try {
      const response = await axios.get(MANAGER_ENDPOINTS.ORDERS);
      console.log('✅ [API] Successfully fetched orders for manager:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch orders for manager:', error);
      throw error.response?.data || 'Failed to fetch orders';
    }
  },

  updateOrderStatus: async (id, status) => {
    console.log(`🔄 [API] Updating order ${id} status to ${status} for manager`);
    try {
      const response = await axios.put(MANAGER_ENDPOINTS.UPDATE_ORDER_STATUS(id), { status });
      console.log(`✅ [API] Successfully updated order ${id} status for manager:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to update order ${id} status for manager:', error);
      throw error.response?.data || 'Failed to update order status';
    }
  }
};

export default managerService;