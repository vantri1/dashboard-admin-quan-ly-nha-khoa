// src/pages/Customers/CustomerListPage.jsx

import { CheckCircleOutlined, DeleteOutlined, EyeOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, message, Popconfirm, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP BAN ĐẦU ---
// Trong thực tế, bạn sẽ fetch dữ liệu này từ API
const initialCustomers = [
    { id: 'KH001', name: 'Phòng khám Răng-Hàm-Mặt Sài Gòn', phone: '0912345678', email: 'pk.saigon@email.com', status: 'Active', plan: 'Nâng cao', registeredAt: '2025-07-20', trialEndDate: '2025-07-27', avatar: 'https://cdn-icons-png.flaticon.com/512/33/33777.png' },
    { id: 'KH002', name: 'Nha khoa Quốc tế Á Âu', phone: '0987654321', email: 'nk.aau@email.com', status: 'Active', plan: 'Cơ bản', registeredAt: '2025-07-18', trialEndDate: '2025-07-25', avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
    { id: 'KH003', name: 'Nha khoa Nụ Cười Việt', phone: '0334455667', email: 'nk.nucuoi@email.com', status: 'Inactive', plan: 'Cơ bản', registeredAt: '2024-06-15', trialEndDate: '2024-06-22', avatar: 'https://cdn-icons-png.flaticon.com/512/880/880530.png' },
    { id: 'KH004', name: 'Phòng khám Thẩm mỹ ABC', phone: '0123456789', email: 'pk.abc@email.com', status: 'Active', plan: 'Nâng cao', registeredAt: '2025-07-10', trialEndDate: '2025-07-17', avatar: 'https://cdn-icons-png.flaticon.com/512/3077/3077421.png' },
];

/**
 * Hàm định nghĩa cấu trúc cột cho bảng Ant Design.
 * Được tách ra để giữ cho component chính gọn gàng.
 * @param {function} handleStatusChange - Hàm callback để xử lý khi thay đổi trạng thái.
 * @returns {array} - Mảng các đối tượng định nghĩa cột.
 */
const getTableColumns = (handleStatusChange) => [
    {
        title: 'Tên Phòng khám',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => <Space><Avatar src={record.avatar} /> <Text strong>{name}</Text></Space>,
        width: 250
    },
    {
        title: 'Email & Số điện thoại',
        key: 'contact',
        render: (_, record) => (
            <Space direction="vertical" size={0}>
                <Text strong copyable>{record.email}</Text>
                <Text type="secondary" copyable>{record.phone}</Text>
            </Space>
        ),
        width: 220
    },
    {
        title: 'Loại gói',
        key: 'plan',
        dataIndex: 'plan',
        render: (plan) =>
            <Tag color='blue'>{plan}</Tag>,
        width: 220
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'trialEndDate',
        key: 'trialEndDate',
        render: (date) => new Date(date).toLocaleDateString('vi-VN'),
        sorter: (a, b) => new Date(a.trialEndDate) - new Date(b.trialEndDate),
    },
    {
        title: 'Thời gian còn lại',
        key: 'remaining',
        sorter: (a, b) => new Date(a.trialEndDate) - new Date(b.trialEndDate),
        render: (_, record) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày chính xác
            const endDate = new Date(record.trialEndDate);
            const remainingDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

            if (remainingDays < 0) return <Tag color="error">Đã hết hạn</Tag>;
            if (remainingDays === 0) return <Tag color="warning">Hôm nay hết hạn</Tag>;
            if (remainingDays <= 3) return <Tag color="warning">{`${remainingDays} ngày`}</Tag>;
            return <Tag color="success">{`${remainingDays} ngày`}</Tag>;
        },
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        filters: [
            { text: 'Đang hoạt động', value: 'Active' },
            { text: 'Vô hiệu hóa', value: 'Inactive' },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status) => <Tag icon={status === 'Active' ? <CheckCircleOutlined /> : <MinusCircleOutlined />} color={status === 'Active' ? 'success' : 'default'}>{status === 'Active' ? 'Hoạt động' : 'Vô hiệu hóa'}</Tag>
    },
    {
        title: 'Hành động',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (_, record) => (
            <Space>
                <Tooltip title="Xem chi tiết">
                    <Link to={`/customers/${record.id}`}><Button size="small" icon={<EyeOutlined />} /></Link>
                </Tooltip>
                {record.status === 'Active' ? (
                    <Tooltip title="Vô hiệu hóa">
                        <Popconfirm title="Vô hiệu hóa tài khoản này?" onConfirm={() => handleStatusChange(record.id, 'Inactive')}>
                            <Button size="small" icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Tooltip>
                ) : (
                    <Tooltip title="Kích hoạt lại">
                        <Popconfirm title="Kích hoạt lại tài khoản?" onConfirm={() => handleStatusChange(record.id, 'Active')}>
                            <Button size="small" icon={<CheckCircleOutlined />} style={{ color: 'green', borderColor: 'green' }} />
                        </Popconfirm>
                    </Tooltip>
                )}
            </Space>
        )
    },
];

const CustomerListPage = () => {
    const [customers, setCustomers] = useState(initialCustomers);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (id, newStatus) => {
        setCustomers(customers.map(c => (c.id === id ? { ...c, status: newStatus } : c)));
        message.success(`Đã ${newStatus === 'Active' ? 'kích hoạt' : 'vô hiệu hóa'} tài khoản ${id}`);
    };

    // Sử dụng useMemo để tối ưu hóa hiệu suất, chỉ lọc lại khi cần
    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowercasedTerm = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedTerm) ||
            customer.email.toLowerCase().includes(lowercasedTerm)
        );
    }, [customers, searchTerm]);

    // Lấy định nghĩa cột bằng cách gọi hàm đã tạo
    const columns = getTableColumns(handleStatusChange);

    return (
        <div className="space-y-4">
            <Title level={3}>Quản lý Khách hàng Dùng thử</Title>
            <Card>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên phòng khám hoặc email..."
                    className="w-full max-w-sm mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Table
                    columns={columns}
                    dataSource={filteredCustomers}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1400 }} // Đảm bảo bảng hiển thị tốt trên mobile
                />
            </Card>
        </div>
    );
};

export default CustomerListPage;