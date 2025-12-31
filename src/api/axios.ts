import axios from 'axios';

import {
  API_BASE_URL,
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
    if (token) {
      config.headers[HEADER_NAMES.authorization] = `${AUTH_SCHEME} ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
