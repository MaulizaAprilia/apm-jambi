import api from './api';

export const documentService = {
  // Public documents endpoint
  getPublicDocuments: async (params = {}) => {
    const response = await api.get('/documents', { params });
    return response.data;
  },

  // Admin documents endpoints
  getAdminDocuments: async (params = {}) => {
    const response = await api.get('/admin/documents', { params });
    return response.data;
  },

  createDocument: async (formData) => {
    const response = await api.post('/admin/documents', formData);
    return response.data;
  },

  updateDocument: async (id, formData) => {
    if (formData instanceof FormData) {
      formData.append('_method', 'PUT');
      const response = await api.post(`/admin/documents/${id}`, formData);
      return response.data;
    }
    const response = await api.put(`/admin/documents/${id}`, formData);
    return response.data;
  },

  deleteDocument: async (id) => {
    const response = await api.delete(`/admin/documents/${id}`);
    return response.data;
  },
};
