import React, { useState } from 'react';
import { useAuth } from '../../hooks';
import { api } from '../../api';
import { Button, Input, PasswordRequirements } from '../../components/common';
import { User, Lock, Mail, AlertCircle, CheckCircle, Shield } from 'lucide-react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { AuthResponse } from '../../types';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import { API_ROUTES, ERRORS, MESSAGES, UI_TEXT, VALIDATION } from '../../components/common/constants/constants';
import type { SignUpFormData } from './SignUp.types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }
  }
};

const ANIMATION_CONFIG = {
  orb1: { scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], duration: 8 },
  orb2: { scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2], duration: 10 },
  orb3: { scale: [1, 1.3, 1], opacity: [0.25, 0.45, 0.25], duration: 12 },
  repeat: Infinity,
  ease: "easeInOut" as const
};

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
    const candidates = [map.password, map.username, map.email, map.message];
    const firstText = candidates.find((v) => typeof v === 'string' && v.trim()) as string | undefined;
    if (firstText) {
      return firstText;
    }
  }

  if (error.response?.status === 409) {
    return 'Username or email already exists';
  }

  if (typeof error.message === 'string' && error.message.trim()) {
    return error.message;
  }

  return null;
};

const SignUp: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState<SignUpFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPasswordReqs, setShowPasswordReqs] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    
    if (formData.password !== formData.confirmPassword) {
      setError(ERRORS.PASSWORD_MISMATCH);
      setLoading(false);
      return;
    }

    if (formData.password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
      setError(ERRORS.PASSWORD_TOO_SHORT);
      setLoading(false);
      return;
    }

    try {
      const response = await api.post<AuthResponse>(API_ROUTES.AUTH.SIGNUP, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess(MESSAGES.SIGNUP_SUCCESS);
      setTimeout(() => {
        login(response.data.tokenAccess);
      }, VALIDATION.SUCCESS_REDIRECT_DELAY);
    } catch (err) {
      console.error(err);
      setError(getApiErrorMessage(err) || ERRORS.FAILED_SIGNUP);
    } finally {
      setLoading(false);
    }
  };

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
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.cardGlow} />

        <motion.div className={styles.header} variants={itemVariants}>
          <div className={styles.logoIcon}>
            <Shield size={28} />
          </div>
          <h2 className={styles.title}>
            <span className={styles.titleGradient}>{UI_TEXT.SIGNUP.TITLE}</span>
          </h2>
          <p className={styles.subtitle}>{UI_TEXT.SIGNUP.SUBTITLE}</p>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              className={styles.error}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && (
            <motion.div
              className={styles.success}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <CheckCircle size={16} />
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form onSubmit={handleSubmit} className={styles.form} variants={itemVariants}>
          <Input 
            label="Username" 
            icon={User}
            placeholder="Choose a username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            required
            minLength={VALIDATION.MIN_USERNAME_LENGTH}
          />

          <Input 
            label="Email" 
            type="email"
            icon={Mail}
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
          
          <Input 
            label="Password" 
            type="password"
            icon={Lock}
            placeholder="Create a password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            onFocus={() => setShowPasswordReqs(true)}
            onBlur={() => setShowPasswordReqs(false)}
            required
            minLength={VALIDATION.MIN_PASSWORD_LENGTH}
          />

          <PasswordRequirements password={formData.password} show={showPasswordReqs} />

          <Input 
            label="Confirm Password" 
            type="password"
            icon={Lock}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            <Button type="submit" isLoading={loading} className={styles.submitButton}>
              Create Account
            </Button>
          </motion.div>
        </motion.form>

        <motion.div className={styles.footer} variants={itemVariants}>
          Already have an account?
          <Link to="/login" className={styles.loginLink}>
            Sign In
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SignUp;
