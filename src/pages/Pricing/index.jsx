// src/pages/Pricing/index.jsx

import {
    AppstoreOutlined,
    CheckCircleFilled,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleFilled,
    PlusOutlined,
    UnorderedListOutlined,
} from '@ant-design/icons';
import {
    Alert,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    InputNumber,
    List,
    message,
    Modal,
    Popconfirm,
    Row,
    Segmented,
    Space,
    Switch,
    Table,
    Tag,
    Typography,
} from 'antd';
import React, { useState } from 'react';

const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

// --- DỮ LIỆU ĐÃ ĐƯỢC CẬP NHẬT VỚI GÓI "FREE TRIAL" ---
const initialPackages = [
    {
        id: 1,
        name: 'FREE TRIAL',
        price: 0,
        description: 'Trải nghiệm đầy đủ các tính năng nổi bật trong vòng 7 ngày',
        features: ['Quản lý lịch hẹn', 'Quản lý bệnh nhân', 'Báo cáo cơ bản', 'Hỗ trợ qua Email'],
        isFeatured: false,
        isActive: true
    },
    { id: 2, name: 'MINI', price: 300000, description: 'Gói cơ bản cho phòng khám nhỏ', features: ['Quản lý lịch hẹn', 'Quản lý bệnh nhân', 'Quản lý lịch sử bệnh nhân'], isFeatured: false, isActive: true },
    { id: 3, name: 'STANDARD', price: 400000, description: 'Gói cho phòng khám vừa', features: ['Mọi thứ ở gói MINI', 'Tích hợp module CSKH', 'SMS Brandname'], isFeatured: true, isActive: true },
    { id: 4, name: 'PRO', price: 600000, description: 'Gói cho phòng khám lớn', features: ['Mọi thứ ở gói STANDARD', 'Tích hợp Quản lý kho', 'Tích hợp tổng đài Call'], isFeatured: false, isActive: false },
];

// --- COMPONENT CON: GIAO DIỆN THẺ ---
const PricingCard = ({ pkg, onEdit, onDelete }) => (
    <Card
        hoverable
        className={`h-full shadow-lg ${!pkg.isActive && 'grayscale opacity-60'}`}
        actions={[
            <Button type="text" key="edit" icon={<EditOutlined />} onClick={() => onEdit(pkg)}>Sửa</Button>,
            <Popconfirm key="delete" title="Bạn có chắc muốn xóa gói này?" onConfirm={() => onDelete(pkg.id)}>
                <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
        ]}
    >
        {pkg.isFeatured && <Tag color="gold" className="absolute top-4 right-[-1px] rounded-l-md rounded-r-none">Nổi bật</Tag>}
        {pkg.id === 0 && <Tag color="success" className="absolute top-4 right-[-1px] rounded-l-md rounded-r-none">Dùng thử</Tag>}
        {!pkg.isActive && <Tag color="default" className="absolute top-4 left-[-1px] rounded-r-md rounded-l-none">Đang ẩn</Tag>}
        <div className="text-center">
            <Title level={3} className="uppercase">{pkg.name}</Title>
            <Paragraph type="secondary">{pkg.description}</Paragraph>
            <div className="my-4">
                {pkg.price === 0 ? (
                    <Text strong style={{ fontSize: '2.5rem', color: '#52c41a' }}>Miễn phí</Text>
                ) : (
                    <>
                        <Text strong style={{ fontSize: '2.5rem', color: '#1677ff' }}>{pkg.price.toLocaleString('vi-VN')}</Text>
                        <Text type="secondary"> đ/tháng</Text>
                    </>
                )}
            </div>
        </div>
        <Divider />
        <List
            dataSource={pkg.features}
            renderItem={(item) => <List.Item className="border-none! p-1!"><CheckCircleFilled className="text-green-500 mr-2" /> {item}</List.Item>}
            size="small"
        />
    </Card>
);

