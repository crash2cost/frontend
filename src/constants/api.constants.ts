export const DEFAULT_API_BASE_URL = 'http://localhost:8080';

export const API_BASE_URL = import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL;

export const API_BASE_PATHS = {
  auth: '/api/auth',
  assessments: '/api/assessments',
  reports: '/api/reports',
  images: '/api/images',
  admin: '/api/admin',
};

export const API_PATH_SEGMENTS = {
  all: 'all',
  image: 'image',
  upload: 'upload',
  myImages: 'my-images',
  damageAssessments: 'damage-assessments',
  login: 'login',
  signup: 'signup',
};

export const STORAGE_KEYS = {
  authToken: 'token',
};

export const HEADER_NAMES = {
  authorization: 'Authorization',
  contentType: 'Content-Type',
};

export const CONTENT_TYPES = {
  json: 'application/json',
  multipart: 'multipart/form-data',
};

export const AUTH_SCHEME = 'Bearer';

export const FORM_FIELD_NAMES = {
  imageFile: 'file',
};

export const API_MESSAGES = {
  assessmentFetchFailed: 'Failed to fetch assessment:',
};
