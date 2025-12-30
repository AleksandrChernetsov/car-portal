import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  AdminPanelSettings,
  CarRepair,
  Newspaper,
  FavoriteBorder,
  ExitToApp,
  LocationOn
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/images/logo.png';

/**
 * Компонент Header (шапка сайта).
 * Содержит навигацию, логотип и элементы управления пользователем.
 * Адаптируется для мобильных и десктопных устройств.
 */
const Header = ({ onDrawerToggle }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Открывает меню пользователя.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  /**
   * Закрывает меню пользователя.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * Открывает мобильное меню.
   */
  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  /**
   * Закрывает мобильное меню.
   */
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  /**
   * Выполняет выход пользователя из системы.
   */
  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  /**
   * Возвращает элементы меню в зависимости от роли пользователя.
   * @returns {Array} Массив объектов с элементами меню
   */
  const getMenuItems = () => {
    const items = [
      { text: 'Каталог', icon: <CarRepair />, path: '/cars' },
      { text: 'Новости', icon: <Newspaper />, path: '/news' },
      { text: 'Контакты', icon: <LocationOn />, path: '/contacts' },
    ];

    if (isAuthenticated) {
      items.push({ text: 'Избранное', icon: <FavoriteBorder />, path: '/favorites' });
      if (user?.role === 'MODERATOR' || user?.role === 'ADMIN') {
        items.push({ text: 'Управление новостями', icon: <Newspaper />, path: '/moderator/news' });
      }
      if (user?.role === 'ADMIN') {
        items.push({ text: 'Панель администратора', icon: <AdminPanelSettings />, path: '/admin' });
      }
    }

    return items;
  };

  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Левая часть: логотип и кнопка меню для мобильных */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileMenuOpen}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <Box
              component="img"
              src={logo}
              alt="Логотип"
              sx={{ height: 40, mr: 1 }}
            />
            <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
              Автомобильный портал
            </Typography>
          </Link>
        </Box>

        {/* Правая часть: навигация и элементы управления пользователем */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Десктопная навигация */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              {getMenuItems().map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px'
                    }
                  }}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}

          {/* Управление пользователем */}
          {isAuthenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}
              >
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                keepMounted
              >
                <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                  Мой профиль
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <ExitToApp sx={{ mr: 1 }} /> Выход
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button color="inherit" component={Link} to="/login">
                Вход
              </Button>
              <Button color="inherit" component={Link} to="/register" variant="outlined">
                Регистрация
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>

      {/* Мобильное меню */}
      {isMobile && (
        <Drawer
          anchor="left"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          sx={{
            '& .MuiDrawer-paper': { width: 240 },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Меню
            </Typography>
            <List>
              {getMenuItems().map((item) => (
                <ListItem key={item.path} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={handleMobileMenuClose}
                  >
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </AppBar>
  );
};

export default Header;