import api from "./api";

/**
 * Lấy danh sách các gói giá từ server.
 * @param {object} params - Các tham số cho việc lọc và phân trang (page, limit, sort_by, etc.)
 */
export const getPricingPackages = (params) => api.get('/api/admin/pricing-packages', { params });
export const getPricingPackagesId = (id) => api.get(`/api/admin/pricing-packages/${id}`);

/**
 * Tạo một gói giá mới.
 * @param {object} packageData - Dữ liệu của gói giá mới.
 */
export const createPricingPackage = (categoryData) => api.post('/api/admin/pricing-packages', categoryData);


/**
 * Cập nhật một gói giá.
 * @param {number} id - ID của gói giá.
 * @param {object} packageData - Dữ liệu cần cập nhật.
 */
export const updatePricingPackage = (id, categoryData) => api.put(`/api/admin/pricing-packages/${id}`, categoryData);


/**
 * Xóa một gói giá.
 * @param {number} id - ID của gói giá cần xóa.
 */
export const deletePricingPackage = (id) => api.delete(`/api/admin/pricing-packages/${id}`);
