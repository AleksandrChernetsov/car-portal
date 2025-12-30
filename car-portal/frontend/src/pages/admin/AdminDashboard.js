import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  useTheme,
  Alert
} from '@mui/material';
import {
  People,
  DirectionsCar,
  Newspaper,
  ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Компонент панели администратора.
 * Отображает статистику системы и предоставляет доступ к функциям управления.
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [stats, setStats] = useState({
    users: 0,
    cars: 0,
    news: 0
  });
  const [serverTime, setServerTime] = useState('Загрузка...');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  /**
   * Загружает статистику и время сервера при монтировании компонента.
   */
  useEffect(() => {
    fetchStats();
    fetchServerTime();

    const interval = setInterval(fetchServerTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Получает текущее время сервера.
   */
  const fetchServerTime = async () => {
    try {
      const response = await api.get('/time');
      setServerTime(response.data);
    } catch (err) {
      console.error('Ошибка получения времени сервера:', err);
      setServerTime('Ошибка загрузки');
    }
  };

  /**
   * Получает статистику системы.
   */
  const fetchStats = async () => {
    setLoading(true);
    setError('');

    try {
      const usersResponse = await api.get('/admin/users');
      const carsResponse = await api.get('/admin/cars');
      const newsResponse = await api.get('/admin/news');

      setStats({
        users: usersResponse.data.length,
        cars: carsResponse.data.length,
        news: newsResponse.data.length
      });
    } catch (err) {
      console.error('Ошибка при загрузке статистики:', err);
      setError('Ошибка при загрузке данных панели администратора');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Переход к управлению пользователями.
   */
  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  /**
   * Переход к управлению автомобилями.
   */
  const handleManageCars = () => {
    navigate('/admin/cars');
  };

  /**
   * Переход к управлению новостями.
   */
  const handleManageNews = () => {
    navigate('/moderator/news');
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        Панель администратора
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ width: '100%', mb: 3 }}>
          <LinearProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {/* Статистика пользователей */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <People sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.users}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Пользователей в системе
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={handleManageUsers}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                >
                  Управление
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Статистика автомобилей */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <DirectionsCar sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.cars}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Автомобилей в каталоге
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={handleManageCars}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                >
                  Управление
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Статистика новостей */}
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <Newspaper sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 1 }} />
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {stats.news}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Новостей на портале
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={handleManageNews}
                  sx={{
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main
                  }}
                >
                  Управление
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Дополнительная информация о системе */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Информация о системе
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Версия приложения:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1.0.0
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Версия Spring Boot:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3.5.7
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  База данных:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  PostgreSQL
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  Серверное время:
                </Typography>
                <Typography variant="body2" color="text.secondary" id="server-time">
                  {serverTime}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AdminDashboard;