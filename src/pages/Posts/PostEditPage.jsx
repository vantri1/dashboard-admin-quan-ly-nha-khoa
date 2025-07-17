// src/pages/Posts/PostEditPage.jsx
import { message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PostForm from '../../components/posts/PostForm';
import { getPostById, updatePost } from '../../services/postServer';

const { Title } = Typography;

const PostEditPage = () => {
    const navigate = useNavigate();
    const { postId } = useParams(); // Get postId from URL
    const [postData, setPostData] = useState(null); // Sẽ lưu trữ raw response, ví dụ {data: {...}, category_name: "...", creator_name: "..."}
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await getPostById(postId);
                setPostData(response); // Lưu toàn bộ response.data
            } catch (error) {
                console.error('Failed to fetch post for editing:', error);
                message.error('Không thể tải dữ liệu bài viết để chỉnh sửa.');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [postId]);

    const handleFinish = async (values) => {
        try {
            const response = await updatePost(postId, values);
            message.success(response.message || 'Cập nhật bài viết thành công!');
            navigate('/blog/posts');
        } catch (error) {
            console.error('Failed to update post:', error);
            message.error('Không thể cập nhật bài viết: ', error); // Error message handled by apiService interceptor
        }
    };

    if (loading) {
        return <Title level={2}>Đang tải bài viết...</Title>;
    }

    if (!postData) {
        return <Title level={2}>Không tìm thấy bài viết!</Title>;
    }

    return (
        <>
            <Title level={3} className='mb-4'>Chỉnh sửa Bài viết: {postData.data.title}</Title>
            {/* Truyền toàn bộ postData (bao gồm 'data' và các trường khác như 'category_name') */}
            <PostForm onFinish={handleFinish} initialValues={postData} />
        </>
    );
};

export default PostEditPage;