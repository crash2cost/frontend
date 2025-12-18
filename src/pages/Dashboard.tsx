import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { AlertTriangle, Upload, CheckCircle, XCircle, History, Sparkles, Trash2 } from 'lucide-react';
import { ImageUpload } from '../components/common';
import type { ImageResponse } from '../api/image.api';
import { imageApi } from '../api/image.api';
import { mlApi } from '../api/ml.api';
import { assessmentApi } from '../api/assessment.api';
import { reportApi, type DamageReport } from '../api/report.api';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [uploading, setUploading] = useState(false);
  const [assessments, setAssessments] = useState<Map<string, DamageReport>>(new Map());
  const [processing, setProcessing] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const images = await imageApi.getMyImages();
      setUploadedImages(images);
      
      // Load existing assessments from report-service
      const reports = await reportApi.getUserDamageReports();
      const assessmentMap = new Map<string, DamageReport>();
      reports.forEach(report => {
        assessmentMap.set(report.imageId, report);
      });
      setAssessments(assessmentMap);
    } catch (error) {
      console.error('Failed to load images:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      for (const file of files) {
        await imageApi.uploadImage(file);
      }
      await loadImages();
    } catch (error) {
      console.error('Failed to upload images:', error);
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (imageId: string) => {
    setProcessing(prev => new Set(prev).add(imageId));
    try {
      // Generate assessment with ML
      const assessment = await mlApi.assessDamage(imageId);
      
      // Save to database
      const savedAssessment = await assessmentApi.saveAssessment(assessment);
      
      // Update local state
      setAssessments(prev => new Map(prev).set(imageId, savedAssessment));
    } catch (error) {
      console.error('Failed to process image:', error);
      alert('Failed to process image with ML. Please try again.');
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const handleDeleteOldReports = async () => {
    if (!confirm('Are you sure you want to delete all reports? This action cannot be undone.')) {
      return;
    }
    try {
      await reportApi.deleteAllReports();
      setAssessments(new Map());
      alert('All reports deleted successfully');
    } catch (error) {
      console.error('Failed to delete reports:', error);
      alert('Failed to delete reports. Please try again.');
    }
  };

  // Calculate totals from assessments
  const totalAssessed = assessments.size;
  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Crash2Cost</h1>
          <p className={styles.subtitle}>Welcome back! Here's your crash analytics overview</p>
        </div>
        <div className={styles.headerButtons}>
          <button onClick={handleDeleteOldReports} className={styles.deleteButton}>
            <Trash2 size={20} />
            Delete All Reports
          </button>
          <button onClick={() => navigate('/history')} className={styles.historyButton}>
            <History size={20} />
            View History
          </button>
          <button onClick={logout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Images Assessed</span>
            <Upload size={24} style={{ color: '#38bdf8' }} />
          </div>
          <div className={styles.statValue}>{totalAssessed}</div>
          <div className={styles.statTrend} style={{ color: '#38bdf8' }}>
            {uploadedImages.length} total uploaded
          </div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statTitle}>Total Damage Cost</span>
            <AlertTriangle size={24} style={{ color: '#f97316' }} />
          </div>
          <div className={styles.statValue}>₪{totalCost.toLocaleString()}</div>
          <div className={styles.statTrend} style={{ color: '#f97316' }}>
            {totalLossCount} total loss cases
          </div>
        </div>
      </div>

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

          <ImageUpload onUpload={handleUpload} maxFiles={10} maxSizeMB={10} />

          {uploading && (
            <div className={styles.uploadingMessage}>
              Uploading images...
            </div>
          )}

          {/* Show all assessments */}
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
                          onClick={() => processImage(image.id)}
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
                          <div className={`${styles.statusBadge} ${assessment.totalLoss ? styles.totalLossBadge : styles.repairableBadge}`}>
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
                            <span className={styles.costAmount}>₪{assessment.totalCost.toLocaleString()}</span>
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
                                      <span className={`${styles.severityBadge} ${styles['severity' + damage.severity]}`}>
                                        Severity {damage.severity}/5
                                      </span>
                                      <span className={styles.partCost}>₪{damage.cost.toLocaleString()}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className={styles.assessmentFooter}>
                          <span className={styles.assessmentTime}>
                            Assessed {assessment.assessmentDate ? new Date(assessment.assessmentDate).toLocaleString() : 'Recently'}
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

        {uploadedImages.length === 0 && (
          <div className={styles.emptyState}>
            <AlertTriangle size={64} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No images uploaded yet</h3>
            <p className={styles.emptyText}>
              Upload crash images to start documenting incidents
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
