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
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (driverToken) {
      config.headers.Authorization = `Bearer ${driverToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only handle 401 unauthorized errors, not 500 or other server errors
    if (error.response?.status === 401 && !error.config.url.includes('/api/auth/login')) {
      // Handle unauthorized access, but only if not a login request
      // This prevents clearing tokens during login attempts
      console.error('Authentication error:', error);
      
      // Don't clear tokens and user data during login attempts to avoid issues
      if (!window.location.pathname.includes('/login')) {
        // Only remove tokens for actual authentication issues
        // Don't remove user data to prevent being logged out on server errors
        console.warn('Skipping token removal to prevent logout on server errors');
        // Commented out to prevent logout on refresh
        // localStorage.removeItem('token');
        // localStorage.removeItem('driverToken');
        // localStorage.removeItem('user');
        // localStorage.removeItem('driver');
      }
    }
    return Promise.reject(error);
  }
);

export default instance;