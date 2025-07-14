// src/pages/Pages/StaticPageEditPage.jsx

import { message, Typography } from "antd";
import { useNavigate, useParams } from "react-router-dom";

import StaticPageForm from "../../components/StaticPages/StaticPageForm";

//... (các import giữ nguyên)
const { Title } = Typography;

// --- CẬP NHẬT DỮ LIỆU MẪU VỚI CÁC TRƯỜNG SEO ---
const mockPages = {
    '1': {
        title: 'Chính sách Bảo mật',
        slug: '/chinh-sach-bao-mat',
        content: '<p>Đây là <strong>nội dung chi tiết</strong> của trang chính sách bảo mật...</p>',
        seo_title: 'Chính sách Bảo mật Thông tin | Tên Công Ty',
        meta_description: 'Tìm hiểu cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.'
    },
    '2': {
        title: 'Điều khoản Sử dụng',
        slug: '/dieu-khoan-su-dung',
        content: '<p>Đây là nội dung của trang điều khoản sử dụng...</p>',
        seo_title: '',
        meta_description: ''
    },
    '3': {
        title: 'Câu hỏi thường gặp (FAQ)',
        slug: '/hoi-dap',
        content: '<h2>Mục 1</h2><p>Câu trả lời 1...</p>',
        seo_title: 'Hỏi Đáp - Giải đáp mọi thắc mắc về Dịch vụ',
        meta_description: 'Tìm câu trả lời cho các câu hỏi phổ biến nhất về sản phẩm, dịch vụ, và chính sách của chúng tôi tại đây.'
    },
};

const StaticPageEditPage = () => {
    const navigate = useNavigate();
    const { pageId } = useParams();
    const pageData = mockPages[pageId];

    const handleFinish = (values) => {
        console.log('Updated page data:', values);
        message.success(`Cập nhật trang "${values.title}" thành công!`);
        navigate('/pages');
    };

    if (!pageData) return <Title level={2}>Không tìm thấy trang!</Title>;

    return (
        <>
            <Title level={3} className="mb-4">Chỉnh sửa Trang: {pageData.title}</Title>
            <StaticPageForm onFinish={handleFinish} initialValues={pageData} />
        </>
    );
};

export default StaticPageEditPage;