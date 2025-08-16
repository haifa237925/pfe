import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock, AlertCircle, Eye, EyeOff, BookOpen, Crown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, error } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Clé secrète pour créer un admin (en production, cela devrait être plus sécurisé)
  const ADMIN_SECRET_KEY = 'LECTUREVERSE_ADMIN_2024';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword || !adminKey) {
      setFormError('Veuillez remplir tous les champs');
      return;
    }

    if (adminKey !== ADMIN_SECRET_KEY) {
      setFormError('Clé administrateur invalide');
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
      
      // Pour la démo, on va créer un utilisateur normal puis le promouvoir admin
      await register(name, email, password, 'admin');
      
      // En production, il faudrait une API spéciale pour créer des admins
      // Ici on simule en modifiant le rôle côté client (pas sécurisé en vrai)
      console.log('Compte admin créé avec succès');
      navigate('/admin');
      
    } catch (err) {
      console.error('Erreur création admin:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center px-4 py-12">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-24 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-lg transform rotate-12 animate-float"></div>
        <div className="absolute top-20 right-16 w-16 h-20 bg-gradient-to-br from-blue-400/15 to-cyan-400/15 rounded-lg transform -rotate-6 animate-float-delayed"></div>
        <div className="absolute bottom-20 left-20 w-12 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-lg transform rotate-45 animate-float-slow"></div>
      </div>

      <div className="relative bg-white/10 backdrop-blur-xl shadow-2xl rounded-3xl px-8 pt-8 pb-8 mb-4 w-full max-w-md mx-auto border border-white/20">
        {/* Header avec icône admin */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-4 shadow-2xl">
            <Crown className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Configuration Admin
          </h1>
          <p className="text-purple-100">
            Créez votre compte administrateur
          </p>
        </div>

        {/* Badge de sécurité */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center bg-red-500/20 text-red-100 px-4 py-2 rounded-full text-sm font-medium border border-red-400/30">
            <Shield className="h-4 w-4 mr-2" />
            Accès restreint - Admin uniquement
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {formError && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-xl p-4 animate-fade-in">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-300 mr-2 flex-shrink-0" />
                <p className="text-red-100 text-sm">{formError}</p>
              </div>
            </div>
          )}

          {/* Clé admin */}
          <div className="space-y-1">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="adminKey">
              Clé Administrateur
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                id="adminKey"
                type="password"
                className="pl-10 block w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-purple-200 backdrop-blur-sm"
                placeholder="Entrez la clé secrète"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                required
              />
            </div>
            <p className="text-xs text-purple-200 mt-1">
              Clé requise pour créer un compte administrateur
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="name">
              Nom complet
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                id="name"
                type="text"
                className="pl-10 block w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-purple-200 backdrop-blur-sm"
                placeholder="Administrateur"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="email">
              Adresse email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                className="pl-10 block w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-purple-200 backdrop-blur-sm"
                placeholder="admin@lectureverse.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="password">
              Mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="pl-10 pr-10 block w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-purple-200 backdrop-blur-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-purple-200 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-white text-sm font-semibold mb-2" htmlFor="confirmPassword">
              Confirmer le mot de passe
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
              </div>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                className="pl-10 pr-10 block w-full rounded-xl border-white/20 bg-white/10 text-white shadow-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-300 focus:ring-opacity-50 py-3 transition-all duration-200 placeholder-purple-200 backdrop-blur-sm"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-purple-300 hover:text-purple-200 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Création du compte admin...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Crown className="h-5 w-5 mr-2" />
                Créer le compte administrateur
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-purple-100">
            Retour à la{' '}
            <Link to="/login" className="text-purple-300 hover:text-white font-semibold transition-colors">
              page de connexion
            </Link>
          </p>
        </div>

        {/* Footer sécurité */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex items-center justify-center space-x-4 text-xs text-purple-200">
            <span className="flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              Accès sécurisé
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-2"></div>
              Chiffrement SSL
            </span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 text-white/80 text-sm">
          <p className="font-semibold mb-2">🔑 Clé administrateur pour la démo :</p>
          <code className="bg-white/10 px-3 py-1 rounded font-mono">LECTUREVERSE_ADMIN_2024</code>
        </div>
      </div>
    </div>
  );
};

export default AdminSetupPage;