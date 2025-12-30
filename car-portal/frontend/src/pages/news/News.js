import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Pagination,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Alert
} from '@mui/material';
import { NewsCard } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Компонент страницы новостей.
 * Отображает список новостей с возможностью поиска и пагинации.
 */
const News = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    itemsPerPage: 6
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Загружает новости при монтировании компонента.
   */
  useEffect(() => {
    fetchNews();
  }, []);

  /**
   * Фильтрует новости при изменении поискового запроса.
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredNews(newsItems);
    } else {
      const filtered = newsItems.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    }
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [searchTerm, newsItems]);

  /**
   * Обновляет пагинацию при изменении отфильтрованных новостей.
   */
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filteredNews.length / prev.itemsPerPage)
    }));
  }, [filteredNews]);

  /**
   * Получает новости с сервера.
   */
  const fetchNews = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/news');
      if (!Array.isArray(response.data)) {
        throw new Error('Неверный формат данных');
      }

      // Сортировка новостей по дате (сначала новые)
      const sortedNews = response.data.sort((a, b) => {
        const dateA = new Date(a.date.split('.').reverse().join('-'));
        const dateB = new Date(b.date.split('.').reverse().join('-'));
        return dateB - dateA;
      });

      setNewsItems(sortedNews);
      setFilteredNews(sortedNews);
    } catch (err) {
      console.error('Ошибка при получении новостей:', err);
      setError('Ошибка при загрузке новостей. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выполняет поиск новостей по ключевым словам.
   */
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/news/search?keyword=${encodeURIComponent(searchTerm)}`);
      if (!Array.isArray(response.data)) {
        throw new Error('Неверный формат данных');
      }

      setFilteredNews(response.data);
    } catch (err) {
      console.error('Ошибка при поиске новостей:', err);
      // Локальная фильтрация при ошибке
      const filtered = newsItems.filter(news =>
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNews(filtered);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сбрасывает поиск и показывает все новости.
   */
  const handleResetSearch = () => {
    setSearchTerm('');
    setFilteredNews(newsItems);
  };

  /**
   * Переходит к детальной странице новости.
   */
  const handleNewsClick = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  /**
   * Обрабатывает изменение страницы пагинации.
   */
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  /**
   * Получает новости для текущей страницы.
   */
  const paginatedNews = filteredNews.slice(
    (pagination.page - 1) * pagination.itemsPerPage,
    pagination.page * pagination.itemsPerPage
  );

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Новости автомобильного мира
      </Typography>

      {/* Панель поиска */}
      <Box sx={{ mb: 4, maxWidth: '600px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Поиск новостей по ключевым словам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
          >
            Найти
          </Button>
          <Button
            variant="outlined"
            onClick={handleResetSearch}
            disabled={loading || !searchTerm}
            sx={{
              borderColor: theme.palette.primary.main,
              color: theme.palette.primary.main
            }}
          >
            Сбросить
          </Button>
        </Box>
        {searchTerm && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Найдено новостей: {filteredNews.length}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Список новостей */}
      {loading ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : paginatedNews.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Новостей не найдено
          </Typography>
          {searchTerm && (
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              onClick={handleResetSearch}
            >
              Показать все новости
            </Button>
          )}
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedNews.map((news) => (
            <Grid item key={news.id} xs={12}>
              <NewsCard
                news={news}
                onClick={() => handleNewsClick(news.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Пагинация */}
      {filteredNews.length > pagination.itemsPerPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default News;