import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './Button.module.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  disabled,
  className = '',
  ...props 
}) => {
  const variantClass = variant === 'secondary' ? styles.secondary : styles.primary;

  return (
    <button 
      disabled={isLoading || disabled}
      className={`${styles.button} ${variantClass} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className={styles.loader} size={18} />}
      {children}
    </button>
  );
};