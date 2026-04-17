import { api } from './axios';

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
  assessmentSource?: 'ML' | 'FALLBACK' | 'MANUAL';
  fallbackReason?: string;
  eventDate?: string;
  status?: string;
}

export const reportApi = {
  async getUserDamageReports(): Promise<DamageReport[]> {
    const response = await api.get<DamageReport[]>('/api/assessments');
    return response.data;
  },

  async getAllDamageReports(): Promise<DamageReport[]> {
    const response = await api.get<DamageReport[]>('/api/assessments/all');
    return response.data;
  },

  async deleteReport(reportId: string): Promise<void> {
    await api.delete(`/api/assessments/${reportId}`);
  },

  async deleteAllReports(): Promise<void> {
    await api.delete('/api/assessments/all');
  }
};
