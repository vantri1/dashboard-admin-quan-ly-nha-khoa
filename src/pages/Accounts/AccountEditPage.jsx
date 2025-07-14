// src/pages/Accounts/AccountEditPage.jsx
import { message, Typography } from 'antd';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AccountForm from '../../components/accounts/AccountForm';

const { Title } = Typography;

const mockUsers = {
    '1': { fullName: 'Admin Master', email: 'admin@example.com', role: 'admin', status: true },
    '2': { fullName: 'BTV Anh Tuấn', email: 'editor.anh.tuan@example.com', role: 'editor', status: true },
    '3': { fullName: 'Support Minh', email: 'support.minh@example.com', role: 'support', status: false },
};

const AccountEditPage = () => {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const userData = mockUsers[accountId];

    const handleFinish = (values) => {
        console.log('Updated account data:', values);
        message.success(`Cập nhật tài khoản "${values.fullName}" thành công!`);
        navigate('/settings/users');
    };

    if (!userData) return <Title level={2}>Không tìm thấy tài khoản!</Title>;

    return (
        <><Title level={3} className="mb-4">Chỉnh sửa Tài khoản: {userData.fullName}</Title><AccountForm onFinish={handleFinish} initialValues={userData} isEditing={true} /></>
    );
};

export default AccountEditPage;
