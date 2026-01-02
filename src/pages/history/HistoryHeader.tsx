import { ArrowLeft } from 'lucide-react';
import styles from '../History.module.css';
import { HISTORY_TEXT } from '../history.constants';

type HistoryHeaderProps = {
  onBack: () => void;
  onDeleteSelected: () => void;
  onToggleSelectAll: () => void;
  selectedCount: number;
  totalSelectable: number;
};

const HistoryHeader = ({
  onBack,
  onDeleteSelected,
  onToggleSelectAll,
  selectedCount,
  totalSelectable,
}: HistoryHeaderProps) => {
  const hasSelection = selectedCount > 0;
  const allSelected = totalSelectable > 0 && selectedCount === totalSelectable;

  return (
    <div className={styles.header}>
      <button onClick={onBack} className={styles.backButton}>
        <ArrowLeft size={20} />
        {HISTORY_TEXT.backToDashboard}
      </button>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{HISTORY_TEXT.title}</h1>
        <p className={styles.subtitle}>{HISTORY_TEXT.subtitle}</p>
      </div>
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
    </div>
  );
};

export default HistoryHeader;
