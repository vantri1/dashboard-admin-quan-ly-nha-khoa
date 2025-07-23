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
    Spin,
    Switch,
    Table,
    Tag,
    Typography,
} from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { createPricingPackage, deletePricingPackage, getPricingPackages, updatePricingPackage } from '../../services/pricingService';



const { Title, Text, Paragraph } = Typography;
const { confirm } = Modal;

// --- COMPONENT CON: GIAO DIỆN THẺ (Không đổi) ---
const PricingCard = ({ pkg, onEdit, onDelete }) => (
    <Card
        hoverable
        className={` h-full shadow-lg pt-5 ${!pkg.is_active && 'grayscale opacity-60'}`} // API trả về is_active
        actions={[
            <Button type="text" key="edit" icon={<EditOutlined />} onClick={() => onEdit(pkg)}>Sửa</Button>,
            <Popconfirm key="delete" title="Bạn có chắc muốn xóa gói này?" onConfirm={() => onDelete(pkg.id)}>
                <Button type="text" danger icon={<DeleteOutlined />}>Xóa</Button>
            </Popconfirm>
        ]}
    >
        {!!pkg.is_featured && <Tag color="gold" className="absolute top-4 right-[-1px] rounded-l-md rounded-r-none">Nổi bật</Tag>}
        {pkg.name === 'FREE TRIAL' && <Tag color="success" className="absolute top-4 right-[-1px] rounded-l-md rounded-r-none">Dùng thử</Tag>}
        {!pkg.is_active && <Tag color="default" className="absolute top-4 left-[-1px] rounded-r-md rounded-l-none">Đang ẩn</Tag>}

        <div className="text-center">
            <Title level={3} className="uppercase">{pkg.name}</Title>
            <Paragraph type="secondary">{pkg.description}</Paragraph>
            <div className="my-4">
                {parseFloat(pkg.price_monthly) === 0 ? ( // API trả về price_monthly
                    <Text strong style={{ fontSize: '2.5rem', color: '#52c41a' }}>Miễn phí</Text>
                ) : (
                    <>
                        <Text strong style={{ fontSize: '2.5rem', color: '#1677ff' }}>{parseFloat(pkg.price_monthly).toLocaleString('vi-VN')}</Text>
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
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingPackage, setEditingPackage] = useState(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();

    // Hàm gọi API để lấy dữ liệu
    const fetchPackages = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPricingPackages(
                {
                    sort_by: 'price_monthly',
                    sort_order: 'esc',
                }
            );
            setPackages(response.data);
        } catch (error) {
            message.error(error || 'Có lỗi xảy ra, không thể tải dữ liệu.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPackages();
    }, [fetchPackages]);

    const showModal = (pkg = null) => {
        setEditingPackage(pkg);
        if (pkg) {
            // API trả về `price_monthly`, form dùng `price`
            const formValues = {
                ...pkg,
                price: parseFloat(pkg.price_monthly),
                features: pkg.features.join('\n')
            };
            form.setFieldsValue(formValues);
        } else {
            form.setFieldsValue({ is_active: true, is_featured: false, price: 0 });
        }
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingPackage(null);
        form.resetFields();
    };

    const handleFinish = async (values) => {
        // Chuyển đổi features từ string thành array
        const finalValues = { ...values, features: values.features.split('\n').filter(Boolean) };
        setLoading(true);
        try {
            if (editingPackage) {
                await updatePricingPackage(editingPackage.id, finalValues);
                message.success('Cập nhật gói giá thành công!');
            } else {
                await createPricingPackage(finalValues);
                message.success('Thêm gói giá mới thành công!');
            }
            await fetchPackages(); // Tải lại dữ liệu sau khi thành công
            handleCancel();
        } catch (error) {
            message.error(error || 'Thao tác thất bại.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deletePricingPackage(id);
            message.success('Đã xóa gói giá!');
            await fetchPackages(); // Tải lại dữ liệu
        } catch (error) {
            message.error(error || 'Xóa thất bại.');
        }
    };

    const handleBulkDelete = async () => {
        setLoading(true);
        try {
            // Thực hiện xóa song song để tối ưu hiệu suất
            await Promise.all(selectedRowKeys.map(id => deletePricingPackage(id)));
            message.success(`Đã xóa ${selectedRowKeys.length} gói giá.`);
            setSelectedRowKeys([]);
            await fetchPackages(); // Tải lại dữ liệu
        } catch (error) {
            message.error(error || `Có lỗi khi xóa các gói giá.`);
        } finally {
            setLoading(false);
        }
    };

    const showBulkDeleteConfirm = () => {
        confirm({
            title: `Bạn có chắc muốn xóa ${selectedRowKeys.length} mục đã chọn?`,
            icon: <ExclamationCircleFilled />,
            okText: 'Xác nhận xóa', okType: 'danger', cancelText: 'Hủy',
            onOk: handleBulkDelete,
        });
    };

    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = { selectedRowKeys, onChange: onSelectChange };
    const hasSelected = selectedRowKeys.length > 0;

    const tableColumns = [
        { title: 'Tên gói', dataIndex: 'name', key: 'name', render: (text, record) => <Text strong>{text} {record.name === 'FREE TRIAL' ? <Tag color="success">Dùng thử</Tag> : (!!record.is_featured && <Tag color="gold">Nổi bật</Tag>)}</Text> },
        { title: 'Giá (VNĐ/tháng)', dataIndex: 'price_monthly', key: 'price_monthly', render: (price_monthly) => (parseFloat(price_monthly) === 0 ? <Text strong color="green">Miễn phí</Text> : parseFloat(price_monthly).toLocaleString('vi-VN')), sorter: (a, b) => a.price_monthly - b.price_monthly },
        { title: 'Trạng thái', dataIndex: 'is_active', key: 'is_active', render: (isActive) => <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Hoạt động' : 'Đang ẩn'}</Tag> },
        { title: 'Người tạo', dataIndex: 'creator_name', key: 'creator_name', sorter: true },
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
        { title: 'Người sửa gần nhất', dataIndex: 'updater_name', key: 'updater_name', sorter: true },
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
        }, {
            title: 'Hành động', key: 'action', fixed: 'right',
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)}>Sửa</Button>
                    {record.name !== 'FREE TRIAL' && (
                        <Popconfirm title="Bạn có chắc muốn xóa gói này?" onConfirm={() => handleDelete(record.id)}>
                            <Button icon={<DeleteOutlined />} danger />
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Spin spinning={loading} tip="Đang tải...">
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
                            dataSource={packages.filter(p => p.name !== 'FREE TRIAL')}
                            rowKey="id"
                            scroll={{ x: 1400 }}
                            bordered />
                    </Card>
                )}

                <Modal title={editingPackage ? 'Chỉnh sửa Gói giá' : 'Thêm Gói giá mới'} open={isModalVisible} onCancel={handleCancel} footer={null} destroyOnClose>
                    <Form form={form} layout="vertical" onFinish={handleFinish} className="mt-6">
                        <Form.Item name="name" label="Tên gói" rules={[{ required: true, message: 'Vui lòng nhập tên gói!' }]}><Input /></Form.Item>
                        <Form.Item name="price_monthly" label="Giá (VNĐ/tháng)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
                            <InputNumber className="w-full" formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={(value) => value.replace(/\$\s?|(,*)/g, '')} />
                        </Form.Item>
                        <Form.Item name="description" label="Mô tả ngắn"><Input.TextArea rows={2} /></Form.Item>
                        <Form.Item name="features" label="Danh sách tính năng (mỗi tính năng một dòng)" rules={[{ required: true, message: 'Vui lòng nhập các tính năng!' }]}>
                            <Input.TextArea rows={5} />
                        </Form.Item>
                        <Row justify="space-between">
                            <Form.Item name="is_featured" label="Gói nổi bật?" valuePropName="checked"><Switch /></Form.Item>
                            <Form.Item name="is_active" label="Hiển thị gói này?" valuePropName="checked"><Switch /></Form.Item>
                        </Row>
                        <Form.Item className="text-right mb-0">
                            <Space>
                                <Button onClick={handleCancel}>Hủy</Button>
                                <Button type="primary" htmlType="submit" loading={loading}>Lưu</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Spin>
    );
};

export default PricingListPage;