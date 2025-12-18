import axios from 'axios';

const API_URL = 'http://localhost:8080/api/reports';

export interface DamageArea {
  area: string;
  severity: number;
  cost: number;
  description?: string;
}

export interface DamageReport {
  id?: string;
  username?: string;
  imageId: string;
  damageAreas: DamageArea[];
  totalCost: number;
  totalLoss: boolean;
  assessmentDate?: string;
  eventDate?: string;
  status?: string;
}

export const reportApi = {
  async getUserDamageReports(): Promise<DamageReport[]> {
    const token = localStorage.getItem('token');
    const response = await axios.get<DamageReport[]>(`${API_URL}/damage-assessments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },

  async deleteReport(reportId: string): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/${reportId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  },

  async deleteAllReports(): Promise<void> {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
  }
};
