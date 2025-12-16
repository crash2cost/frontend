import React from 'react';
import { useAuth } from '../hooks';
import { BarChart3, TrendingUp, DollarSign, AlertTriangle } from 'lucide-react';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { logout } = useAuth();

  const stats = [
    {
      title: 'Total Crashes',
      value: '0',
      icon: AlertTriangle,
      color: '#f97316',
      trend: '+0%'
    },
    {
      title: 'Total Cost',
      value: '₪0',
      icon: DollarSign,
      color: '#22c55e',
      trend: '+0%'
    },
    {
      title: 'This Month',
      value: '0',
      icon: BarChart3,
      color: '#38bdf8',
      trend: '+0%'
    },
    {
      title: 'Average Cost',
      value: '₪0',
      icon: TrendingUp,
      color: '#a78bfa',
      trend: '+0%'
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Welcome back! Here's your crash analytics overview</p>
        </div>
        <button onClick={logout} className={styles.logoutButton}>
          Logout
        </button>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{stat.title}</span>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statTrend} style={{ color: stat.color }}>
              {stat.trend} from last month
            </div>
          </div>
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.emptyState}>
          <AlertTriangle size={64} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>No crashes recorded yet</h3>
          <p className={styles.emptyText}>
            Start tracking your crashes to see analytics and cost breakdown
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
