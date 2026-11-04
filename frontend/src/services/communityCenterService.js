import api from './api';

export const communityCenterService = {
  getPublicCenters: async () => (await api.get('/community-centers')).data,
  getAdminCenters: async () => (await api.get('/admin/community-centers')).data,
  create: async (data) => (await api.post('/admin/community-centers', data)).data,
  update: async (id, data) => (await api.put(`/admin/community-centers/${id}`, data)).data,
  remove: async (id) => (await api.delete(`/admin/community-centers/${id}`)).data,
};
