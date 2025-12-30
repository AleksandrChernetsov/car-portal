import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';

/**
 * Компонент формы аутентификации.
 * Обертка для форм входа и регистрации с единым стилем оформления.
 */
const AuthForm = ({ title, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      p: 2,
      backgroundColor: theme.palette.background.default
    }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, md: 4 },
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%'
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
            {title}
          </Typography>
        </Box>
        {children}
      </Paper>
    </Box>
  );
};

export default AuthForm;