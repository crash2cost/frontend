import { AlertTriangle } from 'lucide-react';
import styles from '../Dashboard.module.css';

const DashboardEmptyState = () => {
  return (
    <div className={styles.emptyState}>
      <AlertTriangle size={64} className={styles.emptyIcon} />
      <h3 className={styles.emptyTitle}>No images uploaded yet</h3>
      <p className={styles.emptyText}>
        Upload crash images to start documenting incidents
      </p>
    </div>
  );
};

export default DashboardEmptyState;
