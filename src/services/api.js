// src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Tạo một instance Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Thêm interceptor để đính kèm JWT token vào mỗi request (nếu có)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Thêm interceptor để xử lý lỗi phản hồi
api.interceptors.response.use(
    (response) => {
        // Với các request thành công, trả về thẳng data
        return response.data;
    },
    (error) => {
        // --- PHIÊN BẢN SỬA LỖI ---
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data || {};

            // SỬA ĐỔI 1: Ưu tiên xử lý lỗi 401 trước tiên
            if (status === 401) {
                // Xử lý dứt điểm tại đây và không chạy code bên dưới
                localStorage.removeItem('admin_info');
                localStorage.removeItem('admin_token');
                window.location.href = '/login';

                // SỬA ĐỔI 2: Ngăn không cho promise tiếp tục bị reject, tránh các .catch() khác chạy gây ra lỗi không mong muốn
                return new Promise(() => { });
            }

            // Nếu không phải lỗi 401, thì lấy message lỗi theo thứ tự ưu tiên
            const errorMessage = data.message || error.message || 'Có lỗi xảy ra, vui lòng thử lại.';
            return Promise.reject(new Error(errorMessage));

        } else if (error.request) {
            // Lỗi mạng
            const networkError = new Error('Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại kết nối mạng.');
            return Promise.reject(networkError);
        } else {
            // Các lỗi khác
            return Promise.reject(error);
        }
    }
);

export default api;