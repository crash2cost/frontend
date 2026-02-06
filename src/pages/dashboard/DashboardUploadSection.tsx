import { AlertTriangle, Car, CheckCircle, Sparkles, Upload, XCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload, Select } from '../../components/common';
import { imageApi, type ImageResponse } from '../../api/image.api';
import { CAR_CATEGORY_OPTIONS, type CarCategory } from '../../api/ml.api';
import type { DamageReport } from '../../api/report.api';
import styles from '../Dashboard.module.css';

type DashboardUploadSectionProps = {
  assessments: Map<string, DamageReport>;
  processing: Set<string>;
  uploadedImages: ImageResponse[];
  uploading: boolean;
  onProcessImage: (imageId: string, carCategory: CarCategory) => void;
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
  const [imageUrls, setImageUrls] = useState<Map<string, string>>(new Map());
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [carCategory, setCarCategory] = useState<CarCategory>('sedan');
  const imageUrlRef = useRef<Map<string, string>>(new Map());
  const imageErrorRef = useRef<Set<string>>(new Set());

  const sortedImages = useMemo(() => {
    return [...uploadedImages].sort((a, b) => {
      const aTime = new Date(a.uploadDate).getTime();
      const bTime = new Date(b.uploadDate).getTime();
      return bTime - aTime;
    });
  }, [uploadedImages]);

  const latestImage = sortedImages[0];
  const uploadedIds = useMemo(() => (latestImage ? [latestImage.id] : []), [latestImage]);

  useEffect(() => {
    let isMounted = true;
    const nextUrls = new Map(imageUrlRef.current);
    const nextErrors = new Set(imageErrorRef.current);
    const activeIds = new Set(uploadedIds);

    nextUrls.forEach((url, id) => {
      if (!activeIds.has(id)) {
        URL.revokeObjectURL(url);
        nextUrls.delete(id);
      }
    });

    nextErrors.forEach((id) => {
      if (!activeIds.has(id)) {
        nextErrors.delete(id);
      }
    });

    const loadImages = async () => {
      for (const imageId of uploadedIds) {
        if (nextUrls.has(imageId) || nextErrors.has(imageId)) {
          continue;
        }
        try {
          const blob = await imageApi.getImageBlob(imageId);
          const objectUrl = URL.createObjectURL(blob);
          if (!isMounted) {
            URL.revokeObjectURL(objectUrl);
            return;
          }
          nextUrls.set(imageId, objectUrl);
        } catch {
          nextErrors.add(imageId);
        }
      }

      if (isMounted) {
        imageUrlRef.current = new Map(nextUrls);
        imageErrorRef.current = new Set(nextErrors);
        setImageUrls(new Map(nextUrls));
        setImageErrors(new Set(nextErrors));
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      nextUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [uploadedIds]);

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

        {latestImage && (
          <div className={styles.assessmentsContainer}>
            {(() => {
              const image = latestImage;
              const assessment = assessments.get(image.id);
              const isProcessing = processing.has(image.id);

              return (
                <div key={image.id} className={styles.imageCard}>
                  {imageUrls.get(image.id) && !imageErrors.has(image.id) ? (
                    <img
                      src={imageUrls.get(image.id)}
                      alt="Crash damage"
                      className={styles.damageImage}
                    />
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <div className={styles.imagePlaceholderIcon}></div>
                      <span>Image unavailable</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {!assessment && !isProcessing && (
                      <motion.div
                        className={styles.mlButtonContainer}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <div className={styles.carCategorySelect}>
                          <Select
                            label="Car Type"
                            icon={Car}
                            options={[...CAR_CATEGORY_OPTIONS]}
                            value={carCategory}
                            onChange={(value) => setCarCategory(value as CarCategory)}
                          />
                        </div>
                        <motion.button
                          onClick={() => onProcessImage(image.id, carCategory)}
                          className={styles.mlButton}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Sparkles size={20} />
                          Process with AI
                        </motion.button>
                        <p className={styles.mlDescription}>
                          Select your car type and click to analyze damage
                        </p>
                      </motion.div>
                    )}

                    {isProcessing && (
                      <motion.div
                        className={styles.processingBox}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        <div className={styles.spinner}></div>
                        <span>Analyzing damage with AI...</span>
                      </motion.div>
                    )}

                    {assessment && (
                      <motion.div
                        className={styles.resultsBox}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                      >
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardUploadSection;
