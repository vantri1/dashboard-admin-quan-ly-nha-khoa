// src/pages/Customers/CustomerDetailPage.jsx

import { CheckCircleOutlined, ClockCircleOutlined, MinusCircleOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Descriptions, Row, Space, Spin, Tag, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const { Text, Title } = Typography;
// Sử dụng lại mockApiData đã định nghĩa ở trên để đảm bảo tính nhất quán
// Trong dự án thực, bạn sẽ có một file riêng để quản lý các hàm gọi API
const mockApiData = [
    // ... (sao chép mockApiData từ file list vào đây)
    {
        id: 1, name: 'Phòng khám Răng-Hàm-Mặt Sài Gòn', phone: '0912345678', email: 'pk.saigon@email.com', avatar_url: 'https://cdn-icons-png.flaticon.com/512/33/33777.png', registered_at: '2025-07-20T10:00:00Z',
        subscription: { id: 101, status: 'trialing', trial_ends_at: '2025-07-27T23:59:59Z', package: { name: 'Gói Cao Cấp' } }
    },
    {
        id: 2, name: 'Nha khoa Quốc tế Á Âu', phone: '0987654321', email: 'nk.aau@email.com', avatar_url: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png', registered_at: '2025-07-18T09:00:00Z',
        subscription: { id: 102, status: 'active', trial_ends_at: null, current_period_ends_at: '2025-08-18T23:59:59Z', package: { name: 'Gói Chuyên Nghiệp' } }
    },
    {
        id: 3, name: 'Nha khoa Nụ Cười Việt', phone: '0334455667', email: 'nk.nucuoi@email.com', avatar_url: 'https://cdn-icons-png.flaticon.com/512/880/880530.png', registered_at: '2024-06-15T08:00:00Z',
        subscription: { id: 103, status: 'canceled', trial_ends_at: '2024-06-22T23:59:59Z', current_period_ends_at: '2024-07-15T23:59:59Z', package: { name: 'Gói Khởi Đầu' } }
    },
];

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- MÔ PHỎNG GỌI API ĐỂ LẤY CHI TIẾT KHÁCH HÀNG ---
        // GET /api/customers/{customerId}
        setLoading(true);
        setTimeout(() => {
            const foundCustomer = mockApiData.find(c => c.id.toString() === customerId);
            setCustomer(foundCustomer);
            setLoading(false);
        }, 500);
    }, [customerId]);

    if (loading) return <Spin size="large" className="flex justify-center items-center h-full" />;
    if (!customer) return <Title level={3}>Không tìm thấy khách hàng với ID: {customerId}</Title>;

    const { subscription } = customer;
    const endDate = subscription.trial_ends_at || subscription.current_period_ends_at;

    const statusMap = {
        trialing: { color: 'processing', icon: <ClockCircleOutlined />, text: 'Dùng thử' },
        active: { color: 'success', icon: <CheckCircleOutlined />, text: 'Hoạt động' },
        canceled: { color: 'default', icon: <MinusCircleOutlined />, text: 'Đã hủy' },
        past_due: { color: 'error', icon: <MinusCircleOutlined />, text: 'Quá hạn' },
    };
    const currentStatus = statusMap[subscription.status] || statusMap.canceled;

    return (
        <div className="space-y-6">
            <Title level={3}>Chi tiết Khách hàng: {customer.name}</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={12}>
                    <Card>
                        <Space direction="vertical" align="center" className="w-full mb-6">
                            <Avatar size={128} src={customer.avatar_url} icon={<UserOutlined />} />
                            <Title level={4} className="mt-4 mb-0">{customer.name}</Title>
                            <Text type="secondary" copyable>{customer.email}</Text>
                        </Space>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label={<Space><PhoneOutlined />Số điện thoại</Space>}>{customer.phone}</Descriptions.Item>
                            <Descriptions.Item label="Gói dịch vụ"><Tag color="blue">{subscription.package.name}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag icon={currentStatus.icon} color={currentStatus.color}>{currentStatus.text}</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đăng ký">{new Date(customer.registered_at).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label={subscription.status === 'trialing' ? 'Kết thúc dùng thử' : 'Ngày gia hạn kế tiếp'}>
                                {endDate ? new Date(endDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                <Col xs={24} md={12} lg={12}>
                    <Card>
                        <Title level={5}>Lịch sử Gói Đăng ký</Title>
                        <Timeline className="mt-6">
                            <Timeline.Item>
                                <Text strong>Đăng ký tài khoản</Text> - {new Date(customer.registered_at).toLocaleDateString('vi-VN')}
                                <p>Khách hàng đã đăng ký và bắt đầu gói: <Text strong>{subscription.package.name}</Text>.</p>
                            </Timeline.Item>
                            {subscription.status === 'canceled' && (
                                <Timeline.Item color="red" dot={<MinusCircleOutlined />}>
                                    <Text strong>Gói dịch vụ đã bị hủy</Text>
                                    <p>Quản trị viên hoặc người dùng đã hủy gói dịch vụ.</p>
                                </Timeline.Item>
                            )}
                            <Timeline.Item color="green" dot={<ClockCircleOutlined />}>
                                <Text strong>{subscription.status === 'trialing' ? 'Hết hạn dùng thử' : 'Ngày thanh toán tiếp theo'}</Text> - {endDate ? new Date(endDate).toLocaleDateString('vi-VN') : 'N/A'}
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerDetailPage;