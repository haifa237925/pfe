import React from 'react';
import { Users, BookOpen, Flag, BarChart2, TrendingUp, DollarSign, AlertTriangle, CheckCircle, Clock, Eye, Download, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  // Mock data pour les statistiques
  const stats = {
    totalUsers: 1234,
    totalBooks: 567,
    totalRevenue: 45200,
    pendingReports: 23,
    activeReaders: 892,
    newUsersToday: 45,
    booksPublishedToday: 12,
    revenueToday: 1250
  };

  const recentActivity = [
    { type: 'user', message: 'Nouvel utilisateur inscrit', time: '2 min', status: 'success' },
    { type: 'book', message: 'Nouveau livre publié', time: '15 min', status: 'info' },
    { type: 'report', message: 'Contenu signalé', time: '1h', status: 'warning' },
    { type: 'purchase', message: 'Nouvelle vente', time: '2h', status: 'success' },
    { type: 'user', message: 'Compte suspendu', time: '3h', status: 'error' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Admin Dashboard</h1>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalUsers.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-primary-100 rounded-full text-primary-600">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{stats.newUsersToday} aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Total Books</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{stats.totalBooks.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-secondary-100 rounded-full text-secondary-600">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{stats.booksPublishedToday} aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Revenus</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">${stats.totalRevenue.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-green-100 rounded-full text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-green-500 flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+${stats.revenueToday} aujourd'hui</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Signalements</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{stats.pendingReports}</h3>
            </div>
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-red-500 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            <span>5 urgents</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 text-sm font-medium">Lecteurs Actifs</p>
              <h3 className="text-3xl font-bold text-neutral-900 mt-1">{stats.activeReaders}</h3>
            </div>
            <div className="p-3 bg-purple-100 rounded-full text-purple-600">
              <Eye className="h-6 w-6" />
            </div>
          </div>
          <div className="mt-3 text-xs text-purple-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            <span>En ligne maintenant</span>
          </div>
        </div>
      </div>

      {/* Actions rapides et gestion */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Gestion des Utilisateurs</h2>
          <div className="space-y-4">
            <Link
              to="/admin/users"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Gérer les Utilisateurs</h3>
                  <p className="text-sm text-neutral-600">Voir et gérer les comptes utilisateurs</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/moderation"
              className="block p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Modération</h3>
                  <p className="text-sm text-neutral-600">Examiner le contenu signalé</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Activité Récente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className={`border-l-2 pl-4 ${
                activity.status === 'success' ? 'border-green-500' :
                activity.status === 'warning' ? 'border-amber-500' :
                activity.status === 'error' ? 'border-red-500' :
                'border-blue-500'
              }`}>
                <p className="text-sm text-neutral-600">{activity.message}</p>
                <p className="text-xs text-neutral-500">Il y a {activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Actions Rapides</h2>
          <div className="space-y-4">
            <button className="w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left">
              <div className="flex items-center">
                <Download className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Exporter les Données</h3>
                  <p className="text-sm text-neutral-600">Télécharger les rapports</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left">
              <div className="flex items-center">
                <Settings className="h-5 w-5 text-neutral-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Paramètres Système</h3>
                  <p className="text-sm text-neutral-600">Configuration de la plateforme</p>
                </div>
              </div>
            </button>

            <button className="w-full p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-left">
              <div className="flex items-center">
                <BarChart2 className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900">Rapports Avancés</h3>
                  <p className="text-sm text-neutral-600">Analytics détaillées</p>
                </div>
              </div>
            </button>
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