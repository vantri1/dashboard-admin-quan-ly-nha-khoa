// src/pages/ProductListPage.jsx

import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Input, message, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

// Dữ liệu giả lập
const initialData = [
    { key: '1', name: 'React E-commerce Kit', author: 'John Doe', category: 'React', price: 1200000, sales: 150, status: 'Đang bán', imageUrl: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png' },
    { key: '2', name: 'VueJS Dashboard Pro', author: 'Jane Smith', category: 'VueJS', price: 950000, sales: 98, status: 'Đang bán', imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' },
    { key: '3', name: 'Laravel API Boilerplate', author: 'Admin', category: 'PHP', price: 500000, sales: 230, status: 'Ngừng bán', imageUrl: 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png' },
    { key: '4', name: 'NextJS Blog Template', author: 'Jane Smith', category: 'NextJS', price: 750000, sales: 110, status: 'Đang bán', imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png' },
];

const ProductListPage = () => {
    const [data, setData] = useState(initialData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const handleSearch = (value) => {
        const filteredData = initialData.filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())
        );
        setData(filteredData);
    };

    const handleDelete = (key) => {
        const newData = data.filter(item => item.key !== key);
        setData(newData);
        message.success(`Đã xóa source code #${key}`);
    };

    // --- LOGIC MỚI CHO MODAL XÁC NHẬN ---
    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            content: 'Hành động này không thể hoàn tác.',
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                // Logic xóa hàng loạt
                const newData = data.filter(item => !selectedRowKeys.includes(item.key));
                setData(newData);
                message.success(`Đã xóa ${selectedRowKeys.length} source code`);
                setSelectedRowKeys([]); // Xóa lựa chọn sau khi xóa
            },
            onCancel() {
                console.log('Cancel');
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
        { title: 'ID', dataIndex: 'key', key: 'key', render: (key) => <Text strong>#{key}</Text> },
        { title: 'Source Code', dataIndex: 'name', key: 'name', render: (text, record) => <Space><Avatar shape="square" size={48} src={record.imageUrl} /><Text>{text}</Text></Space> },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Danh mục', dataIndex: 'category', key: 'category', render: (category) => <Tag color="blue">{category}</Tag> },
        { title: 'Giá', dataIndex: 'price', key: 'price', sorter: (a, b) => a.price - b.price, render: (price) => `${price.toLocaleString('vi-VN')}đ` },
        { title: 'Lượt bán', dataIndex: 'sales', key: 'sales', sorter: (a, b) => a.sales - b.sales },
        { title: 'Trạng thái', key: 'status', dataIndex: 'status', filters: [{ text: 'Đang bán', value: 'Đang bán' }, { text: 'Ngừng bán', value: 'Ngừng bán' }], onFilter: (value, record) => record.status.indexOf(value) === 0, render: (status) => <Tag color={status === 'Đang bán' ? 'success' : 'error'}>{status.toUpperCase()}</Tag> },
        { title: 'Hành Động', key: 'action', render: (_, record) => <Space size="middle"><Link to={`/products/edit/${record.key}`}><Button type="text" icon={<EditOutlined />} /></Link><Popconfirm title="Bạn có chắc muốn xóa?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy"><Button type="text" danger icon={<DeleteOutlined />} /></Popconfirm></Space> },
    ];

    return (
        <>
            <Title level={3} className='mb-4'>Danh sách Source code</Title>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm theo tên source code..."
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full max-w-xs"
                    />
                    <Link to="/products/add">
                        <Button type="primary" icon={<PlusOutlined />}>Thêm Source Code</Button>
                    </Link>
                </div>

                {hasSelected && (
                    <Alert
                        message={
                            <Space>
                                <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                                {/* Nút này giờ sẽ gọi hàm hiển thị Modal */}
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
                    dataSource={data}
                    bordered
                    rowKey="key"
                />
            </div>
        </>
    );
};

export default ProductListPage;