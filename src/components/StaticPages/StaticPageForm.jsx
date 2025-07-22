// src/components/pages/StaticPageForm.jsx

import 'react-quill/dist/quill.snow.css';

import { Button, Card, Col, Form, Input, Row, Typography } from 'antd';
import ReactQuill from 'react-quill';

const { Paragraph, Text } = Typography;

// --- COMPONENT XEM TRƯỚC TRÊN GOOGLE ---
const GooglePreview = ({ title, slug, description }) => (
    <div style={{ fontFamily: 'arial, sans-serif' }}>
        <Text style={{ color: '#1a0dab', fontSize: '18px', display: 'block' }} ellipsis>
            {title || 'Tiêu đề SEO sẽ hiển thị ở đây'}
        </Text>
        <Paragraph style={{ color: '#006621', fontSize: '14px', margin: 0 }}>
            https://yourwebsite.com{slug || '/duong-dan-trang'}
        </Paragraph>
        <Paragraph style={{ color: '#545454', fontSize: '14px' }} ellipsis={{ rows: 2 }}>
            {description || 'Mô tả meta sẽ hiển thị ở đây để thu hút người dùng nhấp vào.'}
        </Paragraph>
    </div>
);


const StaticPageForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);

    const quillModules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
            <Row gutter={24}>
                {/* --- CỘT TRÁI: NỘI DUNG CHÍNH --- */}
                <Col span={24} lg={16}>
                    <Card title="Nội dung trang" className="shadow-sm">
                        <Form.Item name="title" label="Tiêu đề trang" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Ví dụ: Chính sách Bảo mật" />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                            <ReactQuill theme="snow" modules={quillModules} style={{ backgroundColor: 'white' }} />
                        </Form.Item>
                    </Card>
                </Col>

                {/* --- CỘT PHẢI: CÀI ĐẶT & SEO --- */}
                <Col span={24} lg={8}>
                    <Card title="Cài đặt & SEO" className="shadow-sm">
                        <Form.Item
                            name="slug"
                            label="Đường dẫn (Slug)"
                            // rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]}
                            help="Ví dụ: /chinh-sach-bao-mat"
                        >
                            <Input addonBefore="https://yourwebsite.com" placeholder="/dieu-khoan" />
                        </Form.Item>
                        <Paragraph type="secondary" className="mt-6">Xem trước trên Google</Paragraph>
                        <Card type="inner" className="mb-6">
                            <GooglePreview
                                title={formValues?.seo_title || formValues?.title}
                                slug={formValues?.slug}
                                description={formValues?.meta_description}
                            />
                        </Card>
                        <Form.Item name="seo_title" label="Tiêu đề SEO">
                            <Input placeholder="Để trống để dùng tiêu đề chính" />
                        </Form.Item>
                        <Form.Item name="meta_description" label="Mô tả Meta">
                            <Input.TextArea rows={4} placeholder="Viết mô tả ngắn gọn, hấp dẫn cho công cụ tìm kiếm." />
                        </Form.Item>
                    </Card>
                </Col>
            </Row>
            <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" size="large">
                    {initialValues ? 'Cập nhật Trang' : 'Lưu và Xuất bản'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default StaticPageForm;