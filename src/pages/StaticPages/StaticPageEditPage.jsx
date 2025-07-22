import { message, Spin, Typography } from "antd";
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";

import StaticPageForm from "../../components/StaticPages/StaticPageForm";
import { getStaticPagesId, updateStaticPage } from "../../services/staticPageService";

const { Title } = Typography;

const StaticPageEditPage = () => {
    const navigate = useNavigate();
    const { pageId } = useParams();
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (pageId) {
            setLoading(true);
            getStaticPagesId(pageId)
                .then(response => {
                    setPageData(response.data);
                })
                .catch(error => {
                    message.error("Không tìm thấy dữ liệu trang: " + error);
                    navigate('/pages');
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [pageId, navigate]);

    const handleFinish = async (values) => {
        try {
            await updateStaticPage(pageId, values);
            message.success(`Cập nhật trang "${values.title}" thành công!`);
            navigate('/pages');
        } catch (error) {
            const errorMessage = error || 'Cập nhật trang thất bại.';
            message.error(errorMessage);
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
    }

    if (!pageData) {
        return <Title level={2}>Không tìm thấy trang!</Title>;
    }

    return (
        <>
            <Title level={3} className="mb-4">Chỉnh sửa Trang: {pageData.title}</Title>
            <StaticPageForm onFinish={handleFinish} initialValues={pageData} />
        </>
    );
};

export default StaticPageEditPage;