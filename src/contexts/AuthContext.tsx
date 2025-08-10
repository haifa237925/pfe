import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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
  
  // Check for existing session on load
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);
  
  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      console.log('Loading profile for user:', supabaseUser.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Profile not found, creating new profile');
        const userRole = (supabaseUser.user_metadata?.role as 'reader' | 'writer') || 'reader';
        
        const newProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
          role: userRole
        };

        console.log('Creating profile with data:', newProfile);
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(newProfile);

        if (insertError) {
          console.error('Error creating profile:', insertError);
          // Don't set error, just use the basic user data
          const basicProfile = {
            id: supabaseUser.id,
            email: supabaseUser.email!,
            name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
            role: userRole
          };
          setUser(basicProfile);
        } else {
          console.log('Profile created successfully');
          setUser(newProfile);
        }
      } else if (profile) {
        console.log('Profile found:', profile);
        setUser(profile);
      } else if (error) {
        console.error('Error loading profile:', error);
        // Fallback to basic user data
        const basicProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email!,
          name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
          role: (supabaseUser.user_metadata?.role as 'reader' | 'writer') || 'reader'
        };
        setUser(basicProfile);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
      // Fallback to basic user data
      const basicProfile = {
        id: supabaseUser.id,
        email: supabaseUser.email!,
        name: supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
        role: (supabaseUser.user_metadata?.role as 'reader' | 'writer') || 'reader'
      };
      setUser(basicProfile);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Login function
  const login = async (email: string, password: string) => {
    setError(null);
    
    try {
      console.log('Attempting login for:', email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        setError(error.message);
        throw error;
      }
      console.log('Login successful');
    } catch (err: any) {
      if (!error) {
        setError('Login failed. Please try again.');
      }
      throw err;
    }
  };
  
  // Register function
  const register = async (name: string, email: string, password: string, role: 'reader' | 'writer') => {
    setError(null);
    
    try {
      console.log('Attempting registration for:', email, 'as', role);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      });

      if (error) {
        console.error('Registration error:', error);
        setError(error.message);
        throw error;
      }

      console.log('Registration successful:', data);
      // Profile creation is handled by loadUserProfile via onAuthStateChange
    } catch (err: any) {
      if (!error) {
        setError('Registration failed. Please try again.');
      }
      throw err;
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
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