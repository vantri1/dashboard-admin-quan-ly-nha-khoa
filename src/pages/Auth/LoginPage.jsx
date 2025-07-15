// src/pages/Auth/LoginPage.jsx

import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Form, Input, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react'; // Giữ useState cho 'loading'
import { useNavigate } from 'react-router-dom';

import { themeColors } from '../../configs/theme';
import { useAuth } from '../../contexts/AuthContext';
import { loginAPI } from './api';

const { Title, Text, Link } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(false); // Vẫn giữ state 'loading'

    useEffect(() => {
        if (isAuthenticated) {
            // Nếu người dùng đã xác thực thành công, chuyển hướng đến dashboard
            // Điều này đảm bảo trạng thái đã cập nhật xong xuôi
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const onFinish = async (values) => {
        setLoading(true);

        try {
            // Gửi yêu cầu POST đến API đăng nhập bằng Axios
            // SỬ DỤNG TRỰC TIẾP values.email VÀ values.password TỪ ĐỐI SỐ ONFINISH
            const response = await loginAPI(values);

            const { token, admin, message: msg } = response.data;

            login(token, admin);

        } catch (error) {
            console.error('Login error:', error);
            if (error.response) {
                message.error(error.response.data.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            } else if (error.request) {
                message.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
            } else {
                message.error('Có lỗi xảy ra trong quá trình đăng nhập.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen"
            style={{ backgroundColor: themeColors.contentBg }}
        >
            <Card className="w-full max-w-md shadow-lg" variant="borderless"> {/* Đã sửa variant */}
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
                        <Input
                            prefix={<MailOutlined />}
                            placeholder="Email"
                        // KHÔNG DÙNG value={email} VÀ onChange={setEmail} NỮA
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Mật khẩu"
                        // KHÔNG DÙNG value={password} VÀ onChange={setPassword} NỮA
                        />
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
                        <Button type="primary" htmlType="submit" className="w-full" loading={loading}>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default LoginPage;