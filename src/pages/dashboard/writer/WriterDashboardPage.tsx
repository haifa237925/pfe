import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  BookOpen, 
  DollarSign, 
  Users, 
  Upload, 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Eye,
  Download,
  MessageCircle,
  Calendar,
  Target,
  Award
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data
const MOCK_WRITER_DATA = {
  totalBooks: 8,
  totalSales: 1247,
  totalRevenue: 15678.50,
  totalReaders: 892,
  monthlyRevenue: 2340.75,
  monthlyGrowth: 18.5,
  averageRating: 4.6,
  totalReviews: 234
};

const MOCK_AUTHOR_BOOKS = [
  {
    id: '1',
    title: 'The Art of Programming',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    sales: 324,
    revenue: 3237.76,
    rating: 4.8,
    reviews: 67,
    published: '2023-05-15',
    views: 1250,
    downloads: 298
  },
  {
    id: '2',
    title: 'Advanced Data Structures',
    cover: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
    sales: 189,
    revenue: 1890.11,
    rating: 4.5,
    reviews: 43,
    published: '2023-02-20',
    views: 890,
    downloads: 167
  },
  {
    id: '3',
    title: 'Web Development Mastery',
    cover: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
    sales: 456,
    revenue: 5467.89,
    rating: 4.7,
    reviews: 89,
    published: '2023-08-10',
    views: 1890,
    downloads: 423
  }
];

const MOCK_RECENT_ACTIVITY = [
  { type: 'sale', message: 'Nouvelle vente de "The Art of Programming"', time: '5 min', amount: 9.99 },
  { type: 'review', message: 'Nouvel avis 5⭐ sur "Web Development Mastery"', time: '2h', rating: 5 },
  { type: 'milestone', message: 'Félicitations ! 1000 ventes atteintes', time: '1 jour' },
  { type: 'sale', message: 'Nouvelle vente de "Advanced Data Structures"', time: '3h', amount: 12.99 }
];

const WriterDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data] = useState(MOCK_WRITER_DATA);
  const [books] = useState(MOCK_AUTHOR_BOOKS);
  const [recentActivity] = useState(MOCK_RECENT_ACTIVITY);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'review': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'milestone': return <Award className="h-4 w-4 text-purple-500" />;
      default: return <BookOpen className="h-4 w-4 text-blue-500" />;
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
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.username} ! ✍️</h1>
          <p className="text-indigo-100 text-lg mb-6">Votre espace créatif vous attend. Prêt à inspirer vos lecteurs ?</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/writer/upload"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
            >
              <Upload className="h-5 w-5 mr-2" />
              Publier un livre
            </Link>
            <Link
              to="/writer/stats"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center border border-white/20"
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Voir les statistiques
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres publiés</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalBooks}</h3>
              <div className="flex items-center mt-2 text-blue-600">
                <BookOpen className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">2 ce mois</span>
              </div>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Ventes totales</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalSales.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+{data.monthlyGrowth}% ce mois</span>
              </div>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400">
              <BarChart2 className="h-6 w-6" />
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
                <span className="text-sm font-medium">${data.monthlyRevenue.toLocaleString()} ce mois</span>
              </div>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Lecteurs</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalReaders.toLocaleString()}</h3>
              <div className="flex items-center mt-2 text-purple-600">
                <Users className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Note: {data.averageRating}⭐</span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Performance ce mois</h2>
            <p className="text-neutral-600 dark:text-neutral-400">Évolution de vos ventes et revenus</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">+{data.monthlyGrowth}%</div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">vs mois dernier</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-600">${data.monthlyRevenue.toLocaleString()}</div>
            <div className="text-sm text-green-700 dark:text-green-400">Revenus mensuels</div>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{Math.round(data.monthlyRevenue / 12)}</div>
            <div className="text-sm text-blue-700 dark:text-blue-400">Ventes ce mois</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{data.totalReviews}</div>
            <div className="text-sm text-purple-700 dark:text-purple-400">Avis reçus</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Books */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Mes livres</h2>
              <Link to="/writer/stats" className="text-primary-600 hover:text-primary-700 text-sm font-medium inline-flex items-center">
                Voir tout
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {books.slice(0, 3).map((book) => (
                <div key={book.id} className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                  />
                  <div className="flex-grow min-w-0">
                    <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{book.title}</h3>
                    <div className="flex items-center mt-1 mb-2">
                      <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">{book.rating}</span>
                      <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">({book.reviews} avis)</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-green-600">
                        <DollarSign className="h-3 w-3 mr-1" />
                        ${book.revenue.toLocaleString()}
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Eye className="h-3 w-3 mr-1" />
                        {book.views}
                      </div>
                      <div className="flex items-center text-purple-600">
                        <Download className="h-3 w-3 mr-1" />
                        {book.downloads}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

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
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">{activity.time}</p>
                      {activity.amount && (
                        <span className="text-sm font-medium text-green-600">+${activity.amount}</span>
                      )}
                      {activity.rating && (
                        <div className="flex items-center">
                          {[...Array(activity.rating)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 text-amber-400 fill-current" />
                          ))}
                        </div>
                      )}
                    </div>
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
            to="/writer/upload"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"
          >
            <Upload className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Publier</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Nouveau livre</p>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/writer/stats"
            className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group"
          >
            <BarChart2 className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Statistiques</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Analyses détaillées</p>
            </div>
            <ArrowRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl">
            <MessageCircle className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Messages</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <Target className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Objectifs</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">💡 Conseils pour augmenter vos ventes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              <strong>Couvertures attrayantes :</strong> Une belle couverture peut augmenter vos ventes de 30%
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              <strong>Descriptions détaillées :</strong> Utilisez des mots-clés pour améliorer la découvrabilité
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              <strong>Formats multiples :</strong> Proposez e-book ET audiobook pour toucher plus de lecteurs
            </p>
          </div>
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              <strong>Échantillons gratuits :</strong> Les extraits augmentent les conversions de 25%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriterDashboardPage;