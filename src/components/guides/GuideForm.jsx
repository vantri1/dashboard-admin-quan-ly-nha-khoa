// src/components/guides/GuideForm.jsx

import 'react-quill/dist/quill.snow.css';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Typography, Upload } from 'antd';
import React, { useState } from 'react';
import ReactQuill from 'react-quill';

import CategoryForm from '../categories/CategoryForm'; // Tái sử dụng form danh mục

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;

// Dữ liệu giả lập cho danh mục hướng dẫn
const initialCategories = ['Hướng dẫn cho Bác sĩ', 'Hướng dẫn cho Lễ tân', 'Cài đặt & Cấu hình'];

// Component xem trước trên Google
const GooglePreview = ({ title, slug, description }) => (
    <div style={{ fontFamily: 'arial, sans-serif' }}>
        <Text style={{ color: '#1a0dab', fontSize: '18px', display: 'block' }} ellipsis>{title || 'Tiêu đề SEO sẽ hiển thị ở đây'}</Text>
        <Paragraph style={{ color: '#006621', fontSize: '14px', margin: 0 }}>https://yourwebsite.com/guides/{slug || 'duong-dan-huong-dan'}</Paragraph>
        <Paragraph style={{ color: '#545454', fontSize: '14px' }} ellipsis={{ rows: 2 }}>{description || 'Mô tả meta sẽ hiển thị ở đây.'}</Paragraph>
    </div>
);

const GuideForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState(initialCategories);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const formValues = Form.useWatch([], form);

    const handleAddCategory = (values) => {
        const newCategoryName = values.name;
        setCategories([...categories, newCategoryName]);
        form.setFieldsValue({ category: newCategoryName });
        message.success(`Đã thêm danh mục "${newCategoryName}"`);
        setIsCategoryModalVisible(false);
    };

    const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Row gutter={24}>
                {/* Cột trái */}
                <Col span={24} lg={16}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Card title="Nội dung Hướng dẫn" className="shadow-sm">
                            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}><Input placeholder="Ví dụ: Cách tạo một lịch hẹn mới" /></Form.Item>
                            <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}><ReactQuill theme="snow" modules={quillModules} style={{ backgroundColor: 'white' }} /></Form.Item>
                        </Card>
                        <Card title="Tối ưu hóa SEO (Tùy chọn)" className="shadow-sm">
                            <Card type="inner" className="mb-6"><GooglePreview title={formValues?.seo_title || formValues?.title} slug={formValues?.slug} description={formValues?.meta_description} /></Card>
                            <Form.Item name="seo_title" label="Tiêu đề SEO"><Input placeholder="Để trống để dùng tiêu đề chính" /></Form.Item>
                            <Form.Item name="slug" label="Đường dẫn (Slug)"><Input addonBefore="https://yourwebsite.com/guides/" placeholder="cach-tao-lich-hen" /></Form.Item>
                            <Form.Item name="meta_description" label="Mô tả Meta"><TextArea rows={3} placeholder="Viết mô tả ngắn gọn cho công cụ tìm kiếm." /></Form.Item>
                        </Card>
                    </Space>
                </Col>
                {/* Cột phải */}
                <Col span={24} lg={8}>
                    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                        <Card title="Tùy chọn đăng" className="shadow-sm">
                            <Form.Item name="status" label="Trạng thái" initialValue="Published"><Select><Option value="Published">Xuất bản</Option><Option value="Draft">Bản nháp</Option></Select></Form.Item>
                        </Card>
                        <Card title="Phân loại" className="shadow-sm">
                            <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                                <Select
                                    placeholder="Chọn một danh mục"
                                    popupRender={(menu) => (
                                        <><Divider style={{ margin: '8px 0' }} /><Space style={{ padding: '0 8px 4px' }}><Button type="text" icon={<PlusOutlined />} onClick={() => setIsCategoryModalVisible(true)}>Thêm danh mục</Button></Space></>
                                    )}
                                >
                                    {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                                </Select>
                            </Form.Item>
                        </Card>
                        <Card title="Ảnh đại diện" className="shadow-sm">
                            <Form.Item name="featuredImage" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload name="featuredImage" action="/upload.do" listType="picture-card" maxCount={1}><div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải lên</div></div></Upload>
                            </Form.Item>
                        </Card>
                    </Space>
                </Col>
            </Row>
            <Form.Item className="mt-6"><Button type="primary" htmlType="submit" size="large">{initialValues ? 'Cập nhật Hướng dẫn' : 'Lưu và Xuất bản'}</Button></Form.Item>
            <CategoryForm open={isCategoryModalVisible} onCancel={() => setIsCategoryModalVisible(false)} onFinish={handleAddCategory} />
        </Form>
    );
};

export default GuideForm;