import axios from '../utils/axios';

const KITCHEN_ENDPOINTS = {
  ORDERS: '/api/kitchen/orders',
  PENDING_ORDERS: '/api/kitchen/orders/pending',
  UPDATE_ORDER_STATUS: (id) => `/api/kitchen/orders/${id}/status`
};

export const kitchenService = {
  getAllOrders: async () => {
    console.log('🔄 [API] Fetching all orders for kitchen');
    try {
      const response = await axios.get(KITCHEN_ENDPOINTS.ORDERS);
      console.log('✅ [API] Successfully fetched orders for kitchen:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch orders for kitchen:', error);
      throw error.response?.data || 'Failed to fetch orders';
    }
  },

  getPendingOrders: async () => {
    console.log('🔄 [API] Fetching pending orders for kitchen');
    try {
      const response = await axios.get(KITCHEN_ENDPOINTS.PENDING_ORDERS);
      console.log('✅ [API] Successfully fetched pending orders for kitchen:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ [API] Failed to fetch pending orders for kitchen:', error);
      throw error.response?.data || 'Failed to fetch pending orders';
    }
  },

  updateOrderStatus: async (id, status) => {
    console.log(`🔄 [API] Updating order ${id} status to ${status} for kitchen`);
    try {
      const response = await axios.put(KITCHEN_ENDPOINTS.UPDATE_ORDER_STATUS(id), { status });
      console.log(`✅ [API] Successfully updated order ${id} status for kitchen:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ [API] Failed to update order ${id} status for kitchen:`, error);
      throw error.response?.data || 'Failed to update order status';
    }
  }
};

export default kitchenService;