import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Функция для форматирования даты.
 * Преобразует строку даты в читаемый формат.
 */
const formatDate = (dateString) => {
  if (!dateString || dateString === 'invalid date') return 'Дата не указана';

  try {
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.');
      const date = new Date(`${year}-${month}-${day}`);

      if (isNaN(date.getTime())) {
        return dateString;
      }

      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    console.error('Ошибка при форматировании даты:', e);
    return dateString;
  }
};

/**
 * Компонент управления новостями для модератора и администратора.
 * Позволяет создавать, редактировать, удалять и просматривать новости.
 */
const NewsManagement = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Загружает список новостей при монтировании компонента.
   */
  useEffect(() => {
    fetchNews();
  }, []);

  /**
   * Получает список новостей с сервера.
   */
  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '/moderator/news';
      const path = window.location.pathname;
      if (path.includes('/admin')) {
        endpoint = '/admin/news';
      } else if (path.includes('/moderator')) {
        endpoint = '/moderator/news';
      }

      const response = await api.get(endpoint);
      const data = response.data;
      if (!Array.isArray(data)) {
        throw new Error('Неверный формат данных: ожидается массив');
      }

      // Сортировка новостей по дате (сначала новые)
      const sortedNews = data.sort((a, b) => {
        try {
          const parseDateForSorting = (dateStr) => {
            if (!dateStr) return new Date(0);

            if (dateStr.includes('.')) {
              const [day, month, year] = dateStr.split('.');
              return new Date(`${year}-${month}-${day}`);
            }

            return new Date(dateStr);
          };

          const dateA = parseDateForSorting(a.date);
          const dateB = parseDateForSorting(b.date);

          if (isNaN(dateA.getTime())) return 1;
          if (isNaN(dateB.getTime())) return -1;

          return dateB - dateA;
        } catch (e) {
          console.error('Ошибка при сортировке по дате:', e);
          return 0;
        }
      });

      setNewsList(sortedNews);
    } catch (err) {
      console.error('Ошибка при получении списка новостей:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке списка новостей');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Открывает диалог добавления новости.
   */
  const handleOpenAddDialog = () => {
    setNewsForm({ title: '', content: '' });
    setFormErrors({});
    setIsAddDialogOpen(true);
  };

  /**
   * Открывает диалог редактирования новости.
   */
  const handleOpenEditDialog = (news) => {
    setCurrentNews(news);
    setNewsForm({ title: news.title, content: news.content });
    setFormErrors({});
    setIsEditDialogOpen(true);
  };

  /**
   * Закрывает все диалоги.
   */
  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setCurrentNews(null);
    setFormErrors({});
  };

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewsForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Валидирует данные формы.
   */
  const validateForm = () => {
    const errors = {};
    if (!newsForm.title.trim()) {
      errors.title = 'Заголовок обязателен для заполнения';
    } else if (newsForm.title.length < 5) {
      errors.title = 'Заголовок должен содержать минимум 5 символов';
    }
    if (!newsForm.content.trim()) {
      errors.content = 'Содержание обязательно для заполнения';
    } else if (newsForm.content.length < 20) {
      errors.content = 'Содержание должно содержать минимум 20 символов';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Добавляет новую новость.
   */
  const handleAddNews = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      let endpoint = '/moderator/news/add';
      const path = window.location.pathname;
      if (path.includes('/admin')) {
        endpoint = '/admin/news/add';
      } else if (path.includes('/moderator')) {
        endpoint = '/moderator/news/add';
      }

      const today = new Date();
      const formattedDate = today.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const newsData = {
        ...newsForm,
        date: formattedDate
      };

      await api.post(endpoint, newsData);
      setSuccessMessage('Новость успешно создана');
      handleCloseDialogs();
      fetchNews();
    } catch (err) {
      console.error('Ошибка при создании новости:', err);
      setError(err.response?.data?.message || 'Ошибка при создании новости');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Редактирует существующую новость.
   */
  const handleEditNews = async () => {
    if (!validateForm() || !currentNews) return;
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      let endpoint = `/moderator/news/${currentNews.id}/edit`;
      const path = window.location.pathname;
      if (path.includes('/admin')) {
        endpoint = `/admin/news/${currentNews.id}/edit`;
      } else if (path.includes('/moderator')) {
        endpoint = `/moderator/news/${currentNews.id}/edit`;
      }

      const today = new Date();
      const formattedDate = today.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      const newsData = {
        ...newsForm,
        date: formattedDate
      };

      await api.post(endpoint, newsData);
      setSuccessMessage('Новость успешно обновлена');
      handleCloseDialogs();
      fetchNews();
    } catch (err) {
      console.error('Ошибка при обновлении новости:', err);
      setError(err.response?.data?.message || 'Ошибка при обновлении новости');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Удаляет новость.
   */
  const handleDeleteNews = async (newsId) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту новость? Это действие нельзя отменить.')) {
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      let endpoint = `/moderator/news/${newsId}/delete`;
      const path = window.location.pathname;
      if (path.includes('/admin')) {
        endpoint = `/admin/news/${newsId}/delete`;
      } else if (path.includes('/moderator')) {
        endpoint = `/moderator/news/${newsId}/delete`;
      }
      await api.delete(endpoint);
      setSuccessMessage('Новость успешно удалена');
      fetchNews();
    } catch (err) {
      console.error('Ошибка при удалении новости:', err);
      setError(err.response?.data?.message || 'Ошибка при удалении новости');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Переходит к детальной странице новости.
   */
  const handleViewNews = (newsId) => {
    navigate(`/news/${newsId}`);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Управление новостями
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark }
          }}
        >
          Добавить новость
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : newsList.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Новостей пока нет. Нажмите кнопку "Добавить новость", чтобы создать первую новость.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {newsList.map((news) => (
            <Grid item key={news.id} xs={12}>
              <Card sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                height: '100%'
              }}>
                <Box sx={{ p: 2, flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {news.title}
                    </Typography>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleViewNews(news.id)}
                        title="Просмотреть"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(news)}
                        title="Редактировать"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteNews(news.id)}
                        title="Удалить"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Автор: {news.author} | Дата: {formatDate(news.date)}
                  </Typography>
                  <Typography variant="body2" sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {news.content}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог добавления новости */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить новую новость</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Заголовок"
              name="title"
              value={newsForm.title}
              onChange={handleFormChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Содержание"
              name="content"
              value={newsForm.content}
              onChange={handleFormChange}
              error={!!formErrors.content}
              helperText={formErrors.content}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogs}
            startIcon={<Cancel />}
          >
            Отменить
          </Button>
          <Button
            onClick={handleAddNews}
            variant="contained"
            startIcon={<Save />}
            sx={{
              bgcolor: theme.palette.success.main,
              '&:hover': { bgcolor: theme.palette.success.dark }
            }}
            disabled={loading}
          >
            {loading ? 'Создание...' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалог редактирования новости */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Редактировать новость</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Заголовок"
              name="title"
              value={newsForm.title}
              onChange={handleFormChange}
              error={!!formErrors.title}
              helperText={formErrors.title}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Содержание"
              name="content"
              value={newsForm.content}
              onChange={handleFormChange}
              error={!!formErrors.content}
              helperText={formErrors.content}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogs}
            startIcon={<Cancel />}
          >
            Отменить
          </Button>
          <Button
            onClick={handleEditNews}
            variant="contained"
            startIcon={<Save />}
            sx={{
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
            disabled={loading}
          >
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewsManagement;