// src/pages/Accounts/AccountAddPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import AccountForm from '../../components/accounts/AccountForm';

const { Title } = Typography;

const AccountAddPage = () => {
    const navigate = useNavigate();
    const handleFinish = (values) => {
        console.log('New account data:', values);
        message.success('Thêm tài khoản mới thành công!');
        navigate('/settings/users');
    };
    return (
        <><Title level={3} className="mb-4">Tạo Tài khoản mới</Title><AccountForm onFinish={handleFinish} /></>
    );
};

export default AccountAddPage;