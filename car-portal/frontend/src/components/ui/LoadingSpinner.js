import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * Компонент индикатора загрузки.
 * Отображает круговой индикатор с опциональным текстом сообщения.
 */
const LoadingSpinner = ({ message = 'Загрузка...' }) => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 3
    }}>
      <CircularProgress size={40} />
      {message && (
        <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;