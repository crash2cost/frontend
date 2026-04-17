import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks';
import { api } from '../../api';
import { Button, Input } from '../../components/common';
import { User, Lock, AlertCircle, Car, Sparkles, Shield, Zap } from 'lucide-react';
import type { AuthResponse } from '../../types';
import styles from './Login.module.css';
import { API_ROUTES, ERRORS, UI_TEXT } from '../../components/common/constants/constants';
import { Link } from 'react-router-dom';

const ANIMATION_CONFIG = {
  orb1: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], duration: 8 },
  orb2: { scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2], duration: 10 },
  orb3: { scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25], duration: 12 },
  repeat: Infinity,
  ease: "easeInOut"
} as const;

const getApiErrorMessage = (err: unknown): string | null => {
  const error = err as {
    message?: string;
    response?: {
      status?: number;
      data?: unknown;
    };
  };

  const data = error.response?.data;

  if (typeof data === 'string' && data.trim()) {
    return data;
  }

  if (data && typeof data === 'object') {
    const map = data as Record<string, unknown>;
    const message = map.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  if (error.message === 'Network Error') {
    return 'Network error. Please make sure backend services are running.';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return null;
};

const Login: React.FC = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
      login(response.data.tokenAccess);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err) || ERRORS.FAILED_LOGIN);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: Zap, text: 'AI-Powered Analysis', color: '#3b82f6' },
    { icon: Shield, text: 'Secure & Private', color: '#10b981' },
    { icon: Sparkles, text: 'Instant Results', color: '#8b5cf6' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.bgOrbs}>
        <motion.div
          className={styles.orb1}
          animate={{
            scale: ANIMATION_CONFIG.orb1.scale,
            opacity: ANIMATION_CONFIG.orb1.opacity,
          }}
          transition={{
            duration: ANIMATION_CONFIG.orb1.duration,
            repeat: ANIMATION_CONFIG.repeat,
            ease: ANIMATION_CONFIG.ease
          }}
        />
        <motion.div
          className={styles.orb2}
          animate={{
            scale: ANIMATION_CONFIG.orb2.scale,
            opacity: ANIMATION_CONFIG.orb2.opacity,
          }}
          transition={{
            duration: ANIMATION_CONFIG.orb2.duration,
            repeat: ANIMATION_CONFIG.repeat,
            ease: ANIMATION_CONFIG.ease
          }}
        />
        <motion.div
          className={styles.orb3}
          animate={{
            scale: ANIMATION_CONFIG.orb3.scale,
            opacity: ANIMATION_CONFIG.orb3.opacity,
          }}
          transition={{
            duration: ANIMATION_CONFIG.orb3.duration,
            repeat: ANIMATION_CONFIG.repeat,
            ease: ANIMATION_CONFIG.ease
          }}
        />
      </div>

      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      >
        <div className={styles.cardGlow} />
        
        <motion.div 
          className={styles.logoContainer}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className={styles.logoIcon}>
            <Car size={32} />
          </div>
        </motion.div>

        <motion.div 
          className={styles.header}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className={styles.title}>
            <span className={styles.titleGradient}>Crash</span>2Cost
          </h1>
          <p className={styles.subtitle}>AI-powered damage assessment</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className={styles.error}
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit} 
          className={styles.form}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Input 
            label="Username" 
            icon={User}
            placeholder="Enter your username"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
            required
          />
        
          <Input 
            label="Password" 
            type="password"
            icon={Lock}
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
            required
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button type="submit" isLoading={loading} className={styles.submitButton}>
              {loading ? 'Signing in...' : UI_TEXT.LOGIN.BUTTON}
            </Button>
          </motion.div>
        </motion.form>

        <motion.div 
          className={styles.features}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={feature.text}
              className={styles.feature}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <feature.icon size={14} style={{ color: feature.color }} />
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span>Don't have an account?</span>
          <Link to="/signup" className={styles.signupLink}>
            Create Account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;