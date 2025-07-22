import { message, Spin, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomerForm from '../../components/customer/CustomerForm';
import { getCustomerById, updateCustomer } from '../../services/customerService';

const { Title } = Typography;

const CustomerEditPage = () => {
    const { customerId } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        if (!customerId) return;
        setLoading(true);
        try {
            const response = await getCustomerById(customerId);
            if (response) {
                setCustomer(response.data);
            }
        } catch (error) {
            setCustomer(null);
            message.error('Lỗi không thể lấy thông tin người dùng: ' + error);

        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const handleFinish = async (values) => {
        // Loại bỏ các giá trị rỗng để không ghi đè dữ liệu không cần thiết (đặc biệt là mật khẩu)
        const cleanedValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== null && v !== '')
        );

        try {
            const response = await updateCustomer(customerId, cleanedValues);
            navigate(`/customers/${customerId}`);
            message.success(response.message);

        } catch (error) {
            message.error('Lỗi không thể tạo người dùng: ' + error);
            console.log('Failed to update customer:', error);
        }
    };

    if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
    if (!customer) return <Title level={3} className="text-center mt-10">Không tìm thấy khách hàng.</Title>;

    return (
        <div className="space-y-6">
            <Title level={3}>Chỉnh sửa Khách hàng: {customer.clinic_name || `#${customer.id}`}</Title>
            <CustomerForm onFinish={handleFinish} initialValues={customer} isEdit={true} />
        </div>
    );
};

export default CustomerEditPage;