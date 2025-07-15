// src/services/api.js

import axios from 'axios';

// Đặt URL API backend của bạn vào đây
// Đảm bảo nó khớp với Virtual Host bạn đã cấu hình trong Laragon
const API_BASE_URL = 'http://localhost:8008'; // THAY THẾ BẰNG URL BACKEND THỰC TẾ CỦA BẠN!

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
        return response;
    },
    (error) => {
        // Xử lý lỗi tập trung, ví dụ: nếu token hết hạn hoặc không hợp lệ (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Có thể tự động đăng xuất người dùng ở đây
            // Để làm được điều này, chúng ta cần truy cập vào logout function từ AuthContext.
            // Điều này phức tạp hơn một chút với interceptor vì nó nằm ngoài React Component.
            // Tạm thời, chúng ta sẽ chỉ hiển thị lỗi và để việc logout được trigger bởi component.
            console.error("Unauthorized request, token might be invalid or expired.");
            // message.error('Phiên làm việc đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.');
            // window.location.href = '/login'; // Chuyển hướng thủ công (có thể gây lỗi React Router)
        }
        return Promise.reject(error);
    }
);

export default api;