import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import DashboardEmptyState from './dashboard/DashboardEmptyState';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import DashboardUploadSection from './dashboard/DashboardUploadSection';
import { Toast } from '../components/common';
import { imageApi, type ImageResponse } from '../api/image.api';
import { mlApi } from '../api/ml.api';
import { reportApi, type DamageReport } from '../api/report.api';
import styles from './Dashboard.module.css';

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
    loadImages();
  }, []);

  const loadImages = async () => {
    let images: ImageResponse[] = [];
    let reports: DamageReport[] = [];

    try {
      images = await imageApi.getMyImages();
      reports = await reportApi.getUserDamageReports();
    } catch (error) {
      console.error('Failed to load images:', error);
      setToast({ message: 'Failed to load your images. Please refresh.', variant: 'error' });
      return;
    }

    setUploadedImages(images);

    
    const assessmentMap = new Map<string, DamageReport>();
    reports.forEach(report => {
      assessmentMap.set(report.imageId, report);
    });
    setAssessments(assessmentMap);
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
      setToast({ message: 'Failed to upload images. Please try again.', variant: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (imageId: string) => {
    setProcessing(prev => new Set(prev).add(imageId));
    try {
      
      const assessment = await mlApi.assessDamage(imageId);
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
    <div className={styles.container}>
      {toast && (
        <Toast message={toast.message} variant={toast.variant} onClose={() => setToast(null)} />
      )}

      {isBusy && (
        <div className={styles.busyOverlay} aria-live="polite" aria-busy="true">
          <div className={styles.busyContent}>
            <div className={styles.busySpinner}></div>
            <span>{busyMessage}</span>
          </div>
        </div>
      )}

      <DashboardHeader
        onGoToHistory={() => navigate('/history')}
        onLogout={logout}
      />

      <DashboardStats
        totalAssessed={totalAssessed}
        totalCost={totalCost}
        totalLossCount={totalLossCount}
        totalUploaded={uploadedImages.length}
      />

      <DashboardUploadSection
        assessments={assessments}
        processing={processing}
        uploadedImages={uploadedImages}
        uploading={uploading}
        onProcessImage={processImage}
        onUpload={handleUpload}
      />

      {uploadedImages.length === 0 && <DashboardEmptyState />}
    </div>
  );
};

export default Dashboard;
