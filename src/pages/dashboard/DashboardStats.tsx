import { AlertTriangle, Upload, TrendingUp, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './Dashboard.module.css';

type DashboardStatsProps = {
  totalAssessed: number;
  totalCost: number;
  totalLossCount: number;
  totalUploaded: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const DashboardStats = ({
  totalAssessed,
  totalCost,
  totalLossCount,
  totalUploaded,
}: DashboardStatsProps) => {
  return (
    <div className={styles.statsGrid}>
      <motion.div
        className={`${styles.statCard} ${styles.statCardBlue}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Images Assessed</span>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <Upload size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{totalAssessed}</div>
        <div className={styles.statTrend} style={{ color: '#60a5fa' }}>
          <TrendingUp size={16} />
          {totalUploaded} total uploaded
        </div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardOrange}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>Total Damage Cost</span>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
            <DollarSign size={22} />
          </div>
        </div>
        <div className={styles.statValue}>₪{totalCost.toLocaleString()}</div>
        <div className={styles.statTrend} style={{ color: '#fbbf24' }}>
          <AlertTriangle size={16} />
          {totalLossCount} total loss cases
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
