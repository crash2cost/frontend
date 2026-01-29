import { AlertTriangle, Calendar, CheckCircle, Trash2, XCircle } from 'lucide-react';
import type { DamageReport } from '../../api/report.api';
import type { ImageResponse } from '../../api/image.api';
import styles from '../History.module.css';
import { HISTORY_CLASS_KEYS, HISTORY_TEXT } from '../history.constants';

type HistoryGridProps = {
  uploadedImages: ImageResponse[];
  assessments: Map<string, DamageReport>;
  onDeleteAssessment: (imageId: string) => void;
  onToggleSelect: (imageId: string) => void;
  selectedReportIds: Set<string>;
  onGoToDashboard: () => void;
  readOnly?: boolean;
};

const HistoryGrid = ({
  uploadedImages,
  assessments,
  onDeleteAssessment,
  onToggleSelect,
  selectedReportIds,
  onGoToDashboard,
  readOnly = false,
}: HistoryGridProps) => {
  if (uploadedImages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Calendar size={64} className={styles.emptyIcon} />
        <h3 className={styles.emptyTitle}>{HISTORY_TEXT.emptyTitle}</h3>
        <p className={styles.emptyText}>{HISTORY_TEXT.emptyText}</p>
        <button onClick={onGoToDashboard} className={styles.dashboardButton}>
          {HISTORY_TEXT.goToDashboard}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.historyGrid}>
      {uploadedImages.map((image) => {
        const assessment = assessments.get(image.id);
        const isSelected = selectedReportIds.has(image.id);
        const canManage = !readOnly;

        return (
          <div key={image.id} className={styles.historyCard}>
            <div className={styles.cardHeader}>
              <div className={styles.cardDate}>
                <Calendar size={16} />
                <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
              </div>
              <div className={styles.cardActions}>
                {canManage && (
                  <label className={styles.selectLabel}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(image.id)}
                      aria-label={HISTORY_TEXT.selectAssessment}
                    />
                    <span className={styles.selectIndicator} />
                  </label>
                )}
                {assessment && (
                  <div
                    className={`${styles.statusBadge} ${assessment.totalLoss ? styles.totalLoss : styles.repairable}`}
                  >
                    {assessment.totalLoss ? (
                      <>
                        <XCircle size={16} />
                        <span>{HISTORY_TEXT.totalLoss}</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={16} />
                        <span>{HISTORY_TEXT.repairable}</span>
                      </>
                    )}
                  </div>
                )}
                {canManage && (
                  <button
                    onClick={() => onDeleteAssessment(image.id)}
                    className={styles.deleteButton}
                    title={HISTORY_TEXT.deleteAssessmentTitle}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>

            {assessment ? (
              <>
                <div className={styles.costDisplay}>
                  <span className={styles.costLabel}>{HISTORY_TEXT.totalCostLabel}</span>
                  <span className={styles.costValue}>₪{assessment.totalCost.toLocaleString()}</span>
                </div>

                <div className={styles.damageList}>
                  <h4 className={styles.damageTitle}>
                    <AlertTriangle size={16} />
                    {HISTORY_TEXT.damagedPartsLabel} ({assessment.damageAreas.length})
                  </h4>
                  {assessment.damageAreas.map((damage) => (
                    <div key={`${image.id}-${damage.area}`} className={styles.damageItem}>
                      <div className={styles.damageName}>{damage.area}</div>
                      <div className={styles.damageInfo}>
                        <span
                          className={`${styles.severityTag} ${styles[`${HISTORY_CLASS_KEYS.severityPrefix}${damage.severity}`]}`}
                        >
                          {HISTORY_TEXT.levelPrefix}
                          {damage.severity}
                        </span>
                        <span className={styles.damageCost}>₪{damage.cost.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.noAssessment}>
                <p>{HISTORY_TEXT.assessmentNotAvailable}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HistoryGrid;
