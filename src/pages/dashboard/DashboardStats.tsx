import { AlertTriangle, Upload } from 'lucide-react';
import styles from '../Dashboard.module.css';

type DashboardStatsProps = {
  totalAssessed: number;
  totalCost: number;
  totalLossCount: number;
  totalUploaded: number;
};

const DashboardStats = ({
  totalAssessed,
  totalCost,
  totalLossCount,
  totalUploaded,
}: DashboardStatsProps) => {
  return (
    <div className={styles.statsGrid}>
      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Images Assessed</span>
          <Upload size={24} style={{ color: '#38bdf8' }} />
        </div>
        <div className={styles.statValue}>{totalAssessed}</div>
        <div className={styles.statTrend} style={{ color: '#38bdf8' }}>
          {totalUploaded} total uploaded
        </div>
      </div>

      <div className={styles.statCard}>
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Total Damage Cost</span>
          <AlertTriangle size={24} style={{ color: '#f97316' }} />
        </div>
        <div className={styles.statValue}>₪{totalCost.toLocaleString()}</div>
        <div className={styles.statTrend} style={{ color: '#f97316' }}>
          {totalLossCount} total loss cases
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
