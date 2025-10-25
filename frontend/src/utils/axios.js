import axios from 'axios';

const instance = axios.create({
  baseURL: '',  // Using relative URLs to work with Vite's proxy
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
    
    // Debug: Log authentication header being sent
    console.log('🌐 [AXIOS] Outgoing Request:', {
      url: config.url,
      method: config.method?.toUpperCase(),
      hasToken: !!token,
      hasDriverToken: !!driverToken,
      authHeader: token ? 'Bearer token present' : 'NO AUTH HEADER',
      timestamp: new Date().toISOString()
    });
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ [AXIOS] Added Authorization header with user token');
    } else if (driverToken) {
      config.headers.Authorization = `Bearer ${driverToken}`;
      console.log('✅ [AXIOS] Added Authorization header with driver token');
    } else {
      console.error('❌ [AXIOS] NO TOKEN FOUND - Request will be sent without authentication!');
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
      hadAuthHeader: !!error.config?.headers?.Authorization,
      timestamp: new Date().toISOString()
    });
    
    // Handle authentication errors
    if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
      console.error('🚫 [AUTH] 401 Unauthorized - Token may be invalid or expired');
      console.warn('🔄 [AUTH] Clearing expired session and redirecting to login...');
      
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('driverToken');
      
      // Redirect to login page
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    if (error.response?.status === 403) {
      console.error('🚫 [AUTH] 403 Forbidden - User does not have required permissions');
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token) {
        console.error('❌ [AUTH] 403 error AND no token found - User must log in!');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // If we have a token but still getting 403, the token is likely expired or invalid
      console.warn('⚠️ [AUTH] Token exists but access forbidden - Token may be expired');
      console.warn('🔄 [AUTH] Please log out and log back in to refresh your session');
      
      // Show a more helpful error message
      const message = user.role === 'ADMIN' 
        ? 'Your session has expired. Please log out and log back in.' 
        : 'You do not have permission to access this resource.';
      
      // If it's an admin with an expired token, auto-logout after 2 seconds
      if (user.role === 'ADMIN' && token) {
        setTimeout(() => {
          console.warn('🔄 [AUTH] Auto-logging out due to expired admin token...');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }, 2000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;