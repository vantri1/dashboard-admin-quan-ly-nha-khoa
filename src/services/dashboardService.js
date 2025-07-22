import api from './api';

/**
 * Lấy dữ liệu thống kê cho Dashboard.
 * @param {string} period - 'day', 'month', 'year'
 */
export const getDashboardStats = async (period = 'day') => api.get('/api/admin/dashboard-stats', { params: { period } });
