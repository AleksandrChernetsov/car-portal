import React from 'react';
import {
  Card as MuiCard,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  Box,
  IconButton,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite, FavoriteBorder, Block } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

/**
 * Стилизованный компонент Card.
 * Расширяет стандартный MUI Card с анимацией при наведении.
 */
const StyledCard = styled(MuiCard)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
  borderRadius: '8px',
  overflow: 'hidden',
}));

/**
 * Компонент карточки автомобиля.
 * Отображает информацию об автомобиле с возможностью добавления в избранное.
 */
const CarCard = ({ car, onCarClick, onFavoriteToggle, isFavorite }) => {
  const { isAuthenticated } = useAuth();
  const isSold = !car.isAvailable;

  /**
   * Обрабатывает клик по кнопке избранного.
   */
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      return;
    }

    try {
      if (isFavorite) {
        await api.delete(`/favorites/remove/${car.id}`);
      } else {
        await api.post(`/favorites/add/${car.id}`);
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(car.id, !isFavorite);
      }
    } catch (error) {
      console.error('Ошибка при изменении избранного:', error);
      alert(error.response?.data?.message || 'Ошибка при изменении избранного');
    }
  };

  return (
    <StyledCard onClick={onCarClick} sx={{ cursor: 'pointer', position: 'relative' }}>
      {/* Бейдж "ПРОДАН" для проданных автомобилей */}
      {isSold && (
        <Box sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          bgcolor: 'error.main',
          color: 'white',
          px: 1,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          ПРОДАН
        </Box>
      )}

      <CardMedia
        component="img"
        height="180"
        image={car.imageUrl || 'http://localhost:8080/images/carImages/default-car.jpg'}
        alt={car.brand + ' ' + car.model}
        sx={{ objectFit: 'cover', opacity: isSold ? 0.7 : 1 }}
      />
      <CardContent sx={{ flexGrow: 1 }}>
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
          <Typography variant="body2" color="text.secondary" sx={{
            mt: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {car.description}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ p: 2, justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{
            px: 1,
            py: 0.5,
            borderRadius: '4px',
            backgroundColor: car.isAvailable ? 'success.light' : 'error.light',
            color: car.isAvailable ? 'success.contrastText' : 'error.contrastText'
          }}>
            {car.isAvailable ? 'В наличии' : 'Продан'}
          </Typography>
        </Box>

        {/* Кнопка избранного для авторизованных пользователей */}
        {isAuthenticated && !isSold && (
          <Tooltip title={isFavorite ? "Удалить из избранного" : "Добавить в избранное"}>
            <IconButton
              onClick={handleFavoriteClick}
              color={isFavorite ? 'error' : 'default'}
              size="small"
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
        )}

        {/* Заблокированная кнопка для проданных автомобилей */}
{isSold && (
  <Tooltip title="Проданный автомобиль нельзя добавить в избранное">
    <span>
      <IconButton size="small" disabled>
        <Block />
      </IconButton>
    </span>
  </Tooltip>
)}
      </CardActions>
    </StyledCard>
  );
};

/**
 * Компонент карточки новости.
 * Отображает краткую информацию о новости.
 */
const NewsCard = ({ news, onClick }) => {
  return (
    <StyledCard onClick={onClick} sx={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {news.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Автор: {news.author} | {news.date}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
          {news.content}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export { CarCard, NewsCard };