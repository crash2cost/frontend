import { History, LogOut, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../Dashboard.module.css';

type DashboardHeaderProps = {
  onGoToHistory: () => void;
  onLogout: () => void;
};

const DashboardHeader = ({
  onGoToHistory,
  onLogout,
}: DashboardHeaderProps) => {
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
