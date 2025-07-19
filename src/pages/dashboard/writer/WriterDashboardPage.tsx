import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, BookOpen, DollarSign, Users, Upload, TrendingUp, ArrowRight, Star } from 'lucide-react';

// Mock data
const authorBooks = [
  {
    id: '1',
    title: 'The Art of Programming',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    sales: 124,
    revenue: 1237.76,
    rating: 4.5,
    published: '2023-05-15',
  },
  {
    id: '2',
    title: 'Advanced Data Structures',
    cover: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=600',
    sales: 89,
    revenue: 890.11,
    rating: 4.2,
    published: '2023-02-20',
  },
];

const WriterDashboardPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate data loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 md:mb-0">Writer Dashboard</h1>
        <Link
          to="/writer/upload"
          className="inline-flex items-center justify-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload New Book
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-sm font-medium">Total Books</p>
                  <h3 className="text-3xl font-bold text-neutral-900 mt-1">2</h3>
                </div>
                <div className="p-3 bg-primary-100 rounded-full text-primary-600">
                  <BookOpen className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>2 published this year</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-sm font-medium">Total Sales</p>
                  <h3 className="text-3xl font-bold text-neutral-900 mt-1">213</h3>
                </div>
                <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
                  <BarChart2 className="h-6 w-6" />
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
                  <p className="text-neutral-500 text-sm font-medium">Revenue</p>
                  <h3 className="text-3xl font-bold text-neutral-900 mt-1">$2,127.87</h3>
                </div>
                <div className="p-3 bg-accent-100 rounded-full text-accent-600">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>18% increase this month</span>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-neutral-500 text-sm font-medium">Readers</p>
                  <h3 className="text-3xl font-bold text-neutral-900 mt-1">156</h3>
                </div>
                <div className="p-3 bg-neutral-100 rounded-full text-neutral-600">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-2 text-xs text-green-500 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>8 new readers this week</span>
              </div>
            </div>
          </div>
          
          {/* Books table */}
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-neutral-900">Your Books</h2>
              <Link to="/writer/stats" className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center">
                Detailed Statistics
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full divide-y divide-neutral-200">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                      Published
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-200">
                  {authorBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded">
                            <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-900">{book.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {book.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        ${book.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-amber-400 fill-current" />
                          <span className="ml-1">{book.rating}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                        {new Date(book.published).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {authorBooks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-neutral-500">You haven't published any books yet.</p>
                <Link
                  to="/writer/upload"
                  className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Upload your first book
                </Link>
              </div>
            )}
          </div>
          
          {/* Quick tips section */}
          <div className="bg-primary-50 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-3">Tips for Successful Book Sales</h2>
            <ul className="space-y-3">
              <li className="flex">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-neutral-700">Upload high-quality book covers to attract more readers</span>
              </li>
              <li className="flex">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-neutral-700">Provide detailed descriptions with keywords for better discoverability</span>
              </li>
              <li className="flex">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-neutral-700">Consider offering both e-book and audio versions for wider audience reach</span>
              </li>
              <li className="flex">
                <span className="text-primary-600 mr-2">•</span>
                <span className="text-neutral-700">Review sales statistics regularly to understand reader preferences</span>
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default WriterDashboardPage;