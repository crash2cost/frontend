import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, XCircle, Calendar, Trash2 } from 'lucide-react';
import { imageApi } from '../api/image.api';
import { reportApi, type DamageReport } from '../api/report.api';
import type { ImageResponse } from '../api/image.api';
import styles from './History.module.css';

const History: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [assessments, setAssessments] = useState<Map<string, DamageReport>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const images = await imageApi.getMyImages();
      setUploadedImages(images);
      
      // Load assessments from report-service
      const reports = await reportApi.getUserDamageReports();
      const assessmentMap = new Map<string, DamageReport>();
      reports.forEach(report => {
        assessmentMap.set(report.imageId, report);
      });
      setAssessments(assessmentMap);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssessment = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this assessment? This action cannot be undone.')) {
      return;
    }
    try {
      await reportApi.deleteReport(reportId);
      await loadHistory();
    } catch (error) {
      console.error('Failed to delete assessment:', error);
      alert('Failed to delete assessment. Please try again.');
    }
  };

  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Assessment History</h1>
          <p className={styles.subtitle}>View all your previous damage assessments</p>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading your history...</p>
        </div>
      ) : (
        <>
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Assessments</span>
              <span className={styles.summaryValue}>{uploadedImages.length}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Cost</span>
              <span className={styles.summaryValue}>₪{totalCost.toLocaleString()}</span>
            </div>
            <div className={styles.summaryCard}>
              <span className={styles.summaryLabel}>Total Loss Cases</span>
              <span className={styles.summaryValue}>{totalLossCount}</span>
            </div>
          </div>

          {uploadedImages.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={64} className={styles.emptyIcon} />
              <h3 className={styles.emptyTitle}>No history yet</h3>
              <p className={styles.emptyText}>
                Upload crash images to start building your assessment history
              </p>
              <button onClick={() => navigate('/dashboard')} className={styles.dashboardButton}>
                Go to Dashboard
              </button>
            </div>
          ) : (
            <div className={styles.historyGrid}>
              {uploadedImages.map((image) => {
                const assessment = assessments.get(image.id);

                return (
                  <div key={image.id} className={styles.historyCard}>
                    <div className={styles.cardHeader}>
                      <div className={styles.cardDate}>
                        <Calendar size={16} />
                        <span>{new Date(image.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <div className={styles.cardActions}>
                        {assessment && (
                          <>
                            <div className={`${styles.statusBadge} ${assessment.totalLoss ? styles.totalLoss : styles.repairable}`}>
                              {assessment.totalLoss ? (
                                <>
                                  <XCircle size={16} />
                                  <span>Total Loss</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle size={16} />
                                  <span>Repairable</span>
                                </>
                              )}
                            </div>
                            <button 
                              onClick={() => handleDeleteAssessment(assessment.id!)}
                              className={styles.deleteButton}
                              title="Delete assessment"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {assessment ? (
                      <>
                        <div className={styles.costDisplay}>
                          <span className={styles.costLabel}>Total Cost</span>
                          <span className={styles.costValue}>₪{assessment.totalCost.toLocaleString()}</span>
                        </div>

                        <div className={styles.damageList}>
                          <h4 className={styles.damageTitle}>
                            <AlertTriangle size={16} />
                            Damaged Parts ({assessment.damageAreas.length})
                          </h4>
                          {assessment.damageAreas.map((damage) => (
                            <div key={`${image.id}-${damage.area}`} className={styles.damageItem}>
                              <div className={styles.damageName}>{damage.area}</div>
                              <div className={styles.damageInfo}>
                                <span className={`${styles.severityTag} ${styles['severity' + damage.severity]}`}>
                                  Lvl {damage.severity}
                                </span>
                                <span className={styles.damageCost}>₪{damage.cost.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className={styles.noAssessment}>
                        <p>Assessment not available</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default History;
