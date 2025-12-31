import styles from '../History.module.css';
import { HISTORY_TEXT } from '../history.constants';

type HistorySummaryProps = {
  totalAssessments: number;
  totalCost: number;
  totalLossCount: number;
};

const HistorySummary = ({ totalAssessments, totalCost, totalLossCount }: HistorySummaryProps) => {
  return (
    <div className={styles.summary}>
      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>{HISTORY_TEXT.totalAssessments}</span>
        <span className={styles.summaryValue}>{totalAssessments}</span>
      </div>
      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>{HISTORY_TEXT.totalCost}</span>
        <span className={styles.summaryValue}>₪{totalCost.toLocaleString()}</span>
      </div>
      <div className={styles.summaryCard}>
        <span className={styles.summaryLabel}>{HISTORY_TEXT.totalLossCases}</span>
        <span className={styles.summaryValue}>{totalLossCount}</span>
      </div>
    </div>
  );
};

export default HistorySummary;
