// src/hooks/useReadingProgress.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  bookType: 'ebook' | 'audio' | 'both';
  
  // Progression ebook
  currentPage?: number;
  totalPages?: number;
  scrollPosition?: number;
  chapterIndex?: number;
  
  // Progression audio
  currentTime?: number; // en secondes
  totalDuration?: number;
  currentChapterIndex?: number;
  
  // Métadonnées communes
  progressPercentage: number;
  lastReadDate: string;
  readingTime: number; // temps total de lecture en minutes
  status: 'not-started' | 'reading' | 'completed' | 'abandoned';
  
  // Estimations
  estimatedTimeLeft?: number; // en minutes
  averageReadingSpeed?: number; // pages/min ou mots/min
  
  // Session tracking
  sessionCount: number;
  firstReadDate: string;
  completedDate?: string;
  
  // Notes et marque-pages
  bookmarks?: Bookmark[];
  notes?: Note[];
  lastKnownPosition?: string;
}

export interface Bookmark {
  id: string;
  progressId: string;
  position: number | string;
  title: string;
  note?: string;
  createdDate: string;
  type: 'manual' | 'auto-generated';
}

export interface Note {
  id: string;
  progressId: string;
  position: number | string;
  content: string;
  highlightedText?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface ReadingSession {
  id: string;
  progressId: string;
  startTime: string;
  endTime?: string;
  duration: number; // en minutes
  startPosition: number | string;
  endPosition: number | string;
  pagesRead?: number;
  device: string;
  userAgent: string;
}

export const useReadingProgress = (bookId: string, bookType: 'ebook' | 'audio') => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  
  // Auto-save interval
  const autoSaveInterval = useRef<NodeJS.Timeout>();
  const lastSavePosition = useRef<number>(0);
  const sessionStartTime = useRef<Date>();

  // Storage keys
  const getProgressKey = (userId: string, bookId: string) => `reading-progress-${userId}-${bookId}`;
  const getSessionsKey = (userId: string, bookId: string) => `reading-sessions-${userId}-${bookId}`;

