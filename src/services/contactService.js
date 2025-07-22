
import api from './api'; // Giả sử bạn có một file cấu hình axios instance là api.js

/**
 * Xử lý lỗi API một cách tập trung.
 */

/**
 * Lấy danh sách liên hệ với các tham số.
 * @param {object} params - Các tham số (page, limit, search_term, status, sort_by, sort_order)
 */
export const getContacts = (params) => api.get('/api/admin/contacts', { params });

/**
 * Cập nhật một liên hệ (thường là trạng thái và ghi chú).
 * @param {number} id - ID của liên hệ.
 * @param {object} data - Dữ liệu cập nhật (ví dụ: { status: 'replied', notes: 'Đã gọi điện.' })
 */
export const updateContact = (id, data) => api.put(`/api/admin/contacts/${id}`, data);

/**
 * Xóa một liên hệ.
 * @param {number} id - ID của liên hệ.
 */
export const deleteContact = (id) => api.delete(`/api/admin/contacts/${id}`);
