import api from './api';

/**
 * Сервис для работы с автомобилями.
 * Содержит методы для получения данных о каталоге автомобилей.
 */

/**
 * Получает все автомобили в каталоге.
 * @returns {Promise} список автомобилей
 */
export const getAllCars = async () => {
  try {
    const response = await api.get('/cars/catalog');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении каталога автомобилей');
  }
};

/**
 * Получает автомобиль по идентификатору.
 * @param {number} id - идентификатор автомобиля
 * @returns {Promise} данные автомобиля
 */
export const getCarById = async (id) => {
  try {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении данных автомобиля');
  }
};

/**
 * Получает автомобили по марке.
 * @param {string} brand - марка автомобиля
 * @returns {Promise} список автомобилей указанной марки
 */
export const getCarsByBrand = async (brand) => {
  try {
    const response = await api.get(`/cars/brand/${brand}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении автомобилей по марке');
  }
};

/**
 * Получает автомобили в указанном ценовом диапазоне.
 * @param {number} minPrice - минимальная цена
 * @param {number} maxPrice - максимальная цена
 * @returns {Promise} список автомобилей в указанном ценовом диапазоне
 */
export const getCarsByPriceRange = async (minPrice, maxPrice) => {
  try {
    const response = await api.get('/cars/price-range', {
      params: { minPrice, maxPrice }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении автомобилей по ценовому диапазону');
  }
};

/**
 * Добавляет автомобиль в избранное.
 * @param {number} carId - идентификатор автомобиля
 * @returns {Promise} результат добавления
 */
export const addToFavorites = async (carId) => {
  try {
    const response = await api.post(`/favorites/add/${carId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при добавлении в избранное');
  }
};

/**
 * Удаляет автомобиль из избранного.
 * @param {number} carId - идентификатор автомобиля
 * @returns {Promise} результат удаления
 */
export const removeFromFavorites = async (carId) => {
  try {
    const response = await api.delete(`/favorites/remove/${carId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при удалении из избранного');
  }
};

/**
 * Проверяет, находится ли автомобиль в избранном.
 * @param {number} carId - идентификатор автомобиля
 * @returns {Promise} true, если автомобиль в избранном, иначе false
 */
export const isFavorite = async (carId) => {
  try {
    const response = await api.get(`/favorites/check/${carId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при проверке избранного');
  }
};