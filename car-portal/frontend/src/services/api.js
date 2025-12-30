import axios from 'axios';
import Cookies from 'js-cookie';

/**
 * Конфигурация HTTP-клиента для работы с API.
 * Настраивает базовые параметры, обработку токенов авторизации и перехватчики.
 */

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  withCredentials: true,
  timeout: 15000,
});

// Флаг для предотвращения множественных проверок аутентификации
let isRefreshing = false;
let failedQueue = [];

/**
 * Обрабатывает очередь запросов, ожидающих обновления токена.
 */
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Добавляем перехватчик запросов для установки токена авторизации
api.interceptors.request.use(config => {
  const token = Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Добавляем заголовок для предотвращения кэширования
  config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  config.headers['Pragma'] = 'no-cache';
  config.headers['Expires'] = '0';

  return config;
}, error => {
  return Promise.reject(error);
});

// Добавляем перехватчик ответов для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    const originalRequest = error.config;

    // Если ошибка 401 и это не запрос на проверку логина
    if (error.response?.status === 401 && !originalRequest.url.includes('/user/checklogin')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      isRefreshing = true;

      // Пробуем проверить аутентификацию
      return api.get('/user/checklogin')
        .then(response => {
          // Если проверка прошла успешно, повторяем исходный запрос
          processQueue(null, response.data);
          return api(originalRequest);
        })
        .catch(refreshError => {
          // Если проверка не удалась, очищаем данные аутентификации
          processQueue(refreshError, null);
          Cookies.remove('auth_token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth_checked');
          sessionStorage.clear();

          // Если мы на странице, требующей аутентификации, перенаправляем на логин
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    // Для других ошибок возвращаем детальную информацию
    if (error.response?.data) {
      return Promise.reject({
        response: {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers
        },
        config: error.config,
        request: error.request,
        message: error.message
      });
    }

    return Promise.reject(error);
  }
);

// Добавляем специальный метод для получения времени сервера
api.getServerTime = async () => {
  try {
    // Прямой запрос без использования axios для обхода CORS-проблем
    const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}/time`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status}`);
    }

    return await response.text();
  } catch (error) {
    console.warn('Ошибка при получении времени через fetch:', error);
    // Возвращаем клиентское время как резервный вариант
    return new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }
};

// Метод для безопасного выполнения запросов с обработкой ошибок аутентификации
api.safeGet = async (url, config = {}) => {
  try {
    const response = await api.get(url, config);
    return response.data;
  } catch (error) {
    // Если ошибка аутентификации, пробуем проверить статус
    if (error.response?.status === 401) {
      try {
        // Пробуем проверить аутентификацию
        await api.get('/user/checklogin');
        // Если успешно, повторяем запрос
        const retryResponse = await api.get(url, config);
        return retryResponse.data;
      } catch (authError) {
        // Если проверка не удалась, пробрасываем оригинальную ошибку
        throw error;
      }
    }
    throw error;
  }
};

export default api;