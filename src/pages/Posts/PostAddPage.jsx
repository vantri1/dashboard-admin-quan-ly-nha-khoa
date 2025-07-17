// src/pages/Posts/PostAddPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import PostForm from '../../components/posts/PostForm';
import { addPost } from '../../services/postServer';

const { Title } = Typography;

const PostAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            const response = await addPost(values);
            message.success(response.message || 'Thêm bài viết mới thành công!');
            navigate('/blog/posts');
        } catch (error) {
            console.error('Failed to add post:', error);
            message.error('Không thể thêm bài viết: ', error);
        }
    };

    return (
        <>
            <Title level={3} className='mb-4'>Soạn bài viết mới</Title>
            <PostForm onFinish={handleFinish} />
        </>
    );
};

export default PostAddPage;