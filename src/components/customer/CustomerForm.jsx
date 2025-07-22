import { Button, Card, Col, Form, Input, Row } from 'antd';
import React from 'react';

const CustomerForm = ({ onFinish, initialValues, isEdit = false }) => {
    const [form] = Form.useForm();

    return (
        <Card>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
            >
                <Row gutter={24}>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="clinic_name"
                            label="Tên Phòng khám"
                        >
                            <Input placeholder="Nhập tên phòng khám" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="referring_doctor_1"
                            label="Tên Bác sĩ 1"
                            rules={[{ required: true, message: 'Vui lòng nhập tên bác sĩ!' }]}
                        >
                            <Input placeholder="Bắt buộc" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>

                        <Form.Item
                            name="referring_doctor_2"
                            label="Tên Bác sĩ 2"
                        >
                            <Input />
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
                            <Input placeholder="Bắt buộc" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="phone"
                            label="Số điện thoại"
                        >
                            <Input placeholder="Nhập số điện thoại" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="address" label="Địa chỉ">
                            <Input placeholder="Nhập địa chỉ" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item name="city" label="Thành phố">
                            <Input placeholder="Nhập thành phố" />
                        </Form.Item>
                    </Col>

                    <Col xs={24}>
                        <p className="ant-form-text text-gray-500">
                            {isEdit ? "Để trống mật khẩu nếu không muốn thay đổi." : "Mật khẩu dùng để khách hàng đăng nhập."}
                        </p>
                    </Col>

                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password"
                            label="Mật khẩu"
                            rules={[{ required: !isEdit, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password placeholder={isEdit ? "Nhập mật khẩu mới" : "Bắt buộc"} />
                        </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                        <Form.Item
                            name="password_confirmation"
                            label="Xác nhận Mật khẩu"
                            dependencies={['password']}
                            rules={[
                                { required: !isEdit, message: 'Vui lòng xác nhận mật khẩu!' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder={isEdit ? "Nhập lại mật khẩu mới" : "Bắt buộc"} />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {isEdit ? 'Cập nhật Khách hàng' : 'Thêm Khách hàng'}
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default CustomerForm;