  // Charger la progression depuis localStorage
  const loadProgress = useCallback(async () => {
    if (!user || !bookId) return;
    
    setIsLoading(true);
    try {
      const progressKey = getProgressKey(user.id, bookId);
      const stored = localStorage.getItem(progressKey);
      
      if (stored) {
        const progressData = JSON.parse(stored);
        setProgress(progressData);
      } else {
        // Créer nouvelle progression
        const newProgress: ReadingProgress = {
          id: `progress-${Date.now()}`,
          userId: user.id,
          bookId,
          bookType,
          progressPercentage: 0,
          lastReadDate: new Date().toISOString(),
          readingTime: 0,
          status: 'not-started',
          sessionCount: 0,
          firstReadDate: new Date().toISOString(),
          bookmarks: [],
          notes: []
        };
        
        setProgress(newProgress);
        localStorage.setItem(progressKey, JSON.stringify(newProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Créer une progression par défaut en cas d'erreur
      const fallbackProgress: ReadingProgress = {
        id: `progress-${Date.now()}`,
        userId: user.id,
        bookId,
        bookType,
        progressPercentage: 0,
        lastReadDate: new Date().toISOString(),
        readingTime: 0,
        status: 'not-started',
        sessionCount: 0,
        firstReadDate: new Date().toISOString(),
        bookmarks: [],
        notes: []
      };
      setProgress(fallbackProgress);
    } finally {
      setIsLoading(false);
    }
  }, [user, bookId, bookType]);

  // Démarrer une session de lecture
  const startReadingSession = useCallback((initialPosition: number | string) => {
    if (!progress || !user) return;

    const session: ReadingSession = {
      id: `session-${Date.now()}`,
      progressId: progress.id,
      startTime: new Date().toISOString(),
      duration: 0,
      startPosition: initialPosition,
      endPosition: initialPosition,
      device: navigator.platform,
      userAgent: navigator.userAgent
    };

    setCurrentSession(session);
    sessionStartTime.current = new Date();
    lastSavePosition.current = typeof initialPosition === 'number' ? initialPosition : 0;

    // Auto-save toutes les 30 secondes
    autoSaveInterval.current = setInterval(() => {
      updateProgress(lastSavePosition.current, { autoSave: true });
    }, 30000);

    console.log('Reading session started:', session.id);
  }, [progress, user]);

  // Mettre à jour la progression
  const updateProgress = useCallback(async (
    position: number | string, 
    options: { 
      autoSave?: boolean;
      totalPages?: number;
      totalDuration?: number;
      chapterIndex?: number;
      pagesRead?: number;
    } = {}
  ) => {
    if (!progress || !currentSession || !user) return;

    const now = new Date().toISOString();
    const positionNum = typeof position === 'number' ? position : 0;
    
    // Calculer le pourcentage de progression
    let progressPercentage = 0;
    if (bookType === 'ebook' && options.totalPages) {
      progressPercentage = Math.min((positionNum / options.totalPages) * 100, 100);
    } else if (bookType === 'audio' && options.totalDuration) {
      progressPercentage = Math.min((positionNum / options.totalDuration) * 100, 100);
    }

    // Calculer le temps de lecture actuel de la session
    const sessionDuration = sessionStartTime.current 
      ? Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 60000)
      : 0;

    // Calculer le temps de lecture estimé restant
    let estimatedTimeLeft: number | undefined;
    const totalReadingTime = progress.readingTime + sessionDuration;
    if (totalReadingTime > 0 && progressPercentage > 5) {
      const avgSpeed = progressPercentage / totalReadingTime;
      estimatedTimeLeft = Math.ceil((100 - progressPercentage) / avgSpeed);
    }

    // Déterminer le statut
    let status: ReadingProgress['status'] = 'reading';
    if (progressPercentage >= 100) {
      status = 'completed';
    } else if (progress.status === 'not-started') {
      status = 'reading';
    }

    const updatedProgress: ReadingProgress = {
      ...progress,
      ...(bookType === 'ebook' 
        ? {
            currentPage: positionNum,
            totalPages: options.totalPages || progress.totalPages,
            chapterIndex: options.chapterIndex
          }
        : {
            currentTime: positionNum,
            totalDuration: options.totalDuration || progress.totalDuration,
            currentChapterIndex: options.chapterIndex
          }
      ),
      progressPercentage,
      lastReadDate: now,
      estimatedTimeLeft,
      status,
      completedDate: status === 'completed' ? now : progress.completedDate
    };

    // Mettre à jour la session courante
    const updatedSession: ReadingSession = {
      ...currentSession,
      endTime: now,
      duration: sessionDuration,
      endPosition: position,
      pagesRead: options.pagesRead || currentSession.pagesRead
    };

    setProgress(updatedProgress);
    setCurrentSession(updatedSession);
    lastSavePosition.current = positionNum;

    // Sauvegarder en localStorage (seulement si pas auto-save ou si changement significatif)
    if (!options.autoSave || Math.abs(positionNum - lastSavePosition.current) > 1) {
      try {
        const progressKey = getProgressKey(user.id, bookId);
        localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
        
        // Sauvegarder aussi la session en cours
        const sessionsKey = getSessionsKey(user.id, bookId);
        const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
        const sessionIndex = sessions.findIndex((s: ReadingSession) => s.id === updatedSession.id);
        
        if (sessionIndex >= 0) {
          sessions[sessionIndex] = updatedSession;
        } else {
          sessions.push(updatedSession);
        }
        
        localStorage.setItem(sessionsKey, JSON.stringify(sessions));
      } catch (error) {
        console.error('Error saving progress:', error);
      }
    }
  }, [progress, currentSession, bookType, bookId, user]);

  // Terminer la session de lecture
  const endReadingSession = useCallback(async () => {
    if (!currentSession || !progress || !user) return;

    if (autoSaveInterval.current) {
      clearInterval(autoSaveInterval.current);
    }

    const now = new Date().toISOString();
    const sessionDuration = sessionStartTime.current
      ? Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 60000)
      : 0;

    const finalSession: ReadingSession = {
      ...currentSession,
      endTime: now,
      duration: sessionDuration
    };

    // Mettre à jour le temps total de lecture
    const updatedProgress: ReadingProgress = {
      ...progress,
      readingTime: progress.readingTime + sessionDuration,
      sessionCount: progress.sessionCount + 1,
      lastReadDate: now
    };

    try {
      // Sauvegarder la session finale
      const sessionsKey = getSessionsKey(user.id, bookId);
      const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      const sessionIndex = sessions.findIndex((s: ReadingSession) => s.id === finalSession.id);
      
      if (sessionIndex >= 0) {
        sessions[sessionIndex] = finalSession;
      } else {
        sessions.push(finalSession);
      }
      
      localStorage.setItem(sessionsKey, JSON.stringify(sessions));

      // Sauvegarder la progression mise à jour
      const progressKey = getProgressKey(user.id, bookId);
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error ending session:', error);
    }

    setCurrentSession(null);
    setProgress(updatedProgress);
    sessionStartTime.current = undefined;
    
    console.log('Reading session ended:', finalSession.id, `Duration: ${sessionDuration}min`);
  }, [currentSession, progress, user, bookId]);

  // Ajouter un marque-page
  const addBookmark = useCallback(async (position: number | string, title: string, note?: string) => {
    if (!progress || !user) return;

    const bookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      progressId: progress.id,
      position,
      title,
      note,
      createdDate: new Date().toISOString(),
      type: 'manual'
    };

    const updatedBookmarks = [...(progress.bookmarks || []), bookmark];
    const updatedProgress = { ...progress, bookmarks: updatedBookmarks };

    setProgress(updatedProgress);

    try {
      const progressKey = getProgressKey(user.id, bookId);
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error adding bookmark:', error);
    }

    return bookmark;
  }, [progress, user, bookId]);

