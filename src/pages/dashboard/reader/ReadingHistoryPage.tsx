import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Book, 
  Clock, 
  Calendar, 
  ChevronRight, 
  Star,
  TrendingUp,
  Filter,
  Search,
  BookOpen,
  Headphones,
  Trophy,
  Target
} from 'lucide-react';

// Types
interface ReadingSession {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  bookCover: string;
  bookType: 'ebook' | 'audio' | 'both';
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  pagesRead?: number;
  currentPage?: number;
  totalPages?: number;
  status: 'completed' | 'in-progress' | 'abandoned';
  rating?: number;
  notes?: string;
  genre: string;
}

interface ReadingStats {
  totalReadingTime: number; // en minutes
  booksCompleted: number;
  currentStreak: number; // jours consécutifs
  longestStreak: number;
  averageRating: number;
  favoriteGenre: string;
  totalBooks: number;
  pagesRead: number;
  monthlyGoal: number;
  monthlyProgress: number;
}

// Mock data - À remplacer par des appels API
const MOCK_READING_SESSIONS: ReadingSession[] = [
  {
    id: '1',
    bookId: '1',
    bookTitle: 'The Art of Programming',
    bookAuthor: 'Jane Smith',
    bookCover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=300',
    bookType: 'ebook',
    startTime: '2024-01-15T09:00:00',
    endTime: '2024-01-15T10:30:00',
    duration: 90,
    pagesRead: 25,
    currentPage: 125,
    totalPages: 300,
    status: 'in-progress',
    rating: 5,
    genre: 'Programming'
  },
  {
    id: '2',
    bookId: '2',
    bookTitle: 'Business Strategy',
    bookAuthor: 'Michael Johnson',
    bookCover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=300',
    bookType: 'audio',
    startTime: '2024-01-14T14:00:00',
    endTime: '2024-01-14T15:45:00',
    duration: 105,
    status: 'completed',
    rating: 4,
    notes: 'Excellent livre sur la stratégie d\'entreprise',
    genre: 'Business'
  },
  {
    id: '3',
    bookId: '3',
    bookTitle: 'The Adventure Begins',
    bookAuthor: 'John Doe',
    bookCover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=300',
    bookType: 'ebook',
    startTime: '2024-01-13T20:00:00',
    endTime: '2024-01-13T22:15:00',
    duration: 135,
    pagesRead: 280,
    currentPage: 280,
    totalPages: 280,
    status: 'completed',
    rating: 5,
    genre: 'Fantasy'
  }
];

const MOCK_STATS: ReadingStats = {
  totalReadingTime: 1250, // environ 20h
  booksCompleted: 8,
  currentStreak: 5,
  longestStreak: 12,
  averageRating: 4.2,
  favoriteGenre: 'Programming',
  totalBooks: 12,
  pagesRead: 1456,
  monthlyGoal: 5,
  monthlyProgress: 3
};

