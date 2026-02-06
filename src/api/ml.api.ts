import { api } from './axios';
import { REPORTS_AI_ASSESSMENTS_PATH } from './report.paths';
import type { DamageReport } from './report.api';

export type CarCategory =
  | 'small'
  | 'sedan'
  | 'family_suv'
  | 'truck'
  | 'minivan'
  | 'sports'
  | 'luxury'
  | 'electric';

export const CAR_CATEGORY_OPTIONS = [
  { value: 'small', label: 'Small / Compact' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'family_suv', label: 'Family / SUV' },
  { value: 'truck', label: 'Truck / Pickup' },
  { value: 'minivan', label: 'Minivan' },
  { value: 'sports', label: 'Sports Car' },
  { value: 'luxury', label: 'Luxury' },
  { value: 'electric', label: 'Electric' },
] as const;

export const mlApi = {
  async assessDamage(imageId: string, carCategory: CarCategory = 'sedan'): Promise<DamageReport> {
    try {
      const response = await api.post<DamageReport>(REPORTS_AI_ASSESSMENTS_PATH, {
        imageId,
        severity: 3,
        carSegment: carCategory,
      });
      return response.data;
    } catch (error) {
      console.error('ML assessment failed:', error);
      throw error;
    }
  }
};
