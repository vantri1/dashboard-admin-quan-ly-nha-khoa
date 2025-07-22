// src/pages/Settings/SiteSettingsPage.jsx

import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, ColorPicker, Form, Input, message, Row, Space, Switch, Tabs, Typography } from 'antd';
import React, { useState } from 'react';

const { Title, Text } = Typography;

const SiteSettingsPage = () => {
    const [form] = Form.useForm();

    // Giả lập dữ liệu cài đặt hiện tại từ database
    const initialSettings = {
        siteTitle: 'Nha Khoa CRM',
        footerText: `© ${new Date().getFullYear()} Phần mềm CRM Nha Khoa. All Rights Reserved.`,
        hotline: '1900 1234',
        email: 'support@nhakhoacrm.com',
        primaryColor: '#00b96b', // Lấy từ theme hiện tại
        allowRegister: true,
    };

    const onFinish = (values) => {
        // Trong thực tế, đây là nơi bạn gọi API để lưu các cài đặt này vào database
        console.log('Saving settings:', values);
        message.success('Đã lưu cài đặt thành công!');
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    return (
        <div className="space-y-4">
            <Title level={3}>Cài đặt Website</Title>
            <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialSettings}>
                <Tabs defaultActiveKey="1" type="card">
                    {/* Tab 1: Cài đặt chung */}
                    <Tabs.TabPane tab="Cài đặt chung" key="1">
                        <Card>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item name="siteTitle" label="Tiêu đề Website" rules={[{ required: true }]}>
                                        <Input placeholder="Ví dụ: Phần mềm CRM cho Nha khoa" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="hotline" label="Hotline hỗ trợ">
                                        <Input placeholder="0987xxxxxx" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="email" label="Email liên hệ">
                                        <Input placeholder="support@example.com" />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>

                    {/* Tab 2: Giao diện & Thương hiệu */}
                    <Tabs.TabPane tab="Giao diện & Thương hiệu" key="2">
                        <Card>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item label="Màu chủ đạo">
                                        <Form.Item name="primaryColor" noStyle>
                                            <ColorPicker showText />
                                        </Form.Item>
                                        <Text type="secondary" style={{ marginLeft: 16 }}>Dùng để thay đổi màu nút, link...</Text>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="logo" label="Logo chính" valuePropName="fileList" getValueFromEvent={normFile}>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            <Text type="secondary">Nên dùng ảnh PNG nền trong, kích thước 200x60px.</Text>
                                            <Button icon={<UploadOutlined />}>Tải lên Logo</Button>
                                        </Space>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                </Tabs>

                <Form.Item className="mt-6">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large">
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SiteSettingsPage;