// src/components/products/ProductForm.jsx

import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Form, Input, InputNumber, message, Row, Select, Space, Upload } from 'antd';
import React, { useState } from 'react';

import CategoryForm from '../categories/CategoryForm';


const { TextArea } = Input;
const { Option } = Select;

// Giả lập các danh mục ban đầu
const initialCategories = ['React', 'VueJS', 'PHP', 'NextJS', 'NodeJS'];

const ProductForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState(initialCategories);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);

    const normFile = (e) => (Array.isArray(e) ? e : e && e.fileList);

    // --- LOGIC MỚI ĐỂ XỬ LÝ THÊM DANH MỤC ---
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

    return (
        <>
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                initialValues={initialValues}
            >
                <Row gutter={24}>
                    <Col span={24} lg={16}>
                        {/* ... (Phần thông tin cơ bản không đổi) ... */}
                        <Card title="Thông tin cơ bản" variant={false} className="shadow-sm">
                            <Form.Item name="name" label="Tên Source Code" rules={[{ required: true, message: 'Vui lòng nhập tên source code!' }]}>
                                <Input placeholder="Ví dụ: React E-commerce Kit" />
                            </Form.Item>
                            <Form.Item name="description" label="Mô tả chi tiết" rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}>
                                <TextArea rows={6} placeholder="Mô tả các tính năng, công nghệ sử dụng..." />
                            </Form.Item>
                        </Card>
                    </Col>

                    <Col span={24} lg={8}>
                        <Card title="Giá và Danh mục" variant={false} className="shadow-sm">
                            {/* ... (Phần giá không đổi) ... */}
                            <Form.Item name="price" label="Giá (VNĐ)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                                <InputNumber className="w-full" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} min={0} />
                            </Form.Item>

                            {/* --- CẬP NHẬT DROPDOWN DANH MỤC --- */}
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
                        </Card>
                        {/* ... (Phần tệp và hình ảnh không đổi) ... */}
                        <Card title="Tệp và Hình ảnh" variant={false} className="shadow-sm mt-6">
                            <Form.Item name="sourceFile" label="Tệp mã nguồn (.zip)" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload name="source" action="/upload.do" listType="picture" maxCount={1}>
                                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                                </Upload>
                            </Form.Item>
                            <Form.Item name="images" label="Hình ảnh mô tả" valuePropName="fileList" getValueFromEvent={normFile}>
                                <Upload name="images" action="/upload.do" listType="picture-card" multiple>
                                    <div><PlusOutlined /><div style={{ marginTop: 8 }}>Tải lên</div></div>
                                </Upload>
                            </Form.Item>
                        </Card>
                    </Col>
                </Row>

                <Form.Item className="mt-6">
                    <Button type="primary" htmlType="submit" size="large">
                        {initialValues ? 'Cập nhật Source Code' : 'Lưu và Thêm mới'}
                    </Button>
                </Form.Item>
            </Form>

            {/* --- GỌI MODAL ĐỂ THÊM DANH MỤC --- */}
            <CategoryForm
                open={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                onFinish={handleAddCategory}
            />
        </>
    );
};

export default ProductForm;