import React from 'react';
import { X } from 'lucide-react';
import styles from './Toast.module.css';

type ToastVariant = 'error' | 'success' | 'info';

interface ToastProps {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, variant = 'info', onClose }) => {
  return (
    <div className={`${styles.toast} ${styles[variant]}`} role="status" aria-live="polite">
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
