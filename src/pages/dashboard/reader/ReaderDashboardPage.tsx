import React, { useState, useEffect } from 'react';
import { 
  Book, 
  Clock, 
  BookOpen, 
  Star, 
  TrendingUp, 
  Target, 
  Award, 
  Calendar, 
  ChevronRight, 
  Play, 
  Headphones,

  Filter,
  Search,
  MoreHorizontal,
  Bell,
  Settings,
  Users,
  Bookmark,
  FileText,
  Heart,
  Zap,
  Trophy,
  Eye,
  Volume2,
  Pause,
  SkipForward
} from 'lucide-react';
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
  monthlyProgress: 3,
  weeklyReadingTime: 12,
  favoriteGenre: 'Science Fiction',
  badges: ['Lecteur assidu', 'Explorateur', 'Critique']
};

const MOCK_LIBRARY_BOOKS = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 65,
    lastRead: '2024-01-15',
    type: 'ebook',
    purchaseDate: '2024-01-10',
    status: 'reading',
   
    totalPages: 320,
    currentPage: 208,
    estimatedTimeLeft: '2h 30min',
    genre: 'Programming'
  },
  {
    id: '2',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 23,
    lastRead: '2024-01-14',
    type: 'audio',
    purchaseDate: '2024-01-12',
    status: 'reading',
   
    totalDuration: '8h 45min',
    currentTime: '2h 1min',
    estimatedTimeLeft: '6h 44min',
    genre: 'Business'
  },
  {
    id: '3',
    title: 'The Adventure Begins',
    author: 'John Doe',
    cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 100,
    lastRead: '2024-01-13',
    type: 'ebook',
    purchaseDate: '2024-01-08',
    status: 'completed',
 
    totalPages: 280,
    currentPage: 280,
    genre: 'Fantasy'
  },
  {
    id: '4',
    title: 'History of Science',
    author: 'Sarah Wilson',
    cover: 'https://images.pexels.com/photos/2873669/pexels-photo-2873669.jpeg?auto=compress&cs=tinysrgb&w=300',
    progress: 0,
    lastRead: null,
    type: 'both',
    purchaseDate: '2024-01-16',
    status: 'unread',
   
    totalPages: 450,
    genre: 'Science'
  }
];

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'author', message: 'Jane Smith a publié un nouveau livre', time: '2h', read: false },
  { id: '2', type: 'promotion', message: 'Promotion -30% sur vos livres en attente', time: '1 jour', read: false },
  { id: '3', type: 'achievement', message: 'Badge "Lecteur assidu" débloqué !', time: '2 jours', read: true }
];

const MOCK_RECOMMENDATIONS = [
  {
    id: '5',
    title: 'Advanced Programming Concepts',
    author: 'Tech Expert',
    cover: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=300',
    reason: 'Basé sur "The Art of Programming"',
    rating: 4.7
  },
  {
    id: '6',
    title: 'Leadership in Tech',
    author: 'Business Guru',
    cover: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=300',
    reason: 'Populaire dans Business',
    rating: 4.5
  }
];

const ReaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [data] = useState(MOCK_READING_DATA);
  const [libraryBooks] = useState(MOCK_LIBRARY_BOOKS);
  const [notifications] = useState(MOCK_NOTIFICATIONS);
  const [recommendations] = useState(MOCK_RECOMMENDATIONS);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'reading':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">En cours</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Terminé</span>;
      case 'unread':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Non lu</span>;
      default:
        return null;
    }
  };

  const filteredBooks = libraryBooks.filter(book => {
    const matchesFilter = libraryFilter === 'all' || 
                         (libraryFilter === 'reading' && book.status === 'reading') ||
                         (libraryFilter === 'completed' && book.status === 'completed') ||
                         (libraryFilter === 'unread' && book.status === 'unread') ||
                         (libraryFilter === 'audio' && (book.type === 'audio' || book.type === 'both')) ||
                         (libraryFilter === 'ebook' && (book.type === 'ebook' || book.type === 'both'));
    
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header avec navigation par onglets */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.username} ! 📚</h1>
              <p className="text-primary-100 text-lg">Votre bibliothèque personnelle vous attend</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-white cursor-pointer hover:text-primary-200" />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </div>
              <Settings className="h-6 w-6 text-white cursor-pointer hover:text-primary-200" />
            </div>
          </div>
          
          {/* Navigation par onglets */}
          <div className="flex space-x-1 bg-white/10 rounded-xl p-1">
            {[
              { id: 'overview', label: 'Vue d\'ensemble', icon: <Target className="h-4 w-4" /> },
              { id: 'library', label: 'Ma Bibliothèque', icon: <BookOpen className="h-4 w-4" /> },
              { id: 'stats', label: 'Statistiques', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'notes', label: 'Notes', icon: <FileText className="h-4 w-4" /> },
              { id: 'community', label: 'Communauté', icon: <Users className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.icon}
                <span className="ml-2 hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu selon l'onglet actif */}
      {activeTab === 'overview' && (
        <>
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
                    <span className="text-sm font-medium">{data.weeklyReadingTime}h cette semaine</span>
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
                  <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Badges</p>
                  <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.badges.length}</h3>
                  <div className="flex items-center mt-2">
                    <Trophy className="h-4 w-4 mr-1 text-amber-500" />
                    <span className="text-sm font-medium text-amber-600">Derniers obtenus</span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
                  <Award className="h-6 w-6" />
                </div>
              </div>
            </div>
          </div>

          {/* Accès rapide */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">🚀 Accès rapide</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/reader/1"
                className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"
              >
                <Play className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">Reprendre la lecture</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">The Art of Programming</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setActiveTab('library')}
                className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group"
              >
                <BookOpen className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">Ma Bibliothèque</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{libraryBooks.length} livres</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/books"
                className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-xl transition-colors group"
              >
                <Zap className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" />
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white">Découvrir</h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">Nouveaux livres</p>
                </div>
                <ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Recommandations */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">🎯 Recommandations personnalisées</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((book) => (
                  <div key={book.id} className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-neutral-900 dark:text-white">{book.title}</h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">par {book.author}</p>
                      <p className="text-xs text-primary-600 dark:text-primary-400 mb-2">{book.reason}</p>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-400 fill-current mr-1" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'library' && (
        <>
          {/* Filtres et recherche */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher dans ma bibliothèque..."
                  className="pl-10 w-full rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                {[
                  { id: 'all', label: 'Tous', count: libraryBooks.length },
                  { id: 'reading', label: 'En cours', count: libraryBooks.filter(b => b.status === 'reading').length },
                  { id: 'completed', label: 'Terminés', count: libraryBooks.filter(b => b.status === 'completed').length },
                  { id: 'unread', label: 'Non lus', count: libraryBooks.filter(b => b.status === 'unread').length },
                  { id: 'audio', label: 'Audio', count: libraryBooks.filter(b => b.type === 'audio' || b.type === 'both').length },
                  { id: 'ebook', label: 'eBooks', count: libraryBooks.filter(b => b.type === 'ebook' || b.type === 'both').length }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setLibraryFilter(filter.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      libraryFilter === filter.id
                        ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
                    }`}
                  >
                    {filter.label} ({filter.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bibliothèque */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">📚 Ma Bibliothèque</h2>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">{filteredBooks.length} livre(s) trouvé(s)</p>
            </div>
            
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredBooks.map((book) => (
                <div key={book.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-sm"
                      />
                      <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
                        {book.type === 'ebook' || book.type === 'both' ? (
                          <div className="bg-primary-500 text-white p-1 rounded">
                            <BookOpen className="h-3 w-3" />
                          </div>
                        ) : null}
                        {book.type === 'audio' || book.type === 'both' ? (
                          <div className="bg-secondary-500 text-white p-1 rounded">
                            <Headphones className="h-3 w-3" />
                          </div>
                        ) : null}
                      
                      </div>
                    </div>

                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 dark:text-white">{book.title}</h3>
                          <p className="text-neutral-600 dark:text-neutral-400">par {book.author}</p>
                          <div className="flex items-center mt-1 space-x-2">
                            {getStatusBadge(book.status)}
                            <span className="text-xs text-neutral-500">
                              Acheté le {new Date(book.purchaseDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-600 rounded-lg">
                          <MoreHorizontal className="h-5 w-5 text-neutral-400" />
                        </button>
                      </div>

                      {/* Progression */}
                      {book.progress > 0 && (
                        <div className="mb-3">
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
                          <div className="flex items-center justify-between text-xs text-neutral-500 mt-1">
                            <span>
                              {book.type === 'audio' ? book.currentTime : `Page ${book.currentPage}/${book.totalPages}`}
                            </span>
                            {book.estimatedTimeLeft && (
                              <span>Temps restant: {book.estimatedTimeLeft}</span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-3">
                        {book.status === 'reading' && (
                          <Link
                            to={book.type === 'audio' ? `/audio/${book.id}` : `/reader/${book.id}`}
                            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                          >
                            {book.type === 'audio' ? <Volume2 className="h-4 w-4 mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                            Continuer
                          </Link>
                        )}
                        
                        {book.status === 'unread' && (
                          <Link
                            to={book.type === 'audio' ? `/audio/${book.id}` : `/reader/${book.id}`}
                            className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm font-medium"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Commencer
                          </Link>
                        )}

                        {book.status === 'completed' && (
                          <Link
                            to={book.type === 'audio' ? `/audio/${book.id}` : `/reader/${book.id}`}
                            className="flex items-center px-4 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Relire
                          </Link>
                        )}

                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="p-12 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">Aucun livre trouvé</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  {searchQuery ? 'Essayez avec d\'autres mots-clés' : 'Votre bibliothèque est vide'}
                </p>
                <Link
                  to="/books"
                  className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Découvrir des livres
                </Link>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-8">
          {/* Statistiques détaillées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">📊 Cette semaine</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Temps de lecture</span>
                  <span className="font-medium">{data.weeklyReadingTime}h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Pages lues</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600 dark:text-neutral-400">Livres terminés</span>
                  <span className="font-medium">1</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">🎯 Objectifs</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Livres ce mois</span>
                    <span>{data.monthlyProgress}/{data.monthlyGoal}</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full"
                      style={{ width: `${(data.monthlyProgress / data.monthlyGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Temps quotidien</span>
                    <span>1.2h/2h</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">🏆 Badges</h3>
              <div className="grid grid-cols-2 gap-3">
                {data.badges.map((badge, index) => (
                  <div key={index} className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                    <Trophy className="h-5 w-5 text-amber-500 mr-2" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Genres préférés */}
          <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">📚 Genres préférés</h3>
            <div className="space-y-3">
              {[
                { genre: 'Science Fiction', count: 8, percentage: 40 },
                { genre: 'Programming', count: 5, percentage: 25 },
                { genre: 'Business', count: 4, percentage: 20 },
                { genre: 'Fantasy', count: 3, percentage: 15 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-primary-500 rounded mr-3"></div>
                    <span className="font-medium">{item.genre}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-neutral-600 dark:text-neutral-400 w-8">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notes' && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">📝 Mes Notes & Annotations</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Fonctionnalité en développement. Bientôt vous pourrez :
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• Prendre des notes privées par livre</li>
              <li>• Surligner des passages importants</li>
              <li>• Créer des résumés personnels</li>
              <li>• Exporter vos notes (PDF/CSV)</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'community' && (
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">🗣️ Communauté</h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Fonctionnalité en développement. Bientôt vous pourrez :
            </p>
            <ul className="text-left max-w-md mx-auto space-y-2 text-neutral-600 dark:text-neutral-400">
              <li>• Suivre vos auteurs préférés</li>
              <li>• Participer aux discussions</li>
              <li>• Rejoindre des événements virtuels</li>
              <li>• Partager vos avis et recommandations</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReaderDashboardPage;