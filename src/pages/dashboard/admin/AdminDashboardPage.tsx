// src/pages/dashboard/admin/AdminDashboardPage.tsx
import React, { useState, useEffect } from 'react';
import {
  Users, BookOpen, Flag, BarChart2, TrendingUp, Shield, AlertTriangle, CheckCircle, Clock, DollarSign
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  /* ----------  DATA LIVE  ---------- */
  const [data, setData]          = useState<any>(null);
  const [recentActivity]         = useState<any[]>([]); // tu peux la rendre live plus tard
  const [systemStatus]           = useState<any[]>([]); // idem
  const [topBooks]               = useState<any[]>([]); // idem
  const [requests, setRequests]  = useState<any[]>([]);

  const base = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const token = localStorage.getItem('token') ?? '';

  /* ----------  FETCH  ---------- */
  useEffect(() => {
    Promise.all([
      fetch(`${base}/api/admin/stats`,           { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
      fetch(`${base}/api/admin/publisher-requests`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.ok ? r.json() : Promise.reject(r.status)),
    ])
      .then(([stats, reqs]) => { setData(stats); setRequests(reqs); })
      .catch(() => { setData({}); setRequests([]); })
      .finally(() => setIsLoading(false));
  }, [token]);

  /* ----------  ACTIONS  ---------- */
  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    await fetch(`${base}/api/admin/publisher-requests/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
  };

  /* ----------  UI  ---------- */
  if (isLoading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  );

  if (!data) return <div className="text-center py-12">Aucune donnée</div>;

  /* ----------  Helper icons  ---------- */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'down': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  /* ----------  JSX  ---------- */
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin 🛡️</h1>
        <p className="text-purple-100 text-lg mb-6">Bienvenue {user?.username}. Gérez votre plateforme en toute simplicité.</p>
        <div className="flex flex-wrap gap-4">
          <Link to="/admin/users" className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all flex items-center"><Users className="h-5 w-5 mr-2" />Gérer les utilisateurs</Link>
          <Link to="/admin/moderation" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-medium transition-all flex items-center border border-white/20"><Shield className="h-5 w-5 mr-2" />Modération</Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Utilisateurs totaux</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalUsers?.toLocaleString() ?? 0}</h3></div><div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-xl text-primary-600 dark:text-primary-400"><Users className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Livres publiés</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalBooks?.toLocaleString() ?? 0}</h3></div><div className="p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-xl text-secondary-600 dark:text-secondary-400"><BookOpen className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Signalements</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">{data.totalReports ?? 0}</h3></div><div className="p-3 bg-accent-100 dark:bg-accent-900/30 rounded-xl text-accent-600 dark:text-accent-400"><Flag className="h-6 w-6" /></div></div></div>
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Revenus totaux</p><h3 className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">${data.totalRevenue?.toLocaleString() ?? 0}</h3></div><div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400"><DollarSign className="h-6 w-6" /></div></div></div>
      </div>

      {/* SECTION : Demandes de publication */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Demandes de publication</h2>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">{requests.length} en attente</span>
        </div>

        {requests.length === 0 ? (
          <p className="text-neutral-600 dark:text-neutral-400">Aucune demande pour le moment.</p>
        ) : (
          <div className="space-y-4">
            {requests.map(r => (
              <div key={r.id} className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white">{r.first_name} {r.last_name}</p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{r.email} – {r.phone}</p>
                    {r.company_name && <p className="text-sm text-neutral-500 dark:text-neutral-500">Entreprise : {r.company_name}</p>}
                    <p className="text-xs text-neutral-400 mt-1">Reçu le {new Date(r.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(r.id, 'approved')} className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">Approuver</button>
                        <button onClick={() => updateStatus(r.id, 'rejected')} className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">Rejeter</button>
                      </>
                    )}
                    {r.status !== 'pending' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${r.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {r.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                      </span>
                    )}
                  </div>
                </div>
                <details className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
                  <summary className="cursor-pointer">Voir la motivation et le plan</summary>
                  <div className="mt-2 space-y-2">
                    <p><strong>Motivation :</strong> {r.motivation}</p>
                    <p><strong>Plan de publication :</strong> {r.publication_plan}</p>
                    {r.experience && <p><strong>Expérience :</strong> {r.experience}</p>}
                  </div>
                </details>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">Actions rapides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/admin/users" className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-xl transition-colors group">
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
            <div><h3 className="font-medium text-neutral-900 dark:text-white">Utilisateurs</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Gérer les comptes</p></div>
          </Link>
          <Link to="/admin/moderation" className="flex items-center p-4 bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 rounded-xl transition-colors group">
            <Flag className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
            <div><h3 className="font-medium text-neutral-900 dark:text-white">Modération</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Signalements</p></div>
          </Link>
          <div className="flex items-center p-4 bg-accent-50 dark:bg-accent-900/20 rounded-xl"><BarChart2 className="h-8 w-8 text-accent-600 dark:text-accent-400 mr-3" /><div><h3 className="font-medium text-neutral-900 dark:text-white">Analytics</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p></div></div>
          <div className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl"><Shield className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" /><div><h3 className="font-medium text-neutral-900 dark:text-white">Sécurité</h3><p className="text-sm text-neutral-600 dark:text-neutral-400">Bientôt disponible</p></div></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;