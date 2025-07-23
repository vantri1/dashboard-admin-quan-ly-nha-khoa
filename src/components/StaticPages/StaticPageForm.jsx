// src/components/pages/StaticPageForm.jsx

import 'react-quill/dist/quill.snow.css';

import { Button, Card, Col, Form, Input, message, Row, Typography } from 'antd';
// MỚI: Import các hook cần thiết và các thành phần từ thư viện
import { useMemo, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';

// MỚI: Giả sử bạn có các service và constant này giống như PostForm
import { IMAGE_URL } from '../../constants/imageUrl';
import { uploadFileService } from '../../services/uploadFileService';

// MỚI: Đăng ký module resize ảnh với Quill

const { Paragraph, Text } = Typography;

// --- COMPONENT XEM TRƯỚC TRÊN GOOGLE ---
// CẢI TIẾN: Sử dụng className của Tailwind (nếu có) hoặc class CSS thay cho inline style
const GooglePreview = ({ title, slug, description }) => (
    <div className="font-sans">
        <Text className="text-blue-700 text-lg block" ellipsis>
            {title || 'Tiêu đề SEO sẽ hiển thị ở đây'}
        </Text>
        <Paragraph className="text-green-700 text-sm m-0">
            https://yourwebsite.com{slug || '/duong-dan-trang'}
        </Paragraph>
        <Paragraph className="text-gray-700 text-sm" ellipsis={{ rows: 2 }}>
            {description || 'Mô tả meta sẽ hiển thị ở đây để thu hút người dùng nhấp vào.'}
        </Paragraph>
    </div>
);

// MỚI: Tách helper function ra để dễ quản lý, hoặc import từ file utils chung
const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
}


const StaticPageForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const formValues = Form.useWatch([], form);
    // MỚI: State loading cho button submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    // CẢI TIẾN: Bọc modules trong useMemo để tối ưu hiệu suất
    const quillModules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            [{ 'align': [] }], // Thêm tùy chọn căn lề
            ['clean']
        ],
        // MỚI: Kích hoạt module resize ảnh
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }
    }), []);

    // MỚI: Hàm xử lý logic submit form, bao gồm cả upload ảnh
    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            let finalContent = values.content;

            // Tìm tất cả ảnh base64 trong nội dung
            const doc = new DOMParser().parseFromString(finalContent, 'text/html');
            const imagesToUpload = Array.from(doc.querySelectorAll('img[src^="data:"]'));

            if (imagesToUpload.length > 0) {
                message.loading({ content: `Đang xử lý và tải lên ${imagesToUpload.length} ảnh...`, key: 'content-images' });

                const uploadPromises = imagesToUpload.map(img => {
                    const file = dataURLtoFile(img.src, `page_content_image_${Date.now()}.png`);
                    // Giả sử service upload trả về { url: 'path/to/image.png' }
                    return uploadFileService(file, 'pages');
                });

                const uploadResults = await Promise.all(uploadPromises);

                // Thay thế các ảnh base64 bằng URL từ server
                // Cách này an toàn hơn so với việc dùng string.replace() nhiều lần
                const urlMap = new Map();
                imagesToUpload.forEach((img, index) => {
                    if (uploadResults[index] && uploadResults[index].url) {
                        // Đảm bảo URL đầy đủ để hiển thị lại ngay sau khi sửa
                        urlMap.set(img.src, `${IMAGE_URL}${uploadResults[index].url}`);
                    }
                });

                doc.querySelectorAll('img[src^="data:"]').forEach(img => {
                    if (urlMap.has(img.src)) {
                        img.src = urlMap.get(img.src);
                    }
                });

                finalContent = doc.body.innerHTML;
                message.success({ content: `Tải lên ${imagesToUpload.length} ảnh thành công!`, key: 'content-images' });
            }

            const finalValues = {
                ...values,
                content: finalContent,
            };

            // Gọi hàm onFinish gốc từ props
            await onFinish(finalValues);

        } catch (error) {
            console.error('Form submission failed:', error);
            message.error(error || "Đã có lỗi xảy ra khi lưu trang.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // CẢI TIẾN: Sử dụng handler mới
        <Form form={form} layout="vertical" onFinish={handleFormSubmit} initialValues={initialValues}>
            <Row gutter={24}>
                {/* --- CỘT TRÁI: NỘI DUNG CHÍNH --- */}
                <Col span={24} lg={16}>
                    <Card title="Nội dung trang" className="shadow-sm">
                        <Form.Item name="title" label="Tiêu đề trang" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
                            <Input placeholder="Ví dụ: Chính sách Bảo mật" />
                        </Form.Item>
                        <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                            {/* CẢI TIẾN: Thêm style để có chiều cao cố định, cải thiện UX */}
                            <ReactQuill
                                theme="snow"
                                modules={quillModules}
                                style={{ height: '450px', marginBottom: '4rem', backgroundColor: 'white' }}
                                placeholder="Soạn thảo nội dung chi tiết của trang tại đây..."
                            />
                        </Form.Item>
                    </Card>
                </Col>

                {/* --- CỘT PHẢI: CÀI ĐẶT & SEO --- */}
                <Col span={24} lg={8}>
                    <Card title="Cài đặt & SEO" className="shadow-sm">
                        <Form.Item
                            name="slug"
                            label="Đường dẫn (Slug)"
                            rules={[{ required: true, message: 'Vui lòng nhập đường dẫn!' }]} // Bật lại rule này vì slug rất quan trọng
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
                {/* CẢI TIẾN: Thêm trạng thái loading cho button */}
                <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
                    {initialValues ? 'Cập nhật Trang' : 'Lưu và Xuất bản'}
                </Button>
            </Form.Item>
        </Form>
    );
};

export default StaticPageForm;