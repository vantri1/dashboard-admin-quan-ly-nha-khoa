import { DeleteOutlined, EditOutlined, ExclamationCircleFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Alert, Avatar, Button, Input, message, Modal, Popconfirm, Space, Table, Tag, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;
const { confirm } = Modal;

// --- DỮ LIỆU GIẢ LẬP ---
const initialData = [
    { key: '1', title: 'Hướng dẫn sử dụng React Hook', author: 'Admin', category: 'Hướng dẫn Lập trình', tags: ['react', 'hook'], status: 'Published', imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png', seo_title: 'Hướng dẫn sử dụng React Hook || Title', slug: 'huong-dan-su-dung-react-hook', meta_description: 'Mô tả: Hướng dẫn sử dụng React Hook' },
    { key: '2', title: 'Tin tức về phiên bản Vue 3.5', author: 'Editor', category: 'Tin tức Công nghệ', tags: ['vue', 'news'], status: 'Published', imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg', seo_title: '', slug: '', meta_description: '' },
    { key: '3', title: 'Top 5 mẹo tối ưu code CSS', author: 'Admin', category: 'Thủ thuật & Mẹo', tags: ['css', 'tips'], status: 'Draft', imageUrl: 'https://gw.alipayobjects.com/zos/rmsportal/NKBELAOuuKbpiHnsYiOF.png', seo_title: '', slug: '', meta_description: '' },
];

const PostListPage = () => {
    const [data, setData] = useState(initialData);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);

    const handleSearch = (value) => {
        const filteredData = initialData.filter(item =>
            item.title.toLowerCase().includes(value.toLowerCase())
        );
        setData(filteredData);
    };

    const handleDelete = (key) => {
        setData(data.filter(item => item.key !== key));
        message.success(`Đã xóa bài viết #${key}`);
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
        { title: 'Bài viết', dataIndex: 'title', key: 'title', render: (text, record) => <Space><Avatar shape="square" size={48} src={record.imageUrl} /><Text>{text}</Text></Space> },
        { title: 'Tác giả', dataIndex: 'author', key: 'author' },
        { title: 'Danh mục', dataIndex: 'category', key: 'category', render: (cat) => <Tag color="cyan">{cat}</Tag> },
        { title: 'Thẻ', dataIndex: 'tags', key: 'tags', render: (tags) => <>{tags.map(tag => <Tag color="blue" key={tag}>{tag}</Tag>)}</> },
        { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status) => <Tag color={status === 'Published' ? 'success' : 'default'}>{status === 'Published' ? 'Đã xuất bản' : 'Bản nháp'}</Tag> },
        {
            title: 'Hành Động', key: 'action', render: (_, record) => (
                <Space size="middle">
                    <Link to={`/blog/posts/edit/${record.key}`}>
                        <Button type="text" icon={<EditOutlined />} />
                    </Link>
                    <Popconfirm title="Bạn có chắc muốn xóa bài viết này?" onConfirm={() => handleDelete(record.key)} okText="Xóa" cancelText="Hủy">
                        <Button type="text" danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        },
    ];

    return (
        <div className="space-y-4">
            <Title level={3}>Danh sách Bài viết</Title>
            <div className="flex justify-between items-center">
                <Input
                    prefix={<SearchOutlined />}
                    placeholder="Tìm theo tiêu đề bài viết..."
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full max-w-xs"
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
                scroll={{ x: 1400 }}
                rowKey="key"
            />
        </div>
    );
};

export default PostListPage;