import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { WishlistItem, WishlistContextType } from '../types/Wishlist';

// Mock data for demo
const MOCK_WISHLIST: WishlistItem[] = [];

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist when user changes
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // In a real app, this would fetch from Supabase
      // For now, load from localStorage
      const savedWishlist = localStorage.getItem(`wishlist_${user.id}`);
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveWishlistToStorage = (items: WishlistItem[]) => {
    if (user) {
      localStorage.setItem(`wishlist_${user.id}`, JSON.stringify(items));
    }
  };

  const addToWishlist = async (bookId: string) => {
    if (!user) return;

    const newItem: WishlistItem = {
      id: `wishlist_${Date.now()}`,
      userId: user.id,
      bookId,
      addedDate: new Date().toISOString(),
    };

    const updatedItems = [...wishlistItems, newItem];
    setWishlistItems(updatedItems);
    saveWishlistToStorage(updatedItems);
  };

  const removeFromWishlist = async (bookId: string) => {
    if (!user) return;

    const updatedItems = wishlistItems.filter(item => item.bookId !== bookId);
    setWishlistItems(updatedItems);
    saveWishlistToStorage(updatedItems);
  };

  const isInWishlist = (bookId: string): boolean => {
    return wishlistItems.some(item => item.bookId === bookId);
  };

  const clearWishlist = async () => {
    if (!user) return;

    setWishlistItems([]);
    localStorage.removeItem(`wishlist_${user.id}`);
  };

  const value = {
    wishlistItems,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};