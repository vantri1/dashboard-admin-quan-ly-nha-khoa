// src/pages/Posts/PostListPage.jsx
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Input, message, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { IMAGE_URL } from '../../constants/imageUrl';
import { bulkDeletePosts, deletePost, getPosts } from '../../services/postServer';

const { Title, Text } = Typography;
const { confirm } = Modal;

const PostListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 4,
        total: 0,
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState({ field: 'id', order: 'desc' }); // Default sort

    const fetchPosts = useCallback(async (page, pageSize, search = '', sortBy = 'id', sortOrder = 'desc') => {
        setLoading(true);
        try {
            const response = await getPosts({
                page,
                limit: pageSize,
                post_type: 'post',
                search_term: search,
                sort_by: sortBy,
                sort_order: sortOrder,
            });
            const { data: posts, pagination: pagi } = response;
            setData(posts.map(item => ({ ...item, key: item.id }))); // Map id to key
            setPagination(prev => ({
                ...prev,
                current: pagi.page,
                pageSize: pagi.limit,
                total: pagi.total_records,
            }));
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            message.error('Không thể tải dữ liệu bài viết.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchPosts, pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order]);

    const handleTableChange = (pagi, filters, sorter) => {
        setPagination(pagi);
        if (sorter.field) {
            setSort({
                field: sorter.field,
                order: sorter.order === 'ascend' ? 'asc' : 'desc',
            });
        } else {
            setSort({ field: 'id', order: 'desc' }); // Reset sort if no sorter
        }
        // No need to call fetchPosts here, useEffect will react to pagination/sort changes
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page on new search
    };

    const handleDelete = async (key) => {
        try {
            await deletePost(key);
            message.success(`Đã chuyển bài viết #${key} vào thùng rác.`);
            fetchPosts(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order); // Refresh data
        } catch (error) {
            console.error('Failed to delete post:', error);
        }
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa mềm ${selectedRowKeys.length} bài viết đã chọn?`,
            icon: <ExclamationCircleFilled />,
            content: 'Các bài viết sẽ được chuyển vào thùng rác và có thể khôi phục sau.',
            okText: 'Xác nhận xóa mềm',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await bulkDeletePosts(selectedRowKeys);
                    message.success(`Đã xóa mềm thành công ${selectedRowKeys.length} bài viết.`);
                    setSelectedRowKeys([]);
                    fetchPosts(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order); // Refresh data
                } catch (error) {
                    console.error('Failed to bulk delete posts:', error);
                }
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
        {
            title: 'ID', dataIndex: 'id', key: 'id',
            fixed: 'left',
            width: 80,
            render: (id) => <Text strong>#{id}</Text>, sorter: true
        },
        {
            title: 'Bài viết',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <Space>
                    <Avatar shape="square" size={48} src={IMAGE_URL + '/' + record.featured_image_url || 'https://via.placeholder.com/48'} />
                    <Text>{text}</Text>
                </Space>
            ),
            sorter: true
        },
        { title: 'Tác giả', dataIndex: 'creator_name', key: 'creator_name', sorter: true },
        { title: 'Người sửa gần nhất', dataIndex: 'updater_name', key: 'updater_name', sorter: true },
        { title: 'Danh mục', dataIndex: 'category_name', key: 'category_name', render: (cat) => <Tag color="cyan">{cat}</Tag> },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'published' ? 'success' : 'default'}>
                    {status === 'published' ? 'Đã xuất bản' : status === 'draft' ? 'Bản nháp' : 'Đang chờ duyệt'}
                </Tag>
            ),
            sorter: true
        },
        {
            title: 'Ngày xuất bản',
            dataIndex: 'published_at',
            key: 'published_at',
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
            title: 'Nổi bật',
            dataIndex: 'is_featured',
            key: 'is_featured',
            width: 120,
            render: (is_featured) => (
                <Tag color={is_featured === 1 ? 'error' : 'default'}>
                    {is_featured === 1 ? 'Nổi bật' : 'Không'}
                </Tag>
            ),
            sorter: true
        },
        {
            title: 'Lượt xem',
            dataIndex: 'view_count',
            key: 'view_count',
            width: 120,
            render: (view_count) => (
                <div>
                    {view_count}
                </div>
            ),
            sorter: true
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
            title: 'Hành Động',
            key: 'action',
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/blog/posts/edit/${record.id}`}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa bài viết này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa mềm"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Title level={3}>Danh sách Bài viết</Title>
            <div className="flex justify-between items-center">
                <Input.Search
                    placeholder="Tìm theo tiêu đề bài viết..."
                    onSearch={handleSearch}
                    enterButton
                    className="w-full max-w-xs"
                    allowClear
                />
                <Link to="/blog/posts/add">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm bài viết mới</Button>
                </Link>
            </div>
            {hasSelected && (
                <Alert
                    message={
                        <Space>
                            <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                            <Button type="link" danger onClick={showBulkDeleteConfirm}>
                                Xóa tất cả đã chọn (Mềm)
                            </Button>
                            {/* Thêm các nút hành động hàng loạt khác nếu cần */}
                        </Space>
                    }
                    type="info"
                    showIcon
                />
            )}
            <Table
                rowSelection={rowSelection}
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 2000 }} // Đảm bảo bảng có thể cuộn ngang nếu nhiều cột
                rowKey="id" // Quan trọng: sử dụng 'id' thực tế từ API làm rowKey
            />
        </div>
    );
};

export default PostListPage;