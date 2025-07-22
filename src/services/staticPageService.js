import api from "./api";

/**
 * Lấy danh sách các gói giá từ server.
 * @param {object} params - Các tham số cho việc lọc và phân trang (page, limit, sort_by, etc.)
 */
export const getStaticPages = (params) => api.get('/api/admin/static-pages', { params });
export const getStaticPagesId = (id) => api.get(`/api/admin/static-pages/${id}`);

/**
 * Tạo một gói giá mới.
 * @param {object} packageData - Dữ liệu của gói giá mới.
 */
export const createStaticPage = (categoryData) => api.post('/api/admin/static-pages', categoryData);


/**
 * Cập nhật một gói giá.
 * @param {number} id - ID của gói giá.
 * @param {object} packageData - Dữ liệu cần cập nhật.
 */
export const updateStaticPage = (id, categoryData) => api.put(`/api/admin/static-pages/${id}`, categoryData);


/**
 * Xóa một gói giá.
 * @param {number} id - ID của gói giá cần xóa.
 */
export const deleteStaticPage = (id) => api.delete(`/api/admin/static-pages/${id}`);
