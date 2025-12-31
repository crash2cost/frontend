import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { imageApi } from '../api/image.api';
import { reportApi, type DamageReport } from '../api/report.api';
import type { ImageResponse } from '../api/image.api';
import HistoryGrid from './history/HistoryGrid';
import HistoryHeader from './history/HistoryHeader';
import HistorySummary from './history/HistorySummary';
import {
  HISTORY_ALERT_MESSAGES,
  HISTORY_LOG_MESSAGES,
  HISTORY_ROUTES,
  HISTORY_TEXT,
} from './history.constants';
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
    let images: ImageResponse[] = [];
    let reports: DamageReport[] = [];

    try {
      images = await imageApi.getMyImages();
      reports = await reportApi.getUserDamageReports();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.loadFailure, error);
      return;
    } finally {
      setLoading(false);
    }

    setUploadedImages(images);

    const assessmentMap = new Map<string, DamageReport>();
    reports.forEach(report => {
      assessmentMap.set(report.imageId, report);
    });
    setAssessments(assessmentMap);
  };

  const handleDeleteAssessment = async (reportId: string) => {
    if (!confirm(HISTORY_ALERT_MESSAGES.deleteConfirm)) {
      return;
    }
    try {
      await reportApi.deleteReport(reportId);
      await loadHistory();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.deleteFailure, error);
      alert(HISTORY_ALERT_MESSAGES.deleteFailure);
    }
  };

  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;

  return (
    <div className={styles.container}>
      <HistoryHeader onBack={() => navigate(HISTORY_ROUTES.dashboard)} />

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>{HISTORY_TEXT.loading}</p>
        </div>
      ) : (
        <>
          <HistorySummary
            totalAssessments={uploadedImages.length}
            totalCost={totalCost}
            totalLossCount={totalLossCount}
          />
          <HistoryGrid
            uploadedImages={uploadedImages}
            assessments={assessments}
            onDeleteAssessment={handleDeleteAssessment}
            onGoToDashboard={() => navigate(HISTORY_ROUTES.dashboard)}
          />
        </>
      )}
    </div>
  );
};

export default History;
