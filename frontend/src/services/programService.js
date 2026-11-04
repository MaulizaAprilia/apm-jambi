import api from './api';

export const programService = {
  getPublicPrograms: async () => {
    const response = await api.get('/programs');
    return response.data;
  },
  getAdminPrograms: async () => {
    const response = await api.get('/admin/programs');
    return response.data;
  },
  createProgram: async (data) => {
    const response = await api.post('/admin/programs', data);
    return response.data;
  },
  updateProgram: async (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      const response = await api.post(`/admin/programs/${id}`, data);
      return response.data;
    }
    const response = await api.put(`/admin/programs/${id}`, data);
    return response.data;
  },
  deleteProgram: async (id) => {
    const response = await api.delete(`/admin/programs/${id}`);
    return response.data;
  },
};
