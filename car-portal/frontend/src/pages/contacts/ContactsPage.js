import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  useTheme,
  Alert
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Schedule,
  Send
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

/**
 * Компонент страницы контактов.
 * Отображает контактную информацию и форму обратной связи.
 */
const ContactsPage = () => {
  const theme = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState('');

  /**
   * Заполняет форму данными пользователя при авторизации.
   */
  React.useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccess(false);
  };

  /**
   * Обрабатывает отправку формы обратной связи.
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Валидация формы
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Пожалуйста, введите корректный email');
      return;
    }

    console.log('Форма отправлена:', formData);
    setSuccess(true);
    setError('');
    setFormData({
      name: user?.username || '',
      email: user?.email || '',
      phone: user?.phone || '',
      message: ''
    });
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Контакты
      </Typography>

      <Grid container spacing={4}>
        {/* Контактная информация */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: theme.palette.primary.main }}>
                Наши контакты
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <LocationOn sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Адрес
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    г. Пенза, ул. Автомобильная, д. 10
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Phone sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Телефон
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    +7 (495) 123-45-67
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ежедневно с 9:00 до 21:00
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Email sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Email
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    info@carportal.ru
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Отвечаем в течение 24 часов
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Schedule sx={{ mr: 2, color: theme.palette.primary.main, fontSize: 30 }} />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    Режим работы
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Понедельник - Пятница: 9:00 - 18:00
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Суббота: 10:00 - 16:00
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Воскресенье: выходной
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Форма обратной связи */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: theme.palette.primary.main }}>
                Обратная связь
              </Typography>

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Ваше имя"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isAuthenticated}
                  helperText={isAuthenticated ? "Имя взято из вашего профиля" : ""}
                />
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  disabled={isAuthenticated}
                  helperText={isAuthenticated ? "Email взят из вашего профиля" : ""}
                />
                <TextField
                  label="Телефон"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  placeholder="+7 (999) 123-45-67"
                  disabled={!!(isAuthenticated && user?.phone)}
                  helperText={isAuthenticated && user?.phone ? "Телефон взят из вашего профиля" : ""}
                />
                <TextField
                  label="Сообщение"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  required
                  placeholder="Опишите ваш вопрос или предложение..."
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Send />}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    bgcolor: theme.palette.primary.main,
                    '&:hover': { bgcolor: theme.palette.primary.dark }
                  }}
                >
                  Отправить сообщение
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Карта и дополнительная информация */}
      <Box sx={{ mt: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Как добраться
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
             Наш офис находится в центре Пензы на улице Автомобильной.
             Это удобное расположение позволяет легко добраться из любого района города.
            </Typography>
            <Box sx={{
              width: '100%',
              height: '300px',
              bgcolor: '#f5f5f5',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="body1" color="text.secondary">
                Здесь будет карта с нашим местоположением
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ContactsPage;