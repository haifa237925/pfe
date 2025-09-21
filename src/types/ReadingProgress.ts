// src/types/ReadingProgress.ts
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