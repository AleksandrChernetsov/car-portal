import React from 'react';
import { Box, Typography, Link, Grid, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, YouTube, ContactMail } from '@mui/icons-material';

/**
 * Компонент Footer (подвал сайта).
 * Отображает информацию о портале, навигационные ссылки и контактные данные.
 * Используется на всех страницах приложения.
 */
const Footer = () => {
  return (
    <Box component="footer" sx={{
      backgroundColor: '#1976d2',
      color: 'white',
      py: 4,
      mt: 'auto'
    }}>
      <Grid container spacing={3} maxWidth="1400px" mx="auto" px={2}>
        {/* Колонка с описанием портала */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Автомобильный портал
          </Typography>
          <Typography variant="body2">
            Лучший выбор автомобилей на вторичном рынке.
            Покупка, продажа и обмен автомобилей.
          </Typography>
        </Grid>

        {/* Колонка с навигационными ссылками */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Ссылки
          </Typography>
          <Link href="/" color="inherit" display="block" sx={{ mb: 1 }}>
            Главная
          </Link>
          <Link href="/cars" color="inherit" display="block" sx={{ mb: 1 }}>
            Каталог автомобилей
          </Link>
          <Link href="/news" color="inherit" display="block" sx={{ mb: 1 }}>
            Новости
          </Link>
          <Link href="/contacts" color="inherit" display="block" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            Контакты
          </Link>
        </Grid>

        {/* Колонка с контактной информацией и социальными сетями */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Контакты
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Email: info@carportal.ru<br />
            Телефон: +7 (495) 123-45-67<br />
            Адрес: г. Пенза, ул. Автомобильная, д. 10
          </Typography>

          {/* Иконки социальных сетей */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton color="inherit" href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <YouTube />
            </IconButton>
          </Box>
        </Grid>
      </Grid>

      {/* Нижняя часть футера с копирайтом */}
      <Box maxWidth="1400px" mx="auto" px={2} mt={3} pt={2} borderTop="1px solid rgba(255,255,255,0.1)">
        <Typography variant="body2" align="center">
          © {new Date().getFullYear()} Автомобильный портал. Все права защищены.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;