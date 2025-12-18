import { api } from './axios';
import { API_BASE_PATHS, API_MESSAGES, API_PATH_SEGMENTS } from '../constants/api.constants';

const ASSESSMENTS_BASE_PATH = API_BASE_PATHS.assessments;
const ASSESSMENTS_ALL_PATH = `${ASSESSMENTS_BASE_PATH}/${API_PATH_SEGMENTS.all}`;
const buildAssessmentPath = (assessmentId: string) => `${ASSESSMENTS_BASE_PATH}/${assessmentId}`;
const buildAssessmentImagePath = (imageId: string) =>
  `${ASSESSMENTS_BASE_PATH}/${API_PATH_SEGMENTS.image}/${imageId}`;

export interface DamageArea {
  area: string;
  severity: number;
  cost: number;
  description?: string;
}

export interface DamageAssessment {
  id?: string;
  userId?: string;
  imageId: string;
  damageAreas: DamageArea[];
  totalCost: number;
  totalLoss: boolean;
  assessmentDate: string;
}

export const assessmentApi = {
  async saveAssessment(assessment: DamageAssessment): Promise<DamageAssessment> {
    const response = await api.post<DamageAssessment>(ASSESSMENTS_BASE_PATH, assessment);
    return response.data;
  },

  async getUserAssessments(): Promise<DamageAssessment[]> {
    const response = await api.get<DamageAssessment[]>(ASSESSMENTS_BASE_PATH);
    return response.data;
  },

  async getAssessmentByImageId(imageId: string): Promise<DamageAssessment | null> {
    try {
      const response = await api.get<DamageAssessment>(buildAssessmentImagePath(imageId));
      return response.data;
    } catch (error) {
      console.error(API_MESSAGES.assessmentFetchFailed, error);
      return null;
    }
  },

  async deleteAssessment(assessmentId: string): Promise<void> {
    await api.delete(buildAssessmentPath(assessmentId));
  },

  async deleteAllAssessments(): Promise<void> {
    await api.delete(ASSESSMENTS_ALL_PATH);
  }
};
