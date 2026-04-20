import { useState } from 'react';
import { History, LogOut, User, Zap, Shield, KeyRound, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { getTokenUsername, getTokenRole } from '../../utils/jwt';
import { adminApi } from '../../api/admin.api';
import styles from './Dashboard.module.css';

type DashboardHeaderProps = {
  onGoToHistory: () => void;
  onGoToAdmin?: () => void;
  onLogout: () => void;
  onToast?: (toast: { message: string; variant: 'success' | 'error' }) => void;
};

const DashboardHeader = ({
  onGoToHistory,
  onGoToAdmin,
  onLogout,
  onToast,
}: DashboardHeaderProps) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const username = token ? getTokenUsername(token) : null;
  const role = token ? getTokenRole(token) : null;
  const isAdmin = role?.toUpperCase() === 'ADMIN';

  const [showAdminInput, setShowAdminInput] = useState(false);
  const [adminSecret, setAdminSecret] = useState('');
  const [claiming, setClaiming] = useState(false);

  const handleClaimAdmin = async () => {
    if (!adminSecret.trim()) return;
    setClaiming(true);
    try {
      const response = await adminApi.claimAdminAccess(adminSecret);
      localStorage.setItem(STORAGE_KEYS.authToken, response.tokenAccess);
      setShowAdminInput(false);
      setAdminSecret('');
      onToast?.({ message: 'Admin access granted! Reloading...', variant: 'success' });
      setTimeout(() => window.location.reload(), 1000);
    } catch {
      onToast?.({ message: 'Invalid admin code', variant: 'error' });
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          <Zap size={32} style={{ color: '#3b82f6' }} />
          <span className={styles.titleGradient}>Crash2Cost</span>
        </h1>
        <p className={styles.subtitle}>Welcome back! Here's your crash analytics overview</p>
      </div>
      <div className={styles.headerButtons}>
        {username && (
          <div className={styles.userBadge}>
            <User size={16} />
            <span>{username}</span>
          </div>
        )}
        {isAdmin && onGoToAdmin && (
          <motion.button
            onClick={onGoToAdmin}
            className={styles.adminButton}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Shield size={18} />
            Admin Panel
          </motion.button>
        )}
        {!isAdmin && (
          <AnimatePresence>
            {showAdminInput ? (
              <motion.div
                className={styles.adminAccessForm}
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <input
                  type="password"
                  className={styles.adminAccessInput}
                  placeholder="Admin code..."
                  value={adminSecret}
                  onChange={(e) => setAdminSecret(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleClaimAdmin()}
                  autoFocus
                />
                <motion.button
                  className={styles.adminAccessSubmit}
                  onClick={handleClaimAdmin}
                  disabled={claiming || !adminSecret.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check size={16} />
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                onClick={() => setShowAdminInput(true)}
                className={styles.adminAccessButton}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title="Enter admin access code"
              >
                <KeyRound size={18} />
              </motion.button>
            )}
          </AnimatePresence>
        )}
        <motion.button
          onClick={onGoToHistory}
          className={styles.historyButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <History size={18} />
          View History
        </motion.button>
        <motion.button
          onClick={onLogout}
          className={styles.logoutButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default DashboardHeader;
