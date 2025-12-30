import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  useTheme,
  Alert,
  Checkbox,
  FormControlLabel,
  Avatar,
  Tooltip
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Save,
  Cancel,
  Visibility,
  PhotoCamera,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

/**
 * Компонент управления автомобилями для администратора.
 * Позволяет создавать, редактировать, удалять автомобили и управлять их изображениями.
 * Обеспечивает полный CRUD функционал для автомобилей в каталоге.
 */
const ManageCars = () => {
  // Состояние для хранения списка автомобилей
  const [cars, setCars] = useState([]);

  // Состояние для отображения индикатора загрузки
  const [loading, setLoading] = useState(true);

  // Состояние для глобальных ошибок
  const [globalError, setGlobalError] = useState('');

  // Состояние для сообщений об успешных операциях
  const [successMessage, setSuccessMessage] = useState('');

  // Состояния для управления диалоговыми окнами
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  // Состояние для хранения текущего редактируемого автомобиля
  const [currentCar, setCurrentCar] = useState(null);

  // Состояния для работы с изображениями
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Состояние для формы автомобиля
  const [carForm, setCarForm] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    description: '',
    imageUrl: '',
    isAvailable: true
  });

  // Состояние для ошибок валидации формы
  const [formErrors, setFormErrors] = useState({});

  // Состояние для ошибок при работе с изображениями
  const [imageError, setImageError] = useState('');

  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Эффект для загрузки списка автомобилей при монтировании компонента
   */
  useEffect(() => {
    fetchCars();
  }, []);

  /**
   * Функция для получения списка автомобилей с сервера
   */
  const fetchCars = async () => {
    setLoading(true);
    setGlobalError('');
    try {
      const response = await api.get('/admin/cars');
      const data = response.data;

      // Проверка формата данных
      if (!Array.isArray(data)) {
        throw new Error('Неверный формат данных: ожидается массив автомобилей');
      }

      // Обеспечение корректного статуса доступности для всех автомобилей
      const carsWithCorrectStatus = data.map(car => ({
        ...car,
        isAvailable: car.isAvailable !== undefined ? car.isAvailable : true
      }));
      setCars(carsWithCorrectStatus);
    } catch (err) {
      console.error('Ошибка при получении списка автомобилей:', err);
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Открывает диалоговое окно для добавления нового автомобиля
   */
  const handleOpenAddDialog = () => {
    // Сброс формы до значений по умолчанию
    setCarForm({
      brand: '',
      model: '',
      year: '',
      price: '',
      description: '',
      imageUrl: '',
      isAvailable: true
    });
    setFormErrors({});
    setImageError('');
    setImageFile(null);
    setImagePreview(null);
    setIsAddDialogOpen(true);
  };

  /**
   * Открывает диалоговое окно для редактирования автомобиля
   * @param {Object} car - данные автомобиля для редактирования
   */
  const handleOpenEditDialog = (car) => {
    setCurrentCar(car);
    setCarForm({
      brand: car.brand || '',
      model: car.model || '',
      year: car.year || '',
      price: car.price || '',
      description: car.description || '',
      imageUrl: car.imageUrl || '',
      isAvailable: car.isAvailable
    });
    setFormErrors({});
    setImageError('');
    setIsEditDialogOpen(true);
  };

  /**
   * Открывает диалоговое окно для изменения изображения автомобиля
   * @param {Object} car - данные автомобиля
   */
  const handleOpenImageDialog = (car) => {
    setCurrentCar(car);
    setImagePreview(car.imageUrl);
    setImageFile(null);
    setImageError('');
    setIsImageDialogOpen(true);
  };

  /**
   * Закрывает все диалоговые окна и сбрасывает связанные состояния
   */
  const handleCloseDialogs = () => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsImageDialogOpen(false);
    setCurrentCar(null);
    setFormErrors({});
    setImageFile(null);
    setImagePreview(null);
    setImageError('');
  };

  /**
   * Обрабатывает выбор файла изображения
   * @param {Event} e - событие выбора файла
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Проверка размера файла (максимум 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Файл слишком большой. Максимальный размер - 2MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setImageError('');
    }
  };

  /**
   * Загружает изображение для нового автомобиля
   */
  const handleUploadImageForNewCar = async () => {
    if (!imageFile) {
      setImageError('Выберите файл для загрузки');
      return;
    }

    setImageLoading(true);
    setImageError('');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.post('/admin/cars/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Обновление URL изображения в форме
      setCarForm(prev => ({ ...prev, imageUrl: response.data }));
      setSuccessMessage('Изображение автомобиля успешно загружено');

      // Очистка состояния файла после успешной загрузки
      setImageFile(null);
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err);
      setImageError(err.response?.data?.message || 'Ошибка при загрузке изображения');
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Загружает изображение для существующего автомобиля
   */
  const handleUploadImageForExistingCar = async () => {
    if (!imageFile || !currentCar) return;

    setImageLoading(true);
    setImageError('');

    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await api.post(`/admin/cars/${currentCar.id}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccessMessage('Изображение автомобиля успешно изменено');

      // Обновление изображения в списке автомобилей
      setCars(cars.map(car =>
        car.id === currentCar.id
          ? { ...car, imageUrl: response.data }
          : car
      ));

      handleCloseDialogs();
    } catch (err) {
      console.error('Ошибка при изменении изображения:', err);
      setImageError(err.response?.data?.message || 'Ошибка при изменении изображения');
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Удаляет изображение автомобиля
   */
  const handleDeleteImage = async () => {
    if (!currentCar) return;

    setImageLoading(true);
    setImageError('');

    try {
      const response = await api.delete(`/admin/cars/${currentCar.id}/image`);

      setSuccessMessage('Изображение автомобиля удалено');

      // Обновление изображения в списке автомобилей
      setCars(cars.map(car =>
        car.id === currentCar.id
          ? { ...car, imageUrl: response.data }
          : car
      ));

      setImagePreview(response.data);
    } catch (err) {
      console.error('Ошибка при удалении изображения:', err);
      setImageError(err.response?.data?.message || 'Ошибка при удалении изображения');
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Удаляет изображение у нового автомобиля (только в форме)
   */
  const handleDeleteImageForNewCar = () => {
    setCarForm(prev => ({ ...prev, imageUrl: '' }));
    setImageFile(null);
    setImagePreview(null);
    setImageError('');
  };

  /**
   * Обрабатывает изменение полей формы
   * @param {Event} e - событие изменения
   */
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCarForm(prev => ({ ...prev, [name]: value }));

    // Очистка ошибки для измененного поля
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Обрабатывает изменение состояния чекбокса
   * @param {Event} e - событие изменения
   */
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCarForm(prev => ({ ...prev, [name]: checked }));
  };

  /**
   * Валидирует данные формы автомобиля
   * @returns {boolean} true, если данные валидны
   */
  const validateForm = () => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    // Валидация марки
    if (!carForm.brand.trim()) {
      errors.brand = 'Марка обязательна для заполнения';
    } else if (carForm.brand.length < 2) {
      errors.brand = 'Марка должна содержать минимум 2 символа';
    }

    // Валидация модели
    if (!carForm.model.trim()) {
      errors.model = 'Модель обязательна для заполнения';
    } else if (carForm.model.length < 2) {
      errors.model = 'Модель должна содержать минимум 2 символа';
    }

    // Валидация года выпуска
    const yearValue = parseInt(carForm.year);
    if (!carForm.year) {
      errors.year = 'Год выпуска обязателен для заполнения';
    } else if (isNaN(yearValue)) {
      errors.year = 'Год выпуска должен быть числом';
    } else if (yearValue < 1886 || yearValue > currentYear + 1) {
      errors.year = `Год должен быть в диапазоне от 1886 до ${currentYear + 1}`;
    }

    // Валидация цены
    const priceValue = parseFloat(carForm.price);
    if (!carForm.price) {
      errors.price = 'Цена обязательна для заполнения';
    } else if (isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Цена должна быть положительной';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Добавляет новый автомобиль в каталог
   */
  const handleAddCar = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setGlobalError('');
    setSuccessMessage('');
    try {
      const carData = {
        ...carForm,
        year: parseInt(carForm.year),
        price: parseFloat(carForm.price),
        isAvailable: carForm.isAvailable
      };

      await api.post('/admin/cars/add', carData);
      setSuccessMessage('Автомобиль успешно добавлен в каталог');
      handleCloseDialogs();
      fetchCars();
    } catch (err) {
      console.error('Ошибка при создании автомобиля:', err);
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при создании автомобиля');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Редактирует существующий автомобиль
   */
  const handleEditCar = async () => {
    if (!validateForm() || !currentCar) return;
    setLoading(true);
    setGlobalError('');
    setSuccessMessage('');
    try {
      const carData = {
        ...carForm,
        year: parseInt(carForm.year),
        price: parseFloat(carForm.price),
        isAvailable: carForm.isAvailable
      };

      await api.post(`/admin/cars/${currentCar.id}/edit`, carData);
      setSuccessMessage('Автомобиль успешно обновлен');
      handleCloseDialogs();
      fetchCars();
    } catch (err) {
      console.error('Ошибка при обновлении автомобиля:', err);
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при обновлении автомобиля');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Удаляет автомобиль из каталога
   * @param {number} carId - идентификатор автомобиля
   */
  const handleDeleteCar = async (carId) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот автомобиль? Это действие нельзя отменить.')) {
      return;
    }
    setLoading(true);
    setGlobalError('');
    setSuccessMessage('');
    try {
      await api.delete(`/admin/cars/${carId}/delete`);
      setSuccessMessage('Автомобиль успешно удален');
      fetchCars();
    } catch (err) {
      console.error('Ошибка при удалении автомобиля:', err);
      setGlobalError(err.response?.data?.message || 'Произошла ошибка при удалении автомобиля');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Переходит к детальной странице автомобиля
   * @param {number} carId - идентификатор автомобиля
   */
  const handleViewCar = (carId) => {
    navigate(`/cars/${carId}`);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 3 }, maxWidth: '1200px', mx: 'auto' }}>
      {/* Заголовок и кнопка добавления */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Управление автомобилями
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
          Добавить автомобиль
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

      {/* Содержимое страницы: загрузка или список автомобилей */}
      {loading ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Автомобилей в каталоге пока нет. Нажмите кнопку "Добавить автомобиль", чтобы создать первую запись.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {cars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={car.imageUrl || 'http://localhost:8080/images/carImages/default-car.jpg'}
                    alt={car.brand + ' ' + car.model}
                    sx={{ objectFit: 'cover' }}
                  />
                  {/* Бейдж статуса автомобиля */}
                  <Box sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    bgcolor: car.isAvailable ? 'success.main' : 'error.main',
                    color: 'white',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {car.isAvailable ? 'В наличии' : 'Продан'}
                  </Box>
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {car.brand} {car.model}
                    </Typography>
                    <Box>
                      <Tooltip title="Просмотреть">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewCar(car.id)}
                          size="small"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Редактировать">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenEditDialog(car)}
                          size="small"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Изменить изображение">
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenImageDialog(car)}
                          size="small"
                        >
                          <PhotoCamera fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Удалить">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteCar(car.id)}
                          size="small"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Год выпуска: {car.year}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {car.price.toLocaleString('ru-RU')} ₽
                  </Typography>
                  {car.description && (
                    <Typography variant="body2" color="text.secondary" sx={{
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Диалоговое окно добавления автомобиля */}
      <Dialog
        open={isAddDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Добавить новый автомобиль</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Марка"
                  name="brand"
                  value={carForm.brand}
                  onChange={handleFormChange}
                  error={!!formErrors.brand}
                  helperText={formErrors.brand}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Модель"
                  name="model"
                  value={carForm.model}
                  onChange={handleFormChange}
                  error={!!formErrors.model}
                  helperText={formErrors.model}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Год выпуска"
                  name="year"
                  value={carForm.year}
                  onChange={handleFormChange}
                  error={!!formErrors.year}
                  helperText={formErrors.year}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Цена (₽)"
                  name="price"
                  value={carForm.price}
                  onChange={handleFormChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
              </Grid>

              {/* Секция загрузки изображения для нового автомобиля */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <Avatar
                    src={carForm.imageUrl || imagePreview || 'http://localhost:8080/images/carImages/default-car.jpg'}
                    alt="Предпросмотр изображения"
                    sx={{
                      width: 200,
                      height: 120,
                      mb: 2,
                      border: '2px solid',
                      borderColor: (carForm.imageUrl || imagePreview) ? theme.palette.success.main : theme.palette.grey[400],
                      objectFit: 'cover'
                    }}
                    variant="rounded"
                  />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 1 }}>
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<PhotoCamera />}
                      disabled={imageLoading}
                    >
                      {imageLoading ? 'Загрузка...' : 'Выбрать файл'}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </Button>
                    {imageFile && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUploadImageForNewCar}
                        disabled={imageLoading}
                        sx={{
                          bgcolor: theme.palette.success.main,
                          '&:hover': { bgcolor: theme.palette.success.dark }
                        }}
                      >
                        {imageLoading ? 'Загрузка...' : 'Загрузить'}
                      </Button>
                    )}
                    {(carForm.imageUrl || imagePreview) && (
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={handleDeleteImageForNewCar}
                        disabled={imageLoading}
                      >
                        Удалить
                      </Button>
                    )}
                  </Box>
                  {imageError && (
                    <Alert severity="error" sx={{ mt: 1, width: '100%' }}>
                      {imageError}
                    </Alert>
                  )}
                  {carForm.imageUrl && (
                    <Typography variant="caption" color="text.secondary">
                      Изображение загружено: {carForm.imageUrl.substring(carForm.imageUrl.lastIndexOf('/') + 1)}
                    </Typography>
                  )}
                  {!carForm.imageUrl && !imagePreview && (
                    <Typography variant="caption" color="text.secondary">
                      Будет использовано изображение по умолчанию
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Описание"
                  name="description"
                  value={carForm.description}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAvailable"
                      checked={carForm.isAvailable}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Автомобиль доступен для покупки"
                />
              </Grid>
            </Grid>
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
            onClick={handleAddCar}
            variant="contained"
            startIcon={<Save />}
            sx={{
              bgcolor: theme.palette.success.main,
              '&:hover': { bgcolor: theme.palette.success.dark }
            }}
            disabled={loading || imageLoading}
          >
            {loading ? 'Добавление...' : 'Добавить'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Диалоговое окно редактирования автомобиля */}
      <Dialog
        open={isEditDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Редактировать автомобиль</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Марка"
                  name="brand"
                  value={carForm.brand}
                  onChange={handleFormChange}
                  error={!!formErrors.brand}
                  helperText={formErrors.brand}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Модель"
                  name="model"
                  value={carForm.model}
                  onChange={handleFormChange}
                  error={!!formErrors.model}
                  helperText={formErrors.model}
                  fullWidth
                  margin="normal"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Год выпуска"
                  name="year"
                  value={carForm.year}
                  onChange={handleFormChange}
                  error={!!formErrors.year}
                  helperText={formErrors.year}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Цена (₽)"
                  name="price"
                  value={carForm.price}
                  onChange={handleFormChange}
                  error={!!formErrors.price}
                  helperText={formErrors.price}
                  fullWidth
                  margin="normal"
                  type="number"
                  required
                />
              </Grid>

              {/* Секция отображения текущего изображения */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                  <Avatar
                    src={carForm.imageUrl || 'http://localhost:8080/images/carImages/default-car.jpg'}
                    alt="Предпросмотр изображения"
                    sx={{
                      width: 200,
                      height: 120,
                      mb: 2,
                      border: '2px solid',
                      borderColor: carForm.imageUrl && !carForm.imageUrl.includes('default-car')
                        ? theme.palette.success.main
                        : theme.palette.grey[400],
                      objectFit: 'cover'
                    }}
                    variant="rounded"
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    {carForm.imageUrl && !carForm.imageUrl.includes('default-car')
                      ? 'Текущее изображение автомобиля'
                      : 'Используется изображение по умолчанию'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                    Для изменения изображения используйте кнопку в карточке автомобиля
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Описание"
                  name="description"
                  value={carForm.description}
                  onChange={handleFormChange}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAvailable"
                      checked={carForm.isAvailable}
                      onChange={handleCheckboxChange}
                      color="primary"
                    />
                  }
                  label="Автомобиль доступен для покупки"
                />
              </Grid>
            </Grid>
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
            onClick={handleEditCar}
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

      {/* Диалоговое окно изменения изображения автомобиля */}
      <Dialog
        open={isImageDialogOpen}
        onClose={handleCloseDialogs}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Изменение изображения автомобиля: {currentCar?.brand} {currentCar?.model}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Avatar
              src={imagePreview || 'http://localhost:8080/images/carImages/default-car.jpg'}
              alt={currentCar?.brand + ' ' + currentCar?.model}
              sx={{
                width: 300,
                height: 180,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: theme.palette.primary.main,
                objectFit: 'cover'
              }}
              variant="rounded"
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 2 }}>
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCamera />}
                disabled={imageLoading}
              >
                Выбрать файл
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteImage}
                disabled={imageLoading || !currentCar?.imageUrl ||
                         currentCar?.imageUrl.includes('default-car')}
              >
                Удалить
              </Button>
            </Box>

            {imageFile && (
              <Typography variant="body2" color="text.secondary">
                Выбран файл: {imageFile.name}
              </Typography>
            )}

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
              Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 2MB
            </Typography>
            {imageError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {imageError}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialogs}
            disabled={imageLoading}
          >
            Отменить
          </Button>
          <Button
            onClick={handleUploadImageForExistingCar}
            variant="contained"
            disabled={!imageFile || imageLoading}
            sx={{
              bgcolor: theme.palette.success.main,
              '&:hover': { bgcolor: theme.palette.success.dark }
            }}
          >
            {imageLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManageCars;