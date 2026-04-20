import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users } from 'lucide-react';
import { useAuth } from '../../hooks';
import { adminApi, type AdminStats as AdminStatsType, type AdminUser } from '../../api/admin.api';
import { reportApi, type DamageReport } from '../../api/report.api';
import { Toast } from '../../components/common';
import AdminHeader from './AdminHeader';
import AdminStatsComponent from './AdminStats';
import AdminActivityFeed from './AdminActivityFeed';
import AdminUsersTab from './AdminUsersTab';
import { ADMIN_TABS, ADMIN_ROUTES, ADMIN_MESSAGES } from './admin.constants';
import type { AdminTab } from './admin.constants';
import styles from './Admin.module.css';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [stats, setStats] = useState<AdminStatsType>({
    totalUsers: 0,
    totalAdmins: 0,
    totalAssessments: 0,
    totalCostSum: 0,
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    variant: 'error' | 'success' | 'info';
  } | null>(null);

  // Dashboard activity data
  const [recentReports, setRecentReports] = useState<DamageReport[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [totalLossCount, setTotalLossCount] = useState(0);
  const [repairableCount, setRepairableCount] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const loadDashboardData = useCallback(async () => {
    // Load each independently so one failure doesn't break everything
    const [statsResult, reportsResult, usersResult] = await Promise.allSettled([
      adminApi.getStats(),
      reportApi.getAllDamageReports(0, 5),
      adminApi.getUsers(0, 5),
    ]);

    if (statsResult.status === 'fulfilled') {
      setStats(statsResult.value);
    }
    if (reportsResult.status === 'fulfilled') {
      const reports = reportsResult.value.content;
      setRecentReports(reports);
      const loss = reports.filter(r => r.totalLoss).length;
      setTotalLossCount(loss);
      setRepairableCount(reports.length - loss);
    }
    if (usersResult.status === 'fulfilled') {
      setRecentUsers(usersResult.value.content);
    }

    const anyFailed = [statsResult, reportsResult, usersResult].some(r => r.status === 'rejected');
    if (anyFailed) {
      setToast({ message: ADMIN_MESSAGES.loadFailed, variant: 'error' });
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const handleToast = useCallback(
    (message: string, variant: 'success' | 'error') => {
      setToast({ message, variant });
      if (variant === 'success') {
        loadDashboardData();
      }
    },
    [loadDashboardData]
  );

  const tabIcons: Record<AdminTab, React.ReactNode> = {
    dashboard: <LayoutDashboard size={18} />,
    users: <Users size={18} />,
  };

  return (
    <motion.div
      className={styles.container}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <AdminHeader
          onBack={() => navigate(ADMIN_ROUTES.dashboard)}
          onLogout={logout}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <div className={styles.tabNav}>
          {(Object.keys(ADMIN_TABS) as AdminTab[]).map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabIcons[tab]}
              {ADMIN_TABS[tab]}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className={styles.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="loading"
          >
            <div className={styles.spinner} />
            <p>Loading admin data...</p>
          </motion.div>
        ) : (
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            {activeTab === 'dashboard' && (
              <>
                <motion.div variants={itemVariants}>
                  <AdminStatsComponent
                    stats={stats}
                    totalLossCount={totalLossCount}
                    repairableCount={repairableCount}
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <AdminActivityFeed
                    recentReports={recentReports}
                    recentUsers={recentUsers}
                  />
                </motion.div>
              </>
            )}
            {activeTab === 'users' && (
              <AdminUsersTab onToast={handleToast} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Admin;
