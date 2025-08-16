import React, { useState, useEffect } from 'react';
import { Users, BookOpen, Flag, BarChart2, TrendingUp, Shield, AlertTriangle, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data
const MOCK_ADMIN_DATA = {
  totalUsers: 15847,
  totalBooks: 2341,
  totalReports: 23,
  totalRevenue: 125678.90,
  monthlyGrowth: 12.5,
  activeUsers: 8934,
  pendingReports: 5,
  systemHealth: 99.9
};

const MOCK_RECENT_ACTIVITY = [
  { type: 'user', message: 'Nouvel utilisateur inscrit', time: '2 min', user: 'marie.dubois@email.com' },
  { type: 'book', message: 'Nouveau livre publié', time: '15 min', book: 'Guide de JavaScript' },
  { type: 'report', message: 'Nouveau signalement', time: '1h', severity: 'medium' },
  { type: 'sale', message: 'Pic de ventes détecté', time: '2h', amount: 1250 },
  { type: 'system', message: 'Maintenance programmée terminée', time: '4h' }
];

const MOCK_SYSTEM_STATUS = [
  { service: 'API Services', status: 'operational', uptime: '99.9%', color: 'green' },
  { service: 'Base de données', status: 'operational', uptime: '99.8%', color: 'green' },
  { service: 'Stockage fichiers', status: 'operational', uptime: '99.9%', color: 'green' },
  { service: 'Authentification', status: 'operational', uptime: '100%', color: 'green' },
  { service: 'Paiements', status: 'maintenance', uptime: '98.5%', color: 'yellow' }
];

const MOCK_TOP_BOOKS = [
  { title: 'The Art of Programming', sales: 324, revenue: 3237.76, author: 'Jane Smith' },
  { title: 'Web Development Mastery', sales: 298, revenue: 2980.50, author: 'John Doe' },
  { title: 'Business Strategy Guide', sales: 267, revenue: 2670.33, author: 'Mike Johnson' }
];

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data] = useState(MOCK_ADMIN_DATA);
  const [recentActivity] = useState(MOCK_RECENT_ACTIVITY);
  const [systemStatus] = useState(MOCK_SYSTEM_STATUS);
  const [topBooks] = useState(MOCK_TOP_BOOKS);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user': return <Users className="h-4 w-4 text-blue-500" />;
      case 'book': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'report': return <Flag className="h-4 w-4 text-red-500" />;
      case 'sale': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'system': return <Shield className="h-4 w-4 text-purple-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin 🛡️</h1>
          <p className="text-purple-100 text-lg mb-6">Bienvenue {user?.username}. Gérez votre plateforme en toute simplicité.</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/admin/users"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Gérer les utilisateurs
            </Link>
            <Link
              to="/admin/moderation"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center border border-white/20"
            >
              <Shield className="h-5 w-5 mr-2" />
              Modération
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Utilisateurs totaux</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalUsers.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+{data.monthlyGrowth}% ce mois</span>
              </div>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres publiés</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalBooks.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-green-600">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">156 ce mois</span>
              </div>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Signalements</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalReports}</h3>
              <div className="flex items-center mt-2 text-amber-600">
                <Flag className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">{data.pendingReports} en attente</span>
              </div>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400">
              <Flag className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Revenus totaux</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">${data.totalRevenue.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-green-600">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Commission plateforme</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
              <BarChart2 className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">État du système</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Surveillance en temps réel des services</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{data.systemHealth}%</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">Disponibilité</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemStatus.map((service, index) => (
            <div key={index} className={`p-4 rounded-xl border-2 ${
              service.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
              service.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
              'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-neutral-900 dark:text-white">{service.service}</h3>
                {getStatusIcon(service.status)}
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium capitalize ${
                  service.color === 'green' ? 'text-green-700 dark:text-green-400' :
                  service.color === 'yellow' ? 'text-yellow-700 dark:text-yellow-400' :
                  'text-red-700 dark:text-red-400'
                }`}>
                  {service.status === 'operational' ? 'Opérationnel' : 
                   service.status === 'maintenance' ? 'Maintenance' : 'Hors service'}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">{service.uptime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Activité récente</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 rounded-lg transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm text-neutral-900 dark:text-white">{activity.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">Il y a {activity.time}</p>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">+${activity.amount}</span>
                      )}
                      {activity.user && (
                        <span className="text-xs text-blue-600 dark:text-blue-400">{activity.user}</span>
                      )}
                      {activity.book && (
                        <span className="text-xs text-green-600 dark:text-green-400">"{activity.book}"</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performing Books */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Livres les plus vendus</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topBooks.map((book, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-600 dark:text-primary-400">#{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900 dark:text-white">{book.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">par {book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-neutral-900 dark:text-white">{book.sales} ventes</div>
                    <div className="text-sm text-green-600">${book.revenue.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"
          >
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Utilisateurs</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Gérer les comptes</p>
            </div>
          </Link>

          <Link
            to="/admin/moderation"
            className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group"
          >
            <Flag className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Modération</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Signalements</p>
            </div>
          </Link>

          <div className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
            <BarChart2 className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Analytics</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Sécurité</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Platform Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-800">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">📊 Insights de la plateforme</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{data.activeUsers.toLocaleString()}</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Utilisateurs actifs</div>
            <div className="text-xs text-green-600 mt-1">+8% vs semaine dernière</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.8⭐</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Note moyenne plateforme</div>
            <div className="text-xs text-green-600 mt-1">+0.2 vs mois dernier</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">92%</div>
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Taux de satisfaction</div>
            <div className="text-xs text-green-600 mt-1">+3% vs trimestre dernier</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;