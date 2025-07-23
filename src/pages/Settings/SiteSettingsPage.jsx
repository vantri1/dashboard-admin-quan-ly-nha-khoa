import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Card, Col, ColorPicker, Form, Input, message, Row, Spin, Tabs, Typography, Upload } from 'antd';
import React, { useEffect, useState } from 'react';

import { IMAGE_URL } from '../../constants/imageUrl';
import { getSettings, updateSettings } from '../../services/settingService';
import { uploadFileService } from '../../services/uploadFileService';

const { Title } = Typography;

const SiteSettingsPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // SỬA 1: Dùng fileList để quản lý ảnh, giống hệt PostForm.jsx
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            try {
                const response = await getSettings();
                const settingsObject = response.data.reduce((acc, setting) => {
                    acc[setting.key] = setting.value;
                    return acc;
                }, {});

                form.setFieldsValue(settingsObject);

                // SỬA 2: Khởi tạo fileList từ initialValues, giống PostForm.jsx
                if (settingsObject.logo) {
                    setFileList([
                        {
                            uid: '-1',
                            name: 'logo.png',
                            status: 'done',
                            url: `${IMAGE_URL}${settingsObject.logo}`, // Tạo URL đầy đủ để hiển thị
                        },
                    ]);
                } else {
                    setFileList([]);
                }

            } catch (error) {
                message.error(error || 'Không thể tải dữ liệu cài đặt.');
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, [form]);

    const onFinish = async (values) => {
        setIsSaving(true);
        try {
            let finalLogoUrl = null;
            const currentFile = fileList.length > 0 ? fileList[0] : null;

            // SỬA 3: Áp dụng logic xử lý upload từ PostForm.jsx
            if (currentFile) {
                // Trường hợp 1: Người dùng upload file mới
                if (currentFile.originFileObj) {
                    const response = await uploadFileService(currentFile.originFileObj, 'logo');
                    if (response && response.url) {
                        finalLogoUrl = response.url; // Lấy URL tương đối từ API
                    } else {
                        throw new Error('Tải logo lên thất bại.');
                    }
                }
                // Trường hợp 2: Người dùng giữ lại file cũ
                else if (currentFile.url) {
                    // Tách URL tương đối từ URL đầy đủ
                    finalLogoUrl = currentFile.url.replace(IMAGE_URL, '');
                }
            }
            // Trường hợp 3: Người dùng đã xóa file, finalLogoUrl sẽ là null

            const formattedValues = {
                ...values,
                primary_color: typeof values.primary_color === 'object' ? values.primary_color.toHexString() : values.primary_color,
                logo: finalLogoUrl, // Gán URL cuối cùng vào payload
            };

            const updateResponse = await updateSettings(formattedValues);
            message.success(updateResponse.message || 'Cập nhật cài đặt thành công!');

        } catch (error) {
            const errorMessage = error || error || 'Lưu cài đặt thất bại.';
            message.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return <Spin size="large" className="flex justify-center items-center h-screen" />;
    }

    return (
        <div className="space-y-4">
            <Title level={3}>Cài đặt Website</Title>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Tabs defaultActiveKey="2" type="card">
                    {/* Tab Cài đặt chung */}
                    <Tabs.TabPane tab="Cài đặt chung" key="1">
                        <Card>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item name="site_title" label="Tiêu đề Website" rules={[{ required: true }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="hotline" label="Hotline hỗ trợ">
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="email" label="Email liên hệ">
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                    <Tabs.TabPane tab="Giao diện & Thương hiệu" key="2">
                        <Card>
                            <Row gutter={24}>
                                <Col span={12}>
                                    <Form.Item label="Màu chủ đạo" name="primary_color">
                                        <ColorPicker showText />
                                    </Form.Item>
                                </Col>
                                <Col span={24} md={12}>
                                    <Form.Item label="Logo chính">
                                        {/* SỬA 4: Sử dụng Upload component với logic của PostForm */}
                                        <Upload
                                            listType="picture-card"
                                            fileList={fileList}
                                            maxCount={1}
                                            beforeUpload={() => false} // Ngăn upload tự động
                                            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                            onPreview={(file) => window.open(file.url, '_blank')}
                                        >
                                            {fileList.length >= 1 ? null : (
                                                <div>
                                                    <PlusOutlined />
                                                    <div className="mt-2">Tải lên</div>
                                                </div>
                                            )}
                                        </Upload>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Card>
                    </Tabs.TabPane>
                </Tabs>
                <Form.Item className="mt-6">
                    <Button type="primary" htmlType="submit" icon={<SaveOutlined />} size="large" loading={isSaving}>
                        Lưu thay đổi
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default SiteSettingsPage;