import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { BookOpen, User, Search, Menu, X, Sun, Moon, Globe } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = React.useState(false);
  
  const getDashboardLink = () => {
    if (!user) return '/dashboard';
    
    switch (user.role) {
      case 'writer':
        return '/writer';
      case 'admin':
        return '/admin';
      default:
        return '/dashboard';
    }
  };

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
  ];
  
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors">
      <header className="bg-white dark:bg-neutral-800 shadow-sm transition-colors">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/" className="flex items-center">
                <BookOpen className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-neutral-900 dark:text-white">LectureVerse</span>
              </Link>
              
              <div className="hidden md:flex ml-10 space-x-8">
                <Link 
                  to="/" 
                  className={`${location.pathname === '/' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-500'} font-medium transition duration-150`}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/books" 
                  className={`${location.pathname.startsWith('/books') ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-600 dark:text-neutral-300 hover:text-primary-500'} font-medium transition duration-150`}
                >
                  {t('nav.books')}
                </Link>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                title={theme === 'light' ? 'Mode sombre' : 'Mode clair'}
              >
                {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center"
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

              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search books..." 
                  className="pl-10 pr-4 py-2 rounded-full text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
              </div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="relative group">
                    <button className="flex items-center space-x-2 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 px-3 py-2 rounded-md">
                      <span>{user.username}</span>
                      <User className="h-5 w-5" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-800 rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border dark:border-neutral-700">
                      <Link 
                        to={getDashboardLink()} 
                        className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors"
                      >
                        {t('nav.dashboard')}
                      </Link>
                      {user.role === 'reader' && (
                        <Link to="/books" className="block px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-primary-50 dark:hover:bg-primary-900 hover:text-primary-600 transition-colors">
                          {t('nav.books')}
                        </Link>
                      )}
                      <div className="border-t border-neutral-100 my-1"></div>
                      <button 
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-600 transition-colors"
                      >
                        {t('nav.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/login" 
                    className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 font-medium"
                  >
                    {t('nav.login')}
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    {t('nav.signup')}
                  </Link>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </nav>
          
          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/" 
                  className={`${location.pathname === '/' ? 'text-primary-600' : 'text-neutral-600 dark:text-neutral-300'} font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.home')}
                </Link>
                <Link 
                  to="/books" 
                  className={`${location.pathname.startsWith('/books') ? 'text-primary-600' : 'text-neutral-600 dark:text-neutral-300'} font-medium`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.books')}
                </Link>
                
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search books..." 
                     className="w-full pl-10 pr-4 py-2 rounded-full text-sm border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500 dark:text-neutral-400" />
                </div>
                
                {user ? (
                  <>
                    <Link 
                      to={getDashboardLink()} 
                      className="text-neutral-700 dark:text-neutral-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.dashboard')}
                    </Link>
                    {user.role === 'reader' && (
                      <>
                        <Link 
                          to="/dashboard/wishlist" 
                          className="text-neutral-700 dark:text-neutral-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Wishlist
                        </Link>
                        <Link 
                          to="/books" 
                          className="text-neutral-700 dark:text-neutral-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {t('nav.books')}
                        </Link>
                      </>
                    )}
                    <button 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="text-left text-neutral-700 dark:text-neutral-300"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link 
                      to="/login" 
                      className="text-neutral-700 dark:text-neutral-300 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.login')}
                    </Link>
                    <Link 
                      to="/register" 
                      className="bg-primary-600 text-white px-4 py-2 rounded-md text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {t('nav.signup')}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <footer className="bg-neutral-800 dark:bg-neutral-900 text-white py-8 transition-colors">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LectureVerse</h3>
              <p className="text-neutral-400">
                A digital platform for publishing and reading books online.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-neutral-400 hover:text-white">{t('nav.home')}</Link></li>
                <li><Link to="/books" className="text-neutral-400 hover:text-white">{t('nav.books')}</Link></li>
                <li><Link to="/login" className="text-neutral-400 hover:text-white">{t('nav.login')}</Link></li>
                <li><Link to="/register" className="text-neutral-400 hover:text-white">{t('nav.signup')}</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-neutral-400">
                Email: contact@lectureverse.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-neutral-700 dark:border-neutral-600 mt-6 pt-6 text-center text-neutral-400">
            <p>&copy; {new Date().getFullYear()} LectureVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;