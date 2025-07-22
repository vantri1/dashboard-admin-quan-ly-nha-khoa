import { message, Typography } from "antd";
import React from 'react';
import { useNavigate } from "react-router-dom";

import StaticPageForm from "../../components/StaticPages/StaticPageForm";
import { createStaticPage } from "../../services/staticPageService";

const { Title } = Typography;

const StaticPageAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            await createStaticPage(values);
            message.success(`Tạo trang "${values.title}" thành công!`);
            navigate('/pages');
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Tạo trang thất bại.';
            message.error(errorMessage);
        }
    };

    return (
        <>
            <Title level={3} className="mb-4">Tạo Trang tĩnh mới</Title>
            <StaticPageForm onFinish={handleFinish} />
        </>
    );
};

export default StaticPageAddPage;