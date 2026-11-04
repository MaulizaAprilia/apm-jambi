import api from './api';

export const newsService = {
  // Public news endpoints
  getPublicNews: async (params = {}) => {
    const response = await api.get('/news', { params });
    return response.data;
  },

  getPublicNewsBySlug: async (slug) => {
    const response = await api.get(`/news/${slug}`);
    return response.data;
  },

  // Admin news endpoints
  getAdminNews: async (params = {}) => {
    const response = await api.get('/admin/news', { params });
    return response.data;
  },

  getAdminNewsById: async (id) => {
    const response = await api.get(`/admin/news/${id}`);
    return response.data;
  },

  createNews: async (formData) => {
    const response = await api.post('/admin/news', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateNews: async (id, formData) => {
    // Note: Laravel POST with _method=PUT or POST endpoint for multipart updates
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      const response = await api.post(`/admin/news/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await api.put(`/admin/news/${id}`, formData);
    return response.data;
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/admin/news/${id}`);
    return response.data;
  },
};
