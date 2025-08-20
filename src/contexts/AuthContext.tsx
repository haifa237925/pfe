import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from "axios";

// Types
export interface User {
  id: string;
  email: string;
  username: string; // Changed from 'name' to match your backend response
  role: 'reader' | 'writer' | 'admin' | 'user';
}

interface LoginResult {
  success: boolean;
  message: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const backendurl = import.meta.env.VITE_BACK_END_URL;

  // Configure axios to include credentials (cookies) in requests
  axios.defaults.withCredentials = true;

  // Check for existing session on load
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        setIsLoading(true);
        
        // Check if there's a stored user in localStorage first (fallback)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (e) {
            console.error('Failed to parse stored user:', e);
            localStorage.removeItem('user');
          }
        }
        
        // Then verify with backend
        const result = await axios.get(`${backendurl}/api/auth/check-session`, { withCredentials: true });
        
        if (result.status === 200 && result.data) {
          const userData = {
            id: result.data.id,
            email: result.data.email,
            username: result.data.username,
            role: result.data.role || 'user'
          };
          setUser(userData);
          
          // Store user data as backup
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } catch (error: any) {
        // If check-session fails, clear any stored user data
        console.log('Session check failed:', error.response?.data?.message || error.message);
        
        // Only clear if the stored user exists and backend confirms no session
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem('user');
          localStorage.removeItem('authToken');
          setUser(null);
        }
        // For network errors, keep the stored user if available
        else {
          const storedUser = localStorage.getItem('user');
          if (storedUser && !user) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (e) {
              localStorage.removeItem('user');
            }
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkUserSession();
  }, [backendurl]);

  // Login function
  const login = async (email: string, password: string): Promise<LoginResult> => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log('Attempting login for:', email);
      
      const response = await axios.post(`${backendurl}/api/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        // Backend returns user data on successful login
        const userData = response.data.user;
        const user = {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          role: userData.role || 'user'
        };
        
        setUser(user);
        
        // Store user data for persistence
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Login successful');
        
        return {
          success: true,
          message: response.data.message || 'Login successful',
          user: user
        };
      }
      
      // This shouldn't happen if status is 200, but just in case
      return {
        success: false,
        message: 'Unexpected response from server'
      };
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      console.error('Login error:', errorMessage);
      
      return {
        success: false,
        message: errorMessage
      };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Register function
  const register = async (username: string, email: string, password: string, role: string = 'reader') => {
    setError(null);
    setIsLoading(true);
    
    try {
      console.log('Attempting registration for:', email);
      
      const response = await axios.post(`${backendurl}/api/auth/register`, {
        username,
        email,
        password,
        role,
      });

      if (response.status === 201) {
        // Backend returns user data on successful registration
        const userData = response.data.user;
        const user = {
          id: userData.id,
          email: userData.email,
          username: userData.name, // Backend returns 'name' field for username
          role: userData.role || 'reader'
        };
        
        setUser(user);
        
        // Store user data for persistence
        localStorage.setItem('user', JSON.stringify(user));
        
        console.log('Registration successful');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error('Registration error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      await axios.post(`${backendurl}/api/auth/logout`);
    } catch (error: any) {
      console.error('Logout error:', error.response?.data?.message || error.message);
    } finally {
      // Always clear user state and any stored data
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      console.log('Logout successful');
    }
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