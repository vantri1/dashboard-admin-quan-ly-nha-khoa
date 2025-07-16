// src/services/categoryService.js

import api from "./api";


/**
 * Lấy danh sách danh mục với các tham số.
 * @param {object} params - Các tham số truy vấn (page, limit, search, sort_by, sort_order)
 * @returns {Promise<any>}
 */
export const getCategories = (params) => {
    // axios tự động chuyển đổi object params thành query string
    return api.get('/api/admin/categories', { params });
};

/**
 * Thêm một danh mục mới.
 * @param {object} categoryData - Dữ liệu của danh mục mới
 * @returns {Promise<any>}
 */
export const addCategory = (categoryData) => {
    return api.post('/api/admin/categories', categoryData);
};

/**
 * Cập nhật một danh mục.
 * @param {number} id - ID của danh mục
 * @param {object} categoryData - Dữ liệu cập nhật
 * @returns {Promise<any>}
 */
export const updateCategory = (id, categoryData) => {
    return api.put(`/api/admin/categories/${id}`, categoryData);
};

/**
 * Xóa mềm một danh mục.
 * @param {number} id - ID của danh mục
 * @returns {Promise<any>}
 */
export const deleteCategory = (id) => {
    return api.delete(`/api/admin/categories/${id}`);
};

/**
 * Xóa mềm nhiều danh mục.
 * @param {Array<number>} ids - Mảng các ID cần xóa
 * @returns {Promise<any>}
 */
export const bulkDeleteCategories = (ids) => {
    return api.post('/api/admin/categories/bulk-delete', { ids });
};

// --- Bạn có thể thêm các hàm khác như restore, forceDelete ở đây ---
// export const restoreCategory = (id) => {
//     return api.post(`/api/admin/categories/${id}/restore`);
// };