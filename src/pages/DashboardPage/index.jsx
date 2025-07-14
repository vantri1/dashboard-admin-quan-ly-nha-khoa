// src/pages/DashboardPage/index.jsx

import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    EyeOutlined,
    GoogleOutlined,
    LineChartOutlined,
    UsergroupAddOutlined
} from '@ant-design/icons';
import { Card, Col, Row, Table, Tag, Typography } from 'antd';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const { Title, Text } = Typography;

// --- DỮ LIỆU GIẢ LẬP CHO TRANG MARKETING CRM ---
const summaryData = [
    { title: 'Lượt Đăng ký Mới (Tháng này)', value: '82', percent: 15.2, isGrowth: true, description: 'so với tháng trước', icon: <UsergroupAddOutlined className="text-xl text-green-500" />, color: 'bg-green-100' },
    { title: 'Khách Truy cập (Hôm nay)', value: '1,420', percent: 5.8, isGrowth: true, description: 'so với hôm qua', icon: <EyeOutlined className="text-xl text-blue-500" />, color: 'bg-blue-100' },
    { title: 'Tỷ lệ Chuyển đổi', value: '5.8%', percent: 1.1, isGrowth: true, description: 'so với tháng trước', icon: <LineChartOutlined className="text-xl text-purple-500" />, color: 'bg-purple-100' },
    { title: 'Nguồn truy cập chính', value: 'Google', percent: 70, isGrowth: true, description: 'lượng truy cập tự nhiên', icon: <GoogleOutlined className="text-xl text-orange-500" />, color: 'bg-orange-100' },
];

const registrationData = [
    { day: '08/07', signups: 5 }, { day: '09/07', signups: 8 }, { day: '10/07', signups: 6 },
    { day: '11/07', signups: 12 }, { day: '12/07', signups: 10 }, { day: '13/07', signups: 15 },
    { day: '14/07', signups: 9 },
];

const recentTrialsData = [
    { key: '1', clinicName: 'Nhà thuốc An Khang', email: 'ankhang@email.com', registeredAt: '2025-07-14 10:30' },
    { key: '2', clinicName: 'Pharmacity Chi nhánh Q1', email: 'pharmacity.q1@email.com', registeredAt: '2025-07-14 09:15' },
    { key: '3', clinicName: 'Nhà thuốc Long Châu', email: 'longchau.hcm@email.com', registeredAt: '2025-07-13 16:45' },
];


// --- COMPONENT CON: THẺ THỐNG KÊ ---
const StatisticCard = ({ title, value, percent, isGrowth, description, icon, color }) => (
    <Card variant={false} className="shadow-sm">
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <Text type="secondary" className="font-medium">{title}</Text>
                <Text className="text-2xl font-semibold my-1">{value}</Text>
                <div className="flex items-center space-x-1">
                    <Tag color={isGrowth ? 'success' : 'error'} className="m-0">
                        {isGrowth ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {percent}%
                    </Tag>
                    <Text type="secondary">{description}</Text>
                </div>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        </div>
    </Card>
);

// --- COMPONENT CON: BIỂU ĐỒ LƯỢT ĐĂNG KÝ ---
const RegistrationChart = ({ data }) => (
    <Card variant={false} className="shadow-sm h-full">
        <Title level={5}>Lượt đăng ký dùng thử (7 ngày gần nhất)</Title>
        <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} lượt`, 'Đăng ký']} />
                    <Legend />
                    <Bar dataKey="signups" fill="#1677FF" name="Lượt đăng ký" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </Card>
);

// --- COMPONENT CON: BẢNG ĐĂNG KÝ GẦN NHẤT ---
const RecentTrials = ({ data }) => {
    const columns = [
        { title: 'Tên Phòng khám / Nhà thuốc', dataIndex: 'clinicName', key: 'clinicName' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Thời gian đăng ký', dataIndex: 'registeredAt', key: 'registeredAt' },
    ];
    return (
        <Card variant={false} className="shadow-sm">
            <Title level={5}>Đăng ký dùng thử gần nhất</Title>
            <Table columns={columns} dataSource={data} pagination={false} className="mt-4" />
        </Card>
    );
};

// --- COMPONENT CHÍNH: DASHBOARD PAGE ---
const DashboardPage = () => {
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
                    <RegistrationChart data={registrationData} />
                </Col>
                <Col xs={24} lg={8}>
                    <Card variant={false} className="shadow-sm h-full">
                        <Title level={5}>Kênh Marketing Hiệu quả</Title>
                        <div className="flex items-center justify-center h-80 bg-gray-50 rounded-lg">
                            <Text type="secondary">(Tính năng sắp ra mắt)</Text>
                        </div>
                    </Card>
                </Col>
            </Row>

            <RecentTrials data={recentTrialsData} />
        </div>
    );
};

export default DashboardPage;