import React from 'react';
import { Book, Clock, BookOpen, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReaderDashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Reader Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Books Read</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0</h3>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Reading Time</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0h</h3>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Library</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0</h3>
            </div>
            <div className="p-3 bg-accent-100 rounded-full text-accent-600">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Reviews</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0</h3>
            </div>
            <div className="p-3 bg-neutral-100 rounded-full text-neutral-600">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Current Reads */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Currently Reading</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-neutral-500">
            <BookOpen className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p className="mb-4">You haven't started reading any books yet.</p>
            <Link
              to="/books"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse our catalog
            </Link>
          </div>
        </div>
      </div>

      {/* Reading History */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Recent Activity</h2>
        </div>
        <div className="p-6">
          <div className="text-center py-8 text-neutral-500">
            <Clock className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p>No reading activity yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboardPage;