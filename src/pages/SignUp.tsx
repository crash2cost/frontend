import React, { useState } from 'react';
import { useAuth } from '../hooks';
import { api } from '../api';
import { Button, Input } from '../components/common';
import { User, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import type { AuthResponse } from '../types';
import styles from './SignUp.module.css';
import { Link } from 'react-router-dom';
import { API_ROUTES, ERRORS, MESSAGES, UI_TEXT, VALIDATION } from '../components/common/constants/constants';

const SignUp: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    // Validation
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
        login(response.data.access_token);
      }, VALIDATION.SUCCESS_REDIRECT_DELAY);
    } catch (err) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || ERRORS.FAILED_SIGNUP);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>{UI_TEXT.SIGNUP.TITLE}</h2>
          <p className={styles.subtitle}>{UI_TEXT.SIGNUP.SUBTITLE}</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {success && (
          <div className={styles.success}>
            <CheckCircle size={16} />
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            required
            minLength={VALIDATION.MIN_PASSWORD_LENGTH}
          />

          <Input 
            label="Confirm Password" 
            type="password"
            icon={Lock}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            required
          />

          <Button type="submit" isLoading={loading} className={styles.submitButton}>
            Create Account
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?
          <Link to="/login" className={styles.loginLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
