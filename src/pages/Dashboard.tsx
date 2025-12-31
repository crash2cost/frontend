import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import DashboardEmptyState from './dashboard/DashboardEmptyState';
import DashboardHeader from './dashboard/DashboardHeader';
import DashboardStats from './dashboard/DashboardStats';
import DashboardUploadSection from './dashboard/DashboardUploadSection';
import { imageApi, type ImageResponse } from '../api/image.api';
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
    let images: ImageResponse[] = [];
    let reports: DamageReport[] = [];

    try {
      images = await imageApi.getMyImages();
      reports = await reportApi.getUserDamageReports();
    } catch (error) {
      console.error('Failed to load images:', error);
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
      alert('Failed to upload images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const processImage = async (imageId: string) => {
    setProcessing(prev => new Set(prev).add(imageId));
    try {
      
      const assessment = await mlApi.assessDamage(imageId);
      
      
      const savedAssessment = await assessmentApi.saveAssessment(assessment);
      
      
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

  
  const totalAssessed = assessments.size;
  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;

  return (
    <div className={styles.container}>
      <DashboardHeader
        onDeleteAllReports={handleDeleteOldReports}
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
