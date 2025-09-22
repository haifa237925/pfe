import { apiService } from './api.service';

class AdminService {
  // Dashboard Statistics
  async getDashboardStats() {
    try {
      const data = await apiService.get('/admin/dashboard/stats');
      return data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  async getRecentActivity() {
    try {
      const data = await apiService.get('/admin/dashboard/recent-activity');
      return data;
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      throw error;
    }
  }

  async getSystemHealth() {
    try {
      const data = await apiService.get('/admin/dashboard/system-health');
      return data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  async getTopBooks() {
    try {
      const data = await apiService.get('/admin/dashboard/top-books');
      return data;
    } catch (error) {
      console.error('Error fetching top books:', error);
      throw error;
    }
  }

  // User Management
  async getAllUsers(params = {}) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        role = '',
        status = ''
      } = params;

      const queryParams = {
        page,
        limit,
        ...(search && { search }),
        ...(role && role !== 'all' && { role }),
        ...(status && status !== 'all' && { status })
      };

      const data = await apiService.get('/admin/users', queryParams);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const data = await apiService.get(`/admin/users/${userId}`);
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async updateUser(userId, userData) {
    try {
      const data = await apiService.put(`/admin/users/${userId}`, userData);
      return data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const data = await apiService.delete(`/admin/users/${userId}`);
      return data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async updateUserStatus(userId, status) {
    try {
      const data = await apiService.put(`/admin/users/${userId}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Content Moderation
  async getAllReports(params = {}) {
    try {
      const {
        status = '',
        type = '',
        severity = '',
        page = 1,
        limit = 20
      } = params;

      const queryParams = {
        page,
        limit,
        ...(status && status !== 'all' && { status }),
        ...(type && type !== 'all' && { type }),
        ...(severity && severity !== 'all' && { severity })
      };

      const data = await apiService.get('/admin/reports', queryParams);
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
    }
  }

  async getReportById(reportId) {
    try {
      const data = await apiService.get(`/admin/reports/${reportId}`);
      return data;
    } catch (error) {
      console.error('Error fetching report:', error);
      throw error;
    }
  }

  async resolveReport(reportId, resolution) {
    try {
      const data = await apiService.put(`/admin/reports/${reportId}/resolve`, resolution);
      return data;
    } catch (error) {
      console.error('Error resolving report:', error);
      throw error;
    }
  }

  async dismissReport(reportId, reason) {
    try {
      const data = await apiService.put(`/admin/reports/${reportId}/dismiss`, { reason });
      return data;
    } catch (error) {
      console.error('Error dismissing report:', error);
      throw error;
    }
  }

  // Book Management
  async getAllBooks(params = {}) {
    try {
      const data = await apiService.get('/admin/books', params);
      return data;
    } catch (error) {
      console.error('Error fetching books:', error);
      throw error;
    }
  }

  async updateBookStatus(bookId, status) {
    try {
      const data = await apiService.put(`/admin/books/${bookId}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating book status:', error);
      throw error;
    }
  }

  async deleteBook(bookId) {
    try {
      const data = await apiService.delete(`/admin/books/${bookId}`);
      return data;
    } catch (error) {
      console.error('Error deleting book:', error);
      throw error;
    }
  }

  // Analytics
  async getSalesAnalytics(params = {}) {
    try {
      const data = await apiService.get('/admin/analytics/sales', params);
      return data;
    } catch (error) {
      console.error('Error fetching sales analytics:', error);
      throw error;
    }
  }

  async getUserAnalytics(params = {}) {
    try {
      const data = await apiService.get('/admin/analytics/users', params);
      return data;
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      throw error;
    }
  }

  async getRevenueAnalytics(params = {}) {
    try {
      const data = await apiService.get('/admin/analytics/revenue', params);
      return data;
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw error;
    }
  }

  // Publisher Requests
  async getPublisherRequests(params = {}) {
    try {
      const data = await apiService.get('/admin/publisher-requests', params);
      return data;
    } catch (error) {
      console.error('Error fetching publisher requests:', error);
      throw error;
    }
  }

  async approvePublisherRequest(requestId, notes = '') {
    try {
      const data = await apiService.put(`/admin/publisher-requests/${requestId}/approve`, { notes });
      return data;
    } catch (error) {
      console.error('Error approving publisher request:', error);
      throw error;
    }
  }

  async rejectPublisherRequest(requestId, reason = '') {
    try {
      const data = await apiService.put(`/admin/publisher-requests/${requestId}/reject`, { reason });
      return data;
    } catch (error) {
      console.error('Error rejecting publisher request:', error);
      throw error;
    }
  }

  // System Management
  async getDetailedSystemHealth() {
    try {
      const data = await apiService.get('/admin/system/health');
      return data;
    } catch (error) {
      console.error('Error fetching system health:', error);
      throw error;
    }
  }

  async toggleMaintenanceMode(enabled = false) {
    try {
      const data = await apiService.post('/admin/system/maintenance', { enabled });
      return data;
    } catch (error) {
      console.error('Error toggling maintenance mode:', error);
      throw error;
    }
  }

  async getSystemLogs(params = {}) {
    try {
      const data = await apiService.get('/admin/system/logs', params);
      return data;
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }
}

export const adminService = new AdminService();