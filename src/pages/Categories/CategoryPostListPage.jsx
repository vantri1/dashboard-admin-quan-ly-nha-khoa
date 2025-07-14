// src/pages/CategoryPostListPage.jsx

import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, message, Modal, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import CategoryForm from '../../components/categories/CategoryForm';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Dữ liệu giả lập
const initialData = [
    { id: 1, name: 'Hướng dẫn Lập trình', slug: 'huong-dan-lap-trinh', postCount: 12 },
    { id: 2, name: 'Tin tức Công nghệ', slug: 'tin-tuc-cong-nghe', postCount: 35 },
    { id: 3, name: 'Thủ thuật & Mẹo', slug: 'thu-thuat-meo', postCount: 28 },
    { id: 4, name: 'Phát hành Sản phẩm', slug: 'phat-hanh-san-pham', postCount: 8 },
];

const CategoryPostListPage = () => {
    const [categories, setCategories] = useState(initialData);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        if (editingCategory) {
            form.setFieldsValue(editingCategory);
        } else {
            form.resetFields();
        }
    }, [editingCategory, form]);

    const handleSearch = (value) => {
        const filteredData = initialData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setCategories(filteredData);
    };

    const showModal = (category = null) => {
        setEditingCategory(category);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    const handleFinish = (values) => {
        if (editingCategory) {
            setCategories(
                categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, ...values } : cat)),
            );
            message.success('Cập nhật danh mục thành công!');
        } else {
            const newCategory = {
                id: categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1,
                ...values,
                postCount: 0,
            };
            setCategories([...categories, newCategory]);
            message.success('Thêm danh mục thành công!');
        }
        handleCancel();
    };

    const showDeleteConfirm = (id) => {
        confirm({
            title: `Bạn có chắc muốn xóa danh mục #${id}?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setCategories(categories.filter((cat) => cat.id !== id));
                message.success('Xóa danh mục thành công');
            },
        });
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} danh mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setCategories(categories.filter((cat) => !selectedRowKeys.includes(cat.id)));
                message.success(`Đã xóa ${selectedRowKeys.length} danh mục`);
                setSelectedRowKeys([]);
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Tên danh mục', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.length - b.name.length },
        { title: 'Đường dẫn (Slug)', dataIndex: 'slug', key: 'slug' },
        { title: 'Số bài viết', dataIndex: 'postCount', key: 'postCount', sorter: (a, b) => a.postCount - b.postCount },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => showDeleteConfirm(record.id)} />
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Title level={3}>Danh mục Sản phẩm</Title>
            <div className="flex justify-between items-center">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên danh mục..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full max-w-xs"
                />
                <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
                    Thêm Danh mục
                </Button>
            </div>

            {hasSelected && (
                <Alert
                    message={
                        <Space>
                            <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                            <Button type="link" danger onClick={showBulkDeleteConfirm}>
                                Xóa tất cả
                            </Button>
                        </Space>
                    }
                    type="info"
                    showIcon
                />
            )}

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={categories}
                rowKey="id"
                scroll={{ x: 1000 }}
                bordered
            />
            <CategoryForm
                open={isModalVisible}
                onCancel={handleCancel}
                onFinish={handleFinish}
                initialValues={editingCategory}
            />
        </div>
    );
};

export default CategoryPostListPage;