// API service for restaurant system
const API_BASE_URL = 'http://localhost:8083/api';

// Helper function to get auth token
const getAuthToken = () => localStorage.getItem('auth_token');

// Helper function to get admin auth token
const getAdminAuthToken = () => localStorage.getItem('admin_auth_token');

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Admin API call function
const adminApiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add admin authorization header
  const adminToken = getAdminAuthToken();
  if (adminToken) {
    config.headers.Authorization = `Bearer ${adminToken}`;
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    throw new Error(`Admin API call failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Orders API
export const ordersApi = {
  getAll: () => apiCall('/orders'),
  getById: (id) => apiCall(`/orders/${id}`),
  create: (orderData) => apiCall('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  }),
  update: (id, orderData) => apiCall(`/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  delete: (id) => apiCall(`/orders/${id}`, {
    method: 'DELETE',
  }),
  downloadInvoice: (id) => apiCall(`/orders/${id}/invoice`),
};

// Admin Orders API
export const adminOrdersApi = {
  getAll: () => adminApiCall('/admin/orders'),
  update: (id, orderData) => adminApiCall(`/admin/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(orderData),
  }),
  delete: (id) => adminApiCall(`/admin/orders/${id}`, {
    method: 'DELETE',
  }),
};

// Payments API
export const paymentsApi = {
  getAll: () => apiCall('/payments'),
  getById: (id) => apiCall(`/payments/${id}`),
  create: (paymentData) => apiCall('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
  update: (id, paymentData) => apiCall(`/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paymentData),
  }),
  delete: (id) => apiCall(`/payments/${id}`, {
    method: 'DELETE',
  }),
  approve: (id) => apiCall(`/payments/${id}/approve`, {
    method: 'PUT',
  }),
};

// Admin Payments API
export const adminPaymentsApi = {
  getAll: () => adminApiCall('/admin/payments'),
  update: (id, paymentData) => adminApiCall(`/admin/payments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(paymentData),
  }),
  delete: (id) => adminApiCall(`/admin/payments/${id}`, {
    method: 'DELETE',
  }),
};

// Reservations API
export const reservationsApi = {
  getAll: () => apiCall('/reservations'),
  getAvailableSlots: (date) => apiCall(`/reservations/available-slots?date=${date}`),
  create: (reservationData) => apiCall('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  }),
  update: (id, reservationData) => apiCall(`/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservationData),
  }),
  delete: (id) => apiCall(`/reservations/${id}`, {
    method: 'DELETE',
  }),
};

// Admin Reservations API
export const adminReservationsApi = {
  getAll: () => adminApiCall('/admin/reservations'),
  update: (id, reservationData) => adminApiCall(`/admin/reservations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(reservationData),
  }),
  delete: (id) => adminApiCall(`/admin/reservations/${id}`, {
    method: 'DELETE',
  }),
};

// Menus API
export const menusApi = {
  getAll: () => apiCall('/menus'),
  getById: (id) => apiCall(`/menus/${id}`),
};

// Admin Menus API
export const adminMenusApi = {
  getAll: () => adminApiCall('/admin/menus'),
  create: (menuData) => adminApiCall('/admin/menus', {
    method: 'POST',
    body: JSON.stringify(menuData),
  }),
  update: (id, menuData) => adminApiCall(`/admin/menus/${id}`, {
    method: 'PUT',
    body: JSON.stringify(menuData),
  }),
  delete: (id) => adminApiCall(`/admin/menus/${id}`, {
    method: 'DELETE',
  }),
};

// Delivery Drivers API (Admin only)
export const deliveryDriversApi = {
  getAll: () => adminApiCall('/admin/delivery-drivers'),
  create: (driverData) => adminApiCall('/admin/delivery-drivers', {
    method: 'POST',
    body: JSON.stringify(driverData),
  }),
  update: (id, driverData) => adminApiCall(`/admin/delivery-drivers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(driverData),
  }),
  delete: (id) => adminApiCall(`/admin/delivery-drivers/${id}`, {
    method: 'DELETE',
  }),
};

// Deliveries API (Admin only)
export const deliveriesApi = {
  getAll: () => adminApiCall('/admin/deliveries'),
  create: (deliveryData) => adminApiCall('/admin/deliveries', {
    method: 'POST',
    body: JSON.stringify(deliveryData),
  }),
  update: (id, deliveryData) => adminApiCall(`/admin/deliveries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(deliveryData),
  }),
  delete: (id) => adminApiCall(`/admin/deliveries/${id}`, {
    method: 'DELETE',
  }),
};

// Users API (Admin only)
export const adminUsersApi = {
  getAll: () => adminApiCall('/admin/users'),
  getById: (id) => adminApiCall(`/admin/users/${id}`),
  create: (userData) => adminApiCall('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => adminApiCall(`/admin/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  updateRole: (id, roleData) => adminApiCall(`/admin/users/${id}/role`, {
    method: 'PUT',
    body: JSON.stringify(roleData),
  }),
  delete: (id) => adminApiCall(`/admin/users/${id}`, {
    method: 'DELETE',
  }),
};

// Auth API
export const authApi = {
  login: (credentials) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Login failed');
    }
    return response.json();
  }),

  register: (userData) => fetch(`${API_BASE_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return response.json();
  }),
};

// Default API object for backward compatibility
const api = {
  get: (endpoint) => apiCall(endpoint),
  post: (endpoint, data) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};

export default api;
