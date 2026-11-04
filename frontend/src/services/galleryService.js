import api from './api';

export const galleryService = {
  // Public gallery endpoint
  getPublicGallery: async (params = {}) => {
    const response = await api.get('/gallery', { params });
    return response.data;
  },

  // Admin gallery endpoints
  getAdminGallery: async (params = {}) => {
    const response = await api.get('/admin/gallery', { params });
    return response.data;
  },

  getAdminGalleryById: async (id) => {
    const response = await api.get(`/admin/gallery/${id}`);
    return response.data;
  },

  createGallery: async (formData) => {
    const response = await api.post('/admin/gallery', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateGallery: async (id, formData) => {
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      const response = await api.post(`/admin/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    }
    const response = await api.put(`/admin/gallery/${id}`, formData);
    return response.data;
  },

  deleteGallery: async (id) => {
    const response = await api.delete(`/admin/gallery/${id}`);
    return response.data;
  },
};