  // Supprimer un marque-page
  const removeBookmark = useCallback(async (bookmarkId: string) => {
    if (!progress || !user) return;

    const updatedBookmarks = progress.bookmarks?.filter(b => b.id !== bookmarkId) || [];
    const updatedProgress = { ...progress, bookmarks: updatedBookmarks };

    setProgress(updatedProgress);

    try {
      const progressKey = getProgressKey(user.id, bookId);
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }, [progress, user, bookId]);

  // Ajouter une note
  const addNote = useCallback(async (
    position: number | string, 
    content: string, 
    highlightedText?: string
  ) => {
    if (!progress || !user) return;

    const note: Note = {
      id: `note-${Date.now()}`,
      progressId: progress.id,
      position,
      content,
      highlightedText,
      createdDate: new Date().toISOString()
    };

    const updatedNotes = [...(progress.notes || []), note];
    const updatedProgress = { ...progress, notes: updatedNotes };

    setProgress(updatedProgress);

    try {
      const progressKey = getProgressKey(user.id, bookId);
      localStorage.setItem(progressKey, JSON.stringify(updatedProgress));
    } catch (error) {
      console.error('Error adding note:', error);
    }

    return note;
  }, [progress, user, bookId]);

  // Calculer les statistiques de lecture
  const getReadingStats = useCallback(() => {
    if (!progress) return null;

    const currentSessionTime = sessionStartTime.current
      ? Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 60000)
      : 0;

    const stats = {
      totalReadingTime: progress.readingTime + currentSessionTime,
      averageSessionTime: progress.sessionCount > 0 ? progress.readingTime / progress.sessionCount : 0,
      progressPercentage: progress.progressPercentage,
      estimatedTimeLeft: progress.estimatedTimeLeft,
      isCompleted: progress.status === 'completed',
      daysSinceStart: Math.floor(
        (new Date().getTime() - new Date(progress.firstReadDate).getTime()) / (1000 * 60 * 60 * 24)
      ),
      bookmarksCount: progress.bookmarks?.length || 0,
      notesCount: progress.notes?.length || 0,
      currentSessionTime
    };

    return stats;
  }, [progress, sessionStartTime]);

  // Obtenir l'historique des sessions
  const getSessionHistory = useCallback(() => {
    if (!user) return [];

    try {
      const sessionsKey = getSessionsKey(user.id, bookId);
      const sessions = JSON.parse(localStorage.getItem(sessionsKey) || '[]');
      return sessions.sort((a: ReadingSession, b: ReadingSession) => 
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      );
    } catch (error) {
      console.error('Error loading session history:', error);
      return [];
    }
  }, [user, bookId]);

  // Charger la progression au montage
  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  // Nettoyer à la fermeture
  useEffect(() => {
    return () => {
      if (autoSaveInterval.current) {
        clearInterval(autoSaveInterval.current);
      }
      // Note: Ne pas terminer automatiquement la session ici car cela pourrait
      // causer des problèmes lors de la navigation. Laisser les composants
      // gérer explicitement la fin de session.
    };
  }, []);

  // Sauvegarder automatiquement lors de la fermeture de la page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession) {
        // Tentative de sauvegarde rapide synchrone
        endReadingSession();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentSession, endReadingSession]);

  return {
    progress,
    isLoading,
    currentSession,
    startReadingSession,
    updateProgress,
    endReadingSession,
    addBookmark,
    removeBookmark,
    addNote,
    getReadingStats,
    getSessionHistory,
    reload: loadProgress
  };
};