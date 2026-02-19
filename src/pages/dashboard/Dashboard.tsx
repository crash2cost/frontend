import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks';
import DashboardEmptyState from './DashboardEmptyState';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import DashboardUploadSection from './DashboardUploadSection';
import { Toast } from '../../components/common';
import { imageApi, type ImageResponse } from '../../api/image.api';
import { mlApi, type CarCategory } from '../../api/ml.api';
import { reportApi, type DamageReport } from '../../api/report.api';
import styles from './Dashboard.module.css';

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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [uploadedImages, setUploadedImages] = useState<ImageResponse[]>([]);
  const [uploading, setUploading] = useState(false);
  const [assessments, setAssessments] = useState<Map<string, DamageReport>>(new Map());
  const [processing, setProcessing] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; variant: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 4000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const reports = await reportApi.getUserDamageReports();
      const assessmentMap = new Map<string, DamageReport>();
      reports.forEach(report => {
        assessmentMap.set(report.imageId, report);
      });
      setAssessments(assessmentMap);
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      const newImages: ImageResponse[] = [];
      for (const file of files) {
        const uploaded = await imageApi.uploadImage(file);
        newImages.push(uploaded);
      }
      setUploadedImages(prev => [...newImages, ...prev]);
    } catch (error) {
      console.error('Failed to upload images:', error);
      setToast({ message: 'Failed to upload images. Please try again.', variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (imageId: string, carCategory: CarCategory) => {
    setProcessing(prev => new Set(prev).add(imageId));
    try {
      const assessment = await mlApi.assessDamage(imageId, carCategory);
      setAssessments(prev => new Map(prev).set(imageId, assessment));
    } catch (error) {
      console.error('Failed to process image:', error);
      setToast({ message: 'Failed to process image. Please try again.', variant: 'error' });
    } finally {
      setProcessing(prev => {
        const newSet = new Set(prev);
        newSet.delete(imageId);
        return newSet;
      });
    }
  };

  const totalAssessed = assessments.size;
  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;
  const isBusy = uploading || processing.size > 0;
  const busyMessage = uploading ? 'Uploading images...' : 'Analyzing damage with AI...';

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

      <AnimatePresence>
        {isBusy && (
          <motion.div
            className={styles.busyOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-live="polite"
            aria-busy="true"
          >
            <motion.div
              className={styles.busyContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.busySpinner}></div>
              <span>{busyMessage}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div variants={itemVariants}>
        <DashboardHeader
          onGoToHistory={() => navigate('/history')}
          onLogout={logout}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardStats
          totalAssessed={totalAssessed}
          totalCost={totalCost}
          totalLossCount={totalLossCount}
          totalUploaded={uploadedImages.length}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardUploadSection
          assessments={assessments}
          processing={processing}
          uploadedImages={uploadedImages}
          uploading={uploading}
          onProcessImage={processImage}
          onUpload={handleUpload}
        />
      </motion.div>

      <AnimatePresence>
        {uploadedImages.length === 0 && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
          >
            <DashboardEmptyState />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
