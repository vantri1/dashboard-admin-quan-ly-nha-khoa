import { Typography } from 'antd';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import MainLayout from '../components/layout/MainLayout';
import { useAuth } from '../contexts/AuthContext';
import AccountAddPage from '../pages/Accounts/AccountAddPage';
import AccountEditPage from '../pages/Accounts/AccountEditPage';
import AccountListPage from '../pages/Accounts/AccountListPage';
import LoginPage from '../pages/Auth/LoginPage';
import CategoryGuideListPage from '../pages/Categories/CategoryGuideListPage';
import CategoryPostListPage from '../pages/Categories/CategoryPostListPage';
import CategoryProductListPage from '../pages/Categories/CategoryProductListPage';
import CustomerListPage from '../pages/Customers';
import CustomerDetailPage from '../pages/Customers/CustomerDetailPage';
import DashboardPage from '../pages/DashboardPage';
import GuideAddPage from '../pages/Guides/GuideAddPage';
import GuideEditPage from '../pages/Guides/GuideEditPage';
import GuideListPage from '../pages/Guides/GuideListPage';
import NotFoundPage from '../pages/NotFoundPage';
import PostListPage from '../pages/Posts';
import PostAddPage from '../pages/Posts/PostAddPage';
import PostEditPage from '../pages/Posts/PostEditPage';
import PricingListPage from '../pages/Pricing';
import ProductListPage from '../pages/Products';
import ProductAddPage from '../pages/Products/ProductAddPage';
import ProductEditPage from '../pages/Products/ProductEditPage';
import SiteSettingsPage from '../pages/Settings/SiteSettingsPage';
import StaticPageListPage from '../pages/StaticPages';
import StaticPageEditPage from '../pages/StaticPages/StaticPageEditPage';
const { Title } = Typography;

// --- Tự động import các trang từ thư mục pages ---
// (Tạm thời chúng ta sẽ dùng placeholder cho các trang chưa tạo)
// const OrderListPage = () => <Title level={3}>Danh sách đơn hàng</Title>;
// const OrderDetailPage = () => <Title level={3}>Chi tiết đơn hàng</Title>;
// const ReviewListPage = () => <Title level={3}>Quản lý đánh giá</Title>;
// const DiscountListPage = () => <Title level={3}>Quản lý mã giảm giá</Title>;
// const TransactionListPage = () => <Title level={3}>Quản lý giao dịch</Title>;
// const SettingsPage = () => <Title level={3}>Cài đặt chung</Title>;
// const NotFoundPage = () => <Title level={3}>404 - Trang không tồn tại</Title>;

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Lấy trạng thái xác thực từ contex
    // const isAuthenticated = true;

    if (!isAuthenticated) {
        // Nếu chưa xác thực, chuyển hướng đến trang đăng nhập
        return <Navigate to="/login" replace />;
    }

    // Nếu đã xác thực, hiển thị các component con
    return children;
};
export const router = createBrowserRouter([
    // --- Các Route sử dụng Layout Admin ---
    {
        path: '/',
        element:
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>,
        children: [
            // Điều hướng từ "/" sang "/dashboard"
            { index: true, element: <Navigate to="/dashboard" replace /> },
            { path: 'dashboard', element: <DashboardPage /> },

            // Quản lý sản phẩm (Source Code)
            { path: 'products', element: <ProductListPage /> },
            { path: 'products/add', element: <ProductAddPage /> },
            { path: 'products/edit/:productId', element: <ProductEditPage /> },// Dùng param để biết sửa sản phẩm nào

            // Quản lý bảng giá
            { path: 'pricing', element: <PricingListPage /> },

            // Quản lý danh mục
            { path: 'categories/products', element: <CategoryProductListPage /> },
            { path: 'categories/posts', element: <CategoryPostListPage /> },
            { path: 'categories/guides', element: <CategoryGuideListPage /> },

            // // Quản lý đơn hàng
            // { path: 'orders', element: <OrderListPage /> },
            // { path: 'orders/:orderId', element: <OrderDetailPage /> },

            // Quản lý khách hàng
            { path: 'customers', element: <CustomerListPage /> },
            { path: 'customers/:customerId', element: <CustomerDetailPage /> },

            // // Quản lý đánh giá & bình luận
            // { path: 'reviews', element: <ReviewListPage /> },

            // // Quản lý Marketing
            // { path: 'discounts', element: <DiscountListPage /> },

            // // Tài chính
            // { path: 'transactions', element: <TransactionListPage /> },

            // Quản lý nội dung bài viết
            { path: 'blog/posts', element: <PostListPage /> },
            { path: 'blog/posts/add', element: <PostAddPage /> },
            { path: 'blog/posts/edit/:postId', element: <PostEditPage /> },

            // Quản lý nội dung bài hướng dẫn
            { path: 'guides', element: <GuideListPage /> },
            { path: 'guides/add', element: <GuideAddPage /> },
            { path: 'guides/edit/:guideId', element: <GuideEditPage /> },

            // Quản lý trang tĩnh
            { path: 'pages', element: <StaticPageListPage /> },
            { path: 'pages/edit/:pageId', element: <StaticPageEditPage /> },


            // Cài đặt hệ thống
            // { path: 'settings', element: <SettingsPage /> },
            { path: 'settings/site', element: <SiteSettingsPage /> },

            // Quản lý tài khoản quản trị
            { path: 'settings/users', element: <AccountListPage /> },
            { path: 'settings/users/add', element: <AccountAddPage /> },
            { path: 'settings/users/edit/:accountId', element: <AccountEditPage /> },
        ],
    },

    // --- Các Route không sử dụng Layout Admin ---
    {
        path: '/login',
        element: <LoginPage />,
    },

    // --- Route cho trang 404 ---
    {
        path: '*',
        element: <NotFoundPage />,
    }
]);