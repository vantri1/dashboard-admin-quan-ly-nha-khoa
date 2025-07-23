import api from './api';

/**
 * Lấy dữ liệu thống kê cho Dashboard.
 * @param {string} period - 'day', 'month', 'year'
 */
export const getDashboardStats = async (period = 'day', year = null) => {
    try {
        const params = { period };
        if (year) {
            params.year = year;
        }
        const response = await api.get('/api/admin/dashboard-stats', { params });
        return response;
    } catch (error) {
        // ... (xử lý lỗi)
    }
}
