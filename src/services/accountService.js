import api from './api'; // Giả sử bạn có một file cấu hình axios instance là api.js

/**
 * Lấy danh sách tài khoản quản trị.
 */
export const getAccounts = (params) => api.get('/api/admin/users', { params });

/**
 * Lấy chi tiết một tài khoản bằng ID.
 */
export const getAccountById = (id) => api.get(`/api/admin/users/${id}`);

/**
 * Thêm một tài khoản mới.
 */
export const addAccount = (accountData) => api.post('/api/admin/users', accountData);

/**
 * Cập nhật một tài khoản.
 */
export const updateAccount = (id, accountData) => api.put(`/api/admin/users/${id}`, accountData);

/**
 * Xóa mềm một tài khoản.
 */
export const deleteAccount = (id) => api.delete(`/api/admin/users/${id}`);