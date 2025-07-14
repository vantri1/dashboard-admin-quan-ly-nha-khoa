// src/components/posts/PostForm.jsx

import { PlusOutlined, } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Typography, Upload } from 'antd';
import React, { useState } from 'react';

import CategoryForm from '../categories/CategoryForm';

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;

// --- DỮ LIỆU GIẢ LẬP ---
const initialCategories = ['Hướng dẫn Lập trình', 'Tin tức Công nghệ', 'Thủ thuật & Mẹo'];

const GooglePreview = ({ title, slug, description }) => (
    <div style={{ fontFamily: 'arial, sans-serif' }}>
        <Text style={{ color: '#1a0dab', fontSize: '18px' }}>{title || 'Tiêu đề SEO sẽ hiển thị ở đây'}</Text>
        <Paragraph style={{ color: '#006621', fontSize: '14px', margin: 0 }}>
            https://yourwebsite.com/blog/{slug || 'duong-dan-bai-viet'}
        </Paragraph>
        <Paragraph style={{ color: '#545454', fontSize: '14px' }} ellipsis={{ rows: 2 }}>
            {description || 'Mô tả meta sẽ hiển thị ở đây. Hãy viết một đoạn mô tả hấp dẫn để thu hút người dùng nhấp vào.'}
        </Paragraph>
    </div>
);

const PostForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState(initialCategories);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

    const handleAddCategory = (values) => {
        console.log('New category:', values);
        const newCategoryName = values.name;
        // Thêm danh mục mới vào danh sách
        setCategories([...categories, newCategoryName]);
        // Tự động chọn danh mục vừa thêm
        form.setFieldsValue({ category: newCategoryName });
        message.success(`Đã thêm danh mục "${newCategoryName}"`);
        setIsCategoryModalVisible(false); // Đóng modal
    };
    const formValues = Form.useWatch([], form);

    const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
        >
            <Row gutter={24}>
                {/* --- Cột trái: Nội dung chính --- */}
                <Col span={24} lg={16}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Card title="Nội dung bài viết" variant={false} className="shadow-sm">
                            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}>
                                <Input placeholder="Ví dụ: Hướng dẫn sử dụng React Hook chi tiết" />
                            </Form.Item>
                            <Form.Item name="excerpt" label="Mô tả ngắn (Excerpt)">
                                <TextArea rows={3} placeholder="Mô tả ngắn gọn nội dung bài viết..." />
                            </Form.Item>
                            <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                                {/* LƯU Ý: Đây là một TextArea đơn giản.
                                Trong dự án thực tế, bạn nên tích hợp một Rich Text Editor
                                như TinyMCE, CKEditor, hoặc React Quill để có trải nghiệm soạn thảo tốt hơn.
                            */}
                                <TextArea rows={15} placeholder="Soạn thảo nội dung bài viết tại đây..." />
                            </Form.Item>
                        </Card>

                        <Card title="Tối ưu hóa SEO (Tùy chọn)" variant={false} className="shadow-sm">
                            <Paragraph type="secondary">Xem trước cách bài viết của bạn sẽ hiển thị trên Google.</Paragraph>
                            <Card type="inner" style={{ marginBottom: 24 }}>
                                <GooglePreview
                                    title={formValues?.seo_title || formValues?.title}
                                    slug={formValues?.slug}
                                    description={formValues?.meta_description}
                                />
                            </Card>

                            <Form.Item name="seo_title" label="Tiêu đề SEO, ngắn gọn (dưới 60 ký tự), chứa từ khóa chính.">
                                <Input placeholder="Để trống để dùng tiêu đề bài viết" />
                            </Form.Item>
                            <Form.Item name="slug" label="Đường dẫn (Slug)">
                                <Input addonBefore="https://yourwebsite.com/blog/" placeholder="vi-du-duong-dan-than-thien" />
                            </Form.Item>
                            <Form.Item name="meta_description" label="Mô tả Meta">
                                <TextArea rows={3} placeholder="Mô tả ngắn gọn, hấp dẫn cho công cụ tìm kiếm." />
                            </Form.Item>
                        </Card>
                    </Space>
                </Col>

                {/* --- Cột phải: Các tùy chọn --- */}
                <Col span={24} lg={8}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Card title="Tùy chọn đăng" variant={false} className="shadow-sm">
                            <Form.Item name="status" label="Trạng thái" initialValue="Draft">
                                <Select>
                                    <Option value="Published">Xuất bản</Option>
                                    <Option value="Draft">Bản nháp</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="author" label="Tác giả" initialValue="Admin">
                                <Select>
                                    <Option value="Admin">Admin</Option>
                                    <Option value="Editor">Editor</Option>
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="Danh mục & Thẻ" variant={false} className="shadow-sm">
                            <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                                <Select
                                    placeholder="Chọn một danh mục"
                                    popupRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <Button type="text" icon={<PlusOutlined />} onClick={() => setIsCategoryModalVisible(true)}>
                                                    Thêm danh mục mới
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                >
                                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                                </Select>
                            </Form.Item>
                            <Form.Item name="tags" label="Thẻ (Tags)">
                                <Select
                                    mode="tags"
                                    placeholder="Nhập các thẻ và nhấn Enter"
                                    tokenSeparators={[',']}
                                >
                                    {/* Các tags sẽ được tạo động */}
                                </Select>
                            </Form.Item>
                        </Card>

                        <Card title="Ảnh đại diện" variant={false} className="shadow-sm">
                            <Form.Item name="featuredImage" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload
                                    name="featuredImage"
                                    action="/upload.do" // URL giả lập
                                    listType="picture-card"
                                    maxCount={1}
                                >
                                    <div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải lên</div></div>
                                </Upload>
                            </Form.Item>
                        </Card>
                    </Space>
                </Col>
            </Row>

            <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" size="large">
                    {initialValues ? 'Cập nhật Bài viết' : 'Lưu và Xuất bản'}
                </Button>
            </Form.Item>

            <CategoryForm
                open={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                onFinish={handleAddCategory}
            />
        </Form>
    );
};

export default PostForm;