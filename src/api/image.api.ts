import { api } from './axios';

export interface ImageResponse {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  uploadDate: string;
}

export const imageApi = {
  uploadImage: async (file: File): Promise<ImageResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post<ImageResponse>('/api/images/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  getMyImages: async (): Promise<ImageResponse[]> => {
    const response = await api.get<ImageResponse[]>('/api/images/my-images');
    return response.data;
  },

  getImageUrl: (imageId: string): string => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/images/${imageId}`;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await api.delete(`/api/images/${imageId}`);
  },
};
