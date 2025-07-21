// src/pages/Customers/CustomerListPage.jsx

import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined, EyeOutlined, MinusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, message, Popconfirm, Space, Spin, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

// --- MÔ PHỎNG DỮ LIỆU TỪ API ---
// Dữ liệu này có cấu trúc giống như kết quả JOIN từ các bảng:
// nk_customers JOIN nk_subscriptions JOIN nk_pricing_packages
const mockApiData = [
    {
        id: 1, // Từ nk_customers.id
        customer_code: 'PK_SAIGON',
        name: 'Phòng khám Răng-Hàm-Mặt Sài Gòn',
        phone: '0912345678',
        email: 'pk.saigon@email.com',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/33/33777.png',
        registered_at: '2025-07-20T10:00:00Z',
        subscription: {
            id: 101,
            status: 'trialing', // 'trialing', 'active', 'past_due', 'canceled'
            trial_ends_at: '2025-07-27T23:59:59Z',
            package: {
                name: 'Gói Cao Cấp' // Từ nk_pricing_packages.name
            }
        }
    },
    {
        id: 2,
        customer_code: 'NK_AAU',
        name: 'Nha khoa Quốc tế Á Âu',
        phone: '0987654321',
        email: 'nk.aau@email.com',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
        registered_at: '2025-07-18T09:00:00Z',
        subscription: {
            id: 102,
            status: 'active',
            trial_ends_at: null,
            current_period_ends_at: '2025-08-18T23:59:59Z',
            package: {
                name: 'Gói Chuyên Nghiệp'
            }
        }
    },
    {
        id: 3,
        name: 'Nha khoa Nụ Cười Việt',
        phone: '0334455667',
        email: 'nk.nucuoi@email.com',
        avatar_url: 'https://cdn-icons-png.flaticon.com/512/880/880530.png',
        registered_at: '2024-06-15T08:00:00Z',
        subscription: {
            id: 103,
            status: 'canceled',
            trial_ends_at: '2024-06-22T23:59:59Z',
            current_period_ends_at: '2024-07-15T23:59:59Z',
            package: {
                name: 'Gói Khởi Đầu'
            }
        }
    },
];


/**
 * Định nghĩa cấu trúc cột cho bảng, phản ánh đúng dữ liệu từ DB.
 * @param {function} handleStatusChange - Callback xử lý thay đổi trạng thái.
 * @returns {array}
 */
