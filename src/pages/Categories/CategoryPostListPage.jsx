import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Input, message, Modal, Space, Table, Tooltip, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

import CategoryForm from '../../components/categories/CategoryForm';
import { addCategory, bulkDeleteCategories, deleteCategory, getCategories, updateCategory } from '../../services/categoryService';

const { Title, Text } = Typography;
const { confirm } = Modal;

const CategoryPostListPage = () => {
    // State quản lý dữ liệu và UI
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    // State quản lý các tham số truy vấn API
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
        search: '',
        sort_by: 'id',
        sort_order: 'desc', // Mặc định sắp xếp mới nhất trước
    });

    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    // Hàm gọi API chính, giờ không cần useCallback
    const fetchCategories = async (params) => {
        setLoading(true);
        try {
            // Chỉ lấy các tham số cần thiết cho API
            const apiParams = {
                ...params,
                type: 'post', // Luôn lấy danh mục bài viết
            };
            const result = await getCategories(apiParams);
            setCategories(result.categories);
            setPagination({
                current: result.page,
                pageSize: result.limit,
                total: result.total,
            });
        } catch (error) {
            message.error(`Lỗi tải danh mục: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // useEffect chỉ chạy một lần khi component được mount để tải dữ liệu ban đầu
    useEffect(() => {
        fetchCategories(queryParams);
    }, [queryParams]); // Chỉ gọi lại API khi queryParams thay đổi

    // --- XỬ LÝ CÁC HÀNH ĐỘNG CỦA NGƯỜI DÙNG ---

    const handleTableChange = (newPagination, filters, sorter) => {
        const newParams = {
            ...queryParams,
            page: newPagination.current,
            sort_by: sorter.field || 'id',
            sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
        };
        setQueryParams(newParams);
    };

    const handleSearch = (value) => {
        const newParams = { ...queryParams, search: value, page: 1 };
        setQueryParams(newParams);
    };

    const showModal = (category = null) => {
        setEditingCategory(category);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingCategory(null);
    };

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, values);
                message.success('Cập nhật danh mục thành công!');
            } else {
                const dataToSend = {
                    ...values,
                    category_type: 'post' // Đảm bảo luôn là 'post'
                };
                await addCategory(dataToSend);
                message.success('Thêm danh mục thành công!');
            }
            // Tải lại dữ liệu sau khi thành công
            fetchCategories(queryParams);
            handleCancel();
        } catch (error) {
            message.error(`Thao tác thất bại: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        confirm({
            title: `Bạn có chắc muốn xóa danh mục này?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await deleteCategory(id);
                    message.success('Xóa danh mục thành công');
                    // Tải lại dữ liệu sau khi thành công
                    fetchCategories(queryParams);
                } catch (error) {
                    message.error(`Lỗi khi xóa: ${error.message}`);
                }
            },
        });
    };

    const handleBulkDelete = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} danh mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await bulkDeleteCategories(selectedRowKeys);
                    message.success(`Đã xóa ${selectedRowKeys.length} danh mục`);
                    setSelectedRowKeys([]);
                    // Tải lại dữ liệu sau khi thành công
                    setQueryParams({ ...queryParams, page: 1 }); // Quay về trang 1
                } catch (error) {
                    message.error(`Lỗi khi xóa hàng loạt: ${error.message}`);
                }
            },
        });
    };

    // --- CẤU HÌNH BẢNG ---

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: true,
            fixed: 'left', // Cố định cột ID ở bên trái
        },
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            width: 250,
            sorter: true,
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Đường dẫn (Slug)',
            dataIndex: 'slug',
            key: 'slug',
            width: 250,
        },
        {
            title: 'Người tạo',
            dataIndex: 'creator_name',
            key: 'creator_name',
            width: 150,
            sorter: true,
            // Hiển thị 'N/A' nếu không có người tạo
            render: (text) => text || <Text type="secondary">N/A</Text>
        },
        {
            title: 'Người sửa',
            dataIndex: 'updater_name',
            key: 'updater_name',
            width: 150,
            sorter: true,
            render: (text) => text || <Text type="secondary">N/A</Text>
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'created_at',
            key: 'created_at',
            width: 180,
            sorter: true,
            // Định dạng lại ngày tháng cho dễ đọc, bao gồm cả giờ và phút
            render: (text) => text ? new Date(text).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : '-',
        },
        {
            title: 'Ngày sửa gần nhất',
            dataIndex: 'updated_at',
            key: 'updated_at',
            width: 180,
            sorter: true,
            render: (text) => text ? new Date(text).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : '-',
        },
        {
            title: 'Hành động',
            key: 'action',
            width: 120,
            fixed: 'right', // Cố định cột Hành động ở bên phải
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="Chỉnh sửa">
                        <Button type="text" icon={<EditOutlined />} onClick={() => showModal(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa (vào thùng rác)">
                        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const onSelectChange = (keys) => setSelectedRowKeys(keys);
    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="space-y-4">
            <Title level={3}>Danh mục Bài viết</Title>
            <div className="flex justify-between items-center">
                <Input.Search
                    placeholder="Tìm theo tên danh mục..."
                    onSearch={handleSearch}
                    enterButton
                    className="w-full max-w-xs"
                    allowClear
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
                            <Button type="link" danger onClick={handleBulkDelete}>Xóa tất cả</Button>
                        </Space>
                    }
                    type="info" showIcon
                />
            )}

            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={categories}
                rowKey="id"
                loading={loading}
                pagination={pagination}
                onChange={handleTableChange}
                scroll={{ x: 1400 }}
                bordered
            />

            <CategoryForm
                open={isModalVisible}
                onCancel={handleCancel}
                onFinish={handleFinish}
                loading={loading}
                initialValues={editingCategory}
            />
        </div>
    );
};

export default CategoryPostListPage;