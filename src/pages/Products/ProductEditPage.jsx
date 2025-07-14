// src/pages/ProductEditPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import ProductForm from '../../components/products/ProductForm';

const { Title } = Typography;


// Dữ liệu giả lập để chỉnh sửa
const mockProducts = {
    '1': { name: 'React E-commerce Kit', description: 'Mô tả chi tiết cho sản phẩm React.', price: 1200000, category: 'React' },
    '2': { name: 'VueJS Dashboard Pro', description: 'Mô tả chi tiết cho sản phẩm Vue.', price: 950000, category: 'VueJS' },
};

const ProductEditPage = () => {
    const navigate = useNavigate();
    const { productId } = useParams(); // Lấy productId từ URL

    // Trong thực tế, bạn sẽ dùng productId để fetch dữ liệu từ API
    const productData = mockProducts[productId];

    const handleFinish = (values) => {
        console.log('Updated values:', values);
        // Gửi dữ liệu cập nhật lên server
        message.success('Cập nhật source code thành công!');
        navigate('/products');
    };

    if (!productData) {
        return <h1>Không tìm thấy sản phẩm!</h1>;
    }

    return (
        <>
            <Title level={3} className='mb-4'>Sửa Source code: {productData.name} </Title>
            <ProductForm onFinish={handleFinish} initialValues={productData} />
        </>
    );
};

export default ProductEditPage;