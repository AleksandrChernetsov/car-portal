import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  useTheme
} from '@mui/material';
import { CheckCircle, Error, Info, Warning } from '@mui/icons-material';

/**
 * Компонент модального окна.
 * Поддерживает различные типы модальных окон (успех, ошибка, предупреждение, информация).
 */
const Modal = ({
  open,
  onClose,
  title,
  children,
  actions,
  type = 'default',
  disableBackdropClick = false,
  disableEscapeKeyDown = false
}) => {
  const theme = useTheme();

  /**
   * Возвращает иконку в зависимости от типа модального окна.
   */
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle sx={{ fontSize: 48, color: theme.palette.success.main }} />;
      case 'error':
        return <Error sx={{ fontSize: 48, color: theme.palette.error.main }} />;
      case 'warning':
        return <Warning sx={{ fontSize: 48, color: theme.palette.warning.main }} />;
      case 'info':
        return <Info sx={{ fontSize: 48, color: theme.palette.info.main }} />;
      default:
        return null;
    }
  };

  /**
   * Возвращает стили заголовка в зависимости от типа.
   */
  const getTitleStyle = () => {
    switch (type) {
      case 'success':
        return { color: theme.palette.success.main };
      case 'error':
        return { color: theme.palette.error.main };
      case 'warning':
        return { color: theme.palette.warning.main };
      case 'info':
        return { color: theme.palette.info.main };
      default:
        return {};
    }
  };

  /**
   * Возвращает стили контейнера для иконки.
   */
  const getIconContainerStyle = () => {
    switch (type) {
      case 'success':
      case 'error':
      case 'warning':
      case 'info':
        return {
          display: 'flex',
          justifyContent: 'center',
          mb: 2
        };
      default:
        return {};
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableBackdropClick={disableBackdropClick}
      disableEscapeKeyDown={disableEscapeKeyDown}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ textAlign: 'center', ...getTitleStyle() }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Box sx={getIconContainerStyle()}>
          {getIcon()}
        </Box>
        {typeof children === 'string' ? (
          <Typography variant="body1" sx={{ textAlign: 'center' }}>
            {children}
          </Typography>
        ) : (
          children
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
        {actions || (
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: type === 'error' ? theme.palette.error.main : theme.palette.primary.main,
              '&:hover': {
                bgcolor: type === 'error' ? theme.palette.error.dark : theme.palette.primary.dark
              }
            }}
          >
            ОК
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Modal;