// src/pages/Customers/CustomerDetailPage.jsx

import { CheckCircleOutlined, ClockCircleOutlined, MailOutlined, MinusCircleOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Descriptions, Row, Space, Spin, Tag, Timeline, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP ---
// Trong dự án thực tế, bạn sẽ không cần dòng này mà sẽ fetch từ API
const allCustomers = [
    { id: 'KH001', name: 'Phòng khám Răng-Hàm-Mặt Sài Gòn', phone: '0912345678', email: 'pk.saigon@email.com', status: 'Active', plan: 'Nâng cao', registeredAt: '2025-07-20', trialEndDate: '2025-07-27', avatar: 'https://cdn-icons-png.flaticon.com/512/33/33777.png' },
    { id: 'KH002', name: 'Nha khoa Quốc tế Á Âu', phone: '0987654321', email: 'nk.aau@email.com', status: 'Active', plan: 'Cơ bản', registeredAt: '2025-07-18', trialEndDate: '2025-07-25', avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
    { id: 'KH003', name: 'Nha khoa Nụ Cười Việt', phone: '0334455667', email: 'nk.nucuoi@email.com', status: 'Inactive', plan: 'Cơ bản', registeredAt: '2024-06-15', trialEndDate: '2024-06-22', avatar: 'https://cdn-icons-png.flaticon.com/512/880/880530.png' },
    { id: 'KH004', name: 'Phòng khám Thẩm mỹ ABC', phone: '0123456789', email: 'pk.abc@email.com', status: 'Active', plan: 'Nâng cao', registeredAt: '2025-07-10', trialEndDate: '2025-07-17', avatar: 'https://cdn-icons-png.flaticon.com/512/3077/3077421.png' },
];

const CustomerDetailPage = () => {
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // --- Logic tìm kiếm khách hàng ---
        // Trong dự án thực tế, đây là nơi bạn gọi API: fetch(`/api/customers/${customerId}`)
        const foundCustomer = allCustomers.find(c => c.id === customerId);
        setCustomer(foundCustomer);
        setLoading(false);
    }, [customerId]);

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-full" />;
    }

    if (!customer) {
        return <Title level={3}>Không tìm thấy khách hàng với ID: {customerId}</Title>;
    }

    return (
        <div className="space-y-6">
            <Title level={3}>Chi tiết Khách hàng: {customer.name}</Title>
            <Row gutter={[24, 24]}>
                {/* --- CỘT THÔNG TIN CÁ NHÂN --- */}
                <Col xs={24} md={12} lg={12}>
                    <Card>
                        <Space direction="vertical" align="center" className="w-full mb-6">
                            <Avatar size={128} src={customer.avatar} icon={<UserOutlined />} />
                            <Title level={4} className="mt-4 mb-0">{customer.name}</Title>
                            <Text type="secondary">{customer.email}</Text>
                        </Space>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label={<Space><PhoneOutlined />Số điện thoại</Space>}>{customer.phone}</Descriptions.Item>
                            <Descriptions.Item label="Gói dịch vụ"><Tag color="blue">{customer.plan}</Tag></Descriptions.Item>
                            <Descriptions.Item label="Trạng thái">
                                <Tag icon={customer.status === 'Active' ? <CheckCircleOutlined /> : <MinusCircleOutlined />} color={customer.status === 'Active' ? 'success' : 'default'}>
                                    {customer.status === 'Active' ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label="Ngày đăng ký">{new Date(customer.registeredAt).toLocaleDateString('vi-VN')}</Descriptions.Item>
                            <Descriptions.Item label="Kết thúc dùng thử">{new Date(customer.trialEndDate).toLocaleDateString('vi-VN')}</Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* --- CỘT LỊCH SỬ HOẠT ĐỘNG --- */}
                <Col xs={24} md={12} lg={12}>
                    <Card>
                        <Title level={5}>Lịch sử Hoạt động</Title>
                        <Timeline className="mt-6">
                            <Timeline.Item>
                                <Text strong>Bắt đầu dùng thử</Text> - {new Date(customer.registeredAt).toLocaleDateString('vi-VN')}
                                <p>Khách hàng đã đăng ký gói dùng thử: <Text strong>{customer.plan}</Text>.</p>
                            </Timeline.Item>
                            <Timeline.Item color="gray">
                                <Text strong>Gửi email chào mừng</Text> - {new Date(customer.registeredAt).toLocaleDateString('vi-VN')}
                                <p>Hệ thống đã tự động gửi email hướng dẫn sử dụng.</p>
                            </Timeline.Item>
                            {customer.status === 'Inactive' && (
                                <Timeline.Item color="red" dot={<MinusCircleOutlined />}>
                                    <Text strong>Tài khoản bị vô hiệu hóa</Text>
                                    <p>Tài khoản đã bị quản trị viên vô hiệu hóa.</p>
                                </Timeline.Item>
                            )}
                            <Timeline.Item color="green" dot={<ClockCircleOutlined />}>
                                <Text strong>Kết thúc dùng thử</Text> - {new Date(customer.trialEndDate).toLocaleDateString('vi-VN')}
                            </Timeline.Item>
                        </Timeline>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerDetailPage;