import { CalendarOutlined, EditOutlined, EnvironmentOutlined, HomeOutlined, MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Descriptions, message, Row, Space, Spin, Tag, Timeline, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCustomerById } from '../../services/customerService'; // <-- Sử dụng service đã tạo

const { Text, Title } = Typography;

const CustomerDetailPage = () => {
    const { customerId } = useParams();
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
            message.error('Lỗi không tìm thấy người dùng: ' + error);
            setCustomer(null);
        } finally {
            setLoading(false);
        }
    }, [customerId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;

    if (!customer) {
        return <Title level={3} className="text-center mt-10">Không tìm thấy khách hàng hoặc có lỗi xảy ra.</Title>;
    }

    return (
        <div className="space-y-6">
            <Title level={3}>Chi tiết Khách hàng: {customer.clinic_name || customer.referring_doctor_1}</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12}>
                    <Card>
                        <Space direction="vertical" align="center" className="w-full mb-6">
                            <Avatar size={128} src={customer.avatar_url} icon={<UserOutlined />} />
                            <Title level={4} className="mt-4 mb-0">{customer.clinic_name || '(Chưa có tên phòng khám)'}</Title>
                            <Text type="secondary">Bác sĩ 1: {customer.referring_doctor_1}</Text>
                            {customer.referring_doctor_2 && (
                                <Text type="secondary">Bác sĩ 1: {customer.referring_doctor_2}</Text>
                            )}
                            <Tag color="geekblue">{customer.customer_code}</Tag>
                        </Space>
                        <Descriptions bordered column={1} size="small">
                            <Descriptions.Item label={<Space><MailOutlined />Email</Space>}>
                                <Text copyable>{customer.email}</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><PhoneOutlined />Số điện thoại</Space>}>
                                {customer.phone ? <Text copyable>{customer.phone}</Text> : <Text type="secondary">Chưa cập nhật</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><HomeOutlined />Địa chỉ</Space>}>
                                {customer.address || <Text type="secondary">Chưa cập nhật</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><EnvironmentOutlined />Thành phố</Space>}>
                                {customer.city || <Text type="secondary">Chưa cập nhật</Text>}
                            </Descriptions.Item>
                            <Descriptions.Item label={<Space><CalendarOutlined />Ngày đăng ký</Space>}>
                                {new Date(customer.registered_at).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })}
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>
                <Col xs={24} md={12}>
                    <Card>
                        <Title level={5}>Lịch sử Hoạt động</Title>
                        <Timeline className="mt-6">
                            <Timeline.Item color="green" dot={<CalendarOutlined />}>
                                <Text strong>Tạo tài khoản:</Text> {formatDate(customer.registered_at)}
                                <p className="text-gray-500">Khách hàng đã được tạo trên hệ thống.</p>
                            </Timeline.Item>
                            {customer.updated_at && (
                                <Timeline.Item color="blue" dot={<EditOutlined />}>
                                    <Text strong>Cập nhật lần cuối:</Text> {formatDate(customer.updated_at)}
                                    <p className="text-gray-500">Thông tin khách hàng đã được chỉnh sửa.</p>
                                </Timeline.Item>
                            )}
                            {/* Khu vực này có thể được mở rộng để hiển thị thêm lịch sử từ nk_activity_logs */}
                        </Timeline>
                        {/* <Text type="secondary">
                            Lưu ý: Thông tin về gói đăng ký và lịch sử thanh toán sẽ được hiển thị ở đây sau khi backend được nâng cấp và phát triển thêm.
                        </Text> */}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerDetailPage;