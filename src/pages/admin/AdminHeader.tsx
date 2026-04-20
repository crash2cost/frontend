import { Shield, ArrowLeft, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { ADMIN_TEXT } from './admin.constants';
import styles from './Admin.module.css';

type AdminHeaderProps = {
  onBack: () => void;
  onLogout: () => void;
};

const AdminHeader = ({ onBack, onLogout }: AdminHeaderProps) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerLeft}>
        <h1 className={styles.title}>
          <Shield size={32} style={{ color: '#8b5cf6' }} />
          <span className={styles.titleGradient}>{ADMIN_TEXT.title}</span>
        </h1>
        <p className={styles.subtitle}>{ADMIN_TEXT.subtitle}</p>
      </div>
      <div className={styles.headerButtons}>
        <div className={styles.adminBadge}>
          <Shield size={16} />
          <span>{ADMIN_TEXT.adminBadge}</span>
        </div>
        <motion.button
          onClick={onBack}
          className={styles.backButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <ArrowLeft size={18} />
          {ADMIN_TEXT.backToDashboard}
        </motion.button>
        <motion.button
          onClick={onLogout}
          className={styles.logoutButton}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LogOut size={18} />
          {ADMIN_TEXT.logout}
        </motion.button>
      </div>
    </div>
  );
};

export default AdminHeader;
