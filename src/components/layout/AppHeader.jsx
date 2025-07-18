// src/components/layout/AppHeader.jsx

import './AppHeader.css'

import {
    BellOutlined,
    CompressOutlined,
    ExpandOutlined,
    LogoutOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SettingOutlined,
    SunOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Avatar, Badge, Breadcrumb, Button, Dropdown, Layout, Space, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { themeColors } from '../../configs/theme';
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQuery } from '../../hooks/useMediaQuery';
const { Header } = Layout;
const { Text } = Typography;


// --- COMPONENT ĐƯỢC CẬP NHẬT ---
const AppHeader = ({ collapsed, setCollapsed, breadcrumbs }) => {
    // Thêm prop "breadcrumbs"
    const [isFullscreen, setIsFullscreen] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const { logout } = useAuth();

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);

        // Dọn dẹp listener khi component bị unmount
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    // Menu cho dropdown của User
    const userMenu = [
        { key: '1', icon: <UserOutlined />, label: 'Hồ sơ' },
        { key: '2', icon: <SettingOutlined />, label: 'Cài đặt' },
        { type: 'divider' },
        {
            key: '3',
            icon: <LogoutOutlined />,
            label: 'Đăng xuất',
            danger: true,
            onClick: () => {
                logout()
                Navigate('/login');
            },
        },
    ];
    return (
        <Header
            className="flex items-center justify-between"
            style={{
                padding: '0 24px',
                backgroundColor: themeColors.headerBg,
                position: 'sticky',
                top: 0,
                zIndex: 10,
                width: '100%',
                // Thêm một đường viền mỏng hoặc bóng mờ để tách biệt header
                boxShadow: '0 1px 4px rgba(0, 21, 41, 0.08)',
            }}
        >
            {/* --- Phần bên trái: Nút thu gọn và Breadcrumb --- */}
            <Space align="center" content='justìy' size="middle">
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{ fontSize: '16px' }}
                />
                {/* Hiển thị Breadcrumb được truyền từ MainLayout */}
                <Breadcrumb items={breadcrumbs} />
            </Space>

            {/* --- Phần bên phải: Các icon chức năng --- */}
            <Space align="center" content='justìy' size="middle">
                <Button type="text" shape="circle" icon={<SunOutlined />} />
                {!isMobile && (
                    <Button
                        type="text"
                        shape="circle"
                        icon={isFullscreen ? <CompressOutlined /> : <ExpandOutlined />}
                        onClick={toggleFullScreen}
                    />
                )}

                <Badge count={4}>
                    <Button type="text" shape="circle" icon={<BellOutlined />} />
                </Badge>
                <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
                    {/* Sử dụng Button làm trigger. onClick của Button sẽ bị ghi đè bởi Dropdown */}
                    <Button
                        type="text" // Kiểu nút văn bản để trông không giống nút khối
                        style={{ padding: 0, height: 'auto' }} // Loại bỏ padding và height mặc định của button
                        className="flex items-center cursor-pointer header-dropdown-trigger" // Thêm class để căn chỉnh nội dung
                        onClick={(e) => e.preventDefault()} // Ngăn chặn hành vi mặc định của button nếu Dropdown không xử lý
                    >
                        <Space> {/* Bọc Avatar và Text trong Space để có khoảng cách */}
                            <Avatar
                                src="https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
                            />
                            <Text>Admin</Text>
                        </Space>
                    </Button>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default AppHeader;