import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  Settings, 
  X, 
  ZoomIn, 
  ZoomOut, 
  BookOpen,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedReader } from '../components/DynamicWatermark';
import { useReadingProgress } from '../hooks/useReadingProgress';

const DUMMY_BOOKS = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    content: `# Chapitre 1: Introduction à la programmation

La programmation est un art qui combine logique, créativité et résolution de problèmes. Dans ce livre, nous explorerons les concepts fondamentaux qui vous permettront de devenir un développeur accompli.

## Les bases de la programmation

La programmation consiste à donner des instructions à un ordinateur pour qu'il accomplisse des tâches spécifiques. Ces instructions sont écrites dans un langage de programmation que l'ordinateur peut comprendre et exécuter.

### Variables et types de données

Une variable est un conteneur qui stocke une valeur. Les types de données définissent le genre d'information qu'une variable peut contenir :

- **Entiers (int)** : Nombres entiers comme 1, 42, -17
- **Décimaux (float)** : Nombres avec décimales comme 3.14, -2.5
- **Chaînes (string)** : Texte comme "Hello World", "Bonjour"
- **Booléens (bool)** : Valeurs vraies ou fausses (true/false)

### Structures de contrôle

Les structures de contrôle permettent de diriger le flux d'exécution du programme :

1. **Conditions (if/else)** : Exécuter du code selon certaines conditions
2. **Boucles (for/while)** : Répéter du code plusieurs fois
3. **Fonctions** : Organiser le code en blocs réutilisables

## Exemple pratique

Voici un exemple simple en pseudocode :

\`\`\`
fonction calculerMoyenne(notes):
    somme = 0
    pour chaque note dans notes:
        somme = somme + note
    moyenne = somme / longueur(notes)
    retourner moyenne

notes_etudiant = [15, 18, 12, 16]
resultat = calculerMoyenne(notes_etudiant)
afficher("La moyenne est: " + resultat)
\`\`\`

## Bonnes pratiques

1. **Code lisible** : Utilisez des noms de variables explicites
2. **Commentaires** : Documentez votre code pour vous et les autres
3. **Tests** : Vérifiez que votre code fonctionne correctement
4. **Refactorisation** : Améliorez continuellement votre code

La programmation est un voyage d'apprentissage continu. Chaque ligne de code écrite vous rapproche de la maîtrise de cet art fascinant.

# Chapitre 2: Algorithmes fondamentaux

Un algorithme est une séquence d'instructions précises permettant de résoudre un problème ou d'accomplir une tâche. C'est le cœur de toute solution informatique.

## Qu'est-ce qu'un algorithme ?

Un algorithme possède plusieurs caractéristiques importantes :

- **Précision** : Chaque étape doit être clairement définie
- **Finitude** : L'algorithme doit se terminer en un temps fini
- **Efficacité** : Il doit résoudre le problème de manière optimale
- **Généralité** : Il doit fonctionner pour tous les cas valides

### Tri par bulles

L'un des algorithmes de tri les plus simples à comprendre :

\`\`\`
fonction triBulles(tableau):
    n = longueur(tableau)
    pour i de 0 à n-1:
        pour j de 0 à n-2-i:
            si tableau[j] > tableau[j+1]:
                échanger tableau[j] et tableau[j+1]
    retourner tableau
\`\`\`

### Recherche binaire

Algorithme efficace pour trouver un élément dans un tableau trié :

\`\`\`
fonction rechercheBinaire(tableau, cible):
    gauche = 0
    droite = longueur(tableau) - 1
    
    tant que gauche <= droite:
        milieu = (gauche + droite) / 2
        si tableau[milieu] = cible:
            retourner milieu
        sinon si tableau[milieu] < cible:
            gauche = milieu + 1
        sinon:
            droite = milieu - 1
    
    retourner -1  // Élément non trouvé
\`\`\`

## Complexité algorithmique

La complexité mesure l'efficacité d'un algorithme :

- **O(1)** : Temps constant
- **O(log n)** : Temps logarithmique
- **O(n)** : Temps linéaire
- **O(n²)** : Temps quadratique

Plus la complexité est faible, plus l'algorithme est efficace sur de grandes quantités de données.

Cette compréhension des algorithmes vous donnera les bases pour résoudre des problèmes complexes de manière élégante et efficace.`
  }
];

interface ReaderSettings {
  fontSize: number;
  theme: 'light' | 'dark' | 'sepia';
  lineHeight: number;
}

const ReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const isSample = searchParams.get('sample') === 'true';
  
  const [book, setBook] = useState(DUMMY_BOOKS.find(b => b.id === id));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [settings, setSettings] = useState<ReaderSettings>({
    fontSize: 16,
    theme: 'light',
    lineHeight: 1.6
  });
  
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Utilisation du hook useReadingProgress
  const {
    progress,
    isLoading: progressLoading,
    currentSession,
    startReadingSession,
    updateProgress,
    endReadingSession,
    addBookmark,
    getReadingStats
  } = useReadingProgress(id || '', 'ebook');

  const [currentPage, setCurrentPage] = useState(progress?.currentPage || 0);
  
  // Calculate pages based on content and settings
  useEffect(() => {
    if (contentRef.current && book?.content) {
      const contentHeight = contentRef.current.scrollHeight;
      const viewportHeight = window.innerHeight - 120; // Account for header/footer
      const estimatedPages = Math.ceil(contentHeight / viewportHeight);
      setTotalPages(Math.max(estimatedPages, 1));
    }
  }, [book, settings]);
  
  // Gestion des sessions de lecture
  useEffect(() => {
    if (progress && !currentSession && !isSample && progress.currentPage !== undefined) {
      setCurrentPage(progress.currentPage);
      startReadingSession(progress.currentPage);
    }
    
    return () => {
      if (currentSession) {
        endReadingSession();
      }
    };
  }, [progress, startReadingSession, endReadingSession, currentSession, isSample]);
  
  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      
      if (!isSample && progress) {
        updateProgress(newPage, { 
          totalPages, 
          pagesRead: 1
        });
      }
    }
  }, [currentPage, totalPages, updateProgress, progress, isSample]);
  
  const handlePrevPage = useCallback(() => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      
      if (!isSample && progress) {
        updateProgress(newPage, { 
          totalPages, 
          pagesRead: -1
        });
      }
    }
  }, [currentPage, updateProgress, progress, isSample, totalPages]);
  
  const getThemeClasses = () => {
    switch (settings.theme) {
      case 'dark':
        return 'bg-neutral-900 text-neutral-100';
      case 'sepia':
        return 'bg-amber-50 text-neutral-900';
      default:
        return 'bg-white text-neutral-900';
    }
  };
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages, handleNextPage, handlePrevPage]);
  
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

  // Convert markdown-like content to HTML for better rendering
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold mb-6 mt-8">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-semibold mb-4 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-medium mb-3 mt-4">{line.substring(4)}</h3>;
        }
        if (line.startsWith('```')) {
          return <div key={index} className="bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg font-mono text-sm my-4 overflow-x-auto" />;
        }
        if (line.startsWith('- ') || line.match(/^\d+\. /)) {
          return <li key={index} className="mb-2 ml-4">{line.replace(/^- /, '').replace(/^\d+\. /, '')}</li>;
        }
        if (line.trim() === '') {
          return <div key={index} className="h-4" />;
        }
        return <p key={index} className="mb-4 leading-relaxed">{line}</p>;
      });
  };
  
  return (
    <ProtectedReader 
      bookId={id || 'unknown'} 
      watermarkConfig={{
        opacity: isSample ? 0.08 : 0.03,
        frequency: isSample ? 6 : 4,
        position: 'random',
        includeTimestamp: true,
        includeBookId: true
      }}
    >
      <div className="flex flex-col h-screen">
        {/* Reader top bar */}
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
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 1) })}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 p-1"
              title="Diminuer la taille"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            
            <span className="text-sm text-neutral-600 dark:text-neutral-400 min-w-[35px] text-center">
              {settings.fontSize}px
            </span>
            
            <button
              onClick={() => setSettings({ ...settings, fontSize: Math.min(28, settings.fontSize + 1) })}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 p-1"
              title="Augmenter la taille"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            
            <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-600 mx-2" />
            
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 p-1"
              title="Paramètres de lecture"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Sample notification */}
        {isSample && (
          <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 px-4 py-3 border-b border-primary-200 dark:border-primary-700">
            <div className="flex items-center justify-center">
              <BookOpen className="h-5 w-5 mr-2" />
              <p className="font-medium">Aperçu gratuit - Achetez le livre pour continuer la lecture</p>
            </div>
          </div>
        )}
        
        {/* Reader content */}
        <div className={`flex-grow overflow-hidden ${getThemeClasses()} transition-colors duration-200`}>
          <div
            className="h-full overflow-y-auto"
            style={{
              transform: `translateY(-${currentPage * 100}vh)`
            }}
          >
            <div
              ref={contentRef}
              className="max-w-4xl mx-auto px-6 py-8"
              style={{
                fontSize: `${settings.fontSize}px`,
                lineHeight: settings.lineHeight,
                minHeight: '100vh'
              }}
            >
              <div className="prose prose-lg max-w-none">
                {renderContent(book.content)}
              </div>
              
              {/* Fin de l'aperçu pour les samples */}
              {isSample && (
                <div className="mt-12 p-8 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl text-center border-2 border-dashed border-primary-200 dark:border-primary-700">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary-600 dark:text-primary-400" />
                  <h3 className="text-xl font-semibold mb-2 text-neutral-900 dark:text-white">
                    Fin de l'aperçu
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    Achetez ce livre pour continuer la lecture et découvrir l'histoire complète.
                  </p>
                  <Link
                    to={`/books/${id}`}
                    className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                  >
                    Acheter le livre
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Reader bottom bar */}
        <div className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-4 py-3 flex items-center justify-between">
          <button 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              currentPage === 0 
                ? 'text-neutral-300 cursor-not-allowed' 
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span className="hidden sm:inline">Précédent</span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
              Page {currentPage + 1} sur {totalPages}
            </div>
            <div className="w-32 bg-neutral-200 dark:bg-neutral-600 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentPage + 1) / totalPages) * 100}%` }}
              />
            </div>
          </div>
          
          <button 
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              currentPage >= totalPages - 1
                ? 'text-neutral-300 cursor-not-allowed' 
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            }`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
        
        {/* Settings panel */}
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsSettingsOpen(false)}></div>
            <div className="absolute right-0 inset-y-0 w-80 bg-white dark:bg-neutral-800 shadow-lg">
              <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between">
                <h3 className="text-lg font-medium text-neutral-900 dark:text-white">Paramètres de lecture</h3>
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Taille de police
                  </label>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSettings({ ...settings, fontSize: Math.max(12, settings.fontSize - 1) })}
                      className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                      <ZoomOut className="h-4 w-4" />
                    </button>
                    <div className="mx-3 text-center min-w-[50px] font-medium">
                      {settings.fontSize}px
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, fontSize: Math.min(28, settings.fontSize + 1) })}
                      className="p-2 rounded-md bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                  <input
                    type="range"
                    min="12"
                    max="28"
                    step="1"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: parseInt(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer mt-3"
                  />
                </div>
                
                {/* Line Height */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Espacement des lignes
                  </label>
                  <input
                    type="range"
                    min="1.2"
                    max="2.5"
                    step="0.1"
                    value={settings.lineHeight}
                    onChange={(e) => setSettings({ ...settings, lineHeight: parseFloat(e.target.value) })}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 text-center">
                    {settings.lineHeight.toFixed(1)}
                  </div>
                </div>
                
                {/* Theme */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Thème de lecture
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, theme: 'light' })}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-colors ${
                        settings.theme === 'light'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="w-6 h-6 bg-white border border-neutral-300 rounded mb-1"></div>
                      <span className="text-xs font-medium">Clair</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, theme: 'sepia' })}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-colors ${
                        settings.theme === 'sepia'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="w-6 h-6 bg-amber-50 border border-amber-300 rounded mb-1"></div>
                      <span className="text-xs font-medium">Sépia</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, theme: 'dark' })}
                      className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-colors ${
                        settings.theme === 'dark'
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                          : 'border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="w-6 h-6 bg-neutral-800 border border-neutral-600 rounded mb-1"></div>
                      <span className="text-xs font-medium">Sombre</span>
                    </button>
                  </div>
                </div>
                
                {/* Reading Progress */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    Progression de lecture
                  </h4>
                  <div className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                    <div className="flex justify-between">
                      <span>Page actuelle:</span>
                      <span className="font-medium">{currentPage + 1}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total des pages:</span>
                      <span className="font-medium">{totalPages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progression:</span>
                      <span className="font-medium">{Math.round(((currentPage + 1) / totalPages) * 100)}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Watermark Info */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <div className="flex items-start">
                      <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-xs text-blue-800 dark:text-blue-200">
                        <p className="font-medium mb-1">Protection DRM</p>
                        <p>Ce livre est protégé par un filigrane numérique personnalisé à votre nom pour prévenir la distribution non autorisée.</p>
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

export default ReaderPage;