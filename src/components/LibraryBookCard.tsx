import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Headphones, 
  Download, 
  Play, 
  Volume2, 
  Eye, 
  FileText, 
  MoreHorizontal,
  Clock,
  Calendar
} from 'lucide-react';

interface LibraryBook {
  id: string;
  title: string;
  author: string;
  cover: string;
  progress: number;
  lastRead: string | null;
  type: 'ebook' | 'audio' | 'both';
  purchaseDate: string;
  status: 'reading' | 'completed' | 'unread';
  downloaded: boolean;
  totalPages?: number;
  currentPage?: number;
  totalDuration?: string;
  currentTime?: string;
  estimatedTimeLeft?: string;
  genre: string;
}

interface LibraryBookCardProps {
  book: LibraryBook;
  onAction?: (action: string, bookId: string) => void;
}

export const LibraryBookCard: React.FC<LibraryBookCardProps> = ({ book, onAction }) => {
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

  const formatLastRead = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-neutral-100 dark:border-neutral-700">
      <div className="flex items-start space-x-4">
        {/* Cover avec badges */}
        <div className="relative flex-shrink-0">
          <img
            src={book.cover}
            alt={book.title}
            className="w-20 h-28 object-cover rounded-lg shadow-sm"
          />
          <div className="absolute -top-1 -right-1 flex flex-col space-y-1">
            {book.type === 'ebook' || book.type === 'both' ? (
              <div className="bg-primary-500 text-white p-1 rounded shadow-sm">
                <BookOpen className="h-3 w-3" />
              </div>
            ) : null}
            {book.type === 'audio' || book.type === 'both' ? (
              <div className="bg-secondary-500 text-white p-1 rounded shadow-sm">
                <Headphones className="h-3 w-3" />
              </div>
            ) : null}
            {book.downloaded && (
              <div className="bg-green-500 text-white p-1 rounded shadow-sm">
                <Download className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-grow min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="min-w-0 flex-grow">
              <h3 className="font-semibold text-lg text-neutral-900 dark:text-white truncate">
                {book.title}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-2">
                par {book.author}
              </p>
              <div className="flex items-center space-x-3 mb-2">
                {getStatusBadge(book.status)}
                <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Acheté le {new Date(book.purchaseDate).toLocaleDateString()}
                </span>
                {book.lastRead && (
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    Lu {formatLastRead(book.lastRead)}
                  </span>
                )}
              </div>
              <span className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 text-xs rounded-full">
                {book.genre}
              </span>
            </div>
            <button 
              className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
              onClick={() => onAction?.('menu', book.id)}
            >
              <MoreHorizontal className="h-5 w-5 text-neutral-400" />
            </button>
          </div>

          {/* Barre de progression */}
          {book.progress > 0 && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-neutral-600 dark:text-neutral-400">Progression</span>
                <span className="font-medium text-neutral-900 dark:text-white">{book.progress}%</span>
              </div>
              <div className="w-full bg-neutral-200 dark:bg-neutral-600 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(book.progress)}`}
                  style={{ width: `${book.progress}%` }}
                ></div>
              </div>
              <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                <span>
                  {book.type === 'audio' 
                    ? `${book.currentTime} / ${book.totalDuration}`
                    : `Page ${book.currentPage} / ${book.totalPages}`
                  }
                </span>
                {book.estimatedTimeLeft && (
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {book.estimatedTimeLeft} restant
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center space-x-2 flex-wrap gap-2">
            {/* Action principale selon le statut */}
            {book.status === 'reading' && (
              <Link
                to={book.type === 'audio' ? `/audio/${book.id}` : `/reader/${book.id}`}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                {book.type === 'audio' ? (
                  <Volume2 className="h-4 w-4 mr-2" />
                ) : (
                  <BookOpen className="h-4 w-4 mr-2" />
                )}
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

            {/* Actions secondaires */}
            <button 
              className="flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm"
              onClick={() => onAction?.('notes', book.id)}
            >
              <FileText className="h-4 w-4 mr-2" />
              Notes
            </button>

            {!book.downloaded && (
              <button 
                className="flex items-center px-3 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-sm"
                onClick={() => onAction?.('download', book.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};