import React from 'react';
import { 
  Box, 
  Typography, 
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Home } from '@mui/icons-material';

/**
 * Компонент страницы "Не найдено".
 * Отображается при попытке доступа к несуществующему маршруту.
 */
const NotFound = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  /**
   * Возвращает на главную страницу.
   */
  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '80vh', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h1" sx={{ fontWeight: 'bold', fontSize: { xs: '4rem', md: '6rem' }, color: theme.palette.primary.main }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 2, mb: 1 }}>
        Страница не найдена
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        К сожалению, запрашиваемая вами страница не существует или была перемещена.
      </Typography>
      <Button
        variant="contained"
        startIcon={<Home />}
        onClick={handleGoHome}
        sx={{ 
          py: 1.5,
          px: 4,
          bgcolor: theme.palette.primary.main,
          '&:hover': { bgcolor: theme.palette.primary.dark }
        }}
      >
        Вернуться на главную
      </Button>
    </Box>
  );
};

export default NotFound;