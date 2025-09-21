import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface WatermarkProps {
  opacity?: number;
  frequency?: number; // Nombre de filigranes par page
  position?: 'random' | 'grid' | 'diagonal';
  includeTimestamp?: boolean;
  includeBookId?: boolean;
}

interface WatermarkData {
  userId: string;
  email: string;
  purchaseDate: string;
  bookId: string;
  sessionId: string;
  timestamp: string;
}

const generateWatermarkText = (data: WatermarkData, options: WatermarkProps): string => {
  const parts = [data.email];
  
  if (options.includeBookId) {
    parts.push(`Book: ${data.bookId}`);
  }
  
  if (options.includeTimestamp) {
    parts.push(new Date(data.timestamp).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }));
  }
  
  return parts.join(' • ');
};

const generateWatermarkPositions = (
  frequency: number,
  position: string,
  containerWidth: number,
  containerHeight: number
) => {
  const positions: Array<{ top: string; left: string; rotation: number }> = [];
  
  switch (position) {
    case 'random':
      for (let i = 0; i < frequency; i++) {
        positions.push({
          top: `${Math.random() * 80 + 10}%`,
          left: `${Math.random() * 80 + 10}%`,
          rotation: Math.random() * 60 - 30 // -30° à +30°
        });
      }
      break;
      
    case 'grid':
      const cols = Math.ceil(Math.sqrt(frequency));
      const rows = Math.ceil(frequency / cols);
      for (let i = 0; i < frequency; i++) {
        const row = Math.floor(i / cols);
        const col = i % cols;
        positions.push({
          top: `${(row + 1) * (100 / (rows + 1))}%`,
          left: `${(col + 1) * (100 / (cols + 1))}%`,
          rotation: 45
        });
      }
      break;
      
    case 'diagonal':
      const step = 100 / (frequency + 1);
      for (let i = 0; i < frequency; i++) {
        positions.push({
          top: `${(i + 1) * step}%`,
          left: `${(i + 1) * step * 0.8}%`,
          rotation: 45
        });
      }
      break;
      
    default:
      positions.push({
        top: '50%',
        left: '50%',
        rotation: 45
      });
  }
  
  return positions;
};

export const DynamicWatermark: React.FC<WatermarkProps> = ({
  opacity = 0.05,
  frequency = 3,
  position = 'random',
  includeTimestamp = true,
  includeBookId = true
}) => {
  const { user } = useAuth();
  const [watermarkData, setWatermarkData] = useState<WatermarkData | null>(null);
  const [positions, setPositions] = useState<Array<{ top: string; left: string; rotation: number }>>([]);

  useEffect(() => {
    if (user) {
      const sessionId = Math.random().toString(36).substring(2, 15);
      const data: WatermarkData = {
        userId: user.id,
        email: user.email,
        purchaseDate: new Date().toISOString(),
        bookId: window.location.pathname.split('/').pop() || 'unknown',
        sessionId,
        timestamp: new Date().toISOString()
      };
      setWatermarkData(data);

      // Régénérer les positions toutes les 30 secondes pour plus de sécurité
      const generatePositions = () => {
        const newPositions = generateWatermarkPositions(frequency, position, 1000, 800);
        setPositions(newPositions);
      };

      generatePositions();
      const interval = setInterval(generatePositions, 30000);

      return () => clearInterval(interval);
    }
  }, [user, frequency, position]);

  if (!watermarkData || !user) return null;

  const watermarkText = generateWatermarkText(watermarkData, {
    opacity,
    frequency,
    position,
    includeTimestamp,
    includeBookId
  });

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
      {positions.map((pos, index) => (
        <div
          key={`${watermarkData.sessionId}-${index}`}
          className="absolute text-xs font-mono select-none"
          style={{
            top: pos.top,
            left: pos.left,
            transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
            opacity: opacity,
            color: 'currentColor',
            whiteSpace: 'nowrap',
            fontSize: '10px',
            letterSpacing: '0.05em'
          }}
        >
          {watermarkText}
        </div>
      ))}
    </div>
  );
};

// Hook pour la protection anti-piratage
export const useAntiPiracy = (bookId: string) => {
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    // Désactiver le clic droit
    const disableRightClick = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Désactiver certaines combinaisons de touches
    const disableKeyShortcuts = (e: KeyboardEvent) => {
      // Désactiver Ctrl+S, Ctrl+P, F12, Ctrl+Shift+I, etc.
      if (
        (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
        (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j')) ||
        (e.ctrlKey && (e.key === 'u' || e.key === 'U'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Désactiver la sélection de texte pour certains éléments sensibles
    const disableTextSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
    };

    // Détecter les tentatives de capture d'écran (limité)
    const detectScreenshot = () => {
      // Log les tentatives de capture pour analyse
      console.warn('Potential screenshot attempt detected');
      // Ici on pourrait envoyer un log au serveur
    };

    // Masquer temporairement le contenu lors du focus/blur
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Le document est caché (changement d'onglet, etc.)
        detectScreenshot();
      }
    };

    document.addEventListener('contextmenu', disableRightClick);
    document.addEventListener('keydown', disableKeyShortcuts);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    disableTextSelection();

    // Log de la session de lecture
    const logReadingSession = () => {
      const sessionData = {
        userId: user.id,
        bookId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        screenResolution: `${screen.width}x${screen.height}`,
        sessionId: Math.random().toString(36).substring(2, 15)
      };
      
      // Envoyer au serveur pour audit
      console.log('Reading session:', sessionData);
    };

    logReadingSession();

    return () => {
      document.removeEventListener('contextmenu', disableRightClick);
      document.removeEventListener('keydown', disableKeyShortcuts);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, [user, bookId]);
};

// Composant pour le lecteur avec protection
export const ProtectedReader: React.FC<{
  bookId: string;
  children: React.ReactNode;
  watermarkConfig?: WatermarkProps;
}> = ({ bookId, children, watermarkConfig }) => {
  const { user } = useAuth();
  useAntiPiracy(bookId);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Accès non autorisé</h2>
          <p className="text-neutral-600">Veuillez vous connecter pour accéder à ce contenu.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <DynamicWatermark
        opacity={0.03}
        frequency={4}
        position="random"
        includeTimestamp={true}
        includeBookId={true}
        {...watermarkConfig}
      />
      {children}
      
      {/* Filigrane fixe discret en bas */}
      <div className="fixed bottom-2 right-2 text-xs text-neutral-300 opacity-20 pointer-events-none select-none font-mono">
        Licensed to: {user.email} • {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default DynamicWatermark;