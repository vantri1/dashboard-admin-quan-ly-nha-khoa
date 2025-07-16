// src/services/api.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8008';

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
        // ================== SỬA LỖI TẠI ĐÂY ==================
        // Với các request thành công (status 2xx), trả về thẳng `response.data`
        // `response.data` chính là object mà PHP backend đã `json_encode`
        return response.data;
        // ======================================================
    },
    (error) => {
        // Phần xử lý lỗi của bạn đã rất tốt, giữ nguyên và cải tiến một chút
        let errorMessage = 'Có lỗi xảy ra, vui lòng thử lại.';

        if (error.response) {
            // Lỗi từ server (status code không phải 2xx)
            // Ưu tiên lấy trường `message` từ trong body của lỗi
            if (error.response.data && error.response.data.message) {
                errorMessage = error.response.data.message;
            } else if (error.response.status === 401) {
                errorMessage = 'Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.';
                // Ở đây bạn có thể thêm logic để tự động đăng xuất
                // localStorage.removeItem('authToken');
                // window.location.href = '/login';
            }
        } else if (error.request) {
            // Lỗi mạng hoặc không nhận được phản hồi
            errorMessage = 'Không thể kết nối tới máy chủ.';
        } else {
            // Các lỗi khác
            errorMessage = error.message;
        }

        // `Promise.reject` với một đối tượng Error mới chứa thông điệp đã được làm sạch.
        return Promise.reject(new Error(errorMessage));
    }
);

export default api;