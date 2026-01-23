import { ImagePlus } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from '../Dashboard.module.css';

const DashboardEmptyState = () => {
  return (
    <motion.div
      className={styles.emptyState}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        initial={{ y: 10 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ImagePlus size={56} className={styles.emptyIcon} />
      </motion.div>
      <h3 className={styles.emptyTitle}>No images uploaded yet</h3>
      <p className={styles.emptyText}>
        Upload crash images to start documenting incidents and get AI-powered damage assessments
      </p>
    </motion.div>
  );
};

export default DashboardEmptyState;
