// src/services/categoryService.js

import api from "./api";


/**
 * Lấy danh sách danh mục với các tham số.
 * @param {object} params - Các tham số truy vấn (page, limit, search, sort_by, sort_order)
 * @returns {Promise<any>}
 */
export const getPosts = (params) => api.get('/api/admin/posts', { params });
export const getPostById = (id) => api.get(`/api/admin/posts/${id}`);
/**
 * Thêm một danh mục mới.
 * @param {object} categoryData - Dữ liệu của danh mục mới
 * @returns {Promise<any>}
 */
export const addPost = (categoryData) => api.post('/api/admin/posts', categoryData);

/**
 * Cập nhật một danh mục.
 * @param {number} id - ID của danh mục
 * @param {object} categoryData - Dữ liệu cập nhật
 * @returns {Promise<any>}
 */
export const updatePost = (id, categoryData) => api.put(`/api/admin/posts/${id}`, categoryData);

/**
 * Xóa mềm một danh mục.
 * @param {number} id - ID của danh mục
 * @returns {Promise<any>}
 */
export const deletePost = (id) => api.delete(`/api/admin/posts/${id}`);

/**
 * Xóa mềm nhiều danh mục.
 * @param {Array<number>} ids - Mảng các ID cần xóa
 * @returns {Promise<any>}
 */
export const bulkDeletePosts = (ids) => api.post('/api/admin/posts/bulk-delete', { ids });

export const restorePost = (id) => api.post(`/api/admin/posts/${id}/restore`);
export const bulkRestorePosts = (ids) => api.post('/api/admin/posts/bulk-restore', { ids });
export const forceDeletePost = (id) => api.delete(`/api/admin/posts/${id}/force`);
export const bulkForceDeletePosts = (ids) => api.post('/api/admin/posts/bulk-force-delete', { ids });