const PricingListPage = () => {
    const [viewMode, setViewMode] = useState('card');
    const [packages, setPackages] = useState(initialPackages);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    const showModal = (pkg = null) => {
        setEditingPackage(pkg);
        const formValues = pkg ? { ...pkg, features: pkg.features.join('\n') } : { isActive: true, price: 0 };
        form.setFieldsValue(formValues);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingPackage(null);
        form.resetFields();
    };

    const handleFinish = (values) => {
        const finalValues = { ...values, features: values.features.split('\n').filter(Boolean) };
        if (editingPackage) {
            setPackages(packages.map(p => (p.id === editingPackage.id ? { ...p, ...finalValues } : p)));
            message.success('Cập nhật gói giá thành công!');
        } else {
            const newPackage = { id: Date.now(), ...finalValues };
            setPackages([newPackage, ...packages]);
            message.success('Thêm gói giá mới thành công!');
        }
        handleCancel();
    };

    const handleDelete = (id) => {
        setPackages(packages.filter(p => p.id !== id));
        message.success('Đã xóa gói giá!');
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa', okType: 'danger', cancelText: 'Hủy',
            onOk() {
                setPackages(packages.filter(p => !selectedRowKeys.includes(p.id)));
                setSelectedRowKeys([]);
                message.success(`Đã xóa ${selectedRowKeys.length} gói giá.`);
            },
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    const tableColumns = [
        { title: 'ID', dataIndex: 'id', key: 'id', sorter: (a, b) => a.id - b.id, defaultSortOrder: 'descend' },
        { title: 'Tên gói', dataIndex: 'name', key: 'name', render: (text, record) => <Text strong>{text} {record.id === 0 ? <Tag color="success">Dùng thử</Tag> : (record.isFeatured && <Tag color="gold">Nổi bật</Tag>)}</Text> },
        { title: 'Giá (VNĐ/tháng)', dataIndex: 'price', key: 'price', render: (price) => (price === 0 ? <Text strong color="green">Miễn phí</Text> : price.toLocaleString('vi-VN')), sorter: (a, b) => a.price - b.price },
        { title: 'Trạng thái', dataIndex: 'isActive', key: 'isActive', render: (isActive) => <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Hoạt động' : 'Đang ẩn'}</Tag> },
        {
            title: 'Hành động', key: 'action',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
                    {record.id !== 0 && ( // Không cho xóa gói Dùng thử
                        <Popconfirm title="Bạn có chắc muốn xóa gói này?" onConfirm={() => handleDelete(record.id)}>
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Title level={3} className="m-0">Quản lý Bảng giá</Title>
                <Space>
                    <Segmented options={[{ value: 'card', icon: <AppstoreOutlined /> }, { value: 'table', icon: <UnorderedListOutlined /> }]} value={viewMode} onChange={setViewMode} />
                    <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>Thêm gói giá mới</Button>
                </Space>
            </div>

            {viewMode === 'table' && hasSelected && (
                <Alert
                    message={<Space><Text strong>Đã chọn {selectedRowKeys.length} mục</Text><Button type="link" danger onClick={showBulkDeleteConfirm}>Xóa tất cả</Button></Space>}
                    type="info" showIcon
                />
            )}

            {viewMode === 'card' ? (
                <Row gutter={[24, 24]}>
                    {packages.map(pkg => <Col xs={24} md={12} lg={8} key={pkg.id}><PricingCard pkg={pkg} onEdit={showModal} onDelete={handleDelete} /></Col>)}
                </Row>
            ) : (
                <Card>
                    <Table
                        rowSelection={rowSelection}
                        columns={tableColumns}
                        dataSource={packages.filter(p => p.id !== 0)}
                        rowKey="id"
                        scroll={{ x: 1000 }}
                        bordered />
                </Card>
            )}

            <Modal title={editingPackage ? 'Chỉnh sửa Gói giá' : 'Thêm Gói giá mới'} open={isModalVisible} onCancel={handleCancel} footer={null} destroyOnClose>
                <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-6">
                    <Form.Item name="name" label="Tên gói" rules={[{ required: true }]}><Input /></Form.Item>
                    <Form.Item name="price" label="Giá (VNĐ/tháng)" rules={[{ required: true }]}>
                        <InputNumber className="w-full" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                    </Form.Item>
                    <Form.Item name="description" label="Mô tả ngắn"><Input.TextArea rows={2} /></Form.Item>
                    <Form.Item name="features" label="Danh sách tính năng (mỗi tính năng một dòng)" rules={[{ required: true }]}>
                        <Input.TextArea rows={5} />
                    </Form.Item>
                    <Row justify="space-between">
                        <Form.Item name="isFeatured" label="Gói nổi bật?" valuePropName="checked"><Switch /></Form.Item>
                        <Form.Item name="isActive" label="Hiển thị gói này?" valuePropName="checked"><Switch /></Form.Item>
                    </Row>
                    <Form.Item className="text-right mb-0">
                        <Space>
                            <Button onClick={handleCancel}>Hủy</Button>
                            <Button type="primary" htmlType="submit">Lưu</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default PricingListPage;