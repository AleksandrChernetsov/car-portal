import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Card,
  CardContent,
  useTheme,
  LinearProgress
} from '@mui/material';
import {
  DirectionsCar,
  Newspaper,
  Favorite,
  AccessTime
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import backgroundImage from '../../assets/images/backgrounds/header-bg.jpg';

/**
 * Компонент главной страницы.
 * Отображает приветствие, статистику портала и серверное время.
 */
const HomePage = () => {
  const [serverTime, setServerTime] = useState('Загрузка...');
  const [stats, setStats] = useState({
    cars: 0,
    news: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeLoading, setTimeLoading] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Получает текущее время сервера.
   */
  const fetchServerTime = async () => {
    try {
      const response = await api.get('/time');
      setServerTime(response.data);
      setTimeLoading(false);
    } catch (err) {
      console.error('Ошибка получения времени сервера:', err);
      setServerTime(new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
      setTimeLoading(false);
    }
  };

  /**
   * Получает статистику портала.
   */
  const fetchStats = async () => {
    try {
      const carsResponse = await api.get('/cars/catalog');
      const newsResponse = await api.get('/news');
      setStats({
        cars: carsResponse.data.length || 0,
        news: newsResponse.data.length || 0
      });
    } catch (err) {
      console.error('Ошибка при получении статистики:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Загружает время и статистику при монтировании компонента.
   */
  useEffect(() => {
    fetchStats();
    fetchServerTime();
    const interval = setInterval(fetchServerTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      mt: 2
    }}>
      {/* Герой-секция */}
      <Paper
        elevation={0}
        sx={{
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: { xs: 200, md: 400 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2,
          color: 'white',
          textAlign: 'center',
          px: 2,
          position: 'relative'
        }}
      >
        <Box>
          <Typography variant="h2" component="h1" sx={{
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            Автомобильный портал
          </Typography>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Лучшие предложения на автомобильном рынке
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/cars')}
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              }
            }}
          >
            Посмотреть каталог
          </Button>
        </Box>
      </Paper>

      {/* Серверное время */}
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        my: 4
      }}>
        <Card sx={{
          minWidth: 300,
          maxWidth: 500,
          textAlign: 'center',
          py: 2,
          px: 3,
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          borderRadius: 2,
          boxShadow: 3
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
              <AccessTime sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Серверное время
              </Typography>
            </Box>
            {timeLoading ? (
              <LinearProgress sx={{ width: '100%', backgroundColor: 'rgba(255,255,255,0.3)' }} />
            ) : (
              <Typography variant="h4" sx={{ fontWeight: 'bold', fontFamily: 'monospace' }}>
                {serverTime}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Статистика портала */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <LinearProgress sx={{ width: '50%' }} />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <DirectionsCar sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.cars}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Автомобилей в каталоге
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/cars')}
              >
                Перейти в каталог
              </Button>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Newspaper sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.news}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Новостей на портале
              </Typography>
              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                onClick={() => navigate('/news')}
              >
                Читать новости
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Информация о портале */}
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography variant="body1" paragraph>
          Добро пожаловать на автомобильный портал! Здесь вы найдёте все актуальные предложения по продаже автомобилей, новости автомобильного мира и многое другое.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Используйте навигацию вверху страницы для доступа ко всем функциям портала.
        </Typography>
      </Box>
    </Box>
  );
};

export default HomePage;