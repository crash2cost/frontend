import React from 'react';
import type { LucideIcon } from 'lucide-react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, icon: Icon, error, className = '', ...props }) => {
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
          className={`${styles.input} ${Icon ? styles.withIcon : ''} ${error ? styles.hasError : ''} ${className}`}
          {...props}
        />
      </div>
      
      {error && (
        <span className={styles.errorMessage}>
          {error}
        </span>
      )}
    </div>
  );
};