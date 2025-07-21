import {
    AreaChartOutlined,
    BarChartOutlined,
    BookOutlined,
    DesktopOutlined,
    FileTextOutlined,
    QuestionCircleOutlined,
    SettingOutlined,
    TagOutlined,
    TagsOutlined,
    TeamOutlined,
    UsergroupAddOutlined,
} from '@ant-design/icons';

import { themeColors } from '../../configs/theme';

const styleLabelGroup = {
    fontSize: '13px',
    color: themeColors.menuLabelGroup,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
};

export const menuItems = [
    { key: '/dashboard', icon: <BarChartOutlined />, label: 'Bảng điều khiển', isLink: true },

    { type: 'divider', },
    { key: 'group-customers', type: 'group', label: (<span style={styleLabelGroup}>KHÁCH HÀNG</span>) },

    // { key: '/orders', icon: <AppstoreOutlined />, label: 'Đơn hàng', isLink: true },
    // { key: '/transactions', icon: <DollarCircleOutlined />, label: 'Giao dịch', isLink: true },
    { key: '/customers', icon: <TeamOutlined />, label: 'Khách hàng', isLink: true },

    { type: 'divider' },
    { key: 'group-content-pricing', type: 'group', label: (<span style={styleLabelGroup}>BẢNG GIÁ & NỘI DUNG</span>) },

    // {
    //     key: 'sub_products',
    //     icon: <ShoppingCartOutlined />,
    //     label: 'Source Code',
    //     children: [
    //         { key: '/products', label: 'Danh sách', isLink: true },
    //         { key: '/products/add', label: 'Thêm mới', isLink: true },
    //         { key: '/reviews', label: 'Đánh giá', isLink: true },
    //     ],
    // },
    { key: '/pricing', icon: <TagOutlined />, label: 'Bảng giá', isLink: true },
    {
        key: 'sub_blog',
        icon: <BookOutlined />,
        label: 'Bài viết',
        children: [
            { key: '/blog/posts', label: 'Danh sách bài viết', isLink: true },
            { key: '/blog/posts/add', label: 'Thêm bài viết mới', isLink: true },
        ],
    },
    {
        key: 'sub_guide',
        icon: <QuestionCircleOutlined />,
        label: 'Hướng dẫn',
        children: [
            { key: '/guides', label: 'Danh sách bài hướng dẫn', isLink: true },
            { key: '/guides/add', label: 'Thêm bài hướng dẫn mới', isLink: true },
        ],
    },
    { key: '/pages', icon: <FileTextOutlined />, label: 'Trang tĩnh', isLink: true },
    {
        key: 'sub_categories',
        icon: <TagsOutlined />,
        label: 'Danh mục',
        children: [
            // { key: '/categories/products', label: 'Danh mục sản phẩm', isLink: true },
            { key: '/categories/posts', label: 'Danh mục bài viết', isLink: true },
            { key: '/categories/guides', label: 'Danh mục bài hướng dẫn', isLink: true },
        ],
    },

    { type: 'divider' },
    { key: 'group-system', type: 'group', label: (<span style={styleLabelGroup}>HỆ THỐNG</span>) },

    // { key: '/support', icon: <QuestionCircleOutlined />, label: 'Hỗ trợ khách hàng', isLink: true },
    { key: '/reports', icon: <AreaChartOutlined />, label: 'Báo cáo', isLink: true },
    {
        key: 'sub_settings',
        icon: <SettingOutlined />,
        label: 'Cài đặt',
        children: [
            { key: '/settings/site', label: 'Cài đặt Website', icon: <DesktopOutlined />, isLink: true },
            { key: '/settings/users', label: 'Tài khoản quản trị', icon: <UsergroupAddOutlined />, isLink: true },
            // { key: '/settings/general', label: 'Cài đặt chung', icon: <SettingOutlined />, isLink: true },
            // { key: '/settings/licenses', label: 'Quản lý giấy phép', icon: <FileProtectOutlined />, isLink: true },
            // { key: '/settings/payments', label: 'Cổng thanh toán', icon: <WalletOutlined />, isLink: true },
            // { key: '/settings/emails', label: 'Mẫu Email', icon: <MailOutlined />, isLink: true },
        ],
    },
];