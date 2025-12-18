import axios from 'axios';

const API_URL = 'http://localhost:8080/api/assessments';

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
    const token = localStorage.getItem('token');
    const response = await axios.post<DamageAssessment>(API_URL, assessment, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async getUserAssessments(): Promise<DamageAssessment[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get<DamageAssessment[]>(API_URL, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async getAssessmentByImageId(imageId: string): Promise<DamageAssessment | null> {
    try {
      const response = await axios.get<DamageAssessment>(`${API_URL}/image/${imageId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch assessment:', error);
      return null;
    }
  },

  async deleteAssessment(assessmentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${assessmentId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async deleteAllAssessments(): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
