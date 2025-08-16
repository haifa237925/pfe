import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, User, AlertCircle } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setFormError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return;
    }
    
    if (password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    
    try {
      setIsLoading(true);
      setFormError('');
      console.log('Starting registration process...');
      await register(name, email, password);
      console.log('Registration completed successfully');
    } catch (err) {
      // Error is already handled in the auth context
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to Google OAuth
    window.location.href = `${import.meta.env.VITE_BACK_END_URL}/api/auth/google`;
  };

  const handleFacebookSignup = () => {
    // Redirect to Facebook OAuth
    window.location.href = `${import.meta.env.VITE_BACK_END_URL}/api/auth/facebook`;
  };

  // Check if the error is about user already existing
  const isUserAlreadyExistsError = error && (
    error.includes('User already registered') || 
    error.includes('user_already_exists')
  );
  
  return (
    <div className="bg-white shadow-xl rounded-2xl px-8 pt-8 pb-8 mb-4 w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Rejoignez-nous</h1>
        <p className="text-neutral-600">Créez votre compte LectureVerse</p>
      </div>

      {/* Social Signup Buttons */}
      <div className="space-y-3 mb-6">
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-xl text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200 font-medium"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          S'inscrire avec Google
        </button>

        <button
          onClick={handleFacebookSignup}
          className="w-full flex items-center justify-center px-4 py-3 border border-neutral-300 rounded-xl text-neutral-700 bg-white hover:bg-neutral-50 transition-colors duration-200 font-medium"
        >
          <svg className="w-5 h-5 mr-3" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          S'inscrire avec Facebook
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-neutral-500">ou avec votre email</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {(formError || (error && !isUserAlreadyExistsError)) && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{formError || error}</p>
            </div>
          </div>
        )}
        
        {isUserAlreadyExistsError && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2" />
              <div className="text-blue-700 text-sm">
                <p className="font-medium">Cette adresse email est déjà utilisée !</p>
                <p className="mt-1">
                  Si c'est votre email, veuillez{' '}
                  <Link to="/login" className="underline font-medium hover:text-blue-800">
                    vous connecter
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="name">
            Nom complet
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="name"
              type="text"
              className="pl-10 block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 py-3"
              placeholder="Jean Dupont"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="email">
            Adresse email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="email"
              type="email"
              className="pl-10 block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 py-3"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="password">
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="password"
              type="password"
              className="pl-10 block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 py-3"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />
          </div>
          <p className="mt-1 text-xs text-neutral-500">Au moins 8 caractères</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-neutral-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
            Confirmer le mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-neutral-400" />
            </div>
            <input
              id="confirmPassword"
              type="password"
              className="pl-10 block w-full rounded-xl border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 py-3"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Création du compte...
            </span>
          ) : (
            'Créer mon compte'
          )}
        </button>
        
        <p className="text-center mt-6 text-neutral-600">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-800 font-medium">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;