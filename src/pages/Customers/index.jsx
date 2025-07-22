import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Input, message, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { bulkDeleteCustomers, deleteCustomer, getCustomers } from '../../services/customerService';

const { Title, Text } = Typography;
const { confirm } = Modal;

const CustomerListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState({ field: 'id', order: 'desc' });

    const fetchApiData = useCallback(async (page, pageSize, search = '', sortBy = 'id', sortOrder = 'desc') => {
        setLoading(true);
        try {
            const response = await getCustomers({
                page,
                limit: pageSize,
                search_term: search,
                sort_by: sortBy,
                sort_order: sortOrder,
            });
            const { data: customers, pagination: pagi } = response;
            setData(customers.map(item => ({ ...item, key: item.id })));
            setPagination(prev => ({
                ...prev,
                current: pagi.page,
                pageSize: pagi.limit,
                total: pagi.total_records,
            }));
        } catch (error) {
            message.error('Không thể tải dữ liệu khách hàng: ' + error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchApiData(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchApiData, pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order]);

    const handleTableChange = (pagi, filters, sorter) => {
        const newSort = sorter.field ? {
            field: sorter.field,
            order: sorter.order === 'ascend' ? 'asc' : 'desc',
        } : { field: 'id', order: 'desc' };

        setSort(newSort);
        setPagination(pagi);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(prev => ({ ...prev, current: 1 }));
    };

    const handleDelete = async (key) => {
        try {
            await deleteCustomer(key);
            message.success(`Đã xóa khách hàng #${key}.`);
            // Làm mới dữ liệu mà không cần tải lại trang
            fetchApiData(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order);
        } catch (error) {
            message.error('Lỗi không thể xóa khách hàng: ' + key + '. Lỗi: ' + error);
        }
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} khách hàng đã chọn?`,
            icon: <ExclamationCircleFilled />,
            content: 'Hành động này sẽ xóa mềm các khách hàng đã chọn.',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await bulkDeleteCustomers(selectedRowKeys);
                    message.success(`Đã xóa thành công ${selectedRowKeys.length} khách hàng.`);
                    setSelectedRowKeys([]);
                    fetchApiData(pagination.current, pagination.pageSize, searchTerm, sort.field, sort.order);
                } catch (error) {
                    message.error('Lỗi không thể xóa: ' + error);
                }
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: true,
            render: (id) => <div>{id}</div>,
        },
        {
            title: 'Mã KH', dataIndex: 'customer_code', key: 'customer_code', width: 120, sorter: true,
            render: (code) => <Tag color="geekblue">{code}</Tag>,
        },
        {
            title: 'Khách hàng', key: 'customer', sorter: true, dataIndex: 'clinic_name',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.avatar_url || `https://api.dicebear.com/7.x/miniavs/svg?seed=${record.id}`} />
                    <div>
                        <Text strong>{record.clinic_name || '(Chưa có tên phòng khám)'}</Text>
                        <br />
                        <Text type="secondary">BS: {record.referring_doctor_1}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Email', dataIndex: 'email', key: 'email', sorter: true,
        },
        {
            title: 'Số điện thoại', dataIndex: 'phone', key: 'phone',
        },
        {
            title: 'Ngày đăng ký', dataIndex: 'registered_at', key: 'registered_at', sorter: true,
            render: (text) => text ? new Date(text).toLocaleString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }) : '-',
        },
        {
            title: 'Hành Động', key: 'action', fixed: 'right', width: 180,
            render: (_, record) => (
                <Space size="middle">
                    <Link to={`/customers/${record.id}`}>
                        <Button type="text" icon={<EyeOutlined />} />
                    </Link>
                    <Link to={`/customers/edit/${record.id}`}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm
                        title="Xác nhận xóa khách hàng?"
                        description="Hành động này không thể hoàn tác."
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
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
            <Title level={3}>Danh sách Khách hàng</Title>
            <div className="flex justify-between items-center">
                <Input.Search
                    placeholder="Tìm theo tên PK, BS, mã KH, email, SĐT..."
                    onSearch={handleSearch}
                    enterButton
                    className="w-full max-w-md"
                    allowClear
                />
                <Link to="/customers/add">
                    <Button type="primary" icon={<PlusOutlined />}>Thêm khách hàng</Button>
                </Link>
            </div>
            {hasSelected && (
                <Alert
                    message={
                        <Space>
                            <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                            <Button type="link" danger onClick={showBulkDeleteConfirm}>
                                Xóa tất cả đã chọn
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
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 1200 }}
                rowKey="id"
            />
        </div>
    );
};

export default CustomerListPage;