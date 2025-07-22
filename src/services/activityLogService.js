import api from './api';

/**
 * Lấy danh sách nhật ký hoạt động.
 * @param {object} params - Các tham số (page, limit, sort_by, sort_order)
 */
export const getActivityLogs = (params) => api.get('/api/admin/activity-logs', { params });