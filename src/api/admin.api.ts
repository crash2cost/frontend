import { api } from './axios';
import type { AuthResponse } from '../types';
import type { PageResponse } from './report.api';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  assessmentCount: number;
}

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalAssessments: number;
  totalCostSum: number;
}

export const adminApi = {
  async getUsers(page = 0, size = 20, search = ''): Promise<PageResponse<AdminUser>> {
    const response = await api.get<PageResponse<AdminUser>>('/api/admin/users', {
      params: { page, size, search },
    });
    return response.data;
  },

  async getUserById(id: string): Promise<AdminUser> {
    const response = await api.get<AdminUser>(`/api/admin/users/${id}`);
    return response.data;
  },

  async changeUserRole(id: string, role: 'USER' | 'ADMIN'): Promise<AdminUser> {
    const response = await api.put<AdminUser>(`/api/admin/users/${id}/role`, { role });
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await api.delete(`/api/admin/users/${id}`);
  },

  async getStats(): Promise<AdminStats> {
    const response = await api.get<AdminStats>('/api/admin/stats');
    return response.data;
  },

  async claimAdminAccess(secret: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/api/auth/admin-access', { secret });
    return response.data;
  },
};
