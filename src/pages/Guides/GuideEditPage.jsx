// src/pages/Guides/GuideEditPage.jsx
import { message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import GuideForm from '../../components/guides/GuideForm';
import { getPostById, updatePost } from '../../services/postServer';

const { Title } = Typography;

const GuideEditPage = () => {
    const navigate = useNavigate();
    const { guideId } = useParams(); // Get guideId from URL
    const [guideData, setguideData] = useState(null); // Sẽ lưu trữ raw response, ví dụ {data: {...}, category_name: "...", creator_name: "..."}
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(guideId);
                setguideData(response); // Lưu toàn bộ response.data
            } catch (error) {
                console.error('Failed to fetch guide for editing:', error);
                message.error('Không thể tải dữ liệu bài viết hướng dẫn để chỉnh sửa.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [guideId]);

    const handleFinish = async (values) => {
        try {
            const response = await updatePost(guideId, values);
            message.success(response.message || 'Cập nhật bài viết thành công!');
            navigate('/guides');
        } catch (error) {
            console.error('Failed to update guide:', error);
            message.error('Không thể cập nhật bài viết hướng dẫn: ', error); // Error message handled by apiService interceptor
        }
    };

    if (loading) {
        return <Title level={2}>Đang tải bài viết hướng dẫn...</Title>;
    }

    if (!guideData) {
        return <Title level={2}>Không tìm thấy bài viết hướng dẫn!</Title>;
    }

    return (
        <><Title level={3} className="mb-4">Chỉnh sửa Hướng dẫn: {guideData.data.title}</Title><GuideForm onFinish={handleFinish} initialValues={guideData} /></>
    );
};

export default GuideEditPage;