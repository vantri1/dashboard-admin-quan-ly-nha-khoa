// src/pages/NotFoundPage/index.jsx

import { Button, Result } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';


const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Result
                status="404"
                title="404"
                subTitle="Xin lỗi, trang bạn truy cập không tồn tại."
                extra={
                    <Button type="primary" onClick={() => navigate('/')}>
                        Quay về Trang chủ
                    </Button>
                }
            />
        </div>
    );
};

export default NotFoundPage;