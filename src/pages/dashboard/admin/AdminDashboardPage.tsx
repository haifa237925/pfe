import React from 'react';
import { Users, BookOpen, Flag, BarChart2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">1,234</h3>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>12% increase this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Books</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">567</h3>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>8% increase this month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Reports</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">23</h3>
            </div>
            <div className="p-3 bg-accent-100 rounded-full text-accent-600">
              <Flag className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-amber-500 flex items-center">
            <Flag className="h-3 w-3 mr-1" />
            <span>5 need review</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Revenue</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">$45.2k</h3>
            </div>
            <div className="p-3 bg-neutral-100 rounded-full text-neutral-600">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-2 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>15% increase this month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">User Management</h2>
          <div className="space-y-4">
            <Link
              to="/admin/users"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Manage Users</h3>
                  <p className="text-sm text-neutral-600">View and manage user accounts</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/moderation"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <Flag className="h-5 w-5 text-accent-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Content Moderation</h3>
                  <p className="text-sm text-neutral-600">Review reported content</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-l-2 border-primary-500 pl-4">
              <p className="text-sm text-neutral-600">New user registration</p>
              <p className="text-xs text-neutral-500">2 minutes ago</p>
            </div>
            <div className="border-l-2 border-secondary-500 pl-4">
              <p className="text-sm text-neutral-600">New book uploaded</p>
              <p className="text-xs text-neutral-500">15 minutes ago</p>
            </div>
            <div className="border-l-2 border-accent-500 pl-4">
              <p className="text-sm text-neutral-600">Content reported</p>
              <p className="text-xs text-neutral-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">System Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-medium text-green-700">API Services</h3>
            </div>
            <p className="text-sm text-green-600 mt-1">All systems operational</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-medium text-green-700">Storage Services</h3>
            </div>
            <p className="text-sm text-green-600 mt-1">Running normally</p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
              <h3 className="font-medium text-green-700">Authentication</h3>
            </div>
            <p className="text-sm text-green-600 mt-1">Functioning properly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;