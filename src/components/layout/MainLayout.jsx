// src/components/layout/MainLayout.jsx

import './MainLayout.css';

import { HomeOutlined } from '@ant-design/icons';
import { Drawer, Layout, Menu, Typography } from 'antd';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { themeColors } from '../../configs/theme';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import AppHeader from './AppHeader';
import { menuItems } from './MainMenu';

const { Sider, Content } = Layout;
const { Title } = Typography;

const findBreadcrumbItems = (path, menu) => {
    const items = [];
    items.push({ title: <Link to="/"><HomeOutlined /></Link> });
    for (const item of menu) {
        if (item.key === path) {
            if (item.label) items.push({ title: item.label });
            return items;
        }
        if (item.children) {
            const child = item.children.find(child => child.key === path);
            if (child) {
                if (item.label) items.push({ title: item.label });
                if (child.label) items.push({ title: child.label });
                return items;
            }
        }
    }
    return items;
};

const renderMenuItems = (items) => {
    return items.map((item) => {
        if (item.type === 'divider') return { type: 'divider' };
        if (item.type === 'group') {
            return {
                key: item.key || `group-${item.label}`,
                type: 'group',
                label: item.label,
            };
        }
        const label = item.isLink ? <Link to={item.key}>{item.label}</Link> : item.label;
        if (item.children) {
            return {
                key: item.key,
                icon: item.icon,
                label: item.label,
                children: renderMenuItems(item.children)
            }
        }
        return {
            key: item.key,
            icon: item.icon,
            label: label,
        }
    })
};

const MainLayout = () => {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [collapsed, setCollapsed] = useState(isMobile);
    const location = useLocation();

    // --- LOGIC MỚI: Chỉ tự động đóng menu khi chuyển từ desktop sang mobile ---
    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const handleToggleCollapsed = useCallback(() => {
        setCollapsed(prev => !prev);
    }, []);

    const handleCloseDrawer = useCallback(() => {
        setCollapsed(true);
    }, []);

    const getOpenKeys = () => {
        const parent = menuItems.find(item => item.children?.some(child => child.key === location.pathname));
        return parent ? [parent.key] : [];
    };

    const memoizedMenuItems = useMemo(() => renderMenuItems(menuItems), []);
    const breadcrumbItems = useMemo(() => findBreadcrumbItems(location.pathname, menuItems), [location.pathname]);

    const menuContent = (
        <div>
            <div className="h-16 flex items-center justify-center p-4">
                <Title level={4} style={{ color: themeColors.siderHeaderBg }} className="m-0 text-center overflow-hidden whitespace-nowrap">
                    {isMobile ? 'MENU' : (collapsed ? 'A' : 'ADMIN PANEL')}
                </Title>
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                defaultOpenKeys={getOpenKeys()}
                items={memoizedMenuItems}
                onClick={isMobile ? handleCloseDrawer : undefined}
                inlineCollapsed={!isMobile ? collapsed : false}
            />
        </div>
    );

    const siderWidth = !isMobile && collapsed ? 80 : 250;

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {isMobile ? (
                <Drawer
                    placement="left"
                    closable={false}
                    onClose={handleCloseDrawer}
                    open={!collapsed}
                    width={250}
                    bodyStyle={{ padding: 0, backgroundColor: themeColors.siderBg }}
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
                    collapsedWidth={80}
                    style={{
                        overflow: 'auto',
                        height: '100vh',
                        position: 'fixed',
                        left: 0, top: 0, bottom: 0,
                        zIndex: 10,
                    }}
                >
                    {menuContent}
                </Sider>
            )}
            <Layout style={{ marginLeft: isMobile ? 0 : siderWidth, transition: 'margin-left 0.2s' }}>
                <AppHeader collapsed={collapsed} setCollapsed={handleToggleCollapsed} breadcrumbs={breadcrumbItems} />
                <Content className="m-3 p-3 md:m-6 md:p-6 bg-transparent">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;