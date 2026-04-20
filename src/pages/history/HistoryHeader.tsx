import { ArrowLeft, Shield, User, Search } from 'lucide-react';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { getTokenUsername } from '../../utils/jwt';
import styles from './History.module.css';
import { HISTORY_TEXT } from './history.constants';

type HistoryHeaderProps = {
  onBack: () => void;
  onDeleteSelected: () => void;
  onToggleSelectAll: () => void;
  selectedCount: number;
  totalSelectable: number;
  readOnly?: boolean;
  isAdmin?: boolean;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
};

const HistoryHeader = ({
  onBack,
  onDeleteSelected,
  onToggleSelectAll,
  selectedCount,
  totalSelectable,
  readOnly = false,
  isAdmin = false,
  searchQuery = '',
  onSearchChange,
}: HistoryHeaderProps) => {
  const hasSelection = selectedCount > 0;
  const allSelected = totalSelectable > 0 && selectedCount === totalSelectable;
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  const username = token ? getTokenUsername(token) : null;

  return (
    <div className={styles.header}>
      <button onClick={onBack} className={styles.backButton}>
        <ArrowLeft size={20} />
        {HISTORY_TEXT.backToDashboard}
      </button>
      {username && (
        <div className={styles.userBadge}>
          <User size={16} />
          <span>{username}</span>
        </div>
      )}
      {isAdmin && (
        <div className={styles.adminBadge}>
          <Shield size={16} />
          <span>{HISTORY_TEXT.adminBadge}</span>
        </div>
      )}
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{HISTORY_TEXT.title}</h1>
        <p className={styles.subtitle}>{isAdmin ? HISTORY_TEXT.adminSubtitle : HISTORY_TEXT.subtitle}</p>
      </div>
      {isAdmin && onSearchChange && (
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder={HISTORY_TEXT.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}
      {!readOnly && (
        <div className={styles.headerActions}>
          <button onClick={onToggleSelectAll} className={styles.selectAllButton} disabled={totalSelectable === 0}>
            {allSelected ? HISTORY_TEXT.clearSelection : HISTORY_TEXT.selectAll}
          </button>
          <button
            onClick={onDeleteSelected}
            className={styles.deleteSelectedButton}
            disabled={!hasSelection}
          >
            {HISTORY_TEXT.deleteSelected}
            {hasSelection && (
              <span className={styles.selectedCount}>
                {selectedCount} {HISTORY_TEXT.selectedCount}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default HistoryHeader;
