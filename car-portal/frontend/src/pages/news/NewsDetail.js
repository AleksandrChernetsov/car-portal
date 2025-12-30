import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  useTheme,
  Alert,
  LinearProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBack, Facebook, Twitter, Instagram } from '@mui/icons-material';
import api from '../../services/api';

/**
 * Компонент детальной страницы новости.
 * Отображает полную новость с возможностью поделиться в соцсетях.
 */
const NewsDetail = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedNews, setRelatedNews] = useState([]);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Загружает данные новости при монтировании компонента.
   */
  useEffect(() => {
    fetchNewsData();
  }, [id]);

  /**
   * Получает данные новости и связанные новости.
   */
  const fetchNewsData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/news/${id}`);
      setNews(response.data);

      const relatedResponse = await api.get('/news');
      const filteredRelatedNews = relatedResponse.data.filter(n => n.id !== Number(id));
      setRelatedNews(filteredRelatedNews.slice(0, 3));
    } catch (err) {
      console.error('Ошибка при получении данных новости:', err);
      setError('Ошибка при загрузке новости');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Возвращает к списку новостей.
   */
  const handleBack = () => {
    navigate('/news');
  };

  /**
   * Форматирует дату в читаемый вид.
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Дата не указана';

    try {
      if (dateString.includes('.')) {
        const [day, month, year] = dateString.split('.');
        const date = new Date(year, month - 1, day);

        const options = {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        };
        return date.toLocaleDateString('ru-RU', options);
      }

      const date = new Date(dateString);
      if (isNaN(date)) return 'Неверная дата';

      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <LinearProgress sx={{ width: '200px' }} />
      </Box>
    );
  }

  if (!news) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Новость не найдена
        </Typography>
        <Button variant="contained" sx={{ mt: 2 }} onClick={handleBack}>
          Вернуться к новостям
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={handleBack}
        sx={{ mb: 3 }}
      >
        Вернуться к новостям
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Основной контент новости */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardMedia
              component="img"
              height="400"
              image={news.imageUrl || '/images/newsImages/placeholder-news.jpg'}
              alt={news.title}
              sx={{ objectFit: 'cover' }}
            />
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                {news.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: 'text.secondary' }}>
                <Typography variant="body2">
                  Автор: {news.author} | Дата: {formatDate(news.date)}
                </Typography>
              </Box>

              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                {news.content}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Боковая панель */}
        <Grid item xs={12} md={4}>
          {/* Последние новости */}
          {relatedNews.length > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Другие новости
                </Typography>
                {relatedNews.map((item) => (
                  <Box
                    key={item.id}
                    sx={{
                      mb: 2,
                      pb: 2,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 }
                    }}
                    onClick={() => navigate(`/news/${item.id}`)}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(item.date)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Архив новостей */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Архив новостей
              </Typography>
              <Grid container spacing={1}>
                {[
                  'Январь 2025', 'Февраль 2025', 'Март 2025', 'Апрель 2025',
                  'Май 2025', 'Июнь 2025', 'Июль 2025', 'Август 2025',
                  'Сентябрь 2025', 'Октябрь 2025', 'Ноябрь 2025', 'Декабрь 2025',
                  'Декабрь 2024', 'Ноябрь 2024', 'Октябрь 2024'
                ].map((month, index) => (
                  <Grid item xs={6} sm={4} key={index}>
                    <Button
                      variant="outlined"
                      size="small"
                      fullWidth
                      onClick={() => {
                        alert(`Новости за ${month} будут показаны при реализации фильтрации`);
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        textTransform: 'none',
                        borderColor: theme.palette.divider
                      }}
                    >
                      {month}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewsDetail;