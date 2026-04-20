import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { imageApi } from '../../api/image.api';
import { reportApi, type DamageReport } from '../../api/report.api';
import type { ImageResponse } from '../../api/image.api';
import { Toast } from '../../components/common';
import { STORAGE_KEYS } from '../../constants/api.constants';
import { getTokenRole } from '../../utils/jwt';
import HistoryGrid from './HistoryGrid';
import HistoryHeader from './HistoryHeader';
import HistorySummary from './HistorySummary';
import {
  HISTORY_ALERT_MESSAGES,
  HISTORY_LOG_MESSAGES,
  HISTORY_ROUTES,
  HISTORY_TEXT,
} from './history.constants';
import styles from './History.module.css';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }
  }
};

const History: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [assessments, setAssessments] = useState<Map<string, DamageReport>>(new Map());
  const [loading, setLoading] = useState(true);
  const [selectedImageIds, setSelectedImageIds] = useState<Set<string>>(new Set());
  const [readOnly, setReadOnly] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<{ message: string; variant: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    let images: ImageResponse[] = [];
    let reports: DamageReport[] = [];

    try {
      const token = localStorage.getItem(STORAGE_KEYS.authToken);
      const role = token ? getTokenRole(token) : null;
      const isAdmin = role?.toUpperCase() === 'ADMIN';
      setReadOnly(isAdmin);
      setIsAdmin(isAdmin);

      if (isAdmin) {
        const pageResponse = await reportApi.getAllDamageReports(0, 100);
        reports = pageResponse.content;
        const imageMap = new Map<string, ImageResponse>();
        reports.forEach(report => {
          if (!report.imageId) {
            return;
          }
          if (!imageMap.has(report.imageId)) {
            imageMap.set(report.imageId, {
              id: report.imageId,
              filename: report.imageId,
              contentType: 'image/*',
              size: 0,
              uploadDate: report.assessmentDate || report.eventDate || new Date().toISOString(),
            });
          }
        });
        images = Array.from(imageMap.values());
      } else {
        images = await imageApi.getMyImages();
        reports = await reportApi.getUserDamageReports();
      }
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.loadFailure, error);
      return;
    } finally {
      setLoading(false);
    }

    const assessmentMap = new Map<string, DamageReport>();
    reports.forEach(report => {
      if (report.imageId) {
        const existing = assessmentMap.get(report.imageId);
        if (!existing || (report.assessmentDate && existing.assessmentDate &&
            new Date(report.assessmentDate) > new Date(existing.assessmentDate))) {
          assessmentMap.set(report.imageId, report);
        }
      }
    });
    setAssessments(assessmentMap);

    const imageMap = new Map<string, ImageResponse>();
    images.forEach(img => {
      imageMap.set(img.id, img);
    });

    const assessmentImages: ImageResponse[] = Array.from(assessmentMap.values())
      .filter(report => report.imageId)
      .map(report => {
        const matchingImage = imageMap.get(report.imageId!);
        return matchingImage || {
          id: report.imageId!,
          filename: 'Assessment Image',
          contentType: 'image/*',
          size: 0,
          uploadDate: report.assessmentDate || new Date().toISOString(),
        };
      });

    setUploadedImages(assessmentImages);

    const availableImageIds = new Set(assessmentImages.map(image => image.id));
    setSelectedImageIds(prev => {
      const next = new Set<string>();
      prev.forEach(id => {
        if (availableImageIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  };

  const handleDeleteAssessment = async (imageId: string) => {
    if (readOnly) {
      return;
    }
    if (!confirm(HISTORY_ALERT_MESSAGES.deleteConfirm)) {
      return;
    }
    try {
      const assessment = assessments.get(imageId);
      if (assessment?.id) {
        await reportApi.deleteReport(assessment.id);
      }
      await imageApi.deleteImage(imageId);
      setSelectedImageIds(prev => {
        const next = new Set(prev);
        next.delete(imageId);
        return next;
      });
      await loadHistory();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.deleteFailure, error);
      setToast({ message: HISTORY_ALERT_MESSAGES.deleteFailure, variant: 'error' });
    }
  };

  const handleDeleteSelected = async () => {
    if (readOnly) {
      return;
    }
    if (selectedImageIds.size === 0) {
      return;
    }
    if (!confirm(HISTORY_ALERT_MESSAGES.deleteSelectedConfirm)) {
      return;
    }
    try {
      await Promise.all(
        Array.from(selectedImageIds).map(async (imageId) => {
          const assessment = assessments.get(imageId);
          if (assessment?.id) {
            await reportApi.deleteReport(assessment.id);
          }
          await imageApi.deleteImage(imageId);
        })
      );
      setSelectedImageIds(new Set());
      await loadHistory();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.deleteFailure, error);
      setToast({ message: HISTORY_ALERT_MESSAGES.deleteFailure, variant: 'error' });
    }
  };

  const handleToggleSelect = (imageId: string) => {
    if (readOnly) {
      return;
    }
    setSelectedImageIds(prev => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (readOnly) {
      return;
    }
    const allImageIds = uploadedImages.map(image => image.id);
    setSelectedImageIds(prev => {
      if (prev.size === allImageIds.length) {
        return new Set();
      }
      return new Set(allImageIds);
    });
  };

  // Filter by username when admin is searching
  const filteredImages = isAdmin && searchQuery
    ? uploadedImages.filter(img => {
        const report = assessments.get(img.id);
        return report?.username?.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : uploadedImages;

  const filteredAssessments = isAdmin && searchQuery
    ? new Map(Array.from(assessments.entries()).filter(
        ([, report]) => report.username?.toLowerCase().includes(searchQuery.toLowerCase())
      ))
    : assessments;

  const totalCost = Array.from(filteredAssessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(filteredAssessments.values()).filter(a => a.totalLoss).length;
  const totalSelectable = filteredImages.length;

  return (
    <motion.div
      className={styles.container}
      variants={pageVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {toast && (
          <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <HistoryHeader
          onBack={() => navigate(HISTORY_ROUTES.dashboard)}
          onDeleteSelected={handleDeleteSelected}
          onToggleSelectAll={handleToggleSelectAll}
          selectedCount={selectedImageIds.size}
          totalSelectable={totalSelectable}
          readOnly={readOnly}
          isAdmin={isAdmin}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            className={styles.loading}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="loading"
          >
            <div className={styles.spinner}></div>
            <p>{HISTORY_TEXT.loading}</p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0 }}
          >
            <motion.div variants={itemVariants}>
              <HistorySummary
                totalAssessments={filteredAssessments.size}
                totalCost={totalCost}
                totalLossCount={totalLossCount}
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <HistoryGrid
                uploadedImages={filteredImages}
                assessments={filteredAssessments}
                onDeleteAssessment={handleDeleteAssessment}
                onToggleSelect={handleToggleSelect}
                selectedReportIds={selectedImageIds}
                onGoToDashboard={() => navigate(HISTORY_ROUTES.dashboard)}
                readOnly={readOnly}
                isAdmin={isAdmin}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default History;
