import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'reader' | 'writer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: 'reader' | 'writer') => Promise<void>;
  logout: () => void;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<{ user: User }>(token);
        setUser(decoded.user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setIsLoading(false);
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      setIsLoading(true);
      
      // Mock login for demo purposes
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        role: 'reader'
      };
      
      const mockToken = btoa(JSON.stringify({ user: mockUser }));
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
    } catch (err: any) {
      setError('Login failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string, role: 'reader' | 'writer') => {
    setError(null);
    try {
      setIsLoading(true);
      
      // Mock registration for demo purposes
      const mockUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role
      };
      
      const mockToken = btoa(JSON.stringify({ user: mockUser }));
      localStorage.setItem('token', mockToken);
      setUser(mockUser);
    } catch (err: any) {
      setError('Registration failed. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    error
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};