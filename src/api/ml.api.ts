import { api } from './axios';
import { REPORTS_AI_ASSESSMENTS_PATH } from './report.paths';
import type { DamageAssessment } from '../types/damage';

export const mlApi = {
  async assessDamage(imageId: string): Promise<DamageAssessment> {
    try {
      const response = await api.post<DamageAssessment>(REPORTS_AI_ASSESSMENTS_PATH, {
        imageId,
        severity: 3,
        carSegment: 'Family',
      });
      return response.data;
    } catch (error) {
      console.error('ML assessment failed:', error);
      throw error;
    }
  }
};
