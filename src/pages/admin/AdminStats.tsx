import { Users, Shield, FileText, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AdminStats as AdminStatsType } from '../../api/admin.api';
import { ADMIN_STATS_TEXT } from './admin.constants';
import styles from './Admin.module.css';

type AdminStatsProps = {
  stats: AdminStatsType;
  totalLossCount: number;
  repairableCount: number;
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const AdminStats = ({ stats, totalLossCount, repairableCount }: AdminStatsProps) => {
  const avgCost = stats.totalAssessments > 0
    ? Math.round(stats.totalCostSum / stats.totalAssessments)
    : 0;

  const totalReports = totalLossCount + repairableCount;
  const lossRate = totalReports > 0
    ? Math.round((totalLossCount / totalReports) * 100)
    : 0;

  return (
    <div className={styles.statsGrid}>
      <motion.div
        className={`${styles.statCard} ${styles.statCardBlue}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.totalUsers}</span>
          <div className={`${styles.statIcon} ${styles.statIconBlue}`}>
            <Users size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{stats.totalUsers}</div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardPurple}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.totalAdmins}</span>
          <div className={`${styles.statIcon} ${styles.statIconPurple}`}>
            <Shield size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{stats.totalAdmins}</div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardCyan}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.totalAssessments}</span>
          <div className={`${styles.statIcon} ${styles.statIconCyan}`}>
            <FileText size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{stats.totalAssessments}</div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardOrange}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.totalCost}</span>
          <div className={`${styles.statIcon} ${styles.statIconOrange}`}>
            <DollarSign size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{'\u20AA'}{stats.totalCostSum.toLocaleString()}</div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardGreen}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.avgCost}</span>
          <div className={`${styles.statIcon} ${styles.statIconGreen}`}>
            <TrendingUp size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{'\u20AA'}{avgCost.toLocaleString()}</div>
      </motion.div>

      <motion.div
        className={`${styles.statCard} ${styles.statCardRed}`}
        variants={cardVariants}
        whileHover={{ y: -4, transition: { duration: 0.2 } }}
      >
        <div className={styles.statHeader}>
          <span className={styles.statTitle}>{ADMIN_STATS_TEXT.totalLossRate}</span>
          <div className={`${styles.statIcon} ${styles.statIconRed}`}>
            <AlertTriangle size={22} />
          </div>
        </div>
        <div className={styles.statValue}>{lossRate}%</div>
      </motion.div>
    </div>
  );
};

export default AdminStats;
