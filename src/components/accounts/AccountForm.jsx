import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import React from 'react';

const { Option } = Select;

const AccountForm = ({ onFinish, initialValues, isEditing = false }) => {
    return (
        <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
            // Thêm key để đảm bảo form reset khi initialValues thay đổi (quan trọng khi edit)
            key={initialValues ? initialValues.id : 'new'}
        >
            <Card>
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="full_name"
                            label="Họ và Tên"
                            rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
                        >
                            <Input placeholder="Nhập họ và tên đầy đủ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: 'Vui lòng nhập email!' },
                                { type: 'email', message: 'Email không đúng định dạng!' }
                            ]}
                        >
                            {/* Email không nên được sửa, nên disabled khi isEditing */}
                            <Input
                                placeholder="email@gmail.com"
                                disabled={isEditing}
                            />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="role"
                            label="Vai trò / Quyền"
                            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
                        >
                            <Select placeholder="Chọn một vai trò">
                                <Option value="admin">Quản trị viên (Admin)</Option>
                                <Option value="editor">Biên tập viên (Editor)</Option>
                                <Option value="support">Hỗ trợ (Support)</Option>
                            </Select>
                        </Form.Item>
                    </Col>

                    {/* Chỉ hiển thị trường trạng thái khi chỉnh sửa */}
                    {isEditing && (
                        <Col span={12}>
                            <Form.Item
                                name="status"
                                label="Trạng thái"
                                valuePropName="checked"
                            >
                                <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu hóa" />
                            </Form.Item>
                        </Col>
                    )}

                    <Col span={24}>
                        <p className="ant-form-text text-gray-500">
                            {isEditing ? "Để trống các trường mật khẩu nếu bạn không muốn thay đổi." : "Mật khẩu là bắt buộc cho tài khoản mới."}
                        </p>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[
                                // Mật khẩu chỉ bắt buộc khi tạo mới
                                { required: !isEditing, message: 'Vui lòng nhập mật khẩu!' },
                                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
                            ]}
                            hasFeedback
                        >
                            <Input.Password placeholder={isEditing ? 'Nhập mật khẩu mới' : 'Ít nhất 6 ký tự'} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password_confirmation"
                            label="Xác nhận Mật khẩu"
                            dependencies={['password']}
                            hasFeedback
                            rules={[
                                // Xác nhận chỉ bắt buộc khi trường mật khẩu được nhập
                                ({ getFieldValue }) => ({
                                    required: !!getFieldValue('password'),
                                    message: 'Vui lòng xác nhận mật khẩu!',
                                }),
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Hai mật khẩu không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Nhập lại mật khẩu" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" size="large">
                    {isEditing ? 'Lưu thay đổi' : 'Thêm Tài khoản mới'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountForm;