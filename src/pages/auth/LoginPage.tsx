import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Eye, EyeOff, BookOpen, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setFormError('Veuillez saisir votre email et mot de passe');
      return;
    }
    
    try {
      setIsLoading(true);
      setFormError('');
      console.log('Starting login process...');
      
      const result = await login(email, password);
      
      if (result.success) {
        // Redirection basée sur le rôle utilisateur
        if (result.user?.role === 'admin' || result.user?.isAdmin) {
          console.log('Admin login detected, redirecting to admin dashboard');
          navigate('/admin');
        } else if (result.user?.role === 'moderator') {
          navigate('/moderator/dashboard');
        } else if (result.user?.role === 'writer') {
          console.log('Writer login detected, redirecting to writer dashboard');
          navigate('/writer');
        } else {
          navigate('/dashboard'); // Utilisateur normal (reader)
        }
      } else {
        // Gestion des erreurs spécifiques
        setFormError(result.message || 'Erreur de connexion. Vérifiez vos identifiants.');
      }
    } catch (err: any) {
      console.error('Login failed:', err);
      
      // Gestion d'erreurs plus spécifique
      if (err?.response?.status === 401) {
        setFormError('Email ou mot de passe incorrect');
      } else if (err?.response?.status === 429) {
        setFormError('Trop de tentatives. Veuillez patienter avant de réessayer.');
      } else if (err?.code === 'NETWORK_ERROR') {
        setFormError('Problème de connexion réseau. Vérifiez votre connexion internet.');
      } else {
        setFormError('Une erreur inattendue s\'est produite. Veuillez réessayer.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACK_END_URL}/api/auth/google`;
    } catch (error) {
      setFormError('Erreur lors de la redirection vers Google');
    }
  };

  const handleFacebookLogin = () => {
    try {
      window.location.href = `${import.meta.env.VITE_BACK_END_URL}/api/auth/facebook`;
    } catch (error) {
      setFormError('Erreur lors de la redirection vers Facebook');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };
  
  return (
    <div className="relative">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-24 bg-gradient-to-br from-primary-200/30 to-primary-400/30 rounded-lg transform rotate-12 animate-float"></div>
        <div className="absolute top-20 right-16 w-16 h-20 bg-gradient-to-br from-secondary-200/25 to-secondary-400/25 rounded-lg transform -rotate-6 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-16 bg-gradient-to-br from-accent-200/30 to-accent-400/30 rounded-lg transform rotate-45 animate-float-slow"></div>
        <div className="absolute bottom-32 right-12 w-8 h-10 bg-white/40 dark:bg-white/20 rounded-sm transform -rotate-12 animate-page-float"></div>
      </div>

      <div className="relative bg-white dark:bg-neutral-800 shadow-2xl rounded-3xl px-8 pt-8 pb-8 mb-4 w-full max-w-md mx-auto border border-neutral-100 dark:border-neutral-700 backdrop-blur-sm">
        {/* Header avec icône */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4 shadow-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
            {t('auth.login.title')}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {t('auth.login.subtitle')}
          </p>
        </div>

        {/* Badge de bienvenue */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium border border-primary-200 dark:border-primary-800">
            <Sparkles className="h-4 w-4 mr-2" />
            Accédez à votre bibliothèque
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuer avec Google
          </button>

          <button
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continuer avec Facebook
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 font-medium">ou avec votre email</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700 dark:text-red-400 text-sm">{formError}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-1">
            <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-semibold mb-2" htmlFor="email">
              Adresse email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                className="pl-10 block w-full rounded-xl border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-neutral-400 dark:placeholder-neutral-500"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-semibold" htmlFor="password">
                Mot de passe
              </label>
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-medium transition-colors"
              >
                Mot de passe oublié ?
              </button>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-neutral-400 group-focus-within:text-primary-500 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10 block w-full rounded-xl border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-neutral-400 dark:placeholder-neutral-500"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-primary-700 hover:to-secondary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Connexion en cours...
              </span>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 font-semibold transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>

        {/* Footer décoratif */}
        <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-center space-x-4 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Connexion sécurisée
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Données protégées
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;