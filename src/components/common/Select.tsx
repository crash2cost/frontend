import React from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Select.module.css';
import type { SelectProps } from './Select.types';

export const Select: React.FC<SelectProps> = ({
  label,
  icon: Icon,
  error,
  className = '',
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}

      <div className={styles.selectWrapper}>
        {Icon && <Icon size={18} className={styles.icon} />}
        <select
          className={`${styles.select} ${Icon ? styles.withIcon : ''} ${error ? styles.hasError : ''} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className={styles.chevron} />
      </div>

      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  );
};
