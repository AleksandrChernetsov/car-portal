import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  LinearProgress,
  useTheme
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  Delete,
  ArrowBack
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Компонент страницы избранных автомобилей.
 * Отображает список автомобилей, добавленных пользователем в избранное.
 */
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  /**
   * Загружает избранные автомобили при монтировании компонента.
   */
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Получает список избранных автомобилей с сервера.
   */
  const fetchFavorites = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/favorites', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении избранных автомобилей');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Удаляет автомобиль из избранного.
   */
  const removeFromFavorites = async (carId) => {
    try {
      const response = await fetch(`/favorites/remove/${carId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Ошибка при удалении из избранного');
      }

      setFavorites(prev => prev.filter(car => car.id !== carId));
    } catch (err) {
      setError(err.message || 'Произошла ошибка при удалении из избранного');
    }
  };

  /**
   * Возвращает на главную страницу.
   */
  const handleBack = () => {
    navigate('/');
  };

  /**
   * Переходит к детальной странице автомобиля.
   */
  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  // Проверка аутентификации
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: { xs: 1, md: 3 }, textAlign: 'center', maxWidth: '800px', mx: 'auto' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Пожалуйста, войдите в систему
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Для просмотра избранных автомобилей необходимо авторизоваться
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/login')}
          sx={{
            mr: 2,
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark }
          }}
        >
          Войти в систему
        </Button>
        <Button
          variant="outlined"
          onClick={handleBack}
          sx={{
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main
          }}
        >
          Вернуться на главную
        </Button>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LinearProgress sx={{ width: '200px' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchFavorites}>
          Попробовать снова
        </Button>
      </Box>
    );
  }

  if (favorites.length === 0) {
    return (
      <Box sx={{ p: { xs: 1, md: 3 }, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
          Список избранных пуст
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          Вы еще не добавили ни одного автомобиля в избранное
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/cars')}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark }
          }}
        >
          Перейти в каталог
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleBack}
            sx={{ mb: 1 }}
          >
            Вернуться на главную
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Избранные автомобили
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Всего: {favorites.length} {favorites.length === 1 ? 'автомобиль' :
                  favorites.length < 5 ? 'автомобиля' : 'автомобилей'}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {favorites.map((car) => (
          <Grid item key={car.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={car.imageUrl || 'http://localhost:8080/images/carImages/default-car.jpg'}
                  alt={car.brand + ' ' + car.model}
                  sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  onClick={() => handleViewCar(car.id)}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: 'error.main',
                    '&:hover': { bgcolor: 'error.dark' }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromFavorites(car.id);
                  }}
                >
                  <Delete sx={{ color: 'white' }} />
                </IconButton>
              </Box>
              <CardContent sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => handleViewCar(car.id)}>
                <Typography gutterBottom variant="h6" component="div">
                  {car.brand} {car.model}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {car.year} год
                </Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  {car.price.toLocaleString('ru-RU')} ₽
                </Typography>
                {car.description && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {car.description}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesPage;