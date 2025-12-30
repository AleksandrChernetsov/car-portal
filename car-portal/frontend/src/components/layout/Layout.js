import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * Компонент Layout (основной макет приложения).
 * Обертка для всех страниц, содержит Header, Footer и основное содержимое.
 * Управляет адаптивным макетом и обеспечивает единый стиль для всех страниц.
 */
const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  /**
   * Переключает состояние мобильного меню.
   */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <Header onDrawerToggle={handleDrawerToggle} />
      <Toolbar />
      <Box component="main" sx={{
        flexGrow: 1,
        p: { xs: 2, md: 3 },
        maxWidth: '1400px',
        mx: 'auto',
        width: '100%'
      }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;