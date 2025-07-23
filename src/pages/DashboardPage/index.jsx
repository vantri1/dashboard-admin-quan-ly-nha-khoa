import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    EyeOutlined,
    GoogleOutlined,
    LineChartOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { Button, Card, Col, message, Row, Select, Space, Spin, Table, Tag, Typography } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { getDashboardStats } from '../../services/dashboardService';

const { Title, Text } = Typography;

// --- COMPONENT CON (Giữ nguyên không đổi) ---
const StatisticCard = ({ title, value, percent, isGrowth, description, icon, color }) => (
    <Card variant={false} className="shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <Text type="secondary" className="font-medium">{title}</Text>
                <Text className="text-2xl font-semibold my-1">{value}</Text>
                <div className="flex items-center space-x-1">
                    <Tag color={isGrowth ? 'success' : 'error'} className="m-0" icon={isGrowth ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
                        {percent}%
                    </Tag>
                    <Text type="secondary">{description}</Text>
                </div>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        </div>
    </Card>
);


const RegistrationChart = ({ data }) => (
    <div className="h-96 mt-4">
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip formatter={(value) => [`${value} lượt`, 'Đăng ký']} />
                <Legend />
                <Bar dataKey="signups" fill="#1677FF" name="Lượt đăng ký" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    </div>
);

const RecentTrials = ({ data }) => {
    const columns = [
        { title: 'Tên Phòng khám', dataIndex: 'clinic_name', key: 'clinicName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Thời gian', dataIndex: 'registered_at', key: 'registeredAt', render: (text) => new Date(text).toLocaleString('vi-VN') },
    ];
    return (
        <Card variant={false} className="shadow-sm">
            <Title level={5}>Đăng ký dùng thử gần nhất</Title>
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                rowKey="id"
                scroll={{ x: 600 }}
                className="mt-4" />
        </Card>
    );
};


const DashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [chartPeriod, setChartPeriod] = useState('day');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const fetchDashboardData = useCallback(async (period, year) => {
        setLoading(true);
        try {
            // SỬA LỖI: Truyền `year` vào service
            const data = await getDashboardStats(period, year);
            setStats(data);
        } catch (error) {
            message.error('Không thể tải danh sách trang: ' + error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        // Chỉ truyền tham số year khi period là 'year'
        const yearParam = chartPeriod === 'year' ? selectedYear : null;
        fetchDashboardData(chartPeriod, yearParam);
    }, [fetchDashboardData, chartPeriod, selectedYear]);

    if (loading || !stats) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    // SỬA LẠI PHẦN NÀY
    const summaryData = [
        {
            title: 'Đăng ký Mới (Tháng này)',
            value: stats.summaryData.newSignups,
            percent: Math.abs(stats.summaryData.signupGrowth),
            isGrowth: stats.summaryData.isSignupGrowth,
            description: 'so với tháng trước',
            icon: <UsergroupAddOutlined className="text-xl text-green-500" />,
            color: 'bg-green-100'
        },
        { title: 'Khách Truy cập (Hôm nay) ảo', value: stats.summaryData.visitors.toLocaleString('vi-VN'), percent: 12.5, isGrowth: true, description: 'so với hôm qua', icon: <EyeOutlined className="text-xl text-blue-500" />, color: 'bg-blue-100' },
        { title: 'Tỷ lệ Chuyển đổi (ảo)', value: `${stats.summaryData.conversionRate}%`, percent: 1.2, isGrowth: true, description: 'so với tuần trước', icon: <LineChartOutlined className="text-xl text-purple-500" />, color: 'bg-purple-100' },
        { title: 'Nguồn truy cập chính (ảo)', value: 'Google', percent: 70, isGrowth: true, description: 'lượng organic', icon: <GoogleOutlined className="text-xl text-orange-500" />, color: 'bg-orange-100' },
    ];

    const formattedChartData = stats.registrationChartData.map(item => {
        let name = '';
        if (item.day) {
            name = new Date(item.day).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
        } else if (item.month) {
            // Sửa lại định dạng cho tháng để chỉ hiển thị tháng
            const [year, month] = item.month.split('-');
            name = `${month}-${year}`; // Ví dụ: '07-2025'
        } else {
            name = item.year;
        }
        return { name, signups: item.signups };
    });

    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        const years = [];
        for (let i = 0; i < 5; i++) {
            years.push(currentYear - i);
        }
        return years.map(year => ({ label: `Năm ${year}`, value: year }));
    };

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
                <Col xs={24} lg={24}>
                    <Card variant={false} className="shadow-sm">
                        <Space className="w-full justify-between">
                            <Title level={5}>Thống kê lượt đăng ký</Title>
                            <Space>
                                <Space.Compact>
                                    <Button type={chartPeriod === 'day' ? 'primary' : 'default'} onClick={() => setChartPeriod('day')}>7 ngày</Button>
                                    <Button type={chartPeriod === 'month' ? 'primary' : 'default'} onClick={() => setChartPeriod('month')}>12 tháng</Button>
                                    <Button type={chartPeriod === 'year' ? 'primary' : 'default'} onClick={() => setChartPeriod('year')}>Theo Năm</Button>
                                </Space.Compact>
                                {chartPeriod === 'year' && (
                                    <Select
                                        value={selectedYear}
                                        onChange={setSelectedYear}
                                        options={generateYearOptions()}
                                        style={{ width: 120 }}
                                    />
                                )}
                            </Space>
                        </Space>
                        <RegistrationChart data={formattedChartData} />
                    </Card>
                </Col>
                {/* <Col xs={24} lg={8}>
                    <Card variant={false} className="shadow-sm h-full">
                        <Title level={5}>Kênh Marketing Hiệu quả</Title>
                        <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                            <Text type="secondary">(Tính năng sắp ra mắt)</Text>
                        </div>
                    </Card>
                </Col> */}
            </Row>

            <RecentTrials data={stats.recentTrials} />
        </div>
    );
};

export default DashboardPage;