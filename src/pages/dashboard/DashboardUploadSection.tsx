import { AlertTriangle, CheckCircle, Sparkles, Upload, XCircle } from 'lucide-react';
import { ImageUpload } from '../../components/common';
import { imageApi, type ImageResponse } from '../../api/image.api';
import type { DamageReport } from '../../api/report.api';
import styles from '../Dashboard.module.css';

type DashboardUploadSectionProps = {
  assessments: Map<string, DamageReport>;
  processing: Set<string>;
  uploadedImages: ImageResponse[];
  uploading: boolean;
  onProcessImage: (imageId: string) => void;
  onUpload: (files: File[]) => void;
};

const DashboardUploadSection = ({
  assessments,
  processing,
  uploadedImages,
  uploading,
  onProcessImage,
  onUpload,
}: DashboardUploadSectionProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>
              <Upload size={24} />
              Upload Crash Images
            </h2>
            <p className={styles.sectionSubtitle}>
              Upload photos of crashes to keep track of damage and details
            </p>
          </div>
        </div>

        <ImageUpload onUpload={onUpload} maxFiles={10} maxSizeMB={10} />

        {uploading && (
          <div className={styles.uploadingMessage}>
            Uploading images...
          </div>
        )}

        {uploadedImages.length > 0 && (
          <div className={styles.assessmentsContainer}>
            {uploadedImages.map((image) => {
              const assessment = assessments.get(image.id);
              const isProcessing = processing.has(image.id);

              return (
                <div key={image.id} className={styles.imageCard}>
                  <img
                    src={imageApi.getImageUrl(image.id)}
                    alt="Crash damage"
                    className={styles.damageImage}
                  />

                  {!assessment && !isProcessing && (
                    <div className={styles.mlButtonContainer}>
                      <button
                        onClick={() => onProcessImage(image.id)}
                        className={styles.mlButton}
                      >
                        <Sparkles size={20} />
                        Process with AI
                      </button>
                      <p className={styles.mlDescription}>
                        Click to analyze damage with our ML model
                      </p>
                    </div>
                  )}

                  {isProcessing && (
                    <div className={styles.processingBox}>
                      <div className={styles.spinner}></div>
                      <span>Analyzing damage with AI...</span>
                    </div>
                  )}

                  {assessment && (
                    <div className={styles.resultsBox}>
                      <div className={styles.resultsHeader}>
                        <h3 className={styles.resultsTitle}>Damage Assessment Results</h3>
                        <div
                          className={`${styles.statusBadge} ${assessment.totalLoss ? styles.totalLossBadge : styles.repairableBadge}`}
                        >
                          {assessment.totalLoss ? (
                            <>
                              <XCircle size={18} />
                              <span>Total Loss</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              <span>Repairable</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className={styles.costSummary}>
                        <div className={styles.costBox}>
                          <span className={styles.costLabel}>Total Repair Cost</span>
                          <span className={styles.costAmount}>
                            ₪{assessment.totalCost.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className={styles.brokenPartsList}>
                        <h4 className={styles.partsTitle}>
                          <AlertTriangle size={20} />
                          Broken Parts Detected
                        </h4>
                        <div className={styles.partsList}>
                          {assessment.damageAreas.map((damage) => (
                            <div key={`${image.id}-${damage.area}`} className={styles.partItem}>
                              <div className={styles.partInfo}>
                                <div className={styles.partName}>{damage.area}</div>
                                <div className={styles.partDetails}>
                                  <span className={styles.partDescription}>{damage.description}</span>
                                  <div className={styles.partMeta}>
                                    <span
                                      className={`${styles.severityBadge} ${styles['severity' + damage.severity]}`}
                                    >
                                      Severity {damage.severity}/5
                                    </span>
                                    <span className={styles.partCost}>
                                      ₪{damage.cost.toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={styles.assessmentFooter}>
                        <span className={styles.assessmentTime}>
                          Assessed{' '}
                          {assessment.assessmentDate
                            ? new Date(assessment.assessmentDate).toLocaleString()
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUploadSection;
