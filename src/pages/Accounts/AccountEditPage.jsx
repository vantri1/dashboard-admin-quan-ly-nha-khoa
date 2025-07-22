import { message, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import AccountForm from '../../components/accounts/AccountForm';
import { getAccountById, updateAccount } from '../../services/accountService';

const { Title } = Typography;

const AccountEditPage = () => {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const [account, setAccount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAccountData = async () => {
            setLoading(true);
            try {
                const response = await getAccountById(accountId);
                // API trả về 'active'/'inactive', cần chuyển đổi sang boolean cho Switch
                setAccount({ ...response.data, status: response.data.status === 'active' });
            } catch (error) {
                message.error(error || `Không thể tải dữ liệu tài khoản #${accountId}.`);
            } finally {
                setLoading(false);
            }
        };
        fetchAccountData();
    }, [accountId]);

    const handleFinish = async (values) => {
        // Loại bỏ các giá trị rỗng/null để không gửi lên server
        const cleanedValues = Object.fromEntries(
            Object.entries(values).filter(([_, v]) => v !== null && v !== '')
        );
        const payload = {
            ...cleanedValues,
            status: cleanedValues.status ? 'active' : 'inactive'
        };
        try {
            const response = await updateAccount(accountId, payload);
            message.success(response.message || 'Cập nhật tài khoản thành công!');
            navigate('/settings/users');
        } catch (error) {
            message.error(error || 'Cập nhật thất bại.');
        }
    };

    if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
    if (!account) return <Title level={2}>Không tìm thấy tài khoản!</Title>;

    return (
        <>
            <Title level={3} className="mb-4">Chỉnh sửa Tài khoản: {account.full_name}</Title>
            <AccountForm onFinish={handleFinish} initialValues={account} isEditing={true} />
        </>
    );
};

export default AccountEditPage;