import api from './api';

const TOKEN_KEY = 'apm_admin_token';
const USER_KEY = 'apm_admin_user';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/admin/login', credentials);
    if (response.data.success && response.data.data?.token) {
      sessionStorage.setItem(TOKEN_KEY, response.data.data.token);
      sessionStorage.setItem(USER_KEY, JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/admin/logout');
    } finally {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  },

  getCurrentUser: async () => {
    const response = await api.get('/admin/me');
    return response.data;
  },

  isAuthenticated: () => {
    return Boolean(sessionStorage.getItem(TOKEN_KEY));
  },

  getUserData: () => {
    const user = sessionStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
};
