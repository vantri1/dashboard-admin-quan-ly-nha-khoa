// src/pages/Posts/PostEditPage.jsx

import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PostForm from '../../components/posts/PostForm';

const { Title } = Typography;

// --- DỮ LIỆU GIẢ LẬP ---
const mockPosts = {
    '1': { title: 'Hướng dẫn sử dụng React Hook', author: 'Admin', category: 'Hướng dẫn Lập trình', tags: ['react', 'hook'], status: 'Published', excerpt: 'Mô tả ngắn...', content: 'Nội dung chi tiết...', seo_title: 'Hướng dẫn sử dụng React Hook || Title', slug: 'huong-dan-su-dung-react-hook', meta_description: 'Mô tả: Hướng dẫn sử dụng React Hook', meta_keywords: ['lập trình', 'hướng dẫn'] },
    '2': { title: 'Tin tức về phiên bản Vue 3.5', author: 'Editor', category: 'Tin tức Công nghệ', tags: ['vue', 'news'], status: 'Published', excerpt: 'Mô tả ngắn...', content: 'Nội dung chi tiết...', seo_title: 'Hướng dẫn sử dụng React Hook || Title', slug: 'huong-dan-su-dung-react-hook', meta_description: 'Mô tả: Hướng dẫn sử dụng React Hook' },
    '3': { title: 'Top 5 mẹo tối ưu code CSS', author: 'Admin', category: 'Thủ thuật & Mẹo', tags: ['css', 'tips'], status: 'Draft', excerpt: 'Mô tả ngắn...', content: 'Nội dung chi tiết...', seo_title: 'Hướng dẫn sử dụng React Hook || Title', slug: 'huong-dan-su-dung-react-hook', meta_description: 'Mô tả: Hướng dẫn sử dụng React Hook' },
};


const PostEditPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams(); // Lấy postId từ URL

    // Trong thực tế, bạn sẽ dùng postId để fetch dữ liệu từ API
    const postData = mockPosts[postId];

    const handleFinish = (values) => {
        console.log('Updated post data:', values);
        // Logic: Gửi dữ liệu cập nhật lên server
        message.success('Cập nhật bài viết thành công!');
        navigate('/blog/posts');
    };

    if (!postData) {
        return <Title level={2}>Không tìm thấy bài viết!</Title>;
    }

    return (
        <>
            <Title level={3} className='mb-4'>Chỉnh sửa Bài viết: {postData.title}</Title>
            <PostForm onFinish={handleFinish} initialValues={postData} />
        </>
    );
};

export default PostEditPage;