const getTableColumns = (handleStatusChange) => [
    {
        title: 'Tên Phòng khám',
        dataIndex: 'name',
        key: 'name',
        render: (name, record) => (
            <Space>
                <Avatar src={record.avatar_url} />
                <Text strong>{name}</Text>
            </Space>
        ),
    },
    {
        title: 'Email & SĐT',
        key: 'contact',
        render: (_, record) => (
            <Space direction="vertical" size={0}>
                <Text copyable>{record.email}</Text>
                <Text type="secondary" copyable>{record.phone}</Text>
            </Space>
        ),
    },
    {
        title: 'Gói dịch vụ',
        key: 'plan',
        // Dữ liệu lấy từ object lồng nhau
        render: (_, record) => <Tag color='blue'>{record.subscription.package.name}</Tag>,
    },
    {
        title: 'Ngày kết thúc',
        key: 'endDate',
        sorter: (a, b) => {
            const dateA = new Date(a.subscription.trial_ends_at || a.subscription.current_period_ends_at);
            const dateB = new Date(b.subscription.trial_ends_at || b.subscription.current_period_ends_at);
            return dateA - dateB;
        },
        render: (_, record) => {
            const endDate = record.subscription.trial_ends_at || record.subscription.current_period_ends_at;
            return new Date(endDate).toLocaleDateString('vi-VN');
        },
    },
    {
        title: 'Thời gian còn lại',
        key: 'remaining',
        render: (_, record) => {
            const endDateString = record.subscription.status === 'trialing'
                ? record.subscription.trial_ends_at
                : record.subscription.current_period_ends_at;

            if (!endDateString) return <Tag>Vĩnh viễn</Tag>;

            const endDate = new Date(endDateString);
            const remainingDays = Math.ceil((endDate - new Date()) / (1000 * 60 * 60 * 24));

            if (remainingDays < 0) return <Tag color="error">Đã hết hạn</Tag>;
            if (remainingDays <= 7) return <Tag color="warning">{`${remainingDays} ngày`}</Tag>;
            return <Tag color="success">{`${remainingDays} ngày`}</Tag>;
        },
    },
    {
        title: 'Trạng thái',
        key: 'status',
        dataIndex: ['subscription', 'status'], // Truy cập key lồng nhau
        filters: [
            { text: 'Dùng thử', value: 'trialing' },
            { text: 'Đang hoạt động', value: 'active' },
            { text: 'Đã hủy', value: 'canceled' },
            { text: 'Quá hạn', value: 'past_due' },
        ],
        onFilter: (value, record) => record.subscription.status === value,
        render: (status) => {
            const statusMap = {
                trialing: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Dùng thử' },
                active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoạt động' },
                canceled: { color: 'default', icon: <MinusCircleOutlined />, text: 'Đã hủy' },
                past_due: { color: 'error', icon: <MinusCircleOutlined />, text: 'Quá hạn' },
            };
            const currentStatus = statusMap[status] || statusMap.canceled;
            return <Tag icon={currentStatus.icon} color={currentStatus.color}>{currentStatus.text}</Tag>;
        },
    },
    {
        title: 'Hành động',
        key: 'action',
        fixed: 'right',
        width: 120,
        render: (_, record) => (
            <Space>
                <Tooltip title="Xem chi tiết">
                    {/* Link tới trang chi tiết bằng ID của customer */}
                    <Link to={`/customers/${record.id}`}><Button size="small" icon={<EyeOutlined />} /></Link>
                </Tooltip>
                {['trialing', 'active'].includes(record.subscription.status) ? (
                    <Tooltip title="Hủy gói">
                        <Popconfirm title="Bạn chắc chắn muốn hủy gói?" onConfirm={() => handleStatusChange(record.id, 'canceled')}>
                            <Button size="small" icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    </Tooltip>
                ) : (
                    <Tooltip title="Kích hoạt lại">
                        <Popconfirm title="Kích hoạt lại gói đăng ký?" onConfirm={() => handleStatusChange(record.id, 'active')}>
                            <Button size="small" icon={<CheckCircleOutlined />} style={{ color: 'green', borderColor: 'green' }} />
                        </Popconfirm>
                    </Tooltip>
                )}
            </Space>
        )
    },
];

const CustomerListPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // --- MÔ PHỎNG GỌI API ---
        setLoading(true);
        setTimeout(() => {
            setCustomers(mockApiData);
            setLoading(false);
        }, 1000); // Giả lập độ trễ mạng
    }, []);

    const handleStatusChange = (customerId, newStatus) => {
        // Trong thực tế, bạn sẽ gọi API để cập nhật trạng thái
        // PATCH /api/subscriptions/{subscriptionId} { status: newStatus }
        setCustomers(customers.map(c =>
            c.id === customerId ? { ...c, subscription: { ...c.subscription, status: newStatus } } : c
        ));
        message.success(`Đã cập nhật trạng thái cho khách hàng`);
    };

    const filteredCustomers = useMemo(() => {
        if (!searchTerm) return customers;
        const lowercasedTerm = searchTerm.toLowerCase();
        return customers.filter(customer =>
            customer.name.toLowerCase().includes(lowercasedTerm) ||
            customer.email.toLowerCase().includes(lowercasedTerm)
        );
    }, [customers, searchTerm]);

    const columns = getTableColumns(handleStatusChange);

    return (
        <div className="space-y-4">
            <Title level={3}>Quản lý Khách hàng</Title>
            <Card>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên phòng khám hoặc email..."
                    className="w-full max-w-sm mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Spin spinning={loading}>
                    <Table
                        columns={columns}
                        dataSource={filteredCustomers}
                        rowKey="id"
                        bordered
                        scroll={{ x: 1400 }}
                    />
                </Spin>
            </Card>
        </div>
    );
};

export default CustomerListPage;