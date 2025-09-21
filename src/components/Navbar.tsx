import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, Bell, Menu, X, Heart, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CartIcon } from './CartIcon';
import { CartSidebar } from './CartSidebar';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm border-b border-neutral-200 dark:border-neutral-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-neutral-900 dark:text-white">BookLib</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link 
                to="/books" 
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors"
              >
                Catalogue
              </Link>
              <Link 
                to="/categories" 
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors"
              >
                Catégories
              </Link>
              <Link 
                to="/authors" 
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors"
              >
                Auteurs
              </Link>
              <Link 
                to="/bestsellers" 
                className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors"
              >
                Bestsellers
              </Link>
            </div>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher des livres, auteurs..."
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-full bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
              >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {/* Cart Icon */}
              <CartIcon onClick={() => setShowCart(true)} />

              {user ? (
                <>
                  {/* Notifications */}
                  <button className="relative p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors">
                    <Bell className="h-6 w-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                    >
                      <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                          {user.username?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="hidden md:block text-neutral-700 dark:text-neutral-300 font-medium">
                        {user.username}
                      </span>
                    </button>

                    {/* Dropdown Menu */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 py-1 z-50">
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          Tableau de bord
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Heart className="h-4 w-4 mr-3" />
                          Liste de souhaits
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Paramètres
                        </Link>
                        <div className="border-t border-neutral-200 dark:border-neutral-700 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Se déconnecter
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white font-medium transition-colors"
                  >
                    Se connecter
                  </Link>
                  <Link
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white transition-colors"
              >
                {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden border-t border-neutral-200 dark:border-neutral-700 py-4">
              {/* Mobile Search */}
              <div className="px-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 px-4">
                <Link
                  to="/books"
                  className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Catalogue
                </Link>
                <Link
                  to="/categories"
                  className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Catégories
                </Link>
                <Link
                  to="/authors"
                  className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Auteurs
                </Link>
                <Link
                  to="/bestsellers"
                  className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Bestsellers
                </Link>

                {user && (
                  <>
                    <div className="border-t border-neutral-200 dark:border-neutral-700 my-2 pt-2">
                      <Link
                        to="/dashboard"
                        className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Tableau de bord
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block py-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        Liste de souhaits
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />

      {/* Backdrop for mobile menu */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;