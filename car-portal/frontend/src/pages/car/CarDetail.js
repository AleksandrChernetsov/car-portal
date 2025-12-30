import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  IconButton,
  useTheme,
  Alert,
  LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { Favorite, FavoriteBorder, ArrowBack, Message, Block } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

/**
 * Компонент детальной страницы автомобиля.
 * Отображает полную информацию об автомобиле, включая контакты продавца.
 * Поддерживает добавление в избранное и связь с продавцом.
 */
const CarDetail = () => {
  const [car, setCar] = useState(null);
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  /**
   * Загружает данные автомобиля при монтировании компонента.
   */
  useEffect(() => {
    fetchCarData();
  }, [id]);

  /**
   * Получает данные автомобиля, информацию о продавце и статус избранного.
   */
  const fetchCarData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/cars/${id}`);
      const carData = response.data;
      setCar(carData);

      if (isAuthenticated && carData.isAvailable) {
        try {
          const favoriteResponse = await api.get(`/favorites/check/${id}`);
          setIsFavorite(favoriteResponse.data);
        } catch (err) {
          console.error('Ошибка при проверке избранного:', err);
        }
      }

      if (carData.sellerId) {
        try {
          const sellerResponse = await api.get(`/user/${carData.sellerId}`);
          setSeller(sellerResponse.data);
        } catch (err) {
          console.error('Ошибка при получении данных продавца:', err);
        }
      }

    } catch (err) {
      console.error('Ошибка при получении данных автомобиля:', err);
      setError('Ошибка при загрузке данных автомобиля');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Переключает состояние избранного для автомобиля.
   */
  const toggleFavorite = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/remove/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/add/${id}`);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
      setError(error.response?.data?.message || 'Ошибка при изменении избранного');
    }
  };

  /**
   * Обрабатывает клик по кнопке связи с продавцом.
   */
  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (seller) {
      alert(`Отправка сообщения продавцу: ${seller.username}`);
    } else {
      alert('Информация о продавце недоступна.');
    }
  };

  /**
   * Возвращает к каталогу автомобилей.
   */
  const handleBack = () => {
    navigate('/cars');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '200px' }} />
      </Box>
    );
  }

  if (!car) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Автомобиль не найден
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleBack}>
          Вернуться к каталогу
        </Button>
      </Box>
    );
  }

  const isSold = !car.isAvailable;

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 2 }}
      >
        Вернуться к каталогу
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Левая колонка: Изображение и базовая информация */}
        <Grid item xs={12} md={7}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="400"
              image={car.imageUrl || 'http://localhost:8080/images/carImages/default-car.jpg'}
              alt={`${car.brand} ${car.model}`}
              sx={{ objectFit: 'contain', bgcolor: '#f5f5f5' }}
            />
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                  {car.brand} {car.model}
                </Typography>
                {isAuthenticated && !isSold && (
                  <IconButton
                    onClick={toggleFavorite}
                    color={isFavorite ? 'error' : 'default'}
                    title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                )}
              </Box>

              <Typography variant="h5" color="primary" sx={{ mt: 1, fontWeight: 'bold' }}>
                {car.price.toLocaleString('ru-RU')} ₽
              </Typography>

              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body1"><strong>Год выпуска:</strong> {car.year}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Статус:</strong> <span style={{ color: car.isAvailable ? 'green' : 'red' }}>{car.isAvailable ? 'В наличии' : 'Продан'}</span></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1"><strong>Марка:</strong> {car.brand}</Typography>
                    <Typography variant="body1" sx={{ mt: 1 }}><strong>Модель:</strong> {car.model}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'bold' }}>
                Описание
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {car.description || 'Описание отсутствует'}
              </Typography>

              {isSold && (
                <Alert
                  severity="warning"
                  sx={{ mt: 2 }}
                  icon={<Block />}
                >
                  Этот автомобиль уже продан. Добавление в избранное и связь с продавцом недоступны.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Правая колонка: Контакты продавца */}
        <Grid item xs={12} md={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Контакты продавца
              </Typography>

              {seller ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      component="img"
                      src={seller.avatar || 'http://localhost:8080/images/userImages/defaultUserImage.jpg'}
                      alt={seller.username}
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        mr: 2,
                        border: '2px solid',
                        borderColor: theme.palette.primary.main
                      }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {seller.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Продавец
                      </Typography>
                    </Box>
                  </Box>

                  {seller.phone && (
                    <Typography variant="body1" sx={{ mt: 2 }}>
                      <strong>Телефон:</strong> {seller.phone}
                    </Typography>
                  )}

                  {seller.email && (
                    <Typography variant="body1" sx={{ mt: 1 }}>
                      <strong>Email:</strong> {seller.email}
                    </Typography>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Продавец зарегистрирован: {seller.createdAt}
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  Информация о продавце недоступна
                </Typography>
              )}

              {isSold ? (
                <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                  <Typography variant="body1" color="warning.contrastText" align="center">
                    Этот автомобиль продан. Связь с продавцом недоступна.
                  </Typography>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<Message />}
                  fullWidth
                  onClick={handleContactSeller}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Написать продавцу
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Дополнительная информация */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Условия покупки
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Возможен торг
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Осмотр автомобиля по договоренности
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Все документы в наличии
              </Typography>
              <Typography variant="body2">
                • Возможность кредитования
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarDetail;