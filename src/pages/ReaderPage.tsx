import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  X, 
  ZoomIn, 
  ZoomOut, 
  BookOpen
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const DUMMY_BOOKS = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  }
];

interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: number;
}

const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isSample = searchParams.get('sample') === 'true';
  
  const [book, setBook] = useState(DUMMY_BOOKS.find(b => b.id === id));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    theme: 'light',
    lineHeight: 1.5
  });
  
  // Calculate pages based on content
  const contentRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (contentRef.current && book?.content) {
      // This is a simplified way to calculate pages
      // A real implementation would be more complex
      const content = book.content;
      const avgCharsPerPage = 1000;
      const estimatedPages = Math.ceil(content.length / avgCharsPerPage);
      setTotalPages(estimatedPages);
    }
  }, [book, settings]);
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-neutral-900 text-neutral-100';
      case 'sepia':
        return 'bg-amber-50 text-neutral-900';
      default:
        return 'bg-white text-neutral-900';
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        handlePrevPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]);
  
  // Simulate loading book content
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!book) {
        setBook(DUMMY_BOOKS[0]); // For demo purposes
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [book]);
  
  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Reader top bar */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link to={`/books/${id}`} className="flex items-center text-neutral-600 hover:text-primary-600">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="hidden md:inline">Back to book</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <h1 className="text-neutral-800 font-medium truncate max-w-[150px] md:max-w-xs">
            {book.title}
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 2) })}
            className="text-neutral-600 hover:text-neutral-900"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setSettings({ ...settings, fontSize: Math.min(24, settings.fontSize + 2) })}
            className="text-neutral-600 hover:text-neutral-900"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-neutral-600 hover:text-neutral-900"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Reader content */}
      <div className={`flex-grow overflow-auto ${getThemeClasses()}`}>
        <div
          className={`relative max-w-3xl mx-auto px-6 py-8 transition-all duration-200`}
          style={{
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight
          }}
        >
          {isSample && (
            <div className="bg-primary-100 text-primary-800 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2" />
                <p className="font-medium">You're reading a sample. Purchase the book to continue reading.</p>
              </div>
            </div>
          )}
          
          {/* Watermark with user email if not a sample */}
          {!isSample && user && (
            <div className="absolute top-2 right-2 text-neutral-300 text-xs rotate-45 opacity-30">
              {user.email}
            </div>
          )}
          
          <div ref={contentRef}>
            <h1 className="text-2xl font-bold mb-6">{book.title}</h1>
            <h2 className="text-xl mb-8">by {book.author}</h2>
            
            <div className="prose max-w-none">
              {/* Display a portion of the content based on current page */}
              {book.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Reader bottom bar */}
      <div className="bg-white border-t border-neutral-200 px-4 py-3 flex items-center justify-between">
        <button 
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className={`p-2 rounded-full ${
            currentPage === 0 
              ? 'text-neutral-300 cursor-not-allowed' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-sm text-neutral-600">
          Page {currentPage + 1} of {totalPages}
        </div>
        
        <button 
          onClick={handleNextPage}
          disabled={currentPage >= totalPages - 1}
          className={`p-2 rounded-full ${
            currentPage >= totalPages - 1
              ? 'text-neutral-300 cursor-not-allowed' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Settings panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="absolute right-0 inset-y-0 w-80 bg-white shadow-lg">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">Reader Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Font Size
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 1) })}
                    className="p-2 rounded-md bg-neutral-100 text-neutral-600"
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <div className="mx-3 text-center min-w-[40px]">
                    {settings.fontSize}px
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, fontSize: Math.min(24, settings.fontSize + 1) })}
                    className="p-2 rounded-md bg-neutral-100 text-neutral-600"
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Line Height
                </label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => setSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-sm text-neutral-600 mt-1 text-center">
                  {settings.lineHeight.toFixed(1)}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'light' })}
                    className={`flex items-center justify-center py-2 px-3 rounded border ${
                      settings.theme === 'light'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300'
                    }`}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                    className={`flex items-center justify-center py-2 px-3 rounded border ${
                      settings.theme === 'sepia'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300'
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, theme: 'dark' })}
                    className={`flex items-center justify-center py-2 px-3 rounded border ${
                      settings.theme === 'dark'
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300'
                    }`}
                  >
                    Dark
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderPage;