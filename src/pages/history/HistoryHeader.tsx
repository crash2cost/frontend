import { ArrowLeft } from 'lucide-react';
import styles from '../History.module.css';
import { HISTORY_TEXT } from '../history.constants';

type HistoryHeaderProps = {
  onBack: () => void;
};

const HistoryHeader = ({ onBack }: HistoryHeaderProps) => {
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
    </div>
  );
};

export default HistoryHeader;
