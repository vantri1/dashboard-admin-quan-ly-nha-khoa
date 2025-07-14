// src/pages/Pages/StaticPageListPage.jsx

import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Space, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const initialData = [
    { id: 1, title: 'Chính sách Bảo mật', slug: '/chinh-sach-bao-mat', updatedAt: '2025-07-10' },
    { id: 2, title: 'Điều khoản Sử dụng', slug: '/dieu-khoan-su-dung', updatedAt: '2025-07-11' },
    { id: 3, title: 'Câu hỏi thường gặp (FAQ)', slug: '/hoi-dap', updatedAt: '2025-07-12' },
];

const StaticPageListPage = () => {
    const [pages, setPages] = useState(initialData);

    const columns = [
        { title: 'Tiêu đề Trang', dataIndex: 'title', key: 'title', render: (text) => <Text strong>{text}</Text> },
        { title: 'Đường dẫn (Slug)', dataIndex: 'slug', key: 'slug', render: (slug) => <a href={`https://yourwebsite.com${slug}`} target="_blank" rel="noopener noreferrer">{slug}</a> },
        { title: 'Cập nhật lần cuối', dataIndex: 'updatedAt', key: 'updatedAt', render: (date) => new Date(date).toLocaleDateString('vi-VN') },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Link to={`/pages/edit/${record.id}`}>
                        <Button icon={<EditOutlined />}>Sửa</Button>
                    </Link>
                    {/* NÚT XÓA ĐÃ ĐƯỢC LOẠI BỎ */}
                </Space>
            )
        }
    ];

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
                    bordered
                    scroll={{ x: 1000 }}
                />
            </Card>
        </div>
    );
};

export default StaticPageListPage;