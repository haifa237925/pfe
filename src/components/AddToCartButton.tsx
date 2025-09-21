import React, { useState } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface AddToCartButtonProps {
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    price: number;
    type: 'ebook' | 'audio' | 'both';
  };
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary';
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  book, 
  className = "", 
  size = 'md',
  variant = 'primary'
}) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      type: book.type
    });
    
    setTimeout(() => {
      setIsAdding(false);
      setJustAdded(true);
      
      // Reset after showing success state
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    }, 500);
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'py-2 px-3 text-sm';
      case 'lg':
        return 'py-4 px-6 text-lg';
      default:
        return 'py-3 px-4 text-base';
    }
  };

  const getVariantClasses = () => {
    if (variant === 'secondary') {
      return 'bg-neutral-100 text-neutral-700 border border-neutral-300 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-600';
    }
    return 'bg-primary-600 text-white hover:bg-primary-700';
  };

  const getButtonContent = () => {
    if (isAdding) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Ajout en cours...
        </>
      );
    }
    
    if (justAdded) {
      return (
        <>
          <Check className="h-5 w-5 mr-2" />
          Ajouté !
        </>
      );
    }
    
    return (
      <>
        <ShoppingCart className="h-5 w-5 mr-2" />
        Ajouter au panier
      </>
    );
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || justAdded}
      className={`
        ${getSizeClasses()} 
        ${getVariantClasses()} 
        rounded-lg font-medium flex items-center justify-center transition-colors disabled:opacity-75 
        ${className}
        ${justAdded ? 'bg-green-600 hover:bg-green-600' : ''}
      `}
    >
      {getButtonContent()}
    </button>
  );
};