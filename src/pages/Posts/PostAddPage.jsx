// src/pages/Posts/PostAddPage.jsx

import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PostForm from '../../components/posts/PostForm';

const { Title } = Typography;

const PostAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = (values) => {
        console.log('Post data to submit:', values);
        // Logic: Gửi dữ liệu `values` lên server qua API
        message.success('Thêm bài viết mới thành công!');
        navigate('/blog/posts'); // Chuyển hướng về trang danh sách
    };

    return (
        <>
            <Title level={3} className='mb-4'>Soạn bài viết mới</Title>
            <PostForm onFinish={handleFinish} />
        </>
    );
};

export default PostAddPage;