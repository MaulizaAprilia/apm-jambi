import api from './api';

export const contactService = {
  getPublicContact: async () => {
    const response = await api.get('/contact');
    return response.data;
  },

  getAdminContact: async () => {
    const response = await api.get('/admin/contact');
    return response.data;
  },

  updateAdminContact: async (data) => {
    const response = await api.put('/admin/contact', data);
    return response.data;
  },
};
