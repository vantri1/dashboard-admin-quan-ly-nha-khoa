// src/contexts/AuthContext.jsx

// import { useNavigate } from 'react-router-dom'; // XÓA DÒNG NÀY
import { message } from 'antd';
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

// AuthProvider sẽ nhận `Maps` và `location` từ props nếu cần, hoặc không dùng navigate trực tiếp
export const AuthProvider = ({ children }) => { // XÓA navigate ở đây, sẽ xử lý chuyển hướng ở component khác
    const [adminToken, setAdminToken] = useState(localStorage.getItem('admin_token'));
    const [adminInfo, setAdminInfo] = useState(() => {
        try {
            const storedInfo = localStorage.getItem('admin_info');
            return storedInfo ? JSON.parse(storedInfo) : null;
        } catch (error) {
            console.error("Failed to parse admin_info from localStorage", error);
            return null;
        }
    });
    const [isAuthenticated, setIsAuthenticated] = useState(!!adminToken);
    // const navigate = useNavigate(); // XÓA DÒNG NÀY

    // Cập nhật trạng thái xác thực khi token thay đổi
    useEffect(() => {
        setIsAuthenticated(!!adminToken);
        if (adminToken) {
            localStorage.setItem('admin_token', adminToken);
            if (adminInfo) {
                localStorage.setItem('admin_info', JSON.stringify(adminInfo));
            }
        } else {
            localStorage.removeItem('admin_token');
            localStorage.removeItem('admin_info');
        }
    }, [adminToken, adminInfo]);

    // Hàm login sẽ không gọi navigate trực tiếp nữa
    const login = (token, adminData) => {
        setAdminToken(token);
        setAdminInfo(adminData);
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_info', JSON.stringify(adminData));
        message.success('Đăng nhập thành công!');
        // CHUYỂN HƯỚNG SẼ XẢY RA Ở LoginPage.jsx sau khi gọi hàm `login` này
    };

    // Hàm logout cũng sẽ không gọi navigate trực tiếp nữa
    const logout = async () => {
        setAdminToken(null);
        setAdminInfo(null);
        message.info('Bạn đã đăng xuất.');
        // CHUYỂN HƯỚNG SẼ XẢY RA Ở AppHeader.jsx hoặc ProtectedRoute (nếu cần) sau khi gọi hàm `logout` này
    };

    const value = {
        adminToken,
        adminInfo,
        isAuthenticated,
        login,
        logout,
        setAdminToken
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};