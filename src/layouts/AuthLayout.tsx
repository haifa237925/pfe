import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">
      <div className="py-6 px-4">
        <Link to="/" className="flex items-center">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <span className="ml-2 text-xl font-bold text-neutral-900">LectureVerse</span>
        </Link>
      </div>
      
      <div className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Outlet />
        </div>
      </div>
      
      <footer className="py-4 text-center text-neutral-500 text-sm">
        <p>&copy; {new Date().getFullYear()} LectureVerse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AuthLayout;