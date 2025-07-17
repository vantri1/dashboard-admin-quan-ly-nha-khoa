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
    // (error) => {
    // if (error.response) {
    //     const { status, data } = error.response;
    //     let errorMessage = data.message || 'Có lỗi xảy ra từ server.';

    //     switch (status) {
    //         case 400:
    //             message.error(`Lỗi dữ liệu: ${errorMessage}`);
    //             break;
    //         case 401:
    //             message.error(`Không xác thực: ${errorMessage}`);
    //             // Có thể chuyển hướng về trang đăng nhập nếu token hết hạn
    //             // window.location.href = '/login';
    //             break;
    //         case 403:
    //             message.error(`Không có quyền: ${errorMessage}`);
    //             break;
    //         case 404:
    //             message.error(`Không tìm thấy tài nguyên: ${errorMessage}`);
    //             break;
    //         case 409:
    //             message.error(`Xung đột dữ liệu: ${errorMessage}`);
    //             break;
    //         case 500:
    //             message.error(`Lỗi server nội bộ: ${errorMessage}`);
    //             break;
    //         default:
    //             message.error(`Lỗi: ${errorMessage} (Mã: ${status})`);
    //     }
    // } else if (error.request) {
    //     message.error('Không có phản hồi từ server. Vui lòng kiểm tra kết nối mạng.');
    // } else {
    //     message.error(`Lỗi yêu cầu: ${error.message}`);
    // }
);

export default api;