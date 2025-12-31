import { api } from './axios';
import {
  API_BASE_URL,
  CONTENT_TYPES,
  FORM_FIELD_NAMES,
  HEADER_NAMES,
} from '../constants/api.constants';
import {
  IMAGES_MY_IMAGES_PATH,
  IMAGES_UPLOAD_PATH,
  buildImagePath,
} from './image.paths';

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
    formData.append(FORM_FIELD_NAMES.imageFile, file);
    
    const response = await api.post<ImageResponse>(IMAGES_UPLOAD_PATH, formData, {
      headers: {
        [HEADER_NAMES.contentType]: CONTENT_TYPES.multipart,
      },
    });
    
    return response.data;
  },

  getMyImages: async (): Promise<ImageResponse[]> => {
    const response = await api.get<ImageResponse[]>(IMAGES_MY_IMAGES_PATH);
    return response.data;
  },

  getImageUrl: (imageId: string): string => {
    return `${API_BASE_URL}${buildImagePath(imageId)}`;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    await api.delete(buildImagePath(imageId));
  },
};
