import api from './api';

/**
 * Сервис для работы с пользователями.
 * Содержит методы для получения данных о пользователях и управления ими.
 */

/**
 * Получает данные профиля пользователя по идентификатору.
 * @param {number} userId - идентификатор пользователя
 * @returns {Promise} данные профиля
 */
export const getUserProfile = async (userId) => {
  try {
    const response = await api.get(`/user/profile/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении данных профиля');
  }
};

/**
 * Получает всех пользователей (только для администраторов).
 * @returns {Promise} список пользователей
 */
export const getAllUsers = async () => {
  try {
    const response = await api.get('/admin/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении списка пользователей');
  }
};

/**
 * Редактирует данные пользователя (только для администраторов).
 * @param {number} userId - идентификатор пользователя
 * @param {Object} userData - обновленные данные пользователя
 * @returns {Promise} обновленные данные пользователя
 */
export const editUser = async (userId, userData) => {
  try {
    const response = await api.post(`/admin/users/${userId}/edit`, userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при обновлении данных пользователя');
  }
};

/**
 * Удаляет пользователя (только для администраторов).
 * @param {number} userId - идентификатор пользователя
 * @returns {Promise} результат удаления
 */
export const deleteUser = async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}/delete`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при удалении пользователя');
  }
};

/**
 * Добавляет нового пользователя (только для администраторов).
 * @param {Object} userData - данные нового пользователя
 * @returns {Promise} данные созданного пользователя
 */
export const addUser = async (userData) => {
  try {
    const response = await api.post('/admin/users/add', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при создании пользователя');
  }
};