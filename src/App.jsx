
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { themeColors } from './configs/theme';
import { router } from './routes';
import { lightenColor } from './utils/lightenColor';
function App() {
  // Logic để gán màu từ theme vào biến CSS
  useEffect(() => {
    const primaryColor = themeColors.primary;
    // Tự động tạo màu đậm hơn 10% cho trạng thái hover
    const primaryScrollbarHover = lightenColor(primaryColor, 25);
    document.documentElement.style.setProperty('--primary-scrollbar-color', primaryColor);
    document.documentElement.style.setProperty('--primary-scrollbar-hover-color', primaryScrollbarHover);
  }, []);
  return (
    <RouterProvider router={router} />
  )
}

export default App
