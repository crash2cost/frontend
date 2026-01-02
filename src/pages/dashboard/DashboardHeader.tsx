import { History } from 'lucide-react';
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
      <div>
        <h1 className={styles.title}>Crash2Cost</h1>
        <p className={styles.subtitle}>Welcome back! Here's your crash analytics overview</p>
      </div>
      <div className={styles.headerButtons}>
        <button onClick={onGoToHistory} className={styles.historyButton}>
          <History size={20} />
          View History
        </button>
        <button onClick={onLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
