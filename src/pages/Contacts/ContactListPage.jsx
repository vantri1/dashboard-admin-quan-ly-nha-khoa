import { DeleteOutlined, EyeOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Descriptions, Form, Input as AntInput, Input, message, Modal, Popconfirm, Select, Space, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { deleteContact, getContacts, updateContact } from '../../services/contactService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = AntInput;

const ContactListPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
    const [filters, setFilters] = useState({ search_term: '', status: null });
    const [sort, setSort] = useState({ field: 'created_at', order: 'desc' });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [form] = Form.useForm();

    const fetchApiData = useCallback(async (params) => {
        setLoading(true);
        try {
            const response = await getContacts(params);
            if (response) {
                const { data: contacts, pagination: pagi } = response;
                setData(contacts.map(item => ({ ...item, key: item.id })));
                setPagination({
                    current: pagi.page,
                    pageSize: pagi.limit,
                    total: pagi.total_records,
                });
            }
        } catch (error) {
            // Xử lý lỗi và hiển thị thông báo ngay tại component
            message.error('Không thể tải danh sách liên hệ. ' + error);
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            ...filters,
            sort_by: sort.field,
            sort_order: sort.order,
        };
        fetchApiData(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchApiData, pagination.current, pagination.pageSize, filters, sort]);

    const handleTableChange = (pagi, tableFilters, sorter) => {
        const newSort = sorter.field ? {
            field: sorter.field,
            order: sorter.order === 'ascend' ? 'asc' : 'desc',
        } : { field: 'created_at', order: 'desc' };
        setSort(newSort);
        setPagination(p => ({ ...p, ...pagi }));
    };

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value || null }));
        setPagination(p => ({ ...p, current: 1 }));
    };

    const handleDelete = async (id) => {
        try {
            const response = await deleteContact(id);
            message.success(response.message || 'Đã xóa liên hệ thành công.');
            fetchApiData({ page: pagination.current, limit: pagination.pageSize, ...filters, sort_by: sort.field, sort_order: sort.order });
        } catch (error) {
            message.error(error || 'Không thể xóa liên hệ.');
            console.error('Failed to delete contact:', error);
        }
    };

    // --- Xử lý Modal ---
    const showModal = (contact) => {
        setSelectedContact(contact);
        form.setFieldsValue({
            status: contact.status,
            notes: contact.notes,
        });
        setIsModalOpen(true);
    };

    const handleModalCancel = () => {
        setIsModalOpen(false);
        setSelectedContact(null);
        form.resetFields();
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const response = await updateContact(selectedContact.id, values);
            handleModalCancel();
            fetchApiData({ page: pagination.current, limit: pagination.pageSize, ...filters, sort_by: sort.field, sort_order: sort.order });
            message.success(response.message || 'Cập nhật thành công!');
        } catch (error) {
            message.error('Cập nhật thất bại: ' + error);
            console.log('Update/Validate Failed:', error);
        }
    };

    const columns = [
        {
            title: 'ID', dataIndex: 'id', key: 'id', width: 80, sorter: true,
            render: (id) => <div>{id}</div>,
        },
        {
            title: 'Người gửi',
            key: 'author',
            render: (_, record) => (
                <div>
                    <Text strong>{record.full_name}</Text><br />
                    <Text type="secondary">{record.email}</Text>
                </div>
            )
        },
        {
            title: 'Số điện thoại', dataIndex: 'phone', key: 'phone',
        },
        { title: 'Chủ đề', dataIndex: 'subject', key: 'subject' },
        {
            title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 150, sorter: true,
            render: (status) => {
                const statusMap = {
                    new: { color: 'blue', text: 'Mới' },
                    read: { color: 'cyan', text: 'Đã đọc' },
                    replied: { color: 'success', text: 'Đã phản hồi' },
                    spam: { color: 'default', text: 'Spam' },
                };
                const current = statusMap[status] || {};
                return <Tag color={current.color}>{current.text}</Tag>;
            }
        },
        {
            title: 'Ngày gửi', dataIndex: 'created_at', key: 'created_at', sorter: true,
            render: (text) => new Date(text).toLocaleString('vi-VN')
        },
        {
            title: 'Lần phản hồi gần nhất', dataIndex: 'replied_at', key: 'replied_at', sorter: true,
            render: (text) => new Date(text).toLocaleString('vi-VN')
        },
        {
            title: 'Phản hồi bởi', dataIndex: 'replied_by_admin_name', key: 'replied_by_admin_name',
            render: (name) => name || <Text type="secondary">N/A</Text>
        },
        {
            title: 'Hành Động', key: 'action', fixed: 'right', width: 220,
            render: (_, record) => (
                <Space>
                    <Button icon={<EyeOutlined />} onClick={() => showModal(record)}>Xem & Phản hồi</Button>
                    <Popconfirm
                        title="Bạn chắc chắn muốn xóa?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <Title level={3}>Hộp thư Liên hệ</Title>
            <Space className="w-full justify-between">
                <Input.Search
                    placeholder="Tìm theo tên, email, chủ đề..."
                    onSearch={(value) => handleFilterChange('search_term', value)}
                    enterButton
                    className="w-full max-w-md"
                    allowClear
                />
                <Select
                    placeholder="Lọc theo trạng thái"
                    style={{ width: 200 }}
                    onChange={(value) => handleFilterChange('status', value)}
                    allowClear
                >
                    <Select.Option value="new">Mới</Select.Option>
                    <Select.Option value="read">Đã đọc</Select.Option>
                    <Select.Option value="replied">Đã phản hồi</Select.Option>
                    <Select.Option value="spam">Spam</Select.Option>
                </Select>
            </Space>

            <Table
                columns={columns}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 1600 }}
                rowKey="id"
            />

            {selectedContact && (
                <Modal
                    title={`Chi tiết liên hệ từ: ${selectedContact.full_name}`}
                    open={isModalOpen} // <-- Sửa 'visible' thành 'open'
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    width={720}
                    okText="Lưu thay đổi"
                    cancelText="Hủy"
                >
                    <Space direction="vertical">
                        <Card>
                            <Title level={5} style={{ marginBottom: '0.5em' }}>
                                Chủ đề: {selectedContact.subject || '(Không có chủ đề)'}
                            </Title>
                            <Paragraph
                                blockquote="true" // Đúng chuẩn HTML, không gây warning
                                style={{
                                    whiteSpace: 'pre-wrap',   // Giữ nguyên các định dạng xuống dòng
                                    maxHeight: '200px',       // Giới hạn chiều cao
                                    overflowY: 'auto',        // Thêm thanh cuộn nếu nội dung dài
                                    margin: 0,                // Bỏ margin mặc định của paragraph
                                    padding: '12px',          // Thêm padding cho dễ đọc
                                    background: '#f9f9f9',    // Thêm màu nền nhẹ để phân biệt
                                    borderLeft: '4px solid #d9d9d9' // Làm đậm đường viền trích dẫn
                                }}
                            >
                                {selectedContact.message}
                            </Paragraph>
                        </Card>
                        <Descriptions bordered size="small" column={1}>
                            <Descriptions.Item label="Email">{selectedContact.email}</Descriptions.Item>
                            <Descriptions.Item label="SĐT">{selectedContact.phone || 'Không cung cấp'}</Descriptions.Item>
                            <Descriptions.Item label="Ngày gửi">{new Date(selectedContact.created_at).toLocaleString('vi-VN')}</Descriptions.Item>
                        </Descriptions>

                        <Title level={5} style={{ marginTop: 24 }}>Phản hồi & Ghi chú</Title>
                        <Form form={form} layout="vertical">
                            <Form.Item name="status" label="Cập nhật trạng thái" rules={[{ required: true }]}>
                                <Select>
                                    <Select.Option value="new">Mới</Select.Option>
                                    <Select.Option value="read">Đã đọc</Select.Option>
                                    <Select.Option value="replied">Đã phản hồi</Select.Option>
                                    <Select.Option value="spam">Spam</Select.Option>
                                </Select>
                            </Form.Item>
                            <Form.Item name="notes" label="Ghi chú nội bộ (Khách hàng không thấy)">
                                <TextArea rows={4} placeholder="Ví dụ: Đã gọi điện tư vấn cho khách hàng lúc 15:30..." />
                            </Form.Item>
                        </Form>
                    </Space>
                </Modal>
            )}
        </div>
    );
};

export default ContactListPage;