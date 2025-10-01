import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username, password) => {
    // Mock login - replace with actual API call
    if (username === 'admin' && password === 'admin123') {
      const userData = { id: 1, username: 'admin', email: 'admin@example.com', role: 'ADMIN' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else if (username === 'user' && password === 'user123') {
      const userData = { id: 2, username: 'user', email: 'user@example.com', role: 'USER' };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (username, email, password) => {
    // Mock register - replace with actual API call
    const userData = { id: Date.now(), username, email, role: 'USER' };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates) => {
    if (!user) throw new Error('No user logged in');
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