const ReadingHistoryPage: React.FC = () => {
  const [sessions] = useState<ReadingSession[]>(MOCK_READING_SESSIONS);
  const [stats] = useState<ReadingStats>(MOCK_STATS);
  const [filter, setFilter] = useState<'all' | 'completed' | 'in-progress'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'duration' | 'rating'>('date');

  // Filtrer et trier les sessions
  const filteredSessions = sessions
    .filter(session => {
      const matchesFilter = filter === 'all' || session.status === filter;
      const matchesSearch = session.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.bookAuthor.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
        case 'duration':
          return b.duration - a.duration;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Formatters
  const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: ReadingSession['status']) => {
    const styles = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'abandoned': 'bg-red-100 text-red-800'
    };
    const labels = {
      'completed': 'Terminé',
      'in-progress': 'En cours',
      'abandoned': 'Abandonné'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex">
        {Array.from({ length: 5 }, (_, i) => (
          <Star 
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-amber-400 fill-current' : 'text-neutral-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Historique de lecture
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Suivez vos progrès et retrouvez vos sessions de lecture
        </p>
      </div>

      {/* Reading Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Temps total</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {formatTime(stats.totalReadingTime)}
              </h3>
              <div className="flex items-center mt-2 text-blue-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">+2h cette semaine</span>
              </div>
            </div>
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400">
              <Clock className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres terminés</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.booksCompleted}
              </h3>
              <div className="flex items-center mt-2 text-green-600">
                <Trophy className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Objectif: {stats.monthlyGoal}/mois</span>
              </div>
            </div>
            <div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400">
              <Book className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Série actuelle</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.currentStreak} jours
              </h3>
              <div className="flex items-center mt-2 text-orange-600">
                <Target className="h-4 w-4 mr-1" />
                <span className="text-sm font-medium">Record: {stats.longestStreak} jours</span>
              </div>
            </div>
            <div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Note moyenne</p>
              <h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">
                {stats.averageRating.toFixed(1)}
              </h3>
              <div className="flex items-center mt-2">
                {renderStars(Math.round(stats.averageRating))}
              </div>
            </div>
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400">
              <Star className="h-6 w-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search */}
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher un livre..."
              className="pl-10 w-full rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-neutral-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
              >
                <option value="all">Tous les statuts</option>
                <option value="completed">Terminés</option>
                <option value="in-progress">En cours</option>
              </select>
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white text-sm"
            >
              <option value="date">Trier par date</option>
              <option value="duration">Trier par durée</option>
              <option value="rating">Trier par note</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reading History List */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            Sessions de lecture ({filteredSessions.length})
          </h2>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-12 text-center">
            <Book className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              {searchTerm ? 'Aucun résultat trouvé' : 'Aucun historique de lecture'}
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Commencez à lire pour voir votre historique ici'}
            </p>
            {!searchTerm && (
              <Link
                to="/books"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Parcourir les livres
                <ChevronRight className="h-4 w-4 ml-2" />
              </Link>
            )}
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {filteredSessions.map((session) => (
              <div key={session.id} className="p-6 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors">
                <div className="flex items-start space-x-4">
                  {/* Book Cover */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={session.bookCover}
                      alt={session.bookTitle}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div className="absolute -top-1 -right-1">
                      {session.bookType === 'ebook' || session.bookType === 'both' ? (
                        <div className="bg-primary-500 text-white p-1 rounded">
                          <BookOpen className="h-3 w-3" />
                        </div>
                      ) : (
                        <div className="bg-secondary-500 text-white p-1 rounded">
                          <Headphones className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900 dark:text-white truncate">
                          {session.bookTitle}
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-400">par {session.bookAuthor}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(session.status)}
                        {session.rating && renderStars(session.rating)}
                      </div>
                    </div>

                    {/* Session Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">Date</p>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {formatDate(session.startTime)}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">Durée</p>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {formatTime(session.duration)}
                        </p>
                      </div>
                      <div className="text-sm">
                        <p className="text-neutral-500 dark:text-neutral-400">Progrès</p>
                        <p className="font-medium text-neutral-900 dark:text-white">
                          {session.pagesRead 
                            ? `${session.pagesRead} pages` 
                            : session.status === 'completed' 
                              ? 'Terminé' 
                              : 'En cours'
                          }
                        </p>
                      </div>
                    </div>

                    {/* Notes */}
                    {session.notes && (
                      <div className="mb-3">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                          "{session.notes}"
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Link
                        to={session.bookType === 'audio' ? `/audio/${session.bookId}` : `/reader/${session.bookId}`}
                        className="inline-flex items-center px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors text-sm"
                      >
                        {session.status === 'completed' ? 'Relire' : 'Continuer'}
                      </Link>
                      
                      <Link
                        to={`/books/${session.bookId}`}
                        className="inline-flex items-center px-3 py-1 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 transition-colors text-sm"
                      >
                        Voir détails
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadingHistoryPage;