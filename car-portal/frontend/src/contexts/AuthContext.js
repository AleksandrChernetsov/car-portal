import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import api from '../services/api';

/**
 * Контекст аутентификации.
 * Предоставляет глобальный доступ к данным пользователя и методам авторизации.
 */
const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => Promise.reject(new Error('Auth not initialized')),
  logout: () => {},
  register: () => Promise.reject(new Error('Auth not initialized')),
  checkAuth: () => Promise.reject(new Error('Auth not initialized')),
  uploadAvatar: () => Promise.reject(new Error('Auth not initialized')),
});

/**
 * Провайдер контекста аутентификации.
 * Управляет состоянием аутентификации пользователя во всем приложении.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Проверяет статус аутентификации пользователя.
   * Вызывается при загрузке приложения и при необходимости обновления данных.
   */
  const checkAuth = useCallback(async () => {
    try {
      console.log("Проверка аутентификации...");
      const response = await api.get('/user/checklogin');
      console.log("Данные пользователя получены:", response.data);

      setUser(response.data);
      setIsAuthenticated(true);

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.log("Пользователь не авторизован:", error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Загружает данные пользователя из localStorage при инициализации.
   */
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    checkAuth();
  }, [checkAuth]);

  /**
   * Выполняет вход пользователя в систему.
   */
  const login = useCallback(async (credentials) => {
    const response = await api.post('/user/login', credentials);
    setUser(response.data);
    setIsAuthenticated(true);
    return response.data;
  }, []);

  /**
   * Выполняет выход пользователя из системы.
   */
  const logout = useCallback(async () => {
    await api.get('/user/logout');
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('auth_token');
  }, []);

  /**
   * Регистрирует нового пользователя.
   */
  const register = useCallback(async (userData) => {
    const response = await api.post('/user/signup', userData);
    return response.data;
  }, []);

  /**
   * Загружает аватар пользователя.
   */
  const uploadAvatar = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser(prev => {
        if (prev) {
          return { ...prev, avatar: response.data };
        }
        return prev;
      });

      const updatedUser = await checkAuth();
      return updatedUser.avatar || response.data;
    } catch (error) {
      console.error('Ошибка при загрузке аватара:', error);
      throw error;
    }
  }, [checkAuth]);

  /**
   * Мемоизированное значение контекста для оптимизации производительности.
   */
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    checkAuth,
    uploadAvatar,
  }), [user, isAuthenticated, isLoading, login, logout, register, checkAuth, uploadAvatar]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * Хук для использования контекста аутентификации.
 * @throws {Error} Если используется вне AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthContext };