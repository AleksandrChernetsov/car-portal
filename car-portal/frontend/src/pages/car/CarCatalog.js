import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  Pagination,
  LinearProgress,
  useTheme,
  Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CarCard } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

/**
 * Компонент каталога автомобилей.
 * Отображает список автомобилей с фильтрацией по марке, цене и поиском.
 * Поддерживает пагинацию и добавление в избранное.
 */
const CarCatalog = () => {
  const [cars, setCars] = useState([]);
  const [originalCars, setOriginalCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    itemsPerPage: 9
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const { isAuthenticated } = useAuth();

  /**
   * Загружает автомобили и избранное при монтировании компонента.
   */
  useEffect(() => {
    fetchCars();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated]);

  /**
   * Извлекает уникальные марки автомобилей из списка.
   */
  useEffect(() => {
    const uniqueBrands = [...new Set(cars.map(car => car.brand))];
    setBrands(uniqueBrands);
  }, [cars]);

  /**
   * Получает список автомобилей с сервера.
   */
  const fetchCars = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/cars/catalog');
      const data = response.data;

      if (!Array.isArray(data)) {
        throw new Error('Неверный формат данных: ожидается массив автомобилей');
      }

      setCars(data);
      setOriginalCars(data);
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(data.length / prev.itemsPerPage)
      }));
    } catch (error) {
      console.error('Ошибка при получении автомобилей:', error);
      setError(error.response?.data?.message || 'Произошла ошибка при загрузке автомобилей');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Получает список избранных автомобилей для авторизованного пользователя.
   */
  const fetchFavorites = async () => {
    try {
      const response = await api.get('/favorites');
      const favoriteIds = new Set(response.data.map(car => car.id));
      setFavorites(favoriteIds);
    } catch (error) {
      console.error('Ошибка при получении избранных:', error);
    }
  };

  /**
   * Применяет фильтры к списку автомобилей.
   */
  const applyFilters = () => {
    let filteredCars = [...originalCars];

    // Поиск по названию или описанию
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filteredCars = filteredCars.filter(car =>
        car.brand.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm) ||
        (car.description && car.description.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.brand) {
      filteredCars = filteredCars.filter(car => car.brand === filters.brand);
    }

    if (filters.minPrice || filters.maxPrice) {
      const minPrice = filters.minPrice ? parseFloat(filters.minPrice) : 0;
      const maxPrice = filters.maxPrice ? parseFloat(filters.maxPrice) : Infinity;

      filteredCars = filteredCars.filter(car =>
        car.price >= minPrice && car.price <= maxPrice
      );
    }

    setCars(filteredCars);
    setPagination(prev => ({
      ...prev,
      totalPages: Math.ceil(filteredCars.length / prev.itemsPerPage)
    }));
  };

  /**
   * Обрабатывает изменение фильтров.
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  /**
   * Обрабатывает изменение страницы пагинации.
   */
  const handlePageChange = (event, page) => {
    setPagination(prev => ({ ...prev, page }));
  };

  /**
   * Обрабатывает переключение состояния избранного.
   */
  const handleFavoriteToggle = (carId, isFavorite) => {
    const newFavorites = new Set(favorites);
    if (isFavorite) {
      newFavorites.add(carId);
    } else {
      newFavorites.delete(carId);
    }
    setFavorites(newFavorites);
  };

  /**
   * Сбрасывает все фильтры.
   */
  const handleClearFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      search: ''
    });
    setCars([...originalCars]);
    setPagination(prev => ({
      ...prev,
      page: 1,
      totalPages: Math.ceil(originalCars.length / prev.itemsPerPage)
    }));
  };

  /**
   * Переходит к детальной странице автомобиля.
   */
  const handleCarClick = (carId) => {
    navigate(`/cars/${carId}`);
  };

  /**
   * Получает автомобили для текущей страницы пагинации.
   */
  const paginatedCars = cars.slice(
    (pagination.page - 1) * pagination.itemsPerPage,
    pagination.page * pagination.itemsPerPage
  );

  return (
    <Box sx={{ p: { xs: 1, md: 3 } }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center' }}>
        Каталог автомобилей
      </Typography>

      {/* Панель фильтров */}
      <Box className="filters-container" sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Поиск"
              value={filters.search}
              onChange={(e) => handleFilterChange({ ...filters, search: e.target.value })}
              placeholder="Поиск по марке, модели..."
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Марка</InputLabel>
              <Select
                value={filters.brand}
                label="Марка"
                onChange={(e) => handleFilterChange({ ...filters, brand: e.target.value })}
              >
                <MenuItem value="">Все марки</MenuItem>
                {brands.map((brand) => (
                  <MenuItem key={brand} value={brand}>{brand}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Мин. цена"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange({ ...filters, minPrice: e.target.value })}
              placeholder="От"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Макс. цена"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange({ ...filters, maxPrice: e.target.value })}
              placeholder="До"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={applyFilters}
              sx={{
                flexGrow: 1,
                bgcolor: theme.palette.primary.main,
                '&:hover': { bgcolor: theme.palette.primary.dark }
              }}
            >
              Применить фильтры
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              sx={{
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                '&:hover': {
                  bgcolor: theme.palette.primary.light,
                  borderColor: theme.palette.primary.dark
                }
              }}
            >
              Сбросить
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Список автомобилей */}
      {loading ? (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress />
        </Box>
      ) : paginatedCars.length === 0 ? (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <Typography variant="h6" color="text.secondary">
            По вашему запросу ничего не найдено
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={handleClearFilters}
          >
            Сбросить фильтры
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {paginatedCars.map((car) => (
            <Grid item key={car.id} xs={12} sm={6} md={4}>
              <CarCard
                car={car}
                onCarClick={() => handleCarClick(car.id)}
                onFavoriteToggle={handleFavoriteToggle}
                isFavorite={favorites.has(car.id)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Пагинация */}
      {cars.length > pagination.itemsPerPage && (
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

export default CarCatalog;