// services/reports.service.js
import { apiClient } from './api.service';

class ReportsService {
  // Créer un nouveau signalement
  async createReport(reportData) {
    try {
      const response = await apiClient.post('/reports', reportData);
      return response.data;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Obtenir les signalements de l'utilisateur connecté
  async getUserReports(params = {}) {
    try {
      const response = await apiClient.get('/reports/my-reports', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching user reports:', error);
      throw error;
    }
  }

  // Obtenir un signalement spécifique
  async getReport(reportId) {
    try {
      const response = await apiClient.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  // Supprimer un signalement (seulement si pending)
  async deleteReport(reportId) {
    try {
      const response = await apiClient.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting report:', error);
      throw error;
    }
  }

  // Obtenir les types de signalements disponibles
  async getReportTypes() {
    try {
      const response = await apiClient.get('/reports/types/list');
      return response.data;
    } catch (error) {
      console.error('Error fetching report types:', error);
      // Retourner des données par défaut
      return {
        types: [
          { value: 'book', label: 'Signaler un livre', description: 'Contenu inapproprié, copyright, etc.' },
          { value: 'user', label: 'Signaler un utilisateur', description: 'Comportement inapproprié, spam, etc.' },
          { value: 'review', label: 'Signaler un avis', description: 'Avis inapproprié ou spam' },
          { value: 'other', label: 'Autre', description: 'Autre type de problème' }
        ],
        severityLevels: [
          { value: 'low', label: 'Faible', description: 'Problème mineur' },
          { value: 'medium', label: 'Moyen', description: 'Problème modéré' },
          { value: 'high', label: 'Élevé', description: 'Problème grave' },
          { value: 'critical', label: 'Critique', description: 'Problème très grave' }
        ]
      };
    }
  }

  // Méthodes spécialisées pour signaler différents types de contenu
  async reportBook(bookId, reason, severity = 'medium') {
    try {
      const reportData = {
        type: 'book',
        book_id: bookId,
        reason,
        severity
      };
      return await this.createReport(reportData);
    } catch (error) {
      console.error('Error reporting book:', error);
      throw error;
    }
  }

  async reportUser(userId, reason, severity = 'medium') {
    try {
      const reportData = {
        type: 'user',
        user_id: userId,
        reason,
        severity
      };
      return await this.createReport(reportData);
    } catch (error) {
      console.error('Error reporting user:', error);
      throw error;
    }
  }

  async reportReview(reviewId, reason, severity = 'medium') {
    try {
      const reportData = {
        type: 'review',
        review_id: reviewId,
        reason,
        severity
      };
      return await this.createReport(reportData);
    } catch (error) {
      console.error('Error reporting review:', error);
      throw error;
    }
  }

  // Obtenir les statistiques de modération (pour les admins)
  async getModerationStats() {
    try {
      const response = await apiClient.get('/admin/moderation/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching moderation stats:', error);
      // Données par défaut en cas d'erreur
      return {
        pending: 0,
        resolvedToday: 0,
        highPriority: 0,
        total: 0,
        resolved: 0,
        dismissed: 0
      };
    }
  }

  // Obtenir l'historique des actions de modération
  async getModerationHistory(params = {}) {
    try {
      const response = await apiClient.get('/admin/moderation/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching moderation history:', error);
      throw error;
    }
  }
}

export const reportsService = new ReportsService();