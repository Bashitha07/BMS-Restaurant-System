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
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        console.log('Restored user session from localStorage:', {
          username: parsedUser.username,
          role: parsedUser.role
        });
      } catch (err) {
        console.error('Error parsing saved user data:', err);
        // Don't clear localStorage on parse error to allow retry
      }
    }
  }, []);

  const login = async (username, password) => {
    try {
      console.log("Login attempt:", username);
      
      // Clear any previous login data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // API login - userService now handles the demo credentials internally
      const data = await userService.login({ username, password });
      console.log("Login response:", data);
      
      // Expected response: { token, username, role }
      if (data?.token) {
        localStorage.setItem('token', data.token);
      }
      
      // Create user object from response
      const userData = {
        id: data?.id || Date.now(),
        username: data?.username || username,
        email: data?.email || '',
        role: (data?.role || 'USER').toUpperCase(),
      };
      
      console.log("Setting user data:", userData);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Return the user data for the component to use
      return userData;
    } catch (error) {
      console.error("Login error in AuthContext:", error);
      
      // Clear any stale data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      if (error.message && typeof error.message === 'string') {
        throw error;
      } else {
        throw new Error('Login failed. Please check your credentials and try again.');
      }
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

  // Add persistence check to avoid losing user state during page refresh
  const getSavedUser = () => {
    if (user) return user; // Use context state if available
    
    // Fallback to localStorage if context hasn't loaded yet
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (err) {
        return null;
      }
    }
    return null;
  };
  
  const persistentUser = getSavedUser();
  
  const isAdmin = useMemo(() => {
    const roleToCheck = persistentUser?.role || '';
    return roleToCheck.toUpperCase() === 'ADMIN';
  }, [persistentUser, user]);
  
  const isDriver = useMemo(() => {
    const roleToCheck = persistentUser?.role || '';
    return roleToCheck.toUpperCase() === 'DRIVER';
  }, [persistentUser, user]);
  
  const isKitchen = useMemo(() => {
    const roleToCheck = persistentUser?.role || '';
    return roleToCheck.toUpperCase() === 'KITCHEN';
  }, [persistentUser, user]);
  
  const isManager = useMemo(() => {
    const roleToCheck = persistentUser?.role || '';
    return roleToCheck.toUpperCase() === 'MANAGER';
  }, [persistentUser, user]);

  return (
    <AuthContext.Provider value={{ 
      user: user || persistentUser, // Use persistentUser as fallback
      login, 
      register, 
      logout, 
      updateProfile, 
      isAdmin, 
      isDriver, 
      isKitchen, 
      isManager 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthProvider;
