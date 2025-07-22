import { EditOutlined, ExclamationCircleFilled, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Input, message, Modal, Space, Switch, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { deleteAccount, getAccounts, updateAccount } from '../../services/accountService';

const { Title, Text } = Typography;
const { confirm } = Modal;


const AccountListPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [searchTerm, setSearchTerm] = useState('');
    const [sort, setSort] = useState({ field: 'id', order: 'desc' });


    const fetchApiData = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await getAccounts(params);
            setUsers(response.data.map(u => ({ ...u, status: u.status === 'active', key: u.id })));
            setPagination({
                current: response.pagination.page,
                pageSize: response.pagination.limit,
                total: response.pagination.total_records,
            });
        } catch (error) {
            message.error(error || 'Không thể tải danh sách tài khoản.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            search_term: searchTerm,
            sort_by: sort.field,
            sort_order: sort.order
        };
        fetchApiData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchApiData, pagination.current, pagination.pageSize, searchTerm, sort]);

    const handleStatusChange = async (userId, newStatus) => {
        try {
            const response = await updateAccount(userId, { status: newStatus ? 'active' : 'inactive' });
            message.success(response.message || 'Cập nhật trạng thái thành công!');
            setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
        } catch (error) {
            message.error(error || 'Cập nhật trạng thái thất bại.');
        }
    };

    const handleDelete = async (userId) => {
        confirm({
            title: `Bạn có chắc muốn xóa tài khoản #${userId}?`,
            icon: <ExclamationCircleFilled />,
            content: 'Hành động này sẽ xóa mềm tài khoản.',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteAccount(userId);
                    message.success(response.message || `Đã xóa tài khoản #${userId}.`);
                    fetchApiData({
                        page: pagination.current,
                        limit: pagination.pageSize,
                        search_term: searchTerm,
                        sort_by: sort.field,
                        sort_order: sort.order
                    });
                } catch (error) {
                    message.error(error || `Xóa tài khoản #${userId} thất bại.`);
                }
            },
        });
    };

    const handleTableChange = (pagi, filters, sorter) => {
        const newSort = sorter.field ? {
            field: sorter.field,
            order: sorter.order === 'ascend' ? 'asc' : 'desc',
        } : { field: 'id', order: 'desc' };
        setSort(newSort);
        setPagination(p => ({ ...p, ...pagi }));
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        setPagination(p => ({ ...p, current: 1 }));
    };

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: true },
        { title: 'Người dùng', dataIndex: 'full_name', key: 'full_name', sorter: true, render: (text, record) => <Space><Avatar src={record.avatar_url} icon={<UserOutlined />} /> <Text strong>{text}</Text></Space> },
        { title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
        {
            title: 'Vai trò', dataIndex: 'role', key: 'role', sorter: true,
            render: (role) => <Tag color={role === 'admin' ? 'red' : (role === 'editor' ? 'geekblue' : 'gold')}>{role.toUpperCase()}</Tag>
        },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status, record) => <Switch checked={status} onChange={(checked) => handleStatusChange(record.id, checked)} /> },
        {
            title: 'Hành động', key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/settings/users/edit/${record.id}`}><Button icon={<EditOutlined />}>Sửa</Button></Link>
                    <Button type="primary" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
                </Space>
            )
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Title level={3} className="m-0">Người dùng & Phân quyền</Title>
                <Link to="/settings/users/add"><Button type="primary" icon={<PlusOutlined />}>Thêm Người dùng</Button></Link>
            </div>
            <Card>
                {/* <Input.Search
                    placeholder="Tìm theo tên hoặc email..."
                    onSearch={handleSearch}
                    enterButton
                    allowClear
                    className="w-full max-w-sm mb-4"
                /> */}
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    pagination={pagination}
                    loading={loading}
                    onChange={handleTableChange}
                    bordered
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default AccountListPage;