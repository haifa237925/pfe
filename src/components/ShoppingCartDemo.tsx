import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, X, BookOpen, Headphones, ArrowRight, Trash2, Heart } from 'lucide-react';

// Types
interface CartItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  type: 'ebook' | 'audio' | 'both';
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Cart Icon Component for Navbar
export const CartIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <button
      onClick={onClick}
      className="relative p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
          {totalItems > 99 ? '99+' : totalItems}
        </span>
      )}
    </button>
  );
};

// Cart Sidebar
export const CartSidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-800 shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
              Panier ({items.length})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                  Votre panier est vide
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Ajoutez des livres pour commencer
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-neutral-900 dark:text-white text-sm leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        par {item.author}
                      </p>
                      
                      <div className="flex items-center mt-2">
                        {item.type === 'ebook' || item.type === 'both' ? (
                          <div className="bg-primary-100 text-primary-600 p-1 rounded mr-1">
                            <BookOpen className="h-3 w-3" />
                          </div>
                        ) : null}
                        {item.type === 'audio' || item.type === 'both' ? (
                          <div className="bg-secondary-100 text-secondary-600 p-1 rounded">
                            <Headphones className="h-3 w-3" />
                          </div>
                        ) : null}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-600 dark:hover:bg-neutral-500"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 p-6 space-y-4">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="text-neutral-900 dark:text-white">Total:</span>
                  <span className="text-primary-600 dark:text-primary-400">
                    ${getTotalPrice().toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center">
                    Procéder au paiement
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </button>
                  
                  <button
                    onClick={clearCart}
                    className="w-full bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg font-medium hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Vider le panier
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Add to Cart Button Component
export const AddToCartButton: React.FC<{
  book: {
    id: string;
    title: string;
    author: string;
    cover: string;
    price: number;
    type: 'ebook' | 'audio' | 'both';
  };
  className?: string;
}> = ({ book, className = "" }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(book);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors ${className} ${
        isAdding ? 'opacity-75' : ''
      }`}
    >
      {isAdding ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
      ) : (
        <ShoppingCart className="h-5 w-5 mr-2" />
      )}
      {isAdding ? 'Ajout...' : 'Ajouter au panier'}
    </button>
  );
};

// Demo Component
const ShoppingCartDemo: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);

  // Sample books
  const sampleBooks = [
    {
      id: '1',
      title: 'The Art of Programming',
      author: 'Jane Smith',
      cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 9.99,
      type: 'ebook' as const
    },
    {
      id: '2',
      title: 'The Adventure Begins',
      author: 'John Doe',
      cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 7.99,
      type: 'ebook' as const
    },
    {
      id: '3',
      title: 'Business Strategy',
      author: 'Michael Johnson',
      cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
      price: 12.99,
      type: 'audio' as const
    }
  ];

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar Demo */}
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600 mr-2" />
                <span className="text-xl font-bold">BookStore</span>
              </div>
              <div className="flex items-center space-x-4">
                <CartIcon onClick={() => setCartOpen(true)} />
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Catalogue de Livres</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleBooks.map(book => (
              <div key={book.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm">{book.title}</h3>
                      <p className="text-gray-600 text-sm">par {book.author}</p>
                    </div>
                    <div className="ml-2">
                      {book.type === 'ebook' && (
                        <div className="bg-primary-100 text-primary-600 p-1 rounded">
                          <BookOpen className="h-4 w-4" />
                        </div>
                      )}
                      {book.type === 'audio' && (
                        <div className="bg-secondary-100 text-secondary-600 p-1 rounded">
                          <Headphones className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold text-gray-900">
                      ${book.price.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <AddToCartButton book={book} className="flex-1" />
                    <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                      <Heart className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Sidebar */}
        <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      </div>
    </CartProvider>
  );
};

export default ShoppingCartDemo;