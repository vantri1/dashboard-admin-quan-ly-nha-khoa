// src/pages/Guides/GuideAddPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import GuideForm from '../../components/guides/GuideForm';
import { addPost } from '../../services/postServer';

const { Title } = Typography;

const GuideAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            const response = await addPost(values);
            message.success(response.message || 'Thêm bài viết hưỡng dẫn mới thành công!');
            navigate('/guides');
        } catch (error) {
            console.error('Failed to add post:', error);
            message.error('Không thể thêm bài viết hướng dẫn: ', error);
        }


    };

    return (
        <><Title level={3} className="mb-4">Tạo hướng dẫn mới</Title><GuideForm onFinish={handleFinish} /></>
    );
};

export default GuideAddPage;