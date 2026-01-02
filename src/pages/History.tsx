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
  const [selectedReportIds, setSelectedReportIds] = useState<Set<string>>(new Set());

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
    const availableReportIds = new Set(reports.map(report => report.id).filter(Boolean) as string[]);
    setSelectedReportIds(prev => {
      const next = new Set<string>();
      prev.forEach(id => {
        if (availableReportIds.has(id)) {
          next.add(id);
        }
      });
      return next;
    });
  };

  const handleDeleteAssessment = async (reportId: string) => {
    if (!confirm(HISTORY_ALERT_MESSAGES.deleteConfirm)) {
      return;
    }
    try {
      await reportApi.deleteReport(reportId);
      setSelectedReportIds(prev => {
        const next = new Set(prev);
        next.delete(reportId);
        return next;
      });
      await loadHistory();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.deleteFailure, error);
      alert(HISTORY_ALERT_MESSAGES.deleteFailure);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedReportIds.size === 0) {
      return;
    }
    if (!confirm(HISTORY_ALERT_MESSAGES.deleteSelectedConfirm)) {
      return;
    }
    try {
      await Promise.all(Array.from(selectedReportIds).map(reportId => reportApi.deleteReport(reportId)));
      setSelectedReportIds(new Set());
      await loadHistory();
    } catch (error) {
      console.error(HISTORY_LOG_MESSAGES.deleteFailure, error);
      alert(HISTORY_ALERT_MESSAGES.deleteFailure);
    }
  };

  const handleToggleSelect = (reportId: string) => {
    setSelectedReportIds(prev => {
      const next = new Set(prev);
      if (next.has(reportId)) {
        next.delete(reportId);
      } else {
        next.add(reportId);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    const allReportIds = Array.from(assessments.values())
      .map(report => report.id)
      .filter(Boolean) as string[];
    setSelectedReportIds(prev => {
      if (prev.size === allReportIds.length) {
        return new Set();
      }
      return new Set(allReportIds);
    });
  };

  const totalCost = Array.from(assessments.values()).reduce((sum, a) => sum + a.totalCost, 0);
  const totalLossCount = Array.from(assessments.values()).filter(a => a.totalLoss).length;
  const totalSelectable = Array.from(assessments.values()).filter(a => a.id).length;

  return (
    <div className={styles.container}>
      <HistoryHeader
        onBack={() => navigate(HISTORY_ROUTES.dashboard)}
        onDeleteSelected={handleDeleteSelected}
        onToggleSelectAll={handleToggleSelectAll}
        selectedCount={selectedReportIds.size}
        totalSelectable={totalSelectable}
      />

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
            onToggleSelect={handleToggleSelect}
            selectedReportIds={selectedReportIds}
            onGoToDashboard={() => navigate(HISTORY_ROUTES.dashboard)}
          />
        </>
      )}
    </div>
  );
};

export default History;
