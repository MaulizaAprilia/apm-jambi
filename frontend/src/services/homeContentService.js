import api from './api';

export const homeContentService = {
  getPublicContent: async () => {
    const response = await api.get('/home-content');
    return response.data;
  },
  getAdminContent: async () => {
    const response = await api.get('/admin/home-content');
    return response.data;
  },
  updateAdminContent: async (data) => {
    const response = await api.put('/admin/home-content', data);
    return response.data;
  },
};
