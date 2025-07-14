// src/pages/Guides/GuideListPage.jsx
import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, message, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

const initialData = [
    { id: 1, title: 'Cách tạo một lịch hẹn mới', category: 'Hướng dẫn cho Lễ tân', status: 'Published' },
    { id: 2, title: 'Ghi nhận một ca điều trị phức tạp', category: 'Hướng dẫn cho Bác sĩ', status: 'Published' },
    { id: 3, title: 'Cấu hình SMS Brandname', category: 'Cài đặt & Cấu hình', status: 'Draft' },
];

const GuideListPage = () => {
    const [guides, setGuides] = useState(initialData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // <<< STATE MỚI CHO CHECKBOX

    const handleDelete = (id) => {
        setGuides(guides.filter(p => p.id !== id));
        message.success('Đã xóa hướng dẫn thành công!');
    };

    // --- LOGIC MỚI CHO VIỆC XÓA HÀNG LOẠT ---
    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk() {
                setGuides(guides.filter(p => !selectedRowKeys.includes(p.id)));
                setSelectedRowKeys([]);
                message.success(`Đã xóa ${selectedRowKeys.length} hướng dẫn.`);
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    const columns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id }, // <<< THÊM CỘT ID
        { title: 'Tiêu đề Hướng dẫn', dataIndex: 'title', key: 'title', render: (text) => <Text strong>{text}</Text> },
        { title: 'Danh mục', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="cyan">{cat}</Tag> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Published' ? 'success' : 'default'}>{status}</Tag> },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/guides/edit/${record.id}`}><Button icon={<EditOutlined />}>Sửa</Button></Link>
                    <Popconfirm title="Bạn có chắc muốn xóa hướng dẫn này?" onConfirm={() => handleDelete(record.id)}><Button icon={<DeleteOutlined />} danger /></Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Title level={3} className="m-0">Quản lý Hướng dẫn</Title>
                <Link to="/guides/add"><Button type="primary" icon={<PlusOutlined />}>Thêm hướng dẫn</Button></Link>
            </div>

            {/* --- THANH THÔNG BÁO KHI CHỌN HÀNG LOẠT --- */}
            {hasSelected && (
                <Alert
                    message={
                        <Space>
                            <Text strong>Đã chọn {selectedRowKeys.length} mục</Text>
                            <Button type="link" danger onClick={showBulkDeleteConfirm}>Xóa tất cả</Button>
                        </Space>
                    }
                    type="info"
                    showIcon
                />
            )}

            <Card>
                <Table
                    rowSelection={rowSelection}
                    columns={columns}
                    dataSource={guides}
                    rowKey="id"
                    bordered
                    scroll={{ x: 1400 }}
                />
            </Card>
        </div>
    );
};

export default GuideListPage;