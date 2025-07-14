// src/pages/Guides/GuideEditPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GuideForm from '../../components/guides/GuideForm';

const { Title } = Typography;

const mockGuides = {
    '1': { title: 'Cách tạo một lịch hẹn mới', category: 'Hướng dẫn cho Lễ tân', status: 'Published', content: '<p>Chi tiết...</p>' },
    '2': { title: 'Ghi nhận một ca điều trị phức tạp', category: 'Hướng dẫn cho Bác sĩ', status: 'Published', content: '<p>Chi tiết...</p>' },
    '3': { title: 'Cấu hình SMS Brandname', category: 'Cài đặt & Cấu hình', status: 'Draft', content: '<p>Chi tiết...</p>' },
};

const GuideEditPage = () => {
    const navigate = useNavigate();
    const { guideId } = useParams();
    const guideData = mockGuides[guideId];

    const handleFinish = (values) => {
        console.log('Updated guide data:', values);
        message.success(`Cập nhật hướng dẫn "${values.title}" thành công!`);
        navigate('/guides');
    };

    if (!guideData) return <Title level={2}>Không tìm thấy hướng dẫn!</Title>;

    return (
        <><Title level={3} className="mb-4">Chỉnh sửa Hướng dẫn: {guideData.title}</Title><GuideForm onFinish={handleFinish} initialValues={guideData} /></>
    );
};

export default GuideEditPage;