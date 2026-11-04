import api from './api';

export const profileService = {
  getPublicProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },

  getAdminProfile: async () => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  updateAdminProfile: async (data) => {
    const response = await api.put('/admin/profile', data);
    return response.data;
  },
};
