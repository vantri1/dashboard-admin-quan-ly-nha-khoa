import './MainLayout.css'

import {
    HomeOutlined,
} from '@ant-design/icons';
import { Drawer, Layout, Menu, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { themeColors } from '../../configs/theme';
import AppHeader from './AppHeader';
import { menuItems } from './MainMenu';

const { Sider, Content } = Layout;
const { Title } = Typography;

// Hook để kiểm tra kích thước màn hình
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);
    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [matches, query]);
    return matches;
};

// Hàm render menu items với thẻ Link
const renderMenuItems = (items, collapsed) => {
    return items.map((item, index) => {
        if (item.type === 'divider') return { type: 'divider' };

        if (item.type === 'group') {
            return {
                key: item.key || `group_${index}`,
                type: 'group',
                label: collapsed ? null : item.label, // Nếu collapsed, không hiển thị label
            };
        }

        const label = item.isLink ? <Link to={item.key}>{item.label}</Link> : item.label;

        if (item.children) {
            return {
                key: item.key,
                icon: item.icon,
                label: item.label,
                children: renderMenuItems(item.children, collapsed)
            }
        }
        return {
            key: item.key,
            icon: item.icon,
            label: label,
        }
    })
}

// --- LOGIC MỚI ĐỂ TẠO BREADCRUMB ---
const findBreadcrumbItems = (path, menu) => {
    const items = [];
    // Thêm trang chủ vào breadcrumb
    items.push({ title: <Link to="/"><HomeOutlined /></Link> });

    for (const item of menu) {
        if (item.key === path) {
            items.push({ title: item.label });
            return items;
        }
        if (item.children) {
            for (const child of item.children) {
                if (child.key === path) {
                    items.push({ title: item.label }); // Thêm menu cha
                    items.push({ title: child.label }); // Thêm menu con
                    return items;
                }
            }
        }
    }
    return items;
};


const MainLayout = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [collapsed, setCollapsed] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (isMobile) {
            setCollapsed(true);
        } else {
            setCollapsed(false);
        }
    }, [isMobile]);

    // Tìm key của sub-menu đang mở để highlight chính xác
    const getOpenKeys = () => {
        const parent = menuItems.find(item => item.children?.some(child => child.key === location.pathname));
        return parent ? [parent.key] : [];
    };

    const menuContent = (
        <div>
            <div className="h-16 flex items-center justify-center p-4">
                <Title level={4} style={{ color: themeColors.siderHeaderBg }} className="m-0 text-center overflow-hidden whitespace-nowrap">
                    {/* Trên mobile, không hiển thị chữ khi menu trong Drawer */}
                    {isMobile ? 'MENU' : (collapsed ? 'A' : 'ADMIN PANEL')}
                </Title>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={getOpenKeys()}
                items={renderMenuItems(menuItems, collapsed)}
                onClick={isMobile ? () => setCollapsed(true) : undefined}
            />
        </div>
    );

    // Tạo breadcrumb items dựa trên location.pathname
    const breadcrumbItems = findBreadcrumbItems(location.pathname, menuItems);

    const siderWidth = collapsed ? 80 : 250;
    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isMobile ? (
                // --- GIAO DIỆN TRÊN MOBILE: SỬ DỤNG DRAWER ---
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={() => setCollapsed(true)}
                    open={!collapsed}
                    width={250}
                    style={{ padding: 0, backgroundColor: themeColors.siderBg }}
                >
                    {menuContent}
                </Drawer>
            ) : (
                <Sider
                    className='custom-scrollbar'
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    width={250}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        zIndex: 10,
                    }}
                >
                    {menuContent}
                </Sider>
            )}
            <Layout style={{ marginLeft: isMobile ? 0 : siderWidth, transition: 'margin-left 0.2s' }}>
                {/* --- Truyền breadcrumbs vào AppHeader --- */}
                <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} breadcrumbs={breadcrumbItems} />
                <Content className="m-3 p-3 md:m-6 md:p-6 bg-transparent">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;