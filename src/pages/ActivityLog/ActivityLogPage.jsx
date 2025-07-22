import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, message, Space, Table, Tag, Tooltip, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import { getActivityLogs } from '../../services/activityLogService';

const { Title, Text, Paragraph } = Typography;

// Helper để hiển thị chi tiết nhật ký một cách thân thiện
const renderLogDetails = (details) => {
    if (!details || typeof details !== 'object') {
        return null;
    }
    return (
        <Paragraph style={{ margin: 0, maxWidth: 300 }}>
            {Object.entries(details).map(([key, value]) => (
                <span key={key} style={{ marginRight: '8px' }}>
                    <Text strong>{key}:</Text> <Text code>{JSON.stringify(value)}</Text>
                </span>
            ))}
        </Paragraph>
    );
};

const ActivityLogPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

    const fetchLogs = useCallback(async (page, pageSize) => {
        setLoading(true);
        try {
            const response = await getActivityLogs({ page, limit: pageSize });
            const { data: logs, pagination: pagi } = response;
            setData(logs.map(item => ({ ...item, key: item.id })));
            setPagination(prev => ({
                ...prev,
                current: pagi.page,
                pageSize: pagi.limit,
                total: pagi.total_records,
            }));
        } catch (error) {
            message.error(error || 'Lỗi tải nhật ký.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(pagination.current, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchLogs, pagination.current, pagination.pageSize]);

    const handleTableChange = (pagi) => {
        setPagination(pagi);
    };

    const columns = [
        {
            title: 'Người thực hiện',
            dataIndex: 'admin_name',
            key: 'admin',
            render: (name, record) => (
                <Space>
                    <Avatar icon={<UserOutlined />} />
                    <div>
                        <Text strong>{name || 'N/A'}</Text><br />
                        <Text type="secondary">{record.admin_email}</Text>
                    </div>
                </Space>
            )
        },
        {
            title: 'Hành động',
            dataIndex: 'action',
            key: 'action',
            render: (action) => <Tag color="blue">{action}</Tag>
        },
        {
            title: 'Đối tượng',
            key: 'target',
            render: (_, record) => (
                <Text>
                    {record.target_type}
                    {record.target_id && <Text code> (ID: {record.target_id})</Text>}
                </Text>
            )
        },
        {
            title: 'Chi tiết',
            dataIndex: 'details',
            key: 'details',
            render: renderLogDetails
        },
        {
            title: 'Thời gian',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (text) => new Date(text).toLocaleString('vi-VN'),
        },
        {
            title: 'Địa chỉ IP',
            dataIndex: 'ip_address',
            key: 'ip_address',
        },
    ];

    return (
        <div className="space-y-4">
            <Title level={3}>Nhật ký Hoạt động Hệ thống</Title>
            <Table
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

export default ActivityLogPage;