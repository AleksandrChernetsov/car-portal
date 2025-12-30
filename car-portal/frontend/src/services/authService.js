import api from './api';

/**
 * Сервис для работы с аутентификацией.
 * Содержит методы для входа, регистрации и управления профилем пользователя.
 */

/**
 * Выполняет вход пользователя в систему.
 * @param {Object} credentials - учетные данные пользователя
 * @returns {Promise} результат входа
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при входе в систему');
  }
};

/**
 * Регистрирует нового пользователя.
 * @param {Object} userData - данные для регистрации
 * @returns {Promise} результат регистрации
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при регистрации');
  }
};

/**
 * Проверяет статус аутентификации пользователя.
 * @returns {Promise} статус аутентификации
 */
export const checkAuth = async () => {
  try {
    const response = await api.get('/user/checklogin');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при проверке аутентификации');
  }
};

/**
 * Выполняет выход пользователя из системы.
 * @returns {Promise} результат выхода
 */
export const logout = async () => {
  try {
    await api.get('/user/logout');
    return true;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при выходе из системы');
  }
};

/**
 * Получает данные профиля пользователя.
 * @returns {Promise} данные профиля
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/user/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при получении данных профиля');
  }
};

/**
 * Обновляет данные профиля пользователя.
 * @param {Object} profileData - обновленные данные профиля
 * @returns {Promise} обновленные данные профиля
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.post('/user/edit', profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при обновлении профиля');
  }
};

/**
 * Загружает новый аватар пользователя.
 * @param {File} file - файл изображения
 * @returns {Promise} URL загруженного аватара
 */
export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/user/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при загрузке аватара');
  }
};

/**
 * Удаляет текущий аватар пользователя.
 * @returns {Promise} URL аватара по умолчанию
 */
export const deleteAvatar = async () => {
  try {
    const response = await api.delete('/user/avatar');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Ошибка при удалении аватара');
  }
};