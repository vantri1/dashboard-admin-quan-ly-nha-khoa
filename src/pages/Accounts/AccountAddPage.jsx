import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import AccountForm from '../../components/accounts/AccountForm';
import { addAccount } from '../../services/accountService';

const { Title } = Typography;

const AccountAddPage = () => {
    const navigate = useNavigate();

    const handleFinish = async (values) => {
        const payload = {
            ...values,
            status: values.status ? 'active' : 'inactive'
        };
        try {
            const response = await addAccount(payload);
            message.success(response.message || 'Thêm tài khoản mới thành công!');
            navigate('/settings/users');
        } catch (error) {
            message.error(error || 'Thêm tài khoản thất bại.');
        }
    };

    return (
        <>
            <Title level={3} className="mb-4">Tạo Tài khoản mới</Title>
            <AccountForm onFinish={handleFinish} />
        </>
    );
};

export default AccountAddPage;