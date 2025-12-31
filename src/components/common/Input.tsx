import React, { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>
        {label}
      </label>
      
      <div className={styles.inputWrapper}>
        {Icon && (
          <Icon 
            size={18} 
            className={styles.icon}
          />
        )}
        <input
          className={`${styles.input} ${Icon ? styles.withIcon : ''} ${error ? styles.hasError : ''} ${isPasswordField ? styles.withToggle : ''} ${className}`}
          type={isPasswordField && showPassword ? 'text' : type}
          {...props}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles.togglePassword}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      
      {error && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};
