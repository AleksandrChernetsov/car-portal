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
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  useTheme,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  PhotoCamera,
  Delete as DeleteIcon,
  Phone
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../hooks/useAuth';

/**
 * Компонент управления пользователями для администратора.
 * Позволяет создавать, редактировать и удалять пользователей, а также управлять их ролями, телефонами и аватарами.
 */
const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalError, setGlobalError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [currentEditUser, setCurrentEditUser] = useState(null);
  const [currentAvatarUser, setCurrentAvatarUser] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const { user: currentUser } = useAuth();

  /**
   * Получает список пользователей при загрузке компонента.
   */
  useEffect(() => {
    fetchUsers();
  }, []);

  /**
   * Получает список пользователей с сервера.
   */
  const fetchUsers = async () => {
    setLoading(true);
    setGlobalError('');

    try {
      const response = await api.get('/admin/users');
      const filteredUsers = response.data.filter(user =>
        currentUser ? user.id !== currentUser.id : true
      );
      setUsers(filteredUsers);
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Открывает диалог добавления пользователя.
   */
  const handleOpenAddDialog = () => {
    setUserForm({
      username: '',
      email: '',
      password: '',
      role: 'USER',
      phone: ''
    });
    setFormErrors({});
    setFormError('');
    setIsAddDialogOpen(true);
  };

  /**
   * Открывает диалог редактирования пользователя.
   */
  const handleOpenEditDialog = (user) => {
    setCurrentEditUser(user);
    setUserForm({
      username: user.username || '',
      email: user.email || '',
      password: '',
      role: user.role || 'USER',
      phone: user.phone || ''
    });
    setFormErrors({});
    setFormError('');
    setIsEditDialogOpen(true);
  };

  /**
   * Открывает диалог изменения аватара пользователя.
   */
  const handleOpenAvatarDialog = (user) => {
    setCurrentAvatarUser(user);
    setAvatarPreview(user.avatar);
    setAvatarFile(null);
    setIsAvatarDialogOpen(true);
  };

  /**
   * Закрывает все диалоги.
   */
  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsAvatarDialogOpen(false);
    setCurrentEditUser(null);
    setCurrentAvatarUser(null);
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormErrors({});
    setFormError('');
  };

  /**
   * Обрабатывает выбор файла аватара.
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('Файл слишком большой. Максимальный размер - 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Сохраняет новый аватар пользователя.
   */
  const handleSaveAvatar = async () => {
    if (!avatarFile || !currentAvatarUser) return;

    setAvatarLoading(true);
    setFormError('');

    try {
      const formData = new FormData();
      formData.append('file', avatarFile);

      const response = await api.post(
        `/admin/users/${currentAvatarUser.id}/avatar`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      setSuccessMessage('Аватар пользователя успешно изменен');
      setUsers(users.map(user =>
        user.id === currentAvatarUser.id
          ? { ...user, avatar: response.data }
          : user
      ));

      handleCloseDialogs();
    } catch (err) {
      console.error('Ошибка при изменении аватара:', err);
      setFormError(err.response?.data?.message || 'Ошибка при изменении аватара');
    } finally {
      setAvatarLoading(false);
    }
  };

  /**
   * Удаляет аватар пользователя.
   */
  const handleDeleteAvatar = async () => {
    if (!currentAvatarUser) return;

    setAvatarLoading(true);
    setFormError('');

    try {
      await api.delete(`/admin/users/${currentAvatarUser.id}/avatar`);

      setSuccessMessage('Аватар пользователя удален');
      setUsers(users.map(user =>
        user.id === currentAvatarUser.id
          ? { ...user, avatar: 'http://localhost:8080/images/userImages/defaultUserImage.jpg' }
          : user
      ));

      setAvatarPreview('http://localhost:8080/images/userImages/defaultUserImage.jpg');
    } catch (err) {
      console.error('Ошибка при удалении аватара:', err);
      setFormError(err.response?.data?.message || 'Ошибка при удалении аватара');
    } finally {
      setAvatarLoading(false);
    }
  };

  /**
   * Обрабатывает изменение полей формы.
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (formError) {
      setFormError('');
    }
  };

  /**
   * Валидирует данные формы пользователя.
   */
  const validateForm = () => {
    const errors = {};

    if (!userForm.username.trim()) {
      errors.username = 'Имя пользователя обязательно для заполнения';
    } else if (userForm.username.length < 3) {
      errors.username = 'Имя пользователя должно содержать минимум 3 символа';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(userForm.username)) {
      errors.username = 'Имя пользователя может содержать только буквы, цифры и символ подчеркивания';
    }

    if (!userForm.email.trim()) {
      errors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.email)) {
      errors.email = 'Неверный формат email';
    }

    if (!currentEditUser && !userForm.password.trim()) {
      errors.password = 'Пароль обязателен для заполнения';
    } else if (userForm.password && userForm.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (userForm.phone && !/^\+?[0-9\s\-()]{7,20}$/.test(userForm.phone)) {
      errors.phone = 'Неверный формат номера телефона';
    }

    if (!['USER', 'MODERATOR', 'ADMIN'].includes(userForm.role)) {
      errors.role = 'Недопустимая роль пользователя';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Создает нового пользователя.
   */
  const handleAddUser = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const response = await api.post('/auth/register', {
        username: userForm.username,
        email: userForm.email,
        password: userForm.password,
        role: userForm.role,
        phone: userForm.phone
      });

      setSuccessMessage('Пользователь успешно создан');
      handleCloseDialogs();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Произошла ошибка при создании пользователя');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Обновляет существующего пользователя.
   */
  const handleEditUser = async () => {
    if (!validateForm() || !currentEditUser) return;

    setLoading(true);
    setFormError('');
    setSuccessMessage('');

    try {
      const userData = {
        id: currentEditUser.id,
        username: userForm.username,
        email: userForm.email,
        role: userForm.role,
        phone: userForm.phone
      };

      if (userForm.password.trim()) {
        userData.password = userForm.password;
      }

      const response = await api.post(`/admin/users/${currentEditUser.id}/edit`, userData);
      setSuccessMessage('Пользователь успешно обновлен');
      handleCloseDialogs();
      fetchUsers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Произошла ошибка при обновлении пользователя');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Удаляет пользователя.
   */
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие нельзя отменить.')) {
      return;
    }

    setLoading(true);
    setGlobalError('');
    setSuccessMessage('');

    try {
      await api.delete(`/admin/users/${userId}/delete`);
      setSuccessMessage('Пользователь успешно удален');
      fetchUsers();
    } catch (err) {
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при удалении пользователя');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Управление пользователями
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
          Добавить пользователя
        </Button>
      </Box>

      {/* Отображение ошибок и сообщений */}
      {globalError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {globalError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      {/* Список пользователей */}
      {loading ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : users.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Пользователей в системе пока нет. Нажмите кнопку "Добавить пользователя", чтобы создать первого пользователя.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {users.map((user) => (
            <Grid item key={user.id} xs={12}>
              <Card sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ p: 2, position: 'relative' }}>
                  <Avatar
                    src={user.avatar || 'http://localhost:8080/images/userImages/defaultUserImage.jpg'}
                    alt={user.username}
                    sx={{
                      width: 60,
                      height: 60,
                      bgcolor: theme.palette.primary.light
                    }}
                  />
                  <Tooltip title="Изменить аватар">
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 5,
                        right: 5,
                        bgcolor: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': { bgcolor: theme.palette.primary.dark }
                      }}
                      onClick={() => handleOpenAvatarDialog(user)}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {user.username}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <Phone fontSize="small" sx={{ mr: 0.5 }} /> {user.phone}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: user.role === 'ADMIN' ? 'error.light' :
                                user.role === 'MODERATOR' ? 'warning.light' : 'success.light',
                        color: user.role === 'ADMIN' ? 'error.contrastText' :
                               user.role === 'MODERATOR' ? 'warning.contrastText' : 'success.contrastText',
                        fontWeight: 'medium'
                      }}>
                        {user.role === 'ADMIN' ? 'Администратор' :
                         user.role === 'MODERATOR' ? 'Модератор' : 'Пользователь'}
                      </Box>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                        title="Редактировать"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Удалить"
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалог добавления пользователя */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Добавить нового пользователя</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Имя пользователя"
              name="username"
              value={userForm.username}
              onChange={handleFormChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              label="Email"
              name="email"
              value={userForm.email}
              onChange={handleFormChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Пароль"
              name="password"
              value={userForm.password}
              onChange={handleFormChange}
              error={!!formErrors.password}
              helperText={formErrors.password}
              fullWidth
              margin="normal"
              type="password"
              required
            />
            <TextField
              label="Телефон"
              name="phone"
              value={userForm.phone}
              onChange={handleFormChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || 'Необязательное поле'}
              fullWidth
              margin="normal"
              placeholder="+7 (999) 123-45-67"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                value={userForm.role}
                onChange={handleFormChange}
                error={!!formErrors.role}
                label="Роль"
              >
                <MenuItem value="USER">Пользователь</MenuItem>
                <MenuItem value="MODERATOR">Модератор</MenuItem>
                <MenuItem value="ADMIN">Администратор</MenuItem>
              </Select>
              {formErrors.role && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.role}
                </Typography>
              )}
            </FormControl>
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
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
            onClick={handleAddUser}
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

      {/* Диалог редактирования пользователя */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Редактировать пользователя</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Имя пользователя"
              name="username"
              value={userForm.username}
              onChange={handleFormChange}
              error={!!formErrors.username}
              helperText={formErrors.username}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 20 }}
            />
            <TextField
              label="Email"
              name="email"
              value={userForm.email}
              onChange={handleFormChange}
              error={!!formErrors.email}
              helperText={formErrors.email}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Новый пароль (оставьте пустым, чтобы не менять)"
              name="password"
              value={userForm.password}
              onChange={handleFormChange}
              error={!!formErrors.password}
              helperText={formErrors.password || 'Минимум 6 символов'}
              fullWidth
              margin="normal"
              type="password"
            />
            <TextField
              label="Телефон"
              name="phone"
              value={userForm.phone}
              onChange={handleFormChange}
              error={!!formErrors.phone}
              helperText={formErrors.phone || 'Необязательное поле'}
              fullWidth
              margin="normal"
              placeholder="+7 (999) 123-45-67"
            />
            <FormControl fullWidth margin="normal" required>
              <InputLabel>Роль</InputLabel>
              <Select
                name="role"
                value={userForm.role}
                onChange={handleFormChange}
                error={!!formErrors.role}
                label="Роль"
              >
                <MenuItem value="USER">Пользователь</MenuItem>
                <MenuItem value="MODERATOR">Модератор</MenuItem>
                <MenuItem value="ADMIN">Администратор</MenuItem>
              </Select>
              {formErrors.role && (
                <Typography variant="body2" color="error" sx={{ mt: 0.5 }}>
                  {formErrors.role}
                </Typography>
              )}
            </FormControl>
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
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
            onClick={handleEditUser}
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

      {/* Диалог изменения аватара */}
      <Dialog
        open={isAvatarDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Изменение аватара пользователя: {currentAvatarUser?.username}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Avatar
              src={avatarPreview || 'http://localhost:8080/images/userImages/defaultUserImage.jpg'}
              alt={currentAvatarUser?.username}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: theme.palette.primary.main
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                disabled={avatarLoading}
              >
                Выбрать файл
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarChange}
                />
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteAvatar}
                disabled={avatarLoading || !currentAvatarUser?.avatar ||
                         currentAvatarUser?.avatar.includes('defaultUserImage')}
              >
                Удалить
              </Button>
            </Box>
            {avatarFile && (
              <Typography variant="body2" color="text.secondary">
                Выбран файл: {avatarFile.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 2MB
            </Typography>
            {formError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {formError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogs}
            disabled={avatarLoading}
          >
            Отменить
          </Button>
          <Button
            onClick={handleSaveAvatar}
            variant="contained"
            disabled={!avatarFile || avatarLoading}
            sx={{
              bgcolor: theme.palette.success.main,
              '&:hover': { bgcolor: theme.palette.success.dark }
            }}
          >
            {avatarLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageUsers;