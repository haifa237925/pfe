import { useState, useEffect, useCallback } from 'react';
import { adminService } from '../services/admin.service';

// Hook pour les statistiques du dashboard
export const useDashboardStats = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const stats = await adminService.getDashboardStats();
      setData(stats);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
};

// Hook pour l'activité récente
export const useRecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getRecentActivity();
      setActivities(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivity();
    
    // Rafraichir toutes les 30 secondes
    const interval = setInterval(fetchActivity, 30000);
    return () => clearInterval(interval);
  }, [fetchActivity]);

  return { activities, loading, error, refetch: fetchActivity };
};

// Hook pour la santé du système
export const useSystemHealth = () => {
  const [systemStatus, setSystemStatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSystemHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getSystemHealth();
      setSystemStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemHealth();
    
    // Rafraichir toutes les 60 secondes
    const interval = setInterval(fetchSystemHealth, 60000);
    return () => clearInterval(interval);
  }, [fetchSystemHealth]);

  return { systemStatus, loading, error, refetch: fetchSystemHealth };
};

// Hook pour les top livres
export const useTopBooks = () => {
  const [topBooks, setTopBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTopBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getTopBooks();
      setTopBooks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopBooks();
  }, [fetchTopBooks]);

  return { topBooks, loading, error, refetch: fetchTopBooks };
};

// Hook pour la gestion des utilisateurs
export const useUsers = (initialParams = {}) => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    page: 1,
    limit: 20,
    search: '',
    role: '',
    status: '',
    ...initialParams
  });

  const fetchUsers = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const updatedParams = { ...params, ...newParams };
      const data = await adminService.getAllUsers(updatedParams);
      setUsers(data.users || []);
      setPagination(data.pagination || {});
      setParams(updatedParams);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateUser = async (userId, userData) => {
    try {
      await adminService.updateUser(userId, userData);
      await fetchUsers(); // Reload data
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      await fetchUsers(); // Reload data
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await adminService.updateUserStatus(userId, status);
      await fetchUsers(); // Reload data
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    users,
    pagination,
    loading,
    error,
    params,
    fetchUsers,
    updateUser,
    deleteUser,
    updateUserStatus
  };
};

// Hook pour la gestion des signalements
export const useReports = (initialParams = {}) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({
    status: '',
    type: '',
    severity: '',
    page: 1,
    limit: 20,
    ...initialParams
  });

  const fetchReports = useCallback(async (newParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const updatedParams = { ...params, ...newParams };
      const data = await adminService.getAllReports(updatedParams);
      setReports(Array.isArray(data) ? data : []);
      setParams(updatedParams);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchReports();
  }, []);

  const resolveReport = async (reportId, resolution) => {
    try {
      await adminService.resolveReport(reportId, resolution);
      await fetchReports(); // Reload data
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const dismissReport = async (reportId, reason) => {
    try {
      await adminService.dismissReport(reportId, reason);
      await fetchReports(); // Reload data
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return {
    reports,
    loading,
    error,
    params,
    fetchReports,
    resolveReport,
    dismissReport
  };
};

// Hook générique pour les opérations async
export const useAsyncOperation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (asyncFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction(...args);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return { execute, loading, error, clearError };
};