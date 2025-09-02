import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_BACK_END_URL;

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur serveur');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-neutral-100 dark:bg-neutral-900">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold mb-4">Mot de passe oublié</h1>
        {sent ? (
          <div className="text-green-600">
            Un e-mail vous a été envoyé pour réinitialiser votre mot de passe.
            <br />
            <Link
              to="/login"
              className="mt-4 inline-block text-primary-600 hover:underline"
            >
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle size={16} className="mr-2" />
                {error}
              </div>
            )}
            <div>
              <label className="block mb-1 text-sm">Adresse e-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full rounded-lg border py-2 px-3"
                  placeholder="votre@email.com"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700"
            >
              Envoyer le lien
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;