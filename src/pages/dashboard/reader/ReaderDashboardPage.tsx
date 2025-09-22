// ReaderDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Target, Trophy, TrendingUp, Star, Play, Headphones, Search, Filter, MoreHorizontal, Bell, Settings, Users, FileText, Zap, Eye, Volume2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const ReaderDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<any>(null);
  const [libraryBooks, setBooks] = useState<any[]>([]);
  const [notifications, setNotif] = useState<any[]>([]);
  const [recommendations, setRec] = useState<any[]>([]);
  const [libraryFilter, setLibraryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const token = localStorage.getItem('token') ?? '';
  const base = 'http://localhost:5000';



const filteredBooks = libraryBooks.filter((book: any) => {
  const matchesFilter =
    libraryFilter === 'all' ||
    (libraryFilter === 'reading' && book.status === 'reading') ||
    (libraryFilter === 'completed' && book.status === 'completed') ||
    (libraryFilter === 'unread' && book.status === 'unread') ||
    (libraryFilter === 'audio' && (book.type === 'audio' || book.type === 'both')) ||
    (libraryFilter === 'ebook' && (book.type === 'ebook' || book.type === 'both'));

  const matchesSearch =
    book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchQuery.toLowerCase());

  return matchesFilter && matchesSearch;
});

  useEffect(() => {
    if (!token) { setIsLoading(false); return; }
    Promise.all([
      fetch(`${base}/api/reader/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`${base}/api/reader/library`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`${base}/api/reader/notifications`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`${base}/api/reader/recommendations`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status))
    ])
      .then(([dash, lib, notif, rec]) => { setData(dash); setBooks(lib); setNotif(notif); setRec(rec); })
      .catch(() => { setData({ stats: { books_read: 0, total_pages_read: 0, total_duration_min: 0 }, currentStreak: 0, badges: [] }); setBooks([]); setNotif([]); setRec([]); })
      .finally(() => setIsLoading(false));
  }, [token]);

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!data) return <div className="text-center py-12">Aucune donnée</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Bonjour, {user?.username} ! 📚</h1>
        <p className="text-primary-100 text-lg">Votre bibliothèque personnelle vous attend</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres lus</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.stats.books_read}</h3></div><div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400"><BookOpen className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Temps de lecture</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{Math.round((data.stats.total_duration_min || 0) / 60)}h</h3></div><div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400"><Clock className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Série de lecture</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.currentStreak}</h3></div><div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400"><Target className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Badges</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.badges.length}</h3></div><div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400"><Trophy className="h-6 w-6" /></div></div></div>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">🚀 Accès rapide</h2><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><Link to="/reader/1" className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group"><Play className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" /><div><h3 className="font-medium text-neutral-900 dark:text-white">Reprendre la lecture</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Continuez votre dernier livre</p></div><ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" /></Link><button onClick={() => setActiveTab('library')} className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group"><BookOpen className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" /><div><h3 className="font-medium text-neutral-900 dark:text-white">Ma Bibliothèque</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">{libraryBooks.length} livres</p></div><ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" /></button><Link to="/books" className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30 rounded-xl transition-colors group"><Zap className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" /><div><h3 className="font-medium text-neutral-900 dark:text-white">Découvrir</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Nouveaux livres</p></div><ChevronRight className="h-5 w-5 text-neutral-400 ml-auto group-hover:translate-x-1 transition-transform" /></Link></div></div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm overflow-hidden"><div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700"><h2 className="text-xl font-semibold text-neutral-900 dark:text-white">🎯 Recommandations personnalisées</h2></div><div className="p-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{recommendations.map((book: any) => (<div key={book.id} className="flex items-start space-x-4 p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"><img src={book.cover} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0" /><div className="flex-grow"><h3 className="font-semibold text-neutral-900 dark:text-white">{book.title}</h3><p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">par {book.author}</p><p className="text-xs text-primary-600 dark:text-primary-400 mb-2">Basé sur vos lectures</p><div className="flex items-center"><Star className="h-4 w-4 text-amber-400 fill-current mr-1" /><span className="text-sm font-medium">{Number(book.rating).toFixed(1)}</span></div></div></div>))}</div></div></div>

      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">📚 Ma Bibliothèque</h2><div className="relative mb-4"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-5 w-5" /><input type="text" placeholder="Rechercher..." className="pl-10 w-full rounded-lg border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{filteredBooks.map((book: any) => (<div key={book.id} className="p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"><div className="flex items-start space-x-4"><img src={book.cover} alt={book.title} className="w-16 h-20 object-cover rounded-lg shadow-sm flex-shrink-0" /><div className="flex-grow"><h3 className="font-semibold text-neutral-900 dark:text-white">{book.title}</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">par {book.author}</p><div className="mt-2">{book.status === 'reading' && <Link to={book.type === 'audio' ? `/audio/${book.id}` : `/reader/${book.id}`} className="inline-flex items-center px-3 py-1 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"><span>{book.type === 'audio' ? <Volume2 className="h-4 w-4 mr-1" /> : <BookOpen className="h-4 w-4 mr-1" />}Continuer</span></Link>}</div></div></div></div>))}</div></div>
    </div>
  );
};

export default ReaderDashboardPage;