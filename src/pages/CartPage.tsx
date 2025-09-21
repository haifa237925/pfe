import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Minus, Plus, Trash2, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to login
      return;
    }

    setLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert('Achat effectué avec succès!');
      clearCart();
      setLoading(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <ShoppingCart className="h-24 w-24 mx-auto text-neutral-300 mb-4" />
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
              Votre panier est vide
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Découvrez nos livres et commencez votre collection
            </p>
          </div>
          
          <Link
            to="/books"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Parcourir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link
            to="/books"
            className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continuer les achats
          </Link>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
            Panier ({items.length} {items.length > 1 ? 'articles' : 'article'})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
              <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {items.map((item) => (
                  <div key={item.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.cover}
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm flex-shrink-0"
                      />
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-lg text-neutral-900 dark:text-white truncate">
                              {item.title}
                            </h3>
                            <p className="text-neutral-600 dark:text-neutral-400">
                              par {item.author}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.type === 'ebook' ? 'bg-blue-100 text-blue-800' :
                                item.type === 'audio' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {item.type === 'ebook' ? 'E-Book' : 
                                 item.type === 'audio' ? 'Audio' : 
                                 'E-Book + Audio'}
                              </span>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Supprimer du panier"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Quantité:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-4 w-4" />
                              </button>
                              <span className="w-8 text-center font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 rounded border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors"
                              >
                                <Plus className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-neutral-900 dark:text-white">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            {item.quantity > 1 && (
                              <div className="text-sm text-neutral-500">
                                ${item.price.toFixed(2)} chacun
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                Résumé de commande
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Sous-total ({items.reduce((sum, item) => sum + item.quantity, 0)} articles)
                  </span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">TVA</span>
                  <span className="font-medium">${(getTotalPrice() * 0.1).toFixed(2)}</span>
                </div>
                
                <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
                  <div className="flex justify-between text-lg font-bold text-neutral-900 dark:text-white">
                    <span>Total</span>
                    <span>${(getTotalPrice() * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              {user ? (
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CreditCard className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Traitement...' : 'Procéder au paiement'}
                </button>
              ) : (
                <Link
                  to="/login"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Se connecter pour acheter
                </Link>
              )}
              
              <button
                onClick={clearCart}
                className="w-full mt-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 py-2 px-4 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;