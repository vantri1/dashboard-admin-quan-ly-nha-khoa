import {
    ArrowUpOutlined,
    EyeOutlined,
    GoogleOutlined,
    LineChartOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Card, Col, message, Row, Space, Spin, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getDashboardStats } from '../../services/dashboardService';

const { Title, Text } = Typography;

// --- COMPONENT CON (Giữ nguyên không đổi) ---
const StatisticCard = ({ title, value, icon, color }) => (
    <Card bordered={false} className="shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <Text type="secondary" className="font-medium">{title}</Text>
                <Text className="text-2xl font-semibold my-1">{value}</Text>
                <Tag color="success" icon={<ArrowUpOutlined />}>so với tháng trước</Tag>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        </div>
    </Card>
);

const RegistrationChart = ({ data }) => (
    <Card bordered={false} className="shadow-sm h-full">
        <div className="h-96 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} lượt`, 'Đăng ký']} />
                    <Legend />
                    <Bar dataKey="signups" fill="#1677FF" name="Lượt đăng ký" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
);

const RecentTrials = ({ data }) => {
    const columns = [
        { title: 'Tên Phòng khám', dataIndex: 'clinic_name', key: 'clinicName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Thời gian', dataIndex: 'registered_at', key: 'registeredAt', render: (text) => new Date(text).toLocaleString('vi-VN') },
    ];
    return (
        <Card bordered={false} className="shadow-sm">
            <Title level={5}>Đăng ký dùng thử gần nhất</Title>
            <Table columns={columns} dataSource={data} pagination={false} rowKey="id" className="mt-4" />
        </Card>
    );
};

// --- COMPONENT CHÍNH: DASHBOARD PAGE ---
const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('day'); // 'day', 'month', 'year'

    const fetchDashboardData = useCallback(async (period) => {
        setLoading(true);
        try {
            const data = await getDashboardStats(period);
            setStats(data);
        } catch (error) {
            message.error("Lỗi tải dữ liệu dashboard: " + error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboardData(chartPeriod);
    }, [fetchDashboardData, chartPeriod]);

    if (loading || !stats) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    const summaryData = [
        { title: 'Đăng ký Mới (Tháng này)', value: stats.summaryData.newSignups, icon: <UsergroupAddOutlined className="text-xl text-green-500" />, color: 'bg-green-100' },
        { title: 'Khách Truy cập (Hôm nay) ảo', value: stats.summaryData.visitors.toLocaleString('vi-VN'), icon: <EyeOutlined className="text-xl text-blue-500" />, color: 'bg-blue-100' },
        { title: 'Tỷ lệ Chuyển đổi (ảo)', value: `${stats.summaryData.conversionRate}%`, icon: <LineChartOutlined className="text-xl text-purple-500" />, color: 'bg-purple-100' },
        { title: 'Nguồn truy cập chính (ảo)', value: 'Google', icon: <GoogleOutlined className="text-xl text-orange-500" />, color: 'bg-orange-100' },
    ];

    // Định dạng lại dữ liệu cho biểu đồ
    const formattedChartData = stats.registrationChartData.map(item => ({
        name: item.day || item.month || item.year,
        signups: item.signups,
    }));

    return (
        <div className="space-y-6">
            <Row gutter={[24, 24]}>
                {summaryData.map((item, index) => (
                    <Col key={index} xs={24} sm={12} xl={12}>
                        <StatisticCard {...item} />
                    </Col>
                ))}
            </Row>

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card bordered={false} className="shadow-sm">
                        <Space className="w-full justify-between">
                            <Title level={5}>Thống kê lượt đăng ký</Title>
                            <Button.Group>
                                <Button type={chartPeriod === 'day' ? 'primary' : 'default'} onClick={() => setChartPeriod('day')}>7 ngày</Button>
                                <Button type={chartPeriod === 'month' ? 'primary' : 'default'} onClick={() => setChartPeriod('month')}>Tháng</Button>
                                <Button type={chartPeriod === 'year' ? 'primary' : 'default'} onClick={() => setChartPeriod('year')}>Năm</Button>
                            </Button.Group>
                        </Space>
                        <RegistrationChart data={formattedChartData} />
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card bordered={false} className="shadow-sm h-full">
                        <Title level={5}>Kênh Marketing Hiệu quả</Title>
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                            <Text type="secondary">(Tính năng sắp ra mắt)</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <RecentTrials data={stats.recentTrials} />
        </div>
    );
};

export default DashboardPage;