import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, message, Popconfirm, Space, Table, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteStaticPage, getStaticPages } from '../../services/staticPageService';


const { Title, Text } = Typography;

const StaticPageListPage = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const fetchPages = async (params = {}) => {
        setLoading(true);
        try {
            const response = await getStaticPages({
                page: params,
                limit: params.limit,
                ...params,
            });
            setPages(response.data);
            setPagination({
                current: response.pagination.page,
                pageSize: response.pagination.limit,
                total: response.pagination.total_records,
            });
        } catch (error) {
            message.error('Không thể tải danh sách trang: ' + error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages({ page: pagination.current, limit: pagination.pageSize });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteStaticPage(id);
            message.success('Xóa trang thành công!');
            fetchPages({ page: 1, limit: pagination.pageSize }); // Tải lại trang đầu tiên
        } catch (error) {
            message.error('Xóa trang thất bại: ' + error);
        }
    };

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id',
            fixed: 'left',
            width: 80,
            render: (id) => <Text strong>{id}</Text>, sorter: true
        },
        { title: 'Tiêu đề Trang', dataIndex: 'title', key: 'title', render: (text) => <Text strong>{text}</Text> },
        { title: 'Đường dẫn (Slug)', dataIndex: 'slug', key: 'slug' },
        { title: 'Người tạo', dataIndex: 'creator_name', key: 'creator_name', },
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
        { title: 'Người sửa', dataIndex: 'updater_name', key: 'updater_name', sorter: true },
        {
            title: 'Cập nhật lần cuối', dataIndex: 'updated_at', key: 'updated_at', render: (text) => text ? new Date(text).toLocaleString('vi-VN', {
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
            fixed: 'right',
            width: 120,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/pages/edit/${record.id}`}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc muốn xóa trang này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        placement="topRight"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    const handleTableChange = (pagination, filters, sorter) => {
        fetchPages({
            page: pagination.current,
            limit: pagination.pageSize,
            sort_by: sorter.field,
            sort_order: sorter.order === 'ascend' ? 'asc' : 'desc',
            ...filters,
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Title level={3} className="m-0">Quản lý Trang tĩnh</Title>
                <Link to="/pages/add">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm trang mới</Button>
                </Link>
            </div>
            <Card>
                <Table
                    columns={columns}
                    dataSource={pages}
                    rowKey="id"
                    loading={loading}
                    pagination={pagination}
                    onChange={handleTableChange}
                    bordered
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    );
};

export default StaticPageListPage;