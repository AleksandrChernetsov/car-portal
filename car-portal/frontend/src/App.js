import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/home/HomePage';
import CarCatalog from './pages/car/CarCatalog';
import CarDetail from './pages/car/CarDetail';
import News from './pages/news/News';
import NewsDetail from './pages/news/NewsDetail';
import LoginPage from './pages/user/LoginPage';
import RegistrationPage from './pages/user/RegistrationPage';
import ProfilePage from './pages/profile/ProfilePage';
import FavoritesPage from './pages/favorites/FavoritesPage';
import NewsManagement from './pages/moderator/NewsManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCars from './pages/admin/ManageCars';
import ManageUsers from './pages/admin/ManageUsers';
import ContactsPage from './pages/contacts/ContactsPage';
import NotFound from './pages/notFound/NotFound';
import './styles/index.css';

/**
 * Основной компонент приложения.
 * Определяет маршрутизацию, тему и провайдеры контекста.
 */

/**
 * Внутренний компонент для отображения контента с проверкой аутентификации.
 */
function AppContent() {
  const { checkAuth, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading || isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars" element={<CarCatalog />} />
          <Route path="/cars/:id" element={<CarDetail />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
          <Route path="/moderator/news" element={<RoleRoute allowedRoles={['MODERATOR', 'ADMIN']}><NewsManagement /></RoleRoute>} />
          <Route path="/admin" element={<RoleRoute allowedRoles={['ADMIN']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/cars" element={<RoleRoute allowedRoles={['ADMIN']}><ManageCars /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute allowedRoles={['ADMIN']}><ManageUsers /></RoleRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

/**
 * Компонент для защиты маршрутов, требующих аутентификации.
 */
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) {
    window.location.href = '/login';
    return null;
  }
  return children;
}

/**
 * Компонент для защиты маршрутов по ролям пользователя.
 */
function RoleRoute({ allowedRoles, children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!user || !allowedRoles.includes(user.role)) {
    window.location.href = '/';
    return null;
  }
  return children;
}

/**
 * Основная функция App, инициализирующая приложение.
 */
function App() {
  const theme = createTheme({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { default: '#f5f5f5', paper: '#ffffff' },
    },
    typography: {
      fontFamily: 'Roboto, Arial, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;