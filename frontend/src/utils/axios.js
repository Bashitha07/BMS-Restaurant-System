import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:8084',  // Point directly to backend (temporary fix for proxy issue)
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const driverToken = localStorage.getItem('driverToken');
    
    // Public endpoints that don't require authentication
    const publicEndpoints = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/refresh',
      '/api/menus',
      '/api/menu'
    ];
    
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      config.url?.includes(endpoint)
    );
    
    // Debug: Log authentication header being sent (only for authenticated requests)
    if (!isPublicEndpoint || token || driverToken) {
      console.log('🌐 [AXIOS] Outgoing Request:', {
        url: config.url,
        method: config.method?.toUpperCase(),
        hasToken: !!token,
        hasDriverToken: !!driverToken,
        authHeader: token || driverToken ? 'Bearer token present' : 'Public endpoint',
        timestamp: new Date().toISOString()
      });
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [AXIOS] Added Authorization header with user token');
    } else if (driverToken) {
      config.headers.Authorization = `Bearer ${driverToken}`;
      console.log('✅ [AXIOS] Added Authorization header with driver token');
    } else if (!isPublicEndpoint) {
      console.warn('⚠️ [AXIOS] No token found for protected endpoint:', config.url);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('✅ [AXIOS] Response received:', {
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    });
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('❌ [AXIOS] Request failed:', {
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      status: error.response?.status,
      statusText: error.response?.statusText,
      errorMessage: error.message,
      responseData: error.response?.data,
      hadAuthHeader: !!error.config?.headers?.Authorization,
      timestamp: new Date().toISOString()
    });
    
    // Handle authentication errors
    if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
      console.error('🚫 [AUTH] 401 Unauthorized - Token may be invalid or expired');
      console.error('🔍 [DEBUG] Error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        fullError: error
      });
      
      // TEMPORARY: Don't logout automatically - just show error
      console.warn('⚠️ [AUTH] AUTO-LOGOUT DISABLED FOR DEBUGGING');
      console.warn('⚠️ [AUTH] Please copy the error above and share it!');
      
      // DON'T clear auth data or redirect - just reject the promise
      return Promise.reject(error);
    }
    
    if (error.response?.status === 403) {
      console.error('🚫 [AUTH] 403 Forbidden - User does not have required permissions');
      console.error('🔍 [DEBUG] 403 Error details:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        fullError: error
      });
      
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      console.warn('⚠️ [AUTH] AUTO-LOGOUT DISABLED FOR DEBUGGING (403)');
      console.warn('⚠️ [AUTH] Please copy the error above and share it!');
      
      // TEMPORARY: Don't logout - just show error
      return Promise.reject(error);
    }
    
    return Promise.reject(error);
  }
);

export default instance;