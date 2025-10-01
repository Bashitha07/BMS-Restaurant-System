import React, { useEffect, useState, createContext, useContext } from 'react';
type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
};
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  const login = async (email: string, password: string) => {
    // This would normally be an API call
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock authentication
      if (email === 'admin@example.com' && password === 'password') {
        const adminUser = {
          id: '1',
          name: 'Admin User',
          email,
          role: 'admin' as const
        };
        setUser(adminUser);
        localStorage.setItem('user', JSON.stringify(adminUser));
      } else if (email === 'user@example.com' && password === 'password') {
        const regularUser = {
          id: '2',
          name: 'Regular User',
          email,
          role: 'user' as const
        };
        setUser(regularUser);
        localStorage.setItem('user', JSON.stringify(regularUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock registration
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        role: 'user' as const
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    isLoading,
    login,
    register,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}