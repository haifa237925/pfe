import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Settings, 
  X, 
  Headphones
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedReader } from '../components/DynamicWatermark';
import { useReadingProgress } from '../hooks/useReadingProgress';

const DUMMY_BOOKS = [
  {
    id: '3',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Example audio URL
    chapters: [
      { title: 'Introduction', start: 0 },
      { title: 'Chapter 1: Market Analysis', start: 30 },
      { title: 'Chapter 2: Competitive Advantage', start: 60 },
      { title: 'Chapter 3: Strategic Planning', start: 90 },
      { title: 'Chapter 4: Implementation', start: 120 },
      { title: 'Conclusion', start: 150 }
    ]
  }
];

interface AudioPlayerSettings {
  playbackRate: number;
  volume: number;
  autoNextChapter: boolean;
}

const AudioPlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isSample = searchParams.get('sample') === 'true';
  
  const [book, setBook] = useState(DUMMY_BOOKS.find(b => b.id === id));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [settings, setSettings] = useState<AudioPlayerSettings>({
    playbackRate: 1,
    volume: 0.7,
    autoNextChapter: true
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Utilisation du hook useReadingProgress pour l'audio
  const {
    progress: audioProgress,
    isLoading: progressLoading,
    currentSession: audioSession,
    startReadingSession: startAudioSession,
    updateProgress: updateAudioProgress,
    endReadingSession: endAudioSession
  } = useReadingProgress(id || '', 'audio');
  
  // Handle play/pause
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime = parseFloat(e.target.value);
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Sauvegarder la progression après un seek
      if (audioProgress && !isSample) {
        updateAudioProgress(newTime, { 
          totalDuration: duration,
          chapterIndex: currentChapter 
        });
      }
    }
  };
  
  // Update time display
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      
      // Sauvegarder la progression
      if (audioProgress && !isSample) {
        updateAudioProgress(time, { 
          totalDuration: duration,
          chapterIndex: currentChapter 
        });
      }
      
      // Update current chapter based on time
      if (book?.chapters) {
        for (let i = book.chapters.length - 1; i >= 0; i--) {
          if (audioRef.current.currentTime >= book.chapters[i].start) {
            setCurrentChapter(i);
            break;
          }
        }
      }
    }
  }, [audioProgress, updateAudioProgress, isSample, duration, currentChapter, book?.chapters]);
  
  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setSettings({ ...settings, volume: newVolume });
  };
  
  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };
  
  // Change playback rate
  const changePlaybackRate = (rate: number) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    setSettings({ ...settings, playbackRate: rate });
  };
  
  // Skip forward/backward
  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = audioRef.current.currentTime + seconds;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      
      // Sauvegarder la progression après un skip
      if (audioProgress && !isSample) {
        updateAudioProgress(newTime, { 
          totalDuration: duration,
          chapterIndex: currentChapter 
        });
      }
    }
  };
  
  // Jump to chapter
  const jumpToChapter = (index: number) => {
    if (audioRef.current && book?.chapters?.[index]) {
      const chapterStart = book.chapters[index].start;
      audioRef.current.currentTime = chapterStart;
      setCurrentTime(chapterStart);
      setCurrentChapter(index);
      
      // Sauvegarder la progression après un saut de chapitre
      if (audioProgress && !isSample) {
        updateAudioProgress(chapterStart, { 
          totalDuration: duration,
          chapterIndex: index 
        });
      }
    }
  };
  
  // Handle audio duration loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Démarrer la session audio
  useEffect(() => {
    if (audioProgress && !audioSession && !isSample) {
      const initialTime = audioProgress.currentTime || 0;
      setCurrentTime(initialTime);
      if (audioRef.current) {
        audioRef.current.currentTime = initialTime;
      }
      startAudioSession(initialTime);
    }
    
    return () => {
      if (audioSession) {
        endAudioSession();
      }
    };
  }, [audioProgress, startAudioSession, endAudioSession, audioSession, isSample]);
  
  // Apply settings when they change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = settings.playbackRate;
      audioRef.current.volume = settings.volume;
    }
  }, [settings]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Simulate loading book content
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!book) {
        setBook(DUMMY_BOOKS[0]); // For demo purposes
      }
    }, 800);
    
    return () => clearTimeout(timer);
  }, [book]);
  
  if (!book || progressLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <ProtectedReader 
      bookId={id || 'unknown'} 
      watermarkConfig={{
        opacity: isSample ? 0.06 : 0.04,
        frequency: isSample ? 5 : 3,
        position: 'diagonal',
        includeTimestamp: true,
        includeBookId: true
      }}
    >
      <div className="flex flex-col h-screen">
        {/* Audio player header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            <Link to={`/books/${id}`} className="flex items-center text-neutral-600 dark:text-neutral-400 hover:text-primary-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              <span className="hidden md:inline">Retour au livre</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <h1 className="text-neutral-800 dark:text-neutral-200 font-medium truncate max-w-[150px] md:max-w-xs">
              {book.title}
            </h1>
          </div>
          
          <button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
        
        {/* Sample notification */}
        {isSample && (
          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-4 py-3 border-b border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-center">
              <Headphones className="h-5 w-5 mr-2" />
              <p className="font-medium">Aperçu audio gratuit - Achetez le livre pour écouter l'audiobook complet</p>
            </div>
          </div>
        )}
        
        {/* Main audio player content */}
        <div className="flex-grow overflow-auto bg-neutral-50 dark:bg-neutral-900">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar with cover and chapters */}
              <div className="lg:w-1/3">
                {/* Book Cover */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm mb-6">
                  <div className="aspect-w-3 aspect-h-4 p-4">
                    <img 
                      src={book.cover} 
                      alt={`Couverture de ${book.title}`} 
                      className="w-full h-64 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  
                  <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1">
                      {book.title}
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                      par {book.author}
                    </p>
                    
                    {/* License info - plus discret mais visible */}
                    {!isSample && user && (
                      <div className="bg-neutral-50 dark:bg-neutral-700/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
                          <span className="font-medium">Licence audio :</span><br />
                          {user.email}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Chapters List */}
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
                    <h3 className="font-medium text-neutral-900 dark:text-white flex items-center">
                      <Headphones className="h-4 w-4 mr-2" />
                      Chapitres
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {book.chapters?.map((chapter, index) => (
                        <li key={index}>
                          <button
                            onClick={() => jumpToChapter(index)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                              currentChapter === index
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border-r-2 border-primary-600'
                                : 'hover:bg-neutral-50 dark:hover:bg-neutral-700/50 text-neutral-700 dark:text-neutral-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium truncate">{chapter.title}</span>
                              <span className="text-xs text-neutral-500 ml-2 flex-shrink-0">
                                {formatTime(chapter.start)}
                              </span>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* Main Player */}
              <div className="lg:w-2/3">
                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
                  {/* Now Playing Header */}
                  <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                    <div className="flex items-center">
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                          En écoute
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {book.chapters?.[currentChapter]?.title || 'Lecture en cours'}
                        </p>
                      </div>
                      {isPlaying && (
                        <div className="flex items-center text-primary-600 dark:text-primary-400">
                          <div className="w-2 h-2 bg-current rounded-full animate-pulse mr-1"></div>
                          <span className="text-sm font-medium">LECTURE</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Audio Controls */}
                  <div className="p-6">
                    <audio
                      ref={audioRef}
                      src={book.audioUrl}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleLoadedMetadata}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />
                    
                    {/* Progress Section */}
                    <div className="mb-8">
                      <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max={duration || 100}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                      
                      <div className="flex justify-between text-xs text-neutral-400 mt-1">
                        <span>Début</span>
                        <span>{Math.round(((currentTime / duration) * 100) || 0)}% écouté</span>
                        <span>Fin</span>
                      </div>
                    </div>
                    
                    {/* Main Controls */}
                    <div className="flex items-center justify-center space-x-6 mb-8">
                      <button
                        onClick={() => skipTime(-30)}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors"
                        title="Reculer 30s"
                      >
                        <SkipBack className="h-6 w-6" />
                      </button>
                      
                      <button
                        onClick={() => skipTime(-10)}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors text-sm font-medium"
                        title="Reculer 10s"
                      >
                        -10s
                      </button>
                      
                      <button
                        onClick={togglePlayPause}
                        className="p-4 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
                      >
                        {isPlaying ? (
                          <Pause className="h-8 w-8" />
                        ) : (
                          <Play className="h-8 w-8 ml-1" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => skipTime(10)}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors text-sm font-medium"
                        title="Avancer 10s"
                      >
                        +10s
                      </button>
                      
                      <button
                        onClick={() => skipTime(30)}
                        className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-400 transition-colors"
                        title="Avancer 30s"
                      >
                        <SkipForward className="h-6 w-6" />
                      </button>
                    </div>
                    
                    {/* Secondary Controls */}
                    <div className="space-y-6">
                      {/* Volume Control */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Volume
                          </label>
                          <span className="text-sm text-neutral-500">
                            {Math.round(settings.volume * 100)}%
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={toggleMute}
                            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                          >
                            {settings.volume === 0 ? (
                              <VolumeX className="h-5 w-5" />
                            ) : (
                              <Volume2 className="h-5 w-5" />
                            )}
                          </button>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={settings.volume}
                            onChange={handleVolumeChange}
                            className="flex-grow h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
                      
                      {/* Playback Speed */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Vitesse de lecture
                          </label>
                          <span className="text-sm text-neutral-500">
                            {settings.playbackRate}x
                          </span>
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                            <button
                              key={rate}
                              onClick={() => changePlaybackRate(rate)}
                              className={`py-2 px-1 rounded-lg text-sm font-medium transition-colors ${
                                settings.playbackRate === rate
                                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 border border-primary-300 dark:border-primary-600'
                                  : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
                              }`}
                            >
                              {rate}x
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Settings Panel */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="absolute right-0 inset-y-0 w-80 bg-white dark:bg-neutral-800 shadow-lg">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
                  Paramètres audio
                </h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Lecture automatique du chapitre suivant
                  </label>
                  <div className="flex items-center">
                    <button
                      onClick={() => setSettings({ ...settings, autoNextChapter: true })}
                      className={`flex-1 py-2 px-3 rounded-l-lg border transition-colors ${
                        settings.autoNextChapter
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Activée
                    </button>
                    <button
                      onClick={() => setSettings({ ...settings, autoNextChapter: false })}
                      className={`flex-1 py-2 px-3 rounded-r-lg border border-l-0 transition-colors ${
                        !settings.autoNextChapter
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      Désactivée
                    </button>
                  </div>
                </div>
                
                {/* Protection Info */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <Headphones className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-xs text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Protection DRM Audio</p>
                        <p>Cet audiobook est protégé par un système de filigrane numérique pour prévenir la distribution non autorisée.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedReader>
  );
};

export default AudioPlayerPage;