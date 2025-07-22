
import api from './api'; // Giả sử bạn có một file cấu hình axios instance là api.js


/**
 * Lấy danh sách khách hàng với các tham số.
 * @param {object} params - Các tham số truy vấn (page, limit, search_term, sort_by, sort_order)
 * @returns {Promise<any>}
 */
export const getCustomers = (params) => api.get('/api/admin/customers', { params });


export const getCustomerById = (id) => api.get(`/api/admin/customers/${id}`);


export const addCustomer = async (customerData) => api.post('/api/admin/customers', customerData);

/**
 * Cập nhật thông tin một khách hàng.
 * @param {number} id - ID của khách hàng.
 * @param {object} customerData - Dữ liệu cần cập nhật.
 */
export const updateCustomer = async (id, customerData) => api.put(`/api/admin/customers/${id}`, customerData);


/**
 * Xóa mềm một khách hàng.
 * @param {number} id - ID của khách hàng
 * @returns {Promise<any>}
 */
export const deleteCustomer = (id) => api.delete(`/api/admin/customers/${id}`);

/**
 * Xóa mềm nhiều khách hàng.
 * @param {Array<number>} ids - Mảng các ID cần xóa
 * @returns {Promise<any>}
 */
export const bulkDeleteCustomers = async (ids) => {
    // Lưu ý: Backend của bạn hiện chưa có route cho bulk-delete customer.
    // Khi bạn thêm route POST /api/admin/customers/bulk-delete, bạn có thể bỏ comment phần dưới đây.
    /*
    try {
        const response = await api.post('/api/admin/customers/bulk-delete', { ids });
        return response.data;
    } catch (error) {
        console.error('Lỗi khi thực hiện xóa hàng loạt.', error);
        message.error(error.response?.data?.message || 'Lỗi khi thực hiện xóa hàng loạt.');
        throw error;
    }
    */

    // Giả lập cho mục đích demo và thông báo cho người dùng
    return Promise.resolve({ message: `Tính năng đang được phát triển.` });
};