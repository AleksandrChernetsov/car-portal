import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  IconButton,
  LinearProgress,
  useTheme,
  Grid,
  Card,
  CardContent,
  Alert,
  Divider
} from '@mui/material';
import {
  CameraAlt,
  Delete,
  Save,
  Cancel,
  Edit
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Компонент страницы профиля пользователя.
 * Позволяет просматривать и редактировать профиль, управлять аватаром.
 */
const ProfilePage = () => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Инициализирует данные пользователя при загрузке компонента.
   */
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      });
      setAvatarPreview(user.avatar || null);
      fetchFavoritesCount();
    }
  }, [user]);

  /**
   * Получает количество избранных автомобилей.
   */
  const fetchFavoritesCount = async () => {
    try {
      const response = await api.get('/favorites');
      setFavoritesCount(response.data.length);
    } catch (err) {
      console.error('Ошибка при получении избранных автомобилей:', err);
    }
  };

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  /**
   * Обрабатывает выбор файла аватара.
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 2 * 1024 * 1024) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setError('');
    } else {
      setError('Файл слишком большой. Максимальный размер - 2MB.');
    }
  };

  /**
   * Удаляет аватар пользователя.
   */
  const handleDeleteAvatar = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await api.delete('/user/avatar');
      setAvatarPreview(response.data);
      setAvatarFile(null);
      setSuccessMessage('Аватар успешно удален');

      await checkAuth();
    } catch (err) {
      console.error('Ошибка при удалении аватара:', err);
      setError(err.response?.data?.message || 'Ошибка при удалении аватара');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Сохраняет изменения профиля.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // Валидация
      if (formData.username.length < 3) {
        throw new Error('Имя пользователя должно содержать минимум 3 символа');
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Неверный формат email');
      }

      if (formData.password && formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      const profileData = {
        id: user.id,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password || undefined
      };

      const response = await api.post('/user/edit', profileData);

      // Загрузка аватара если выбран новый файл
      if (avatarFile) {
        const formDataAvatar = new FormData();
        formDataAvatar.append('file', avatarFile);

        try {
          const avatarResponse = await api.post('/user/avatar', formDataAvatar, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          setAvatarPreview(avatarResponse.data);
        } catch (avatarError) {
          console.error('Ошибка при загрузке аватара:', avatarError);
        }
      }

      setSuccessMessage('Профиль успешно обновлен');
      setEditMode(false);

      await checkAuth();
      await fetchFavoritesCount();

    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError(err.response?.data?.message || err.message || 'Произошла ошибка при обновлении профиля');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Выполняет выход из системы.
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Форматирует дату для отображения.
   */
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'Неизвестно' || dateString === 'Никогда') {
      return dateString;
    }

    try {
      if (dateString.includes('.')) {
        const [datePart, timePart] = dateString.split(' ');
        return datePart;
      }

      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU');
    } catch (e) {
      return dateString;
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <LinearProgress sx={{ width: '200px' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Мой профиль
      </Typography>

      {/* Отображение ошибок и сообщений */}
      {error && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', color: 'error.contrastText', borderRadius: 1 }}>
          {error}
        </Box>
      )}
      {successMessage && (
        <Box sx={{ mb: 2, p: 2, bgcolor: 'success.light', color: 'success.contrastText', borderRadius: 1 }}>
          {successMessage}
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Левая колонка: Аватар и информация о пользователе */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                <Avatar
                  src={avatarPreview || 'http://localhost:8080/images/userImages/defaultUserImage.jpg'}
                  alt={formData.username}
                  sx={{ width: 120, height: 120, bgcolor: theme.palette.primary.light }}
                />
                {editMode && (
                  <Box sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'primary.main',
                    borderRadius: '50%',
                    p: 0.5
                  }}>
                    <IconButton component="label" sx={{ color: 'white' }}>
                      <CameraAlt fontSize="small" />
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {editMode ? (
                  <TextField
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                  />
                ) : (
                  formData.username
                )}
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Роль: {user.role === 'USER' ? 'Пользователь' :
                       user.role === 'MODERATOR' ? 'Модератор' :
                       'Администратор'}
              </Typography>

              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                {!editMode ? (
                  <Button
                    variant="contained"
                    startIcon={<Edit />}
                    onClick={() => setEditMode(true)}
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      '&:hover': { bgcolor: theme.palette.primary.dark }
                    }}
                  >
                    Редактировать
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      startIcon={loading ? <LinearProgress size={20} /> : <Save />}
                      onClick={handleSubmit}
                      disabled={loading}
                      sx={{
                        bgcolor: theme.palette.success.main,
                        '&:hover': { bgcolor: theme.palette.success.dark }
                      }}
                    >
                      {loading ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => {
                        setEditMode(false);
                        setFormData({
                          username: user.username || '',
                          email: user.email || '',
                          phone: user.phone || '',
                          password: ''
                        });
                        setAvatarFile(null);
                        setAvatarPreview(user.avatar || null);
                        setError('');
                        setSuccessMessage('');
                      }}
                      sx={{
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main
                      }}
                    >
                      Отменить
                    </Button>
                  </>
                )}
              </Box>

              {editMode && avatarPreview !== 'http://localhost:8080/images/userImages/defaultUserImage.jpg' && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={handleDeleteAvatar}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  Удалить аватар
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Статистика пользователя */}
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Статистика
              </Typography>

              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Дата регистрации:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatDate(user.createdAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Последний вход:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {formatDate(user.lastLoginAt)}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Избранные автомобили:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {favoritesCount}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Количество посещений:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {user.visitCount}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Правая колонка: Контактная информация */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Контактная информация
              </Typography>

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  required
                />
                <TextField
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editMode}
                  fullWidth
                  placeholder="+7 (999) 123-45-67"
                />
                {editMode && (
                  <TextField
                    label="Новый пароль"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    type="password"
                    fullWidth
                    placeholder="Оставьте пустым, чтобы не менять"
                    helperText="Минимум 6 символов"
                  />
                )}
                {!editMode && (
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleLogout}
                      startIcon={<Delete />}
                      sx={{
                        borderColor: theme.palette.error.main,
                        color: theme.palette.error.main,
                        '&:hover': {
                          bgcolor: theme.palette.error.light,
                          borderColor: theme.palette.error.dark
                        }
                      }}
                    >
                      Выйти из системы
                    </Button>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfilePage;