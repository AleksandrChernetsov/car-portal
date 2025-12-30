import api from './api';

/**
 * Сервис для работы с избранными автомобилями.
 * Содержит методы для добавления, удаления и проверки избранных автомобилей.
 */

/**
 * Получает список избранных автомобилей текущего пользователя.
 * @returns {Promise} список избранных автомобилей
 */
export const getFavorites = async () => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении избранных автомобилей');
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
 * Проверяет, находится ли автомобиль в избранном у текущего пользователя.
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