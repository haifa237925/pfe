import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, BookOpen, DollarSign, Download, Calendar, Filter } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data pour les analytics
  const analytics = {
    revenue: {
      current: 45200,
      previous: 38900,
      growth: 16.2,
      data: [3200, 3800, 4100, 3900, 4500, 4800, 5200]
    },
    users: {
      current: 1234,
      previous: 1089,
      growth: 13.3,
      data: [980, 1020, 1080, 1120, 1180, 1220, 1234]
    },
    books: {
      current: 567,
      previous: 523,
      growth: 8.4,
      data: [480, 495, 510, 525, 540, 555, 567]
    },
    sales: {
      current: 2847,
      previous: 2456,
      growth: 15.9,
      data: [2100, 2200, 2350, 2400, 2600, 2750, 2847]
    }
  };

  const topBooks = [
    { title: 'The Art of Programming', sales: 124, revenue: 1237.76 },
    { title: 'Business Strategy', sales: 89, revenue: 890.11 },
    { title: 'Advanced Data Structures', sales: 76, revenue: 760.00 },
    { title: 'Web Development Guide', sales: 65, revenue: 650.00 },
    { title: 'Machine Learning Basics', sales: 54, revenue: 540.00 }
  ];

  const topAuthors = [
    { name: 'Jane Smith', books: 3, sales: 245, revenue: 2450.00 },
    { name: 'John Doe', books: 2, sales: 189, revenue: 1890.00 },
    { name: 'Michael Johnson', books: 1, sales: 124, revenue: 1240.00 },
    { name: 'Sarah Wilson', books: 2, sales: 98, revenue: 980.00 },
    { name: 'David Brown', books: 1, sales: 87, revenue: 870.00 }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Analytics Dashboard</h1>
        
        <div className="flex space-x-4">
          <select
            className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
          
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </button>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Revenus</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                ${analytics.revenue.current.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{analytics.revenue.growth}% vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Utilisateurs</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.users.current.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{analytics.users.growth}% vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Livres</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.books.current.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{analytics.books.growth}% vs période précédente</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Ventes</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">
                {analytics.sales.current.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-amber-100 rounded-full text-amber-600">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{analytics.sales.growth}% vs période précédente</span>
          </div>
        </div>
      </div>

      {/* Graphique principal */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Tendances</h2>
          <div className="flex space-x-2">
            {Object.keys(analytics).map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedMetric === metric
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {metric === 'revenue' ? 'Revenus' :
                 metric === 'users' ? 'Utilisateurs' :
                 metric === 'books' ? 'Livres' : 'Ventes'}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-64 flex items-center justify-center bg-neutral-50 rounded-lg">
          <div className="text-center">
            <BarChart2 className="h-12 w-12 text-neutral-400 mx-auto mb-2" />
            <p className="text-neutral-500">Graphique des tendances pour {selectedMetric}</p>
            <p className="text-sm text-neutral-400 mt-1">
              Données simulées pour la démonstration
            </p>
          </div>
        </div>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Livres</h2>
          <div className="space-y-4">
            {topBooks.map((book, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-neutral-900">{book.title}</h3>
                  <p className="text-sm text-neutral-600">{book.sales} ventes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">${book.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Top Auteurs</h2>
          <div className="space-y-4">
            {topAuthors.map((author, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-neutral-900">{author.name}</h3>
                  <p className="text-sm text-neutral-600">{author.books} livres • {author.sales} ventes</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-neutral-900">${author.revenue.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;