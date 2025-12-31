import { API_BASE_PATHS, API_PATH_SEGMENTS } from '../constants/api.constants';

export const IMAGES_BASE_PATH = API_BASE_PATHS.images;
export const IMAGES_UPLOAD_PATH = `${IMAGES_BASE_PATH}/${API_PATH_SEGMENTS.upload}`;
export const IMAGES_MY_IMAGES_PATH = `${IMAGES_BASE_PATH}/${API_PATH_SEGMENTS.myImages}`;
export const buildImagePath = (imageId: string) => `${IMAGES_BASE_PATH}/${imageId}`;
