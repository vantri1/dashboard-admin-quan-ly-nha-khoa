// src/pages/Accounts/AccountListPage.jsx
import { CheckCircleOutlined, EditOutlined, ExclamationCircleFilled, MinusCircleOutlined, PlusOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Card, Input, message, Modal, Popconfirm, Space, Switch, Table, Tag, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

const initialData = [
    { id: 1, fullName: 'Admin Master', email: 'admin@example.com', role: 'admin', status: true, avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
    { id: 2, fullName: 'BTV Anh Tuấn', email: 'editor.anh.tuan@example.com', role: 'editor', status: true, avatar: null },
    { id: 3, fullName: 'Support Minh', email: 'support.minh@example.com', role: 'support', status: false, avatar: null },
    { id: 4, fullName: 'Admin Phụ', email: 'admin.phu@example.com', role: 'admin', status: true, avatar: null },
];

const AccountListPage = () => {
    const [users, setUsers] = useState(initialData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleStatusChange = (userId, newStatus) => {
        setUsers(users.map(user => user.id === userId ? { ...user, status: newStatus } : user));
        message.success("Cập nhật trạng thái thành công!");
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} tài khoản đã chọn?`,
            icon: <ExclamationCircleFilled />,
            content: 'Tài khoản Admin không thể bị xóa bằng hành động này.',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                // Lọc ra các tài khoản không phải là admin trước khi xóa
                const deletableKeys = selectedRowKeys.filter(key => {
                    const user = users.find(u => u.id === key);
                    return user && user.role !== 'admin';
                });

                if (deletableKeys.length < selectedRowKeys.length) {
                    message.warning('Một số tài khoản Quản trị viên (Admin) không thể bị xóa.');
                }

                setUsers(users.filter(user => !deletableKeys.includes(user.id)));
                setSelectedRowKeys([]);
                message.success(`Đã xóa ${deletableKeys.length} tài khoản.`);
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const lowercasedTerm = searchTerm.toLowerCase();
        return users.filter(user =>
            user.fullName.toLowerCase().includes(lowercasedTerm) ||
            user.email.toLowerCase().includes(lowercasedTerm)
        );
    }, [users, searchTerm]);

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id },
        { title: 'Người dùng', dataIndex: 'fullName', key: 'fullName', sorter: (a, b) => a.fullName.localeCompare(b.fullName), render: (text, record) => <Space><Avatar src={record.avatar} icon={<UserOutlined />} /> <Text strong>{text}</Text></Space> },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            filters: [
                { text: 'Admin', value: 'admin' },
                { text: 'Editor', value: 'editor' },
                { text: 'Support', value: 'support' },
            ],
            onFilter: (value, record) => record.role === value,
            render: (role) => <Tag color={role === 'admin' ? 'red' : (role === 'editor' ? 'geekblue' : 'gold')}>{role.toUpperCase()}</Tag>
        },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status, record) => <Switch checked={status} onChange={(checked) => handleStatusChange(record.id, checked)} /> },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => <Link to={`/settings/users/edit/${record.id}`}><Button icon={<EditOutlined />}>Sửa</Button></Link>
        },
    ];

    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Title level={3} className="m-0">Người dùng & Phân quyền</Title>
                <Link to="/settings/users/add"><Button type="primary" icon={<PlusOutlined />}>Thêm Người dùng</Button></Link>
            </div>

            <Card>
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tên hoặc email..."
                    className="w-full max-w-sm mb-4"
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {hasSelected && (
                    <Alert
                        message={
                            <Space>
                                <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                                <Button type="link" danger onClick={showBulkDeleteConfirm}>Xóa tất cả</Button>
                            </Space>
                        }
                        type="info" showIcon className="mb-4"
                    />
                )}

                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={filteredUsers}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default AccountListPage;