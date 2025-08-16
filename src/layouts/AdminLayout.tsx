import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Shield, 
  Users, 
  Flag, 
  BarChart2, 
  Settings, 
  LogOut, 
  Crown,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Home,
  Database,
  Activity,
  AlertTriangle
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
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
    window.location.href = '/';
  };
  
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-800 dark:text-red-400 mb-2">Accès refusé</h1>
          <p className="text-red-600 dark:text-red-300 mb-4">Vous devez être administrateur pour accéder à cette zone.</p>
          <Link to="/" className="text-red-600 hover:text-red-800 font-medium">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }
  
  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
    { to: '/admin/users', label: 'Gestion Utilisateurs', icon: <Users className="h-5 w-5" /> },
    { to: '/admin/moderation', label: 'Modération', icon: <Flag className="h-5 w-5" /> },
    { to: '/admin/analytics', label: 'Analytics', icon: <Activity className="h-5 w-5" /> },
    { to: '/admin/system', label: 'Système', icon: <Database className="h-5 w-5" /> },
    { to: '/admin/settings', label: 'Paramètres', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-900/20 dark:via-blue-900/20 dark:to-indigo-900/20 flex flex-col md:flex-row transition-colors">
      {/* Mobile header */}
      <div className="md:hidden bg-gradient-to-r from-purple-600 to-indigo-600 p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white mr-4"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <div className="flex items-center">
            <Crown className="h-7 w-7 text-yellow-300" />
            <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <Globe className="h-5 w-5" />
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
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center ${
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

          <div className="relative group">
            <button className="flex items-center space-x-1 text-white/80 hover:text-white">
              <Crown className="h-5 w-5" />
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-10 hidden group-hover:block border dark:border-neutral-700">
              <Link to="/" className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900">
                <Home className="h-4 w-4 inline mr-2" />
                Retour au site
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <LogOut className="h-4 w-4 inline mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className={`md:w-80 bg-gradient-to-b from-purple-800 to-indigo-900 shadow-2xl md:flex md:flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'fixed inset-0 z-20 overflow-auto' : 'hidden'
      } md:relative md:block`}>
        <div className="p-6 border-b border-white/10 hidden md:block">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-purple-200 text-sm">LectureVerse</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>

              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center ${
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
        
        {/* Admin info */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
              <Crown className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="font-semibold text-white">{user.username}</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <p className="text-sm text-purple-200">Super Administrateur</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="py-6 flex-grow">
          <nav className="px-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  location.pathname === item.to
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/10'
                    : 'text-purple-200 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <div className={`p-2 rounded-lg mr-3 ${
                  location.pathname === item.to
                    ? 'bg-white/20'
                    : 'bg-white/5'
                }`}>
                  {item.icon}
                </div>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Quick actions */}
        <div className="p-6 border-t border-white/10">
          <div className="space-y-3">
            <Link
              to="/"
              className="flex items-center w-full px-4 py-3 text-purple-200 hover:bg-white/10 hover:text-white rounded-xl transition-all duration-200"
            >
              <Home className="h-5 w-5 mr-3" />
              <span>Retour au site</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-purple-200 hover:bg-red-500/20 hover:text-red-200 rounded-xl transition-all duration-200"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow">
        <div className="p-6 bg-white/50 dark:bg-neutral-800/50 backdrop-blur-sm shadow-sm border-b border-white/20 dark:border-neutral-700/50 hidden md:flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              {navItems.find(item => item.to === location.pathname)?.label || 'Administration'}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Gestion et supervision de la plateforme LectureVerse
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Système opérationnel</span>
            </div>
            <Link 
              to="/" 
              className="text-neutral-600 dark:text-neutral-300 hover:text-primary-600 flex items-center text-sm"
            >
              <Home className="h-4 w-4 mr-1" />
              Site public
            </Link>
          </div>
        </div>
        
        <main className="p-8 bg-gradient-to-br from-white/80 via-purple-50/50 to-blue-50/50 dark:from-neutral-900/80 dark:via-purple-900/20 dark:to-blue-900/20 min-h-screen backdrop-blur-sm">
          <Outlet />
        </main>
      </div>
      
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;