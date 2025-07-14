// src/pages/Auth/LoginPage.jsx

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Typography } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { themeColors } from '../../configs/theme';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();

    const onFinish = (values) => {
        console.log('Login credentials:', values);
        // --- LOGIC XÁC THỰC ---
        // Trong thực tế, bạn sẽ gọi API ở đây để xác thực email và password.
        // Ví dụ:
        // if (email === 'admin@example.com' && password === '123456') {
        //   message.success('Đăng nhập thành công!');
        //   localStorage.setItem('authToken', 'your_jwt_token_here'); // Lưu token
        //   navigate('/dashboard');
        // } else {
        //   message.error('Email hoặc mật khẩu không chính xác!');
        // }
        // -----------------------

        // Giả lập đăng nhập thành công
        message.success('Đăng nhập thành công!');
        navigate('/dashboard');
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundColor: themeColors.contentBg }}
        >
            <Card className="w-full max-w-md shadow-lg" bordered={false}>
                <div className="text-center mb-8">
                    <Title level={2}>Chào mừng trở lại!</Title>
                    <Text type="secondary">Đăng nhập vào bảng điều khiển của bạn</Text>
                </div>
                <Form
                    name="login_form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email!' },
                            { type: 'email', message: 'Email không hợp lệ!' }
                        ]}
                    >
                        <Input prefix={<MailOutlined />} placeholder="Email" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
                    </Form.Item>

                    <Form.Item>
                        <div className="flex justify-between items-center">
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Ghi nhớ tôi</Checkbox>
                            </Form.Item>
                            <Link href="#">Quên mật khẩu?</Link>
                        </div>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full">
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;