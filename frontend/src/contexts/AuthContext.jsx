import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { userService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    try {
      // Try real API login first
      const data = await userService.login({ username, password });
      // Expected response: { token, username, role }
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      const userData = {
        id: Date.now(),
        username: data?.username || username,
        email: '',
        role: (data?.role || 'USER').toUpperCase(),
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      // Fallback to simple mock for local demo
      if (username === 'admin' && password === 'admin123') {
        const userData = { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      } else if (username === 'user' && password === 'user123') {
        const userData = { id: 2, username: 'user', email: 'user@example.com', role: 'USER' };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      throw error;
    }
  };

  const register = async (username, email, password, phone) => {
    try {
      const data = await userService.register({ username, email, password, phone });
      const userData = {
        id: data?.id ?? Date.now(),
        username: data?.username || username,
        email: data?.email || email,
        phone: data?.phone || phone,
        role: (data?.role || 'USER').toUpperCase(),
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      // Fallback: local demo register
      const userData = { id: Date.now(), username, email, phone, role: 'USER' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('cart');
    // Clear any other user-specific data
    localStorage.removeItem('orders');
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    try {
      // In a real implementation, you'd call the API:
      // const updatedUserData = await userService.updateProfile(user.id, updates);
      
      // For now, we'll simulate a successful API call
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  };

  const isAdmin = useMemo(() => (user?.role || '').toUpperCase() === 'ADMIN', [user]);
  const isDriver = useMemo(() => (user?.role || '').toUpperCase() === 'DRIVER', [user]);
  const isKitchen = useMemo(() => (user?.role || '').toUpperCase() === 'KITCHEN', [user]);
  const isManager = useMemo(() => (user?.role || '').toUpperCase() === 'MANAGER', [user]);

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAdmin, isDriver, isKitchen, isManager }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthProvider;
