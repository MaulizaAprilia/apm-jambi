import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const resolveApiAssetUrl = (path) => {
  if (!path || path === '#' || typeof path !== 'string') return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }

  // Normalize Windows slashes and ensure leading slash
  const cleanPath = path.replace(/\\/g, '/');
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

  if (/^https?:\/\//i.test(API_BASE_URL)) {
    try {
      return new URL(normalizedPath, new URL(API_BASE_URL).origin).toString();
    } catch {
      return normalizedPath;
    }
  }

  return normalizedPath;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('apm_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('apm_admin_token');
      sessionStorage.removeItem('apm_admin_user');
    }
    return Promise.reject(error);
  },
);

export default api;
