import axios from 'axios';

import {
  API_BASE_URL,
  API_BASE_PATHS,
  AUTH_SCHEME,
  CONTENT_TYPES,
  HEADER_NAMES,
  STORAGE_KEYS,
} from '../constants/api.constants';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    [HEADER_NAMES.contentType]: CONTENT_TYPES.json,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.authToken);
    const requestUrl = config.url ?? '';
    const isAuthRequest = requestUrl.startsWith(API_BASE_PATHS.auth) && !requestUrl.includes('admin-access');
    if (token && !isAuthRequest) {
      config.headers[HEADER_NAMES.authorization] = `${AUTH_SCHEME} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const requestUrl = error.config?.url ?? '';
      const isAuthRequest = requestUrl.startsWith(API_BASE_PATHS.auth);
      if (!isAuthRequest) {
        localStorage.removeItem(STORAGE_KEYS.authToken);
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
