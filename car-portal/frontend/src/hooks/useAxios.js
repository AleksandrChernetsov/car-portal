import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * Кастомный хук для работы с HTTP-запросами через axios.
 * Предоставляет методы для выполнения запросов с обработкой состояния загрузки и ошибок.
 */
export const useAxios = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Выполняет GET-запрос.
   */
  const get = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при выполнении запроса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Выполняет POST-запрос.
   */
  const post = useCallback(async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при выполнении запроса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Выполняет PUT-запрос.
   */
  const put = useCallback(async (url, data, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при выполнении запроса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Выполняет DELETE-запрос.
   */
  const del = useCallback(async (url, config = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при выполнении запроса');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get,
    post,
    put,
    del,
    resetError: () => setError(null)
  };
};

export default useAxios;