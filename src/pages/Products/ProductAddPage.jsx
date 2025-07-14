// src/pages/ProductAddPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import ProductForm from '../../components/products/ProductForm';

const { Title } = Typography;

const ProductAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = (values) => {
        console.log('Success:', values);
        // Trong thực tế, bạn sẽ gửi dữ liệu này lên server qua API
        message.success('Thêm source code thành công!');
        // Sau khi thành công, chuyển hướng về trang danh sách
        navigate('/products');
    };

    return (
        <>
            <Title level={3} className='mb-4'>Thêm Source code</Title>
            <ProductForm onFinish={handleFinish} />
        </>
    );
};

export default ProductAddPage;