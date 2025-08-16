import React, { useState, useEffect } from 'react';
import { Book, Clock, BookOpen, Star, TrendingUp, Target, Award, Calendar, ChevronRight, Play, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

// Mock data pour la démo
const MOCK_READING_DATA = {
  booksRead: 12,
  readingTime: 45, // heures
  currentStreak: 7, // jours
  totalBooks: 156,
  averageRating: 4.3,
  monthlyGoal: 5,
  monthlyProgress: 3
};

const MOCK_CURRENT_READS = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 65,
    lastRead: '2024-01-15',
    type: 'ebook'
  },
  {
    id: '2',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 23,
    lastRead: '2024-01-14',
    type: 'audio'
  }
];

const MOCK_RECENT_ACTIVITY = [
  { action: 'Finished reading', book: 'The Adventure Begins', time: '2 hours ago', type: 'completed' },
  { action: 'Started reading', book: 'History of Science', time: '1 day ago', type: 'started' },
  { action: 'Added to wishlist', book: 'Cooking Masterclass', time: '2 days ago', type: 'wishlist' },
  { action: 'Rated 5 stars', book: 'Meditation for Beginners', time: '3 days ago', type: 'rating' }
];

const ReaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data] = useState(MOCK_READING_DATA);
  const [currentReads] = useState(MOCK_CURRENT_READS);
  const [recentActivity] = useState(MOCK_RECENT_ACTIVITY);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed': return <Award className="h-4 w-4 text-green-500" />;
      case 'started': return <Play className="h-4 w-4 text-blue-500" />;
      case 'wishlist': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'rating': return <Star className="h-4 w-4 text-amber-500" />;
      default: return <BookOpen className="h-4 w-4 text-neutral-500" />;
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
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.username} ! 👋</h1>
          <p className="text-primary-100 text-lg mb-6">Prêt pour une nouvelle aventure littéraire ?</p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/books"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Découvrir des livres
            </Link>
            <Link
              to="/dashboard/wishlist"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center border border-white/20"
            >
              <Star className="h-5 w-5 mr-2" />
              Ma liste de souhaits
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres lus</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.booksRead}</h3>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+3 ce mois</span>
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
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Temps de lecture</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.readingTime}h</h3>
              <div className="flex items-center mt-2 text-blue-600">
                <Clock className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">12h cette semaine</span>
              </div>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Série de lecture</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.currentStreak}</h3>
              <div className="flex items-center mt-2 text-orange-600">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">jours consécutifs</span>
              </div>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400">
              <Target className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Note moyenne</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.averageRating}</h3>
              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(data.averageRating)
                        ? 'text-amber-400 fill-current'
                        : 'text-neutral-300 dark:text-neutral-600'
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Goal */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Objectif mensuel</h2>
            <p className="text-neutral-600 dark:text-neutral-400">
              {data.monthlyProgress} sur {data.monthlyGoal} livres ce mois
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round((data.monthlyProgress / data.monthlyGoal) * 100)}%
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">complété</div>
          </div>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(data.monthlyProgress / data.monthlyGoal) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Currently Reading */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Lectures en cours</h2>
          </div>
          <div className="p-6">
            {currentReads.length > 0 ? (
              <div className="space-y-4">
                {currentReads.map((book) => (
                  <div key={book.id} className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <div className="relative flex-shrink-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1">
                        {book.type === 'ebook' ? (
                          <div className="bg-primary-500 text-white p-1 rounded-full">
                            <BookOpen className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="bg-secondary-500 text-white p-1 rounded-full">
                            <Headphones className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-semibold text-neutral-900 dark:text-white truncate">{book.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">par {book.author}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex-grow mr-4">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-neutral-600 dark:text-neutral-400">Progression</span>
                            <span className="font-medium text-neutral-900 dark:text-white">{book.progress}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(book.progress)}`}
                              style={{ width: `${book.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        <Link
                          to={book.type === 'ebook' ? `/reader/${book.id}` : `/audio/${book.id}`}
                          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center"
                        >
                          Continuer
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 mx-auto mb-3 text-neutral-400 dark:text-neutral-500" />
                <p className="text-neutral-500 dark:text-neutral-400 mb-4">Aucune lecture en cours</p>
                <Link
                  to="/books"
                  className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  Découvrir des livres
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            )}
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
                    <p className="text-sm text-neutral-900 dark:text-white">
                      <span className="font-medium">{activity.action}</span>{' '}
                      <span className="text-primary-600 dark:text-primary-400">"{activity.book}"</span>
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <Link
                to="/dashboard/history"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
              >
                Voir tout l'historique
                <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/books"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"
          >
            <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Parcourir</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Nouveaux livres</p>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard/wishlist"
            className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group"
          >
            <Star className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Ma liste</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Livres sauvés</p>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/dashboard/history"
            className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-xl transition-colors group"
          >
            <Calendar className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Historique</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Mes lectures</p>
            </div>
            <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>

          <div className="flex items-center p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl">
            <Award className="h-8 w-8 text-neutral-600 dark:text-neutral-400 mr-3" />
            <div>
              <h3 className="font-medium text-neutral-900 dark:text-white">Badges</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReaderDashboardPage;