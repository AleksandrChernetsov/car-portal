import React from 'react';
import { Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CarCatalog from './pages/CarCatalog';
import CarDetail from './pages/CarDetail';
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import LoginPage from './pages/user/LoginPage';
import RegistrationPage from './pages/user/RegistrationPage';
import ProfilePage from './pages/profile/ProfilePage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import NewsManagement from './pages/moderator/NewsManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageUsers from './pages/admin/ManageUsers';
import NotFound from './pages/NotFound';
import { useAuth } from './hooks/useAuth';

/**
 * Определяет маршруты приложения.
 * Экспортирует конфигурацию маршрутов для использования в компонентах.
 */

/**
 * Компонент для защиты маршрутов для аутентифицированных пользователей.
 * @param {Object} children - дочерние компоненты
 * @returns {JSX.Element} защищенный маршрут или редирект на страницу входа
 */
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

/**
 * Компонент для защиты маршрутов по ролям.
 * @param {string[]} allowedRoles - разрешенные роли
 * @param {Object} children - дочерние компоненты
 * @returns {JSX.Element} защищенный маршрут или редирект на главную страницу
 */
export const RoleRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Конфигурация маршрутов приложения.
 */
export const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/cars', element: <CarCatalog /> },
  { path: '/cars/:id', element: <CarDetail /> },
  { path: '/news', element: <News /> },
  { path: '/news/:id', element: <NewsDetail /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegistrationPage /> },
  {
    path: '/profile',
    element: (
      <PrivateRoute>
        <ProfilePage />
      </PrivateRoute>
    )
  },
  {
    path: '/favorites',
    element: (
      <PrivateRoute>
        <FavoritesPage />
      </PrivateRoute>
    )
  },
  {
    path: '/moderator/news',
    element: (
      <RoleRoute allowedRoles={['MODERATOR', 'ADMIN']}>
        <NewsManagement />
      </RoleRoute>
    )
  },
  {
    path: '/admin',
    element: (
      <RoleRoute allowedRoles={['ADMIN']}>
        <AdminDashboard />
      </RoleRoute>
    )
  },
  {
    path: '/admin/cars',
    element: (
      <RoleRoute allowedRoles={['ADMIN']}>
        <ManageCars />
      </RoleRoute>
    )
  },
  {
    path: '/admin/users',
    element: (
      <RoleRoute allowedRoles={['ADMIN']}>
        <ManageUsers />
      </RoleRoute>
    )
  },
  { path: '*', element: <NotFound /> },
];

export default routes;