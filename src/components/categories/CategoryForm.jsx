import { Button, Form, Input, Modal, Space } from 'antd';
import React, { useEffect } from 'react';

const CategoryForm = ({ open, onCancel, onFinish, initialValues }) => {
    const [form] = Form.useForm();

    // Điền dữ liệu vào form khi chỉnh sửa
    useEffect(() => {
        if (initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [initialValues, form, open]);

    return (
        <Modal
            title={initialValues ? `Chỉnh sửa Danh mục: ${initialValues.name}` : 'Thêm Danh mục mới'}
            open={open}
            onCancel={onCancel}
            footer={null} // Tự tạo footer riêng để kiểm soát tốt hơn
        >
            <Form form={form} layout="vertical" onFinish={onFinish} className="mt-6">
                <Form.Item
                    name="name"
                    label="Tên danh mục"
                    rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
                >
                    <Input placeholder="Ví dụ: React Native" />
                </Form.Item>
                <Form.Item
                    name="slug"
                    label="Đường dẫn (Slug)"
                    rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
                >
                    <Input placeholder="Ví dụ: react-native" />
                </Form.Item>
                <Form.Item className="text-right mb-0">
                    <Space>
                        <Button onClick={onCancel}>Hủy</Button>
                        <Button type="primary" htmlType="submit">
                            {initialValues ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;