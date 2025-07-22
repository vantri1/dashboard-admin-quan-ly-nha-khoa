import api from './api'; // Giả sử bạn có file cấu hình axios

/**
 * Lấy tất cả cài đặt từ server.
 */
export const getSettings = () => api.get('/api/admin/settings');

/**
 * Cập nhật cài đặt.
 * @param {object} settingsObject - Một object chứa các cài đặt.
 */
export const updateSettings = (settingsObject) => {
    // Chuyển đổi object từ form thành định dạng mảng mà backend yêu cầu.
    const settingsPayload = Object.keys(settingsObject).map(key => ({
        key: key,
        value: settingsObject[key],
        // Mặc định is_public, bạn có thể thêm logic để quản lý cờ này nếu cần.
        is_public: true
    }));

    return api.put('/api/admin/settings', { settings: settingsPayload });
};