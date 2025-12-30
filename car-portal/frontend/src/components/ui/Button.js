import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/material/styles';

/**
 * Стилизованный компонент Button.
 * Расширяет стандартный MUI Button с кастомизированными стилями.
 */
const StyledButton = styled(MuiButton)(({ theme, variant = 'contained' }) => ({
  borderRadius: '4px',
  textTransform: 'none',
  fontWeight: 500,
  padding: '8px 16px',
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
      borderColor: theme.palette.primary.dark,
    },
  }),
  ...(variant === 'text' && {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.08)',
    },
  }),
}));

/**
 * Кастомная кнопка с предопределенными стилями.
 * @param {Object} props - Свойства кнопки
 * @param {ReactNode} props.children - Содержимое кнопки
 * @returns {JSX.Element} Стилизованная кнопка
 */
const Button = ({ children, ...props }) => {
  return (
    <StyledButton {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;