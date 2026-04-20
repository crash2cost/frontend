import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Shield, User, Trash2, ChevronLeft, ChevronRight, UserX,
  FileText, ChevronDown, ChevronUp, AlertTriangle, CheckCircle,
} from 'lucide-react';
import { adminApi, type AdminUser } from '../../api/admin.api';
import { reportApi, type DamageReport } from '../../api/report.api';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { getTokenUsername } from '../../utils/jwt';
import { ADMIN_USERS_TEXT, ADMIN_MESSAGES } from './admin.constants';
import styles from './Admin.module.css';

type AdminUsersTabProps = {
  onToast: (message: string, variant: 'success' | 'error') => void;
};

const AdminUsersTab = ({ onToast }: AdminUsersTabProps) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [expandedReports, setExpandedReports] = useState<DamageReport[]>([]);
  const [expandedLoading, setExpandedLoading] = useState(false);

  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const currentUsername = token ? getTokenUsername(token) : null;

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers(page, 20, searchQuery);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch {
      onToast(ADMIN_MESSAGES.loadFailed, 'error');
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery, onToast]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(0);
  };

  const handleRoleChange = async (user: AdminUser) => {
    const newRole = user.role === 'ADMIN' ? 'USER' : 'ADMIN';
    try {
      await adminApi.changeUserRole(user.id, newRole);
      onToast(ADMIN_MESSAGES.roleChangeSuccess, 'success');
      await loadUsers();
    } catch {
      onToast(ADMIN_MESSAGES.roleChangeFailed, 'error');
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (!confirm(ADMIN_USERS_TEXT.deleteConfirm)) return;
    try {
      await adminApi.deleteUser(user.id);
      onToast(ADMIN_MESSAGES.deleteSuccess, 'success');
      await loadUsers();
    } catch {
      onToast(ADMIN_MESSAGES.deleteFailed, 'error');
    }
  };

  const handleToggleExpand = async (user: AdminUser) => {
    if (expandedUserId === user.id) {
      setExpandedUserId(null);
      setExpandedReports([]);
      return;
    }
    setExpandedUserId(user.id);
    setExpandedLoading(true);
    try {
      const response = await reportApi.getAllDamageReports(0, 100);
      const userReports = response.content.filter(r =>
        r.username?.toLowerCase() === user.username.toLowerCase()
      );
      setExpandedReports(userReports);
    } catch {
      setExpandedReports([]);
    } finally {
      setExpandedLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className={styles.searchBar}>
        <Search size={20} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder={ADMIN_USERS_TEXT.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Loading users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className={styles.emptyState}>
          <UserX size={48} className={styles.emptyIcon} />
          <h3 className={styles.emptyTitle}>{ADMIN_USERS_TEXT.emptyTitle}</h3>
          <p className={styles.emptyText}>{ADMIN_USERS_TEXT.emptyText}</p>
        </div>
      ) : (
        <>
          <div className={styles.usersList}>
            {users.map((user) => {
              const isSelf = user.username === currentUsername;
              const isExpanded = expandedUserId === user.id;
              return (
                <div key={user.id}>
                  <div className={`${styles.userCard} ${isExpanded ? styles.userRowExpanded : ''}`}>
                    <div className={styles.userCardLeft}>
                      <div className={styles.userAvatar}>
                        {user.role === 'ADMIN' ? <Shield size={18} /> : <User size={18} />}
                      </div>
                      <div className={styles.userCardInfo}>
                        <div className={styles.userCardName}>
                          {user.username}
                          {isSelf && <span className={styles.selfTag}>{ADMIN_USERS_TEXT.selfLabel}</span>}
                        </div>
                        <div className={styles.userCardEmail}>{user.email}</div>
                      </div>
                    </div>
                    <div className={styles.userCardRight}>
                      <div className={styles.userAssessments}>
                        <FileText size={14} />
                        {user.assessmentCount ?? 0} {ADMIN_USERS_TEXT.assessmentsColumn}
                      </div>
                      <span
                        className={`${styles.roleBadge} ${
                          user.role === 'ADMIN' ? styles.roleBadgeAdmin : styles.roleBadgeUser
                        }`}
                      >
                        {user.role}
                      </span>
                      <div className={styles.userCardActions}>
                        <button
                          className={styles.expandRowBtn}
                          onClick={() => handleToggleExpand(user)}
                          title="View reports"
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <button
                          className={styles.roleToggleButton}
                          onClick={() => handleRoleChange(user)}
                          disabled={isSelf}
                          title={
                            isSelf
                              ? 'Cannot change own role'
                              : user.role === 'ADMIN'
                              ? ADMIN_USERS_TEXT.demoteToUser
                              : ADMIN_USERS_TEXT.promoteToAdmin
                          }
                        >
                          <Shield size={14} />
                        </button>
                        <button
                          className={styles.deleteUserButton}
                          onClick={() => handleDeleteUser(user)}
                          disabled={isSelf}
                          title={isSelf ? 'Cannot delete own account' : ADMIN_USERS_TEXT.deleteUser}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className={styles.userExpandedSection}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {expandedLoading ? (
                          <div className={styles.expandedLoading}>
                            <div className={styles.spinnerSmall} />
                            Loading reports...
                          </div>
                        ) : expandedReports.length === 0 ? (
                          <div className={styles.expandedEmpty}>No reports found for this user</div>
                        ) : (
                          <div className={styles.expandedReports}>
                            {expandedReports.map((report) => (
                              <div key={report.id || report.imageId} className={styles.expandedReportCard}>
                                <div className={styles.expandedReportInfo}>
                                  {report.totalLoss ? (
                                    <AlertTriangle size={14} className={styles.activityIconDanger} />
                                  ) : (
                                    <CheckCircle size={14} className={styles.activityIconSuccess} />
                                  )}
                                  <span className={styles.expandedReportCost}>
                                    {'\u20AA'}{report.totalCost.toLocaleString()}
                                  </span>
                                </div>
                                <span className={styles.expandedReportDate}>
                                  {report.assessmentDate
                                    ? new Date(report.assessmentDate).toLocaleDateString()
                                    : 'N/A'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                <ChevronLeft size={16} />
              </button>
              <span className={styles.pageInfo}>
                Page {page + 1} of {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default AdminUsersTab;
