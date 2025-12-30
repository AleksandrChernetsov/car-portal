import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Checkbox,
  FormControlLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import AuthForm from '../../components/AuthForm';

/**
 * Компонент страницы регистрации.
 * Предоставляет форму для создания нового аккаунта пользователя.
 */
const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Перенаправляет авторизованного пользователя.
   */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  /**
   * Валидирует данные формы.
   */
  const validateForm = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Имя пользователя должно содержать минимум 3 символа';
    }

    if (!/^[a-zA-Z0-9_]{3,20}$/.test(formData.username)) {
      newErrors.username = 'Имя пользователя может содержать только буквы, цифры и символ подчеркивания';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Неверный формат email';
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (!agreedToTerms) {
      newErrors.terms = 'Необходимо согласиться с условиями использования';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  /**
   * Обрабатывает отправку формы.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      setSuccess(true);
      setFormData({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || 'Ошибка при регистрации. Попробуйте другое имя пользователя или email.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Отображение успешной регистрации
  if (success) {
    return (
      <AuthForm title="Регистрация успешна">
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Вы успешно зарегистрировались! Теперь вы можете войти в систему с вашими учетными данными.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              bgcolor: theme.palette.primary.main,
              '&:hover': { bgcolor: theme.palette.primary.dark }
            }}
          >
            Войти в систему
          </Button>
        </Box>
      </AuthForm>
    );
  }

  return (
    <AuthForm title="Регистрация">
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          label="Имя пользователя"
          value={formData.username}
          onChange={(e) => handleChange('username', e.target.value)}
          error={!!errors.username}
          helperText={errors.username}
          fullWidth
          margin="normal"
          disabled={loading}
          required
          inputProps={{ maxLength: 20 }}
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={!!errors.email}
          helperText={errors.email}
          fullWidth
          margin="normal"
          disabled={loading}
          required
        />
        <TextField
          label="Пароль"
          type="password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          error={!!errors.password}
          helperText={errors.password}
          fullWidth
          margin="normal"
          disabled={loading}
          required
        />
        <TextField
          label="Подтвердите пароль"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          fullWidth
          margin="normal"
          disabled={loading}
          required
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={agreedToTerms}
              onChange={(e) => {
                setAgreedToTerms(e.target.checked);
                setErrors(prev => ({ ...prev, terms: undefined }));
              }}
              color="primary"
              disabled={loading}
            />
          }
          label={
            <Typography variant="body2">
              Я согласен с{' '}
              <Link
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' }
                }}
              >
                условиями использования
              </Link>
            </Typography>
          }
          sx={{ mt: 1, mb: 2 }}
        />
        {errors.terms && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errors.terms}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            py: 1.5,
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark }
          }}
          disabled={loading}
        >
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </Box>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Уже есть аккаунт?{' '}
          <Link
            component="button"
            onClick={() => navigate('/login')}
            sx={{
              background: 'none',
              border: 'none',
              p: 0,
              cursor: 'pointer',
              color: theme.palette.primary.main,
              textDecoration: 'none',
              fontWeight: 'medium',
              '&:hover': { textDecoration: 'underline' }
            }}
          >
            Войти
          </Link>
        </Typography>
      </Box>
    </AuthForm>
  );
};

export default RegistrationPage;