import { api } from './axios';
import {
  REPORTS_ALL_PATH,
  REPORTS_DAMAGE_ASSESSMENTS_PATH,
  buildReportPath,
} from './report.paths';

export interface DamageArea {
  area: string;
  severity: number;
  cost: number;
  description?: string;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DamageRegion {
  part: string;
  severity: number;
  bbox: BoundingBox;
  confidence: number;
}

export interface DamageReport {
  id?: string;
  username?: string;
  imageId: string;
  damageAreas: DamageArea[];
  damageRegions?: DamageRegion[];
  totalCost: number;
  totalLoss: boolean;
  assessmentDate?: string;
  eventDate?: string;
  status?: string;
}

export const reportApi = {
  async getUserDamageReports(): Promise<DamageReport[]> {
    const response = await api.get<DamageReport[]>(REPORTS_DAMAGE_ASSESSMENTS_PATH);
    return response.data;
  },

  async deleteReport(reportId: string): Promise<void> {
    await api.delete(buildReportPath(reportId));
  },

  async deleteAllReports(): Promise<void> {
    await api.delete(REPORTS_ALL_PATH);
  }
};
