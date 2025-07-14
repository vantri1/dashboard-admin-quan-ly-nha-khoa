// src/pages/Guides/GuideAddPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import GuideForm from '../../components/guides/GuideForm';

const { Title } = Typography;

const GuideAddPage = () => {
    const navigate = useNavigate();
    const handleFinish = (values) => {
        console.log('New guide data:', values);
        message.success('Thêm hướng dẫn mới thành công!');
        navigate('/guides');
    };

    return (
        <><Title level={3} className="mb-4">Tạo hướng dẫn mới</Title><GuideForm onFinish={handleFinish} /></>
    );
};

export default GuideAddPage;