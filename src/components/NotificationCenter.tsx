import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  User, 
  Tag, 
  Award, 
  BookOpen, 
  MessageCircle,
  Calendar,
  Check,
  Trash2
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'author' | 'promotion' | 'achievement' | 'forum' | 'event' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    authorName?: string;
    bookTitle?: string;
    discount?: number;
    badgeName?: string;
  };
}

interface NotificationCenterProps {
  notifications: Notification[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'author':
        return <User className="h-5 w-5 text-blue-500" />;
      case 'promotion':
        return <Tag className="h-5 w-5 text-green-500" />;
      case 'achievement':
        return <Award className="h-5 w-5 text-amber-500" />;
      case 'forum':
        return <MessageCircle className="h-5 w-5 text-purple-500" />;
      case 'event':
        return <Calendar className="h-5 w-5 text-indigo-500" />;
      default:
        return <Bell className="h-5 w-5 text-neutral-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => 
    filter === 'all' || (filter === 'unread' && !notification.read)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-neutral-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center">
            <Bell className="h-6 w-6 text-primary-600 mr-2" />
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
              >
                Toutes ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300'
                }`}
              >
                Non lues ({unreadCount})
              </button>
            </div>
          </div>

          <div className="flex space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="flex items-center px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Check className="h-4 w-4 mr-1" />
                Tout marquer lu
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="flex items-center px-3 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Tout supprimer
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <Bell className="h-12 w-12 text-neutral-300 mb-3" />
              <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
                {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                {filter === 'unread' 
                  ? 'Toutes vos notifications ont été lues'
                  : 'Vous recevrez ici vos notifications importantes'
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read 
                              ? 'text-neutral-900 dark:text-white' 
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className={`text-sm mt-1 ${
                            !notification.read
                              ? 'text-neutral-600 dark:text-neutral-400'
                              : 'text-neutral-500 dark:text-neutral-500'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                            {notification.time}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={() => onMarkAsRead(notification.id)}
                              className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                              title="Marquer comme lu"
                            >
                              <Check className="h-4 w-4 text-neutral-500" />
                            </button>
                          )}
                          <button
                            onClick={() => onDelete(notification.id)}
                            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-600 rounded transition-colors"
                            title="Supprimer"
                          >
                            <X className="h-4 w-4 text-neutral-500" />
                          </button>
                        </div>
                      </div>

                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {notification.metadata.authorName && (
                            <span className="inline-flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                              <User className="h-3 w-3 mr-1" />
                              {notification.metadata.authorName}
                            </span>
                          )}
                          {notification.metadata.bookTitle && (
                            <span className="inline-flex items-center px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                              <BookOpen className="h-3 w-3 mr-1" />
                              {notification.metadata.bookTitle}
                            </span>
                          )}
                          {notification.metadata.discount && (
                            <span className="inline-flex items-center px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-xs rounded-full">
                              <Tag className="h-3 w-3 mr-1" />
                              -{notification.metadata.discount}%
                            </span>
                          )}
                          {notification.metadata.badgeName && (
                            <span className="inline-flex items-center px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-xs rounded-full">
                              <Award className="h-3 w-3 mr-1" />
                              {notification.metadata.badgeName}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Action Button */}
                      {notification.actionUrl && (
                        <button className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium">
                          Voir plus →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};