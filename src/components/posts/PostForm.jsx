// src/components/posts/PostForm.jsx

import 'react-quill/dist/quill.snow.css';

import { PlusOutlined } from '@ant-design/icons';
import { Button, Card, Col, DatePicker, Divider, Form, Input, message, Row, Select, Space, Typography, Upload } from 'antd';
import dayjs from 'dayjs'; // Cần import dayjs
import { useEffect, useMemo, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill'; // 1. Import Quill

import { IMAGE_URL } from '../../constants/imageUrl'; // Đảm bảo import này đúng
import { addCategory, getCategories } from '../../services/categoryService';
import { uploadFileService } from '../../services/uploadFileService';
import CategoryForm from '../categories/CategoryForm';

// 3. Đăng ký module resize với Quill

const { TextArea } = Input;
const { Option } = Select;
const { Text, Paragraph } = Typography;


const GooglePreview = ({ title, slug, description }) => (
    <div className="font-sans">
        <Text className="text-blue-700 text-lg">{title || 'Tiêu đề SEO sẽ hiển thị ở đây'}</Text>
        <Paragraph className="text-green-700 text-sm m-0">
            https://yourwebsite.com/blog/{slug || 'duong-dan-bai-viet'}
        </Paragraph>
        <Paragraph className="text-gray-700 text-sm" ellipsis={{ rows: 2 }}>
            {description || 'Mô tả meta sẽ hiển thị ở đây. Hãy viết một đoạn mô tả hấp dẫn để thu hút người dùng nhấp vào.'}
        </Paragraph>
    </div>
);


const PostForm = ({ onFinish, initialValues }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [fileList, setFileList] = useState([]);

    // [TỐI ƯU] Thêm state loading cho button submit
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            try {
                const apiParams = {
                    limit: 100000000000,
                    sort_by: 'id',
                    sort_order: 'desc',
                    type: 'post',
                };
                const response = await getCategories(apiParams);
                const activeCategories = response.data.filter(cat => !cat.deleted_at);
                setCategories(activeCategories);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
                message.error('Không thể tải danh mục: ' + error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (initialValues?.data) {
            form.setFieldsValue(initialValues.data);

            if (initialValues.data.featured_image_url) {
                // Đảm bảo không ghép chuỗi nếu URL đã là URL đầy đủ
                const imageUrl = initialValues.data.featured_image_url.startsWith('http')
                    ? initialValues.data.featured_image_url
                    : `${IMAGE_URL}/${initialValues.data.featured_image_url}`;

                setFileList([
                    {
                        uid: '-1',
                        name: 'featured_image.png',
                        status: 'done',
                        url: imageUrl,
                    },
                ]);
            } else {
                setFileList([]);
            }
        } else {
            form.resetFields();
            form.setFieldsValue({
                status: 'draft',
                is_featured: 0,
            });
            setFileList([]);
        }
    }, [initialValues, form]);

    // 4. Cấu hình modules cho Quill, thêm imageResize
    const modules = useMemo(() => ({
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image', 'video'],
            // Thêm các tùy chọn căn lề
            [{ 'align': [] }],
            ['clean']
        ],
        // Kích hoạt module resize ảnh
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize']
        }
    }), []);

    /**
     * Helper function: Chuyển đổi chuỗi base64 thành đối tượng File.
     */
    const dataURLtoFile = (dataurl, filename) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    const handleAddCategory = async (values) => {
        try {
            const dataToSend = {
                ...values,
                category_type: 'post'
            };
            const response = await addCategory(dataToSend);
            const newCategory = response;
            setCategories(prev => [...prev, { id: newCategory.id, name: values.name }]);

            message.success(`Đã thêm danh mục "${values.name} ${newCategory.message}"`);
            form.setFieldsValue({ category_id: newCategory.id });
            setIsCategoryModalVisible(false);
        } catch (error) {
            message.error(`Thêm danh mục thất bại: ${error.message}`);
        }
    };

    // 5. Cập nhật logic onFormFinish
    const onFormFinish = async (values) => {
        setIsSubmitting(true);
        try {
            // --- XỬ LÝ ẢNH ĐẠI DIỆN ---
            let featuredImageUrl = initialValues?.data?.featured_image_url || null;
            const currentFile = fileList.length > 0 ? fileList[0] : null;
            if (currentFile && currentFile.originFileObj) {
                const response = await uploadFileService(currentFile.originFileObj, 'posts');
                featuredImageUrl = response.url;
            }

            // --- XỬ LÝ ẢNH TRONG NỘI DUNG ---
            let finalContent = values.content;
            const imagesToUpload = Array.from(
                new DOMParser().parseFromString(finalContent, 'text/html')
                    .querySelectorAll('img[src^="data:"]')
            );

            if (imagesToUpload.length > 0) {
                message.loading({ content: `Đang tải lên ${imagesToUpload.length} ảnh...`, key: 'content-images' });

                // Tải lên tất cả các ảnh base64 song song
                const uploadPromises = imagesToUpload.map(img => {
                    const file = dataURLtoFile(img.src, `content_image_${Date.now()}.png`);
                    return uploadFileService(file, 'posts');
                });

                const uploadResults = await Promise.all(uploadPromises);

                // Thay thế các ảnh base64 bằng URL từ server
                imagesToUpload.forEach((img, index) => {
                    const result = uploadResults[index];
                    if (result && result.url) {
                        finalContent = finalContent.replace(img.src, `${IMAGE_URL}${result.url}`);
                    }
                });
                message.success({ content: `Đã tải lên ${imagesToUpload.length} ảnh thành công!`, key: 'content-images' });
            }

            const finalValues = {
                ...values,
                featured_image_url: featuredImageUrl,
                content: finalContent, // Gán nội dung HTML đã được cập nhật
                post_type: 'post',
            };

            await onFinish(finalValues);

        } catch (error) {
            console.error('Form submission failed:', error);
            message.error(error || "Đã có lỗi xảy ra khi lưu bài viết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formValues = Form.useWatch([], form);

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFormFinish}
        >
            <Row gutter={24}>
                {/* --- Cột trái: Nội dung chính --- */}
                <Col span={24} lg={16}>
                    <Space direction="vertical" size="middle" className="w-full">
                        <Card title="Nội dung bài viết" variant={false} className="shadow-sm">
                            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề bài viết!' }]}>
                                <Input placeholder="Ví dụ: Hướng dẫn sử dụng React Hook chi tiết" />
                            </Form.Item>
                            <Form.Item name="excerpt" label="Mô tả ngắn (Excerpt)">
                                <TextArea rows={3} placeholder="Mô tả ngắn gọn nội dung bài viết..." />
                            </Form.Item>
                            <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
                                {/* 6. Sử dụng ReactQuill với modules đã cấu hình */}
                                <ReactQuill
                                    theme="snow"
                                    modules={modules}
                                    placeholder="Soạn thảo nội dung bài viết tại đây..."
                                    style={{ height: '400px', marginBottom: '4rem' }}
                                />
                            </Form.Item>
                        </Card>
                        <Card title="Tối ưu hóa SEO (Tùy chọn)" variant={false} className="shadow-sm">
                            <Paragraph type="secondary">Xem trước cách bài viết của bạn sẽ hiển thị trên Google.</Paragraph>
                            <Card type="inner" className="mb-6">
                                <GooglePreview
                                    title={formValues?.seo_title || formValues?.title}
                                    slug={formValues?.slug}
                                    description={formValues?.meta_description}
                                />
                            </Card>
                            <Form.Item name="seo_title" label="Tiêu đề SEO" help="Ngắn gọn (dưới 60 ký tự), chứa từ khóa chính.">
                                <Input placeholder="Để trống để dùng tiêu đề bài viết" />
                            </Form.Item>
                            <Form.Item name="slug" label="Đường dẫn (Slug)">
                                <Input addonBefore="https://yourwebsite.com/blog/" placeholder="vi-du-duong-dan-than-thien" />
                            </Form.Item>
                            <Form.Item name="meta_description" label="Mô tả Meta" help="Mô tả ngắn gọn (dưới 160 ký tự), hấp dẫn cho công cụ tìm kiếm.">
                                <TextArea rows={3} />
                            </Form.Item>
                        </Card>
                    </Space>
                </Col>

                {/* --- Cột phải: Các tùy chọn --- */}
                <Col span={24} lg={8}>
                    <Space direction="vertical" size="middle" className="w-full">
                        <Card title="Tùy chọn đăng" variant={false} className="shadow-sm">
                            <Form.Item name="status" label="Trạng thái">
                                <Select>
                                    <Option value="published">Xuất bản</Option>
                                    <Option value="draft">Bản nháp</Option>
                                    <Option value="pending_review">Chờ duyệt</Option>
                                </Select>
                            </Form.Item>
                            {/* <Form.Item name="post_type" label="Loại bài viết">
                                <Select>
                                    <Option value="post">Bài viết thường</Option>
                                    <Option value="guide">Bài viết hướng dẫn</Option>
                                </Select>
                            </Form.Item> */}
                            <Form.Item name="is_featured" label="Nổi bật?">
                                <Select>
                                    <Option value={1}>Có</Option>
                                    <Option value={0}>Không</Option>
                                </Select>
                            </Form.Item>
                            {initialValues?.data && (
                                <>
                                    <Form.Item label="Tác giả">
                                        <Input value={initialValues?.data?.creator_name || '...'} disabled />
                                    </Form.Item>
                                    <Form.Item label="Ngày tạo">
                                        <DatePicker
                                            // Chuyển đổi chuỗi ngày tháng sang đối tượng dayjs
                                            value={initialValues?.data?.created_at ? dayjs(initialValues.data.created_at) : null}
                                            format="DD/MM/YYYY HH:mm:ss"
                                            style={{ width: '100%' }}
                                            disabled
                                        />
                                    </Form.Item>
                                </>
                            )}
                        </Card>
                        <Card title="Danh mục" variant={false} className="shadow-sm">
                            <Form.Item name="category_id" label="Danh mục" rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}>
                                <Select
                                    placeholder="Chọn một danh mục"
                                    loading={loadingCategories}
                                    popupRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider className="my-2" />
                                            <Space className="p-2">
                                                <Button type="text" icon={<PlusOutlined />} onClick={() => setIsCategoryModalVisible(true)}>
                                                    Thêm danh mục mới
                                                </Button>
                                            </Space>
                                        </>
                                    )}
                                >
                                    {categories.map(cat => <Option key={cat.id} value={cat.id}>{cat.name}</Option>)}
                                </Select>
                            </Form.Item>
                        </Card>
                        <Card title="Ảnh đại diện" variant={false} className="shadow-sm">
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                maxCount={1}
                                beforeUpload={() => false}
                                onChange={({ fileList: newFileList }) => setFileList(newFileList)}
                                onPreview={(file) => {
                                    if (file.url) {
                                        window.open(file.url, '_blank');
                                    }
                                }}
                            >
                                {fileList.length >= 1 ? null : (
                                    <div>
                                        <PlusOutlined />
                                        <div className="mt-2">Tải lên</div>
                                    </div>
                                )}
                            </Upload>
                        </Card>
                    </Space>
                </Col>
            </Row>

            <Form.Item className="mt-6">
                <Button type="primary" htmlType="submit" size="large" loading={isSubmitting}>
                    {initialValues ? 'Cập nhật Bài viết' : 'Lưu Bài viết'}
                </Button>
            </Form.Item>

            <CategoryForm
                open={isCategoryModalVisible}
                onCancel={() => setIsCategoryModalVisible(false)}
                onFinish={handleAddCategory}
            />
        </Form>
    );
};

export default PostForm;