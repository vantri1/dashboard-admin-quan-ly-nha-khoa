import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import CustomerForm from '../../components/customer/CustomerForm';
import { addCustomer } from '../../services/customerService';

const { Title } = Typography;

const CustomerAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        try {
            const response = await addCustomer(values);
            message.success(response.message);
            navigate('/customers'); // Chuyển về trang danh sách sau khi thêm thành công
        } catch (error) {
            message.error('Lỗi không thể thêm người dùng: ' + error);
            console.log('Failed to add customer:', error);
        }
    };

    return (
        <div className="space-y-6">
            <Title level={3}>Thêm Khách hàng mới</Title>
            <CustomerForm onFinish={handleFinish} />
        </div>
    );
};

export default CustomerAddPage;