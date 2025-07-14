// src/components/accounts/AccountForm.jsx
import { Button, Card, Col, Form, Input, Row, Select, Switch } from 'antd';
import React from 'react';

const { Option } = Select;

const AccountForm = ({ onFinish, initialValues, isEditing = false }) => {
    return (
        <Form layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Card>
                <Row gutter={24}>
                    <Col span={12}>
                        <Form.Item name="fullName" label="Họ và Tên" rules={[{ required: true }]}>
                            <Input placeholder="Nhập họ tên đầy đủ" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                            <Input placeholder="email@example.com" disabled={isEditing} />
                        </Form.Item>
                    </Col>
                    {!isEditing && (
                        <>
                            <Col span={12}>
                                <Form.Item
                                    name="password"
                                    label="Mật khẩu"
                                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                                    hasFeedback
                                >
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="confirm"
                                    label="Xác nhận Mật khẩu"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
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
                                    <Input.Password />
                                </Form.Item>
                            </Col>
                        </>
                    )}
                    <Col span={12}>
                        <Form.Item name="role" label="Vai trò / Quyền" rules={[{ required: true }]}>
                            <Select placeholder="Chọn một vai trò">
                                <Option value="admin">Quản trị viên (Admin)</Option>
                                <Option value="editor">Biên tập viên (Editor)</Option>
                                <Option value="support">Hỗ trợ (Support)</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="status" label="Trạng thái" valuePropName="checked" initialValue={true}>
                            <Switch checkedChildren="Hoạt động" unCheckedChildren="Vô hiệu hóa" />
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
            <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" size="large">
                    {isEditing ? 'Cập nhật Tài khoản' : 'Thêm Tài khoản mới'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AccountForm;