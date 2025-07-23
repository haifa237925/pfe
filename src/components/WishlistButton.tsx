import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

interface WishlistButtonProps {
  bookId: string;
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({ 
  bookId, 
  className = '', 
  showText = false 
}) => {
  const { user } = useAuth();
  const { isInWishlist, addToWishlist, removeFromWishlist, isLoading } = useWishlist();
  
  if (!user) return null;

  const inWishlist = isInWishlist(bookId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;

    try {
      if (inWishlist) {
        await removeFromWishlist(bookId);
      } else {
        await addToWishlist(bookId);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`
        inline-flex items-center justify-center transition-all duration-200
        ${inWishlist 
          ? 'text-red-500 hover:text-red-600' 
          : 'text-neutral-400 hover:text-red-500'
        }
        ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart 
        className={`h-5 w-5 ${inWishlist ? 'fill-current' : ''}`} 
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
        </span>
      )}
    </button>
  );
};