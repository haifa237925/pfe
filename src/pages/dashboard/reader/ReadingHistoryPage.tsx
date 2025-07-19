import React from 'react';
import { Book, Clock, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReadingHistoryPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Reading History</h1>

      {/* Reading Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Reading Time</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0h</h3>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Books Completed</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0</h3>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Reading Streak</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">0 days</h3>
            </div>
            <div className="p-3 bg-accent-100 rounded-full text-accent-600">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Reading History List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-neutral-200">
          <h2 className="text-lg font-semibold text-neutral-900">Reading History</h2>
        </div>

        <div className="divide-y divide-neutral-200">
          {/* Empty state */}
          <div className="p-6 text-center">
            <Book className="h-12 w-12 mx-auto mb-3 text-neutral-400" />
            <p className="text-neutral-500 mb-4">Your reading history will appear here</p>
            <Link
              to="/books"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse books
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadingHistoryPage;