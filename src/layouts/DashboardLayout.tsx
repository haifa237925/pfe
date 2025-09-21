import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  BookOpen, 
  User, 
  LogOut, 
  BarChart2, 
  Upload, 
  Book, 
  History, 
  Settings, 
  Users, 
  Shield, 
  Heart,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  UserPlus,
  ShoppingCart
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];

  const handleLogout = () => {
    logout();
    // Force redirect to home after logout
    window.location.href = '/';
  };
  
  if (!user) {
    return null;
  }
  
  const getNavItems = () => {
    switch (user.role) {
      case 'writer':
        return [
          { to: '/writer', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
          { to: '/writer/upload', label: 'Upload Book', icon: <Upload className="h-5 w-5" /> },
          { to: '/writer/stats', label: 'Sales Statistics', icon: <BarChart2 className="h-5 w-5" /> },
        ];
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: <BarChart2 /> },
          { to: '/admin/users', label: 'User Management', icon: <Users /> },
          { to: '/admin/moderation', label: 'Content Moderation', icon: <Shield /> },
          { to: '/admin/analytics', label: 'Analytics', icon: <BarChart2 /> },
          { to: '/admin/system', label: 'System', icon: <Settings /> },
          { to: '/admin/settings', label: 'Settings', icon: <Settings /> },
        ];
      default: // reader
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
          { to: '/dashboard/wishlist', label: 'Ma Liste de Souhaits', icon: <Heart className="h-5 w-5" /> },
          { to: '/dashboard/history', label: 'Historique de Lecture', icon: <History className="h-5 w-5" /> },
          { to: '/cart', label: 'Mon Panier', icon: <ShoppingCart className="h-5 w-5" />, badge: getTotalItems() },
          { to: '/books', label: 'Catalogue', icon: <Book className="h-5 w-5" /> },
        ];
    }
  };

  const navItems = getNavItems();
  
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col md:flex-row transition-colors">
      {/* Mobile header */}
      <div className="md:hidden bg-white dark:bg-neutral-800 px-4 py-3 shadow-sm flex items-center justify-between border-b dark:border-neutral-700">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-neutral-500 dark:text-neutral-400 mr-3 p-1"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="ml-2 text-lg font-bold text-neutral-900 dark:text-white">LectureVerse</span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-1">
          {/* Cart Icon for Mobile */}
          <Link
            to="/cart"
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors relative"
          >
            <ShoppingCart className="h-5 w-5" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <Globe className="h-4 w-4" />
            </button>
            {isLanguageMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 border dark:border-neutral-700">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code as any);
                      setIsLanguageMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center transition-colors ${
                      language === lang.code ? 'bg-primary-50 dark:bg-primary-900 text-primary-600' : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="mr-3">{lang.flag}</span>
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-1 text-neutral-700 dark:text-neutral-300 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
              <User className="h-4 w-4" />
              <ChevronDown className="h-3 w-3" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border dark:border-neutral-700">
              <Link 
                to="/" 
                className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Accueil
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className={`md:w-64 bg-white dark:bg-neutral-800 shadow-sm md:flex md:flex-col transition-all duration-300 ease-in-out border-r dark:border-neutral-700 ${
        isSidebarOpen ? 'fixed inset-0 z-20 overflow-auto' : 'hidden'
      } md:relative md:block`}>
        
        {/* Desktop Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 hidden md:block">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center">
              <BookOpen className="h-6 w-6 text-primary-600" />
              <span className="ml-2 text-lg font-bold text-neutral-900 dark:text-white">LectureVerse</span>
            </Link>
            
            <div className="flex items-center space-x-1">
              {/* Cart Icon for Desktop */}
              <Link
                to="/cart"
                className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors relative"
              >
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
              
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-1.5 rounded-md text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </button>
                {isLanguageMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 border dark:border-neutral-700">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code as any);
                          setIsLanguageMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center transition-colors ${
                          language === lang.code ? 'bg-primary-50 dark:bg-primary-900 text-primary-600' : 'text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <span className="mr-3">{lang.flag}</span>
                        {lang.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* User info */}
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-neutral-900 dark:text-white text-sm">{user.username}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="py-4 flex-grow">
          <nav className="px-6 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors relative ${
                  location.pathname === item.to
                    ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 border-r-2 border-primary-600'
                    : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="ml-auto bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
            
            {/* Publisher Request Button - Only for readers */}
            {user.role === 'reader' && (
              <div className="pt-3 mt-3 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  to="/publisher-request"
                  className="flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 transition-all duration-200 shadow-sm hover:shadow-md"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <UserPlus className="h-5 w-5" />
                  <span className="ml-3">Devenir Éditeur?</span>
                </Link>
              </div>
            )}
          </nav>
        </div>
        
        {/* Logout */}
        <div className="p-3 border-t border-neutral-200 dark:border-neutral-700">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Déconnexion</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow flex flex-col">
        {/* Desktop header */}
        <div className="px-6 py-4 hidden md:flex items-center justify-between bg-white dark:bg-neutral-800 shadow-sm border-b dark:border-neutral-700">
          <div className="flex items-center">
            <div className="w-6 mr-2"></div> {/* Spacer to align with logo icon */}
            <h1 className="text-xl font-semibold text-neutral-900 dark:text-white">
              {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors px-3 py-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              Accueil
            </Link>
            <button 
              onClick={handleLogout}
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 transition-colors p-1.5 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <main className="flex-grow p-6 bg-neutral-50 dark:bg-neutral-900 overflow-auto">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;