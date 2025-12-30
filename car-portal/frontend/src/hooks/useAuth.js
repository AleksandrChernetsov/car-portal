import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Кастомный хук для доступа к контексту аутентификации.
 * Упрощает использование контекста в компонентах.
 * @returns {Object} Данные и методы аутентификации
 * @throws {Error} Если используется вне AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;