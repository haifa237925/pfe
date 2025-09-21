import React from 'react';
import { Link } from 'react-router-dom';
import { 
  X, 
  ShoppingCart, 
  Plus, 
  Minus, 
  ArrowRight, 
  Trash2, 
  BookOpen, 
  Headphones 
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
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
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                  Ajoutez des livres pour commencer
                </p>
                <Link
                  to="/books"
                  onClick={onClose}
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Découvrir des livres
                </Link>
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