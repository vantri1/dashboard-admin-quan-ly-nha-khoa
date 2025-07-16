import { Button, Form, Input, Modal, Space } from 'antd';
import React, { useEffect } from 'react';

const CategoryForm = ({ open, onCancel, onFinish, loading, initialValues }) => {
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
            destroyOnHidden
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
                    help="Để trống sẽ tự động tạo theo tên danh mục."
                >
                    <Input placeholder="Ví dụ: tin-tuc-su-kien" />
                </Form.Item>
                <Form.Item
                    name="description"
                    label="Mô tả"
                >
                    <Input.TextArea rows={3} placeholder="Mô tả ngắn về danh mục..." />
                </Form.Item>
                <Form.Item className="text-right mb-0">
                    <Space>
                        <Button onClick={onCancel} disabled={loading}>Hủy</Button>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            {initialValues ? 'Lưu thay đổi' : 'Thêm mới'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CategoryForm;