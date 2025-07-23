// src/main.jsx

import 'antd/dist/reset.css';
import './index.css';

import { ConfigProvider } from 'antd';
import ImageResize from 'quill-image-resize-module-react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Quill } from 'react-quill';
import { BrowserRouter } from 'react-router-dom';

// Đăng ký module một lần duy nhất cho toàn bộ ứng dụng
Quill.register('modules/imageResize', ImageResize);

import App from './App';
import { themeColors } from './configs/theme';

const antdTheme = {
  token: {
    colorPrimary: themeColors.primary,
    colorDanger: themeColors.danger,
    colorError: themeColors.error,
    // Cập nhật màu nền layout chung
    colorBgLayout: themeColors.contentBg,
  },
  components: {
    Layout: {
      siderBg: themeColors.siderBg,
      headerBg: themeColors.contentBg, // Nền Header cùng màu với content
      headerHeight: 64,
    },
    Menu: {
      // Các màu cho menu tối
      darkItemBg: 'transparent',
      darkItemColor: themeColors.menuItemColor,
      darkItemHoverBg: themeColors.menuItemHoverBg,
      darkItemSelectedBg: themeColors.menuItemActiveBg,
      darkItemSelectedColor: '#ffffff',
      darkSubMenuItemBg: themeColors.siderBg,
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <ConfigProvider theme={antdTheme}>
    <App />
  </ConfigProvider>
);