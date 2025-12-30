import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import AuthForm from '../../components/AuthForm';

/**
 * Компонент страницы входа в систему.
 * Предоставляет форму для аутентификации пользователя.
 */
const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  /**
   * Перенаправляет авторизованного пользователя.
   */
  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) {
      setServerError('');
    }
  };

  /**
   * Валидирует форму.
   */
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Введите имя пользователя';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Введите пароль';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Обрабатывает потерю фокуса полем ввода.
   */
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    if (!formData[field].trim()) {
      setErrors(prev => ({
        ...prev,
        [field]: field === 'username' ? 'Введите имя пользователя' : 'Введите пароль'
      }));
    }
  };

  /**
   * Обрабатывает отправку формы.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setTouched({ username: true, password: true });
      setErrors({
        username: !formData.username.trim() ? 'Введите имя пользователя' : '',
        password: !formData.password.trim() ? 'Введите пароль' : ''
      });
      return;
    }
    setLoading(true);
    setServerError('');
    try {
      await login(formData);
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      let errorMessage = 'Произошла ошибка при входе в систему';

      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;

        if (data && data.message) {
          errorMessage = data.message;
        } else if (data && data.error) {
          errorMessage = data.error;
        }

        if (status === 401 || status === 404) {
          errorMessage = 'Неверное имя пользователя или пароль';
        } else if (status === 403) {
          errorMessage = 'Доступ запрещен';
        } else if (status === 500) {
          errorMessage = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.';
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      const cleanedErrorMessage = String(errorMessage)
        .replace(/^org\.springframework\.security\.authentication\./, '')
        .replace(/^Bad credentials/, 'Неверные учетные данные')
        .replace(/^UserDetailsService returned null/, 'Пользователь не найден')
        .trim();

      setServerError(cleanedErrorMessage || 'Произошла ошибка при входе в систему');
      setFormData(prev => ({ ...prev, password: '' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm title="Вход в систему">
      {serverError && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            '& .MuiAlert-message': {
              width: '100%'
            }
          }}
        >
          {serverError}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
        <TextField
          label="Имя пользователя"
          name="username"
          value={formData.username}
          onChange={handleChange}
          onBlur={() => handleBlur('username')}
          error={!!errors.username && touched.username}
          helperText={touched.username && errors.username}
          fullWidth
          margin="normal"
          disabled={loading}
          autoFocus
          required
          autoComplete="username"
        />
        <TextField
          label="Пароль"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={() => handleBlur('password')}
          error={!!errors.password && touched.password}
          helperText={touched.password && errors.password}
          fullWidth
          margin="normal"
          disabled={loading}
          required
          autoComplete="current-password"
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            py: 1.5,
            bgcolor: theme.palette.primary.main,
            '&:hover': { bgcolor: theme.palette.primary.dark },
            position: 'relative'
          }}
          disabled={loading}
          startIcon={!loading && <LoginIcon />}
        >
          {loading ? (
            <>
              <CircularProgress size={24} sx={{ position: 'absolute', left: '50%', ml: -2 }} />
              <span style={{ visibility: 'hidden' }}>Войти в систему</span>
            </>
          ) : 'Войти в систему'}
        </Button>
      </Box>
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Нет аккаунта?{' '}
          <Link
            component="button"
            onClick={() => navigate('/register')}
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
            disabled={loading}
          >
            Зарегистрироваться
          </Link>
        </Typography>
      </Box>
    </AuthForm>
  );
};

export default LoginPage;