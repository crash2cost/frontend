import { motion } from 'framer-motion';
import { FileText, UserPlus, AlertTriangle, CheckCircle, Shield, User } from 'lucide-react';
import type { DamageReport } from '../../api/report.api';
import type { AdminUser } from '../../api/admin.api';
import { ADMIN_ACTIVITY_TEXT } from './admin.constants';
import styles from './Admin.module.css';

type AdminActivityFeedProps = {
  recentReports: DamageReport[];
  recentUsers: AdminUser[];
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

const AdminActivityFeed = ({ recentReports, recentUsers }: AdminActivityFeedProps) => {
  return (
    <div className={styles.activitySection}>
      <motion.div className={styles.activityColumn} variants={cardVariants}>
        <div className={styles.activityHeader}>
          <FileText size={18} />
          <span>{ADMIN_ACTIVITY_TEXT.recentAssessments}</span>
        </div>
        {recentReports.length === 0 ? (
          <div className={styles.activityEmpty}>{ADMIN_ACTIVITY_TEXT.noRecentAssessments}</div>
        ) : (
          recentReports.map((report) => (
            <div key={report.id || report.imageId} className={styles.activityItem}>
              <div className={styles.activityItemLeft}>
                <div className={styles.activityItemIcon}>
                  {report.totalLoss ? (
                    <AlertTriangle size={14} className={styles.activityIconDanger} />
                  ) : (
                    <CheckCircle size={14} className={styles.activityIconSuccess} />
                  )}
                </div>
                <div>
                  <div className={styles.activityItemTitle}>
                    {report.username || 'Unknown'}
                  </div>
                  <div className={styles.activityItemSub}>
                    {report.assessmentDate
                      ? new Date(report.assessmentDate).toLocaleDateString()
                      : 'N/A'}
                  </div>
                </div>
              </div>
              <div className={styles.activityItemRight}>
                <span className={styles.activityCost}>
                  {'\u20AA'}{report.totalCost.toLocaleString()}
                </span>
                <span
                  className={`${styles.activityStatusDot} ${
                    report.totalLoss ? styles.activityStatusDanger : styles.activityStatusOk
                  }`}
                />
              </div>
            </div>
          ))
        )}
      </motion.div>

      <motion.div className={styles.activityColumn} variants={cardVariants}>
        <div className={styles.activityHeader}>
          <UserPlus size={18} />
          <span>{ADMIN_ACTIVITY_TEXT.recentUsers}</span>
        </div>
        {recentUsers.length === 0 ? (
          <div className={styles.activityEmpty}>{ADMIN_ACTIVITY_TEXT.noRecentUsers}</div>
        ) : (
          recentUsers.map((user) => (
            <div key={user.id} className={styles.activityItem}>
              <div className={styles.activityItemLeft}>
                <div className={styles.activityItemIcon}>
                  {user.role === 'ADMIN' ? (
                    <Shield size={14} className={styles.activityIconPurple} />
                  ) : (
                    <User size={14} className={styles.activityIconBlue} />
                  )}
                </div>
                <div>
                  <div className={styles.activityItemTitle}>{user.username}</div>
                  <div className={styles.activityItemSub}>{user.email}</div>
                </div>
              </div>
              <div className={styles.activityItemRight}>
                <span
                  className={`${styles.roleBadge} ${
                    user.role === 'ADMIN' ? styles.roleBadgeAdmin : styles.roleBadgeUser
                  }`}
                  style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}
                >
                  {user.role}
                </span>
              </div>
            </div>
          ))
        )}
      </motion.div>
    </div>
  );
};

export default AdminActivityFeed;
