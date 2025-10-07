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
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.removeItem('driverToken');
      localStorage.removeItem('user');
      localStorage.removeItem('driver');
      
      // Redirect based on current path
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/driver')) {
        window.location.href = '/driver/login';
      } else {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;