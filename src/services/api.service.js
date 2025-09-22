// services/api.service.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACK_END_URL + '/api' || 'http://localhost:5000/api';

// Créer une instance axios avec configuration de base
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et les erreurs
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('authToken');
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/login';
      }
    }
    
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
    });

    return Promise.reject(error);
  }
);

// Service API simple avec fallback sur données mockées
class APIService {
  constructor() {
    this.useMockData = true; // Basculez à false quand votre backend est prêt
  }

  async get(endpoint, params = {}) {
    if (this.useMockData) {
      return this.getMockData(endpoint, params);
    }
    
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      console.warn(`API call failed for ${endpoint}, falling back to mock data`);
      return this.getMockData(endpoint, params);
    }
  }

  async post(endpoint, data = {}) {
    if (this.useMockData) {
      console.log(`POST ${endpoint} (simulated):`, data);
      return { success: true, message: 'Action simulée avec succès' };
    }
    
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }

  async put(endpoint, data = {}) {
    if (this.useMockData) {
      console.log(`PUT ${endpoint} (simulated):`, data);
      return { success: true, message: 'Mise à jour simulée avec succès' };
    }
    
    const response = await apiClient.put(endpoint, data);
    return response.data;
  }

  async delete(endpoint) {
    if (this.useMockData) {
      console.log(`DELETE ${endpoint} (simulated)`);
      return { success: true, message: 'Suppression simulée avec succès' };
    }
    
    const response = await apiClient.delete(endpoint);
    return response.data;
  }

  // Données mockées pour le développement
  getMockData(endpoint, params = {}) {
    const mockDatabase = {
      '/admin/dashboard/stats': {
        totalUsers: 15847,
        totalBooks: 2341,
        totalReports: 23,
        totalRevenue: 125678.90,
        monthlyGrowth: 12.5,
        activeUsers: 8934,
        pendingReports: 5,
        systemHealth: 99.9
      },
      
      '/admin/dashboard/recent-activity': [
        { type: 'user', message: 'Nouvel utilisateur inscrit', time: '2 min', user: 'marie.dubois@email.com' },
        { type: 'book', message: 'Nouveau livre publié', time: '15 min', book: 'Guide de JavaScript' },
        { type: 'report', message: 'Nouveau signalement', time: '1h', severity: 'medium' },
        { type: 'sale', message: 'Pic de ventes détecté', time: '2h', amount: 1250 },
        { type: 'system', message: 'Maintenance programmée terminée', time: '4h' }
      ],
      
      '/admin/dashboard/system-health': [
        { service: 'API Services', status: 'operational', uptime: '99.9%', color: 'green' },
        { service: 'Base de données', status: 'operational', uptime: '99.8%', color: 'green' },
        { service: 'Stockage fichiers', status: 'operational', uptime: '99.9%', color: 'green' },
        { service: 'Authentification', status: 'operational', uptime: '100%', color: 'green' },
        { service: 'Paiements', status: 'maintenance', uptime: '98.5%', color: 'yellow' }
      ],
      
      '/admin/dashboard/top-books': [
        { title: 'The Art of Programming', sales: 324, revenue: 3237.76, author: 'Jane Smith' },
        { title: 'Web Development Mastery', sales: 298, revenue: 2980.50, author: 'John Doe' },
        { title: 'Business Strategy Guide', sales: 267, revenue: 2670.33, author: 'Mike Johnson' }
      ],
      
      '/admin/users': {
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'reader', status: 'active', joinDate: '2024-01-15' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'writer', status: 'active', joinDate: '2024-02-20' },
          { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'reader', status: 'inactive', joinDate: '2024-03-10' },
          { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'writer', status: 'active', joinDate: '2024-02-28' },
          { id: '5', name: 'David Brown', email: 'david@example.com', role: 'reader', status: 'active', joinDate: '2024-03-05' }
        ].filter(user => {
          // Filtrage simple basé sur les paramètres
          if (params.search) {
            const searchLower = params.search.toLowerCase();
            const matchesSearch = user.name.toLowerCase().includes(searchLower) || 
                                user.email.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }
          if (params.role && params.role !== 'all' && user.role !== params.role) return false;
          if (params.status && params.status !== 'all' && user.status !== params.status) return false;
          return true;
        }),
        pagination: { total: 5, page: 1, limit: 20 }
      },
      
      '/admin/reports': [
        {
          id: '1',
          type: 'book',
          title: 'Contenu inapproprié dans le Chapitre 3',
          reportedBy: 'john@example.com',
          reportDate: '2024-03-15T10:30:00',
          reason: 'Contenu explicite non adapté à la classification d\'âge',
          status: 'pending',
          severity: 'high'
        },
        {
          id: '2',
          type: 'review',
          title: 'Commentaire spam',
          reportedBy: 'jane@example.com',
          reportDate: '2024-03-14T15:45:00',
          reason: 'Multiples commentaires identiques du même utilisateur',
          status: 'resolved',
          severity: 'medium'
        },
        {
          id: '3',
          type: 'user',
          title: 'Signalement de harcèlement',
          reportedBy: 'mike@example.com',
          reportDate: '2024-03-13T09:20:00',
          reason: 'Utilisateur envoyant des messages inappropriés',
          status: 'pending',
          severity: 'high'
        }
      ]
    };

    return mockDatabase[endpoint] || {};
  }
}

export const apiService = new APIService();
export default apiClient;