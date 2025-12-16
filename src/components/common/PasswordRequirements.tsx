import React from 'react';
import { Check, X } from 'lucide-react';
import styles from './PasswordRequirements.module.css';

interface PasswordRequirementsProps {
  password: string;
  show?: boolean;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    label: 'At least 6 characters',
    test: (pwd) => pwd.length >= 6
  },
  {
    label: 'Maximum 16 characters',
    test: (pwd) => pwd.length <= 16
  },
  {
    label: 'Contains uppercase letter (A-Z)',
    test: (pwd) => /[A-Z]/.test(pwd)
  },
  {
    label: 'Contains lowercase letter (a-z)',
    test: (pwd) => /[a-z]/.test(pwd)
  },
  {
    label: 'Contains number (0-9)',
    test: (pwd) => /\d/.test(pwd)
  },
  {
    label: 'Contains special character (!@#$...)',
    test: (pwd) => /[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]/.test(pwd)
  }
];

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password, show = true }) => {
  if (!show) return null;

  return (
    <div className={styles.container}>
      <p className={styles.title}>Password Requirements:</p>
      <ul className={styles.list}>
        {requirements.map((req) => {
          const isMet = req.test(password);
          return (
            <li 
              key={req.label} 
              className={`${styles.requirement} ${isMet ? styles.met : styles.unmet}`}
            >
              <span className={styles.icon}>
                {isMet ? <Check size={16} /> : <X size={16} />}
              </span>
              <span className={styles.label}>{req.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
