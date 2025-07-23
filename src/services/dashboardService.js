import api from './api';

/**
 * Lấy dữ liệu thống kê cho Dashboard.
 * @param {string} period - 'day', 'month', 'year'
 */
export const getDashboardStats = (period = 'day', year = null) => {
    const params = { period };
    if (year) {
        params.year = year;
    }
    return api.get('/api/admin/dashboard-stats', { params });
}
