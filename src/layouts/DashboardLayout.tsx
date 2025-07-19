import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
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
          { to: '/admin', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
          { to: '/admin/users', label: 'User Management', icon: <Users className="h-5 w-5" /> },
          { to: '/admin/moderation', label: 'Content Moderation', icon: <Shield className="h-5 w-5" /> },
        ];
      default: // reader
        return [
          { to: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="h-5 w-5" /> },
          { to: '/dashboard/history', label: 'Reading History', icon: <History className="h-5 w-5" /> },
          { to: '/books', label: 'Book Catalog', icon: <Book className="h-5 w-5" /> },
        ];
    }
  };

  const navItems = getNavItems();
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col md:flex-row">
      {/* Mobile header */}
      <div className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-neutral-500 mr-4"
          >
            {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <Link to="/" className="flex items-center">
            <BookOpen className="h-7 w-7 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-neutral-900">LectureVerse</span>
          </Link>
        </div>
        <div className="relative group">
          <button className="flex items-center space-x-1 text-neutral-700">
            <User className="h-5 w-5" />
            <ChevronDown className="h-4 w-4" />
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
            <Link to="/" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50">Home</Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-primary-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar */}
      <div className={`md:w-64 bg-white shadow-md md:flex md:flex-col transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'fixed inset-0 z-20 overflow-auto' : 'hidden'
      } md:relative md:block`}>
        <div className="p-5 border-b border-neutral-200 hidden md:block">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-7 w-7 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-neutral-900">LectureVerse</span>
          </Link>
        </div>
        
        {/* User info */}
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-3">
              <p className="font-medium text-neutral-900">{user.name}</p>
              <p className="text-sm text-neutral-500 capitalize">{user.role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="py-5 flex-grow">
          <nav className="px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center px-3 py-3 rounded-md ${
                  location.pathname === item.to
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-neutral-600 hover:bg-neutral-100'
                } transition duration-150`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Logout */}
        <div className="p-5 border-t border-neutral-200">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-3 text-neutral-600 hover:bg-neutral-100 rounded-md transition duration-150"
          >
            <LogOut className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-grow md:ml-64">
        <div className="p-5 hidden md:flex items-center justify-between bg-white shadow-sm">
          <h1 className="text-xl font-semibold text-neutral-900">
            {navItems.find(item => item.to === location.pathname)?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-neutral-600 hover:text-primary-600">
              <span className="text-sm">Home</span>
            </Link>
            <button 
              onClick={handleLogout}
              className="text-neutral-600 hover:text-primary-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <main className="p-6">
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

export default DashboardLayout;