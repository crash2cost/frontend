import React, { useState } from 'react';
import { useAuth } from '../hooks';
import { api } from '../api';
import { Button, Input } from '../components/common';
import { User, Lock, AlertCircle } from 'lucide-react';
import type { AuthResponse } from '../types';
import styles from './Login.module.css';
import { API_ROUTES, ERRORS } from '../components/common/constants/constants';

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
      login(response.data.access_token);
      alert(ERRORS.SUCCESSFUL_LOGIN);
    } catch (err) {
      console.error(err);
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || ERRORS.FAILED_LOGIN);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>Welcome Back</h2>
          <p className={styles.subtitle}>Sign in to access your dashboard</p>
        </div>

        {error && (
          <div className={styles.error}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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

          <Button type="submit" isLoading={loading} className={styles.submitButton}>
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;