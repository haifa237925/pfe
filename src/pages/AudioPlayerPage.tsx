import React, { useState, useRef, useEffect } from 'react';
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
    }
  };
  
  // Update time display
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      
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
  };
  
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
      audioRef.current.currentTime += seconds;
    }
  };
  
  // Jump to chapter
  const jumpToChapter = (index: number) => {
    if (audioRef.current && book?.chapters?.[index]) {
      audioRef.current.currentTime = book.chapters[index].start;
      setCurrentChapter(index);
    }
  };
  
  // Handle audio duration loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
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
  
  if (!book) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen">
      {/* Audio player header */}
      <div className="bg-white border-b border-neutral-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <Link to={`/books/${id}`} className="flex items-center text-neutral-600 hover:text-primary-600">
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="hidden md:inline">Back to book</span>
          </Link>
        </div>
        
        <div className="flex items-center">
          <h1 className="text-neutral-800 font-medium truncate max-w-[150px] md:max-w-xs">
            {book.title}
          </h1>
        </div>
        
        <button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          className="text-neutral-600 hover:text-neutral-900"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
      
      {/* Main audio player content */}
      <div className="flex-grow overflow-auto bg-neutral-50">
        <div className="max-w-3xl mx-auto px-4 py-8">
          {isSample && (
            <div className="bg-primary-100 text-primary-800 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <Headphones className="h-5 w-5 mr-2" />
                <p className="font-medium">You're listening to a sample. Purchase the book to listen to the full audiobook.</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <div className="rounded-lg overflow-hidden shadow-md mb-6 aspect-w-2 aspect-h-3 bg-white p-2">
                <img 
                  src={book.cover} 
                  alt={`${book.title} cover`} 
                  className="w-full h-auto object-cover rounded"
                />
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-5 mb-6">
                <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
                <p className="text-neutral-600 mb-4">by {book.author}</p>
                
                {/* Watermark with user email if not a sample */}
                {!isSample && user && (
                  <div className="text-neutral-300 text-xs mb-4 text-center">
                    Licensed to: {user.email}
                  </div>
                )}
                
                <div className="border-t border-neutral-200 pt-4">
                  <h3 className="font-medium mb-3">Chapters</h3>
                  <div className="max-h-60 overflow-y-auto">
                    <ul className="space-y-2">
                      {book.chapters?.map((chapter, index) => (
                        <li key={index}>
                          <button
                            onClick={() => jumpToChapter(index)}
                            className={`w-full text-left px-3 py-2 rounded text-sm ${
                              currentChapter === index
                                ? 'bg-primary-50 text-primary-700'
                                : 'hover:bg-neutral-100'
                            }`}
                          >
                            {chapter.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-semibold mb-6">
                  {book.chapters?.[currentChapter]?.title || 'Playing'}
                </h2>
                
                <div className="bg-neutral-50 rounded-lg p-4 mb-8">
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
                  
                  {/* Progress bar */}
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max={duration || 100}
                      value={currentTime}
                      onChange={handleSeek}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-neutral-500 mb-4">
                    <span>{formatTime(currentTime)}</span>
                    <span>-{formatTime(duration - currentTime)}</span>
                  </div>
                  
                  {/* Player controls */}
                  <div className="flex items-center justify-center space-x-6">
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600"
                    >
                      <SkipBack className="h-6 w-6" />
                    </button>
                    
                    <button
                      onClick={togglePlayPause}
                      className="p-4 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
                    >
                      {isPlaying ? (
                        <Pause className="h-8 w-8" />
                      ) : (
                        <Play className="h-8 w-8" />
                      )}
                    </button>
                    
                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 rounded-full hover:bg-neutral-200 text-neutral-600"
                    >
                      <SkipForward className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                
                {/* Volume control */}
                <div className="flex items-center mb-4">
                  <button
                    onClick={toggleMute}
                    className="text-neutral-600 hover:text-neutral-900 mr-2"
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
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                {/* Playback speed */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-neutral-700">Playback Speed</label>
                    <span className="text-sm text-neutral-500">{settings.playbackRate}x</span>
                  </div>
                  <div className="flex space-x-2">
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={`px-3 py-1 rounded text-sm ${
                          settings.playbackRate === rate
                            ? 'bg-primary-100 text-primary-700 font-medium'
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
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
      
      {/* Settings panel */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSettingsOpen(false)}></div>
          <div className="absolute right-0 inset-y-0 w-80 bg-white shadow-lg">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-medium text-neutral-900">Audio Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Auto-Play Next Chapter
                </label>
                <div className="flex items-center">
                  <button
                    onClick={() => setSettings({ ...settings, autoNextChapter: true })}
                    className={`flex-1 py-2 px-3 rounded-l border ${
                      settings.autoNextChapter
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300'
                    }`}
                  >
                    On
                  </button>
                  <button
                    onClick={() => setSettings({ ...settings, autoNextChapter: false })}
                    className={`flex-1 py-2 px-3 rounded-r border ${
                      !settings.autoNextChapter
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-neutral-300'
                    }`}
                  >
                    Off
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayerPage;