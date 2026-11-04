import api from './api';

export const organizationMemberService = {
  getPublicMembers: async () => {
    const response = await api.get('/organization-members');
    return response.data;
  },
  getAdminMembers: async () => {
    const response = await api.get('/admin/organization-members');
    return response.data;
  },
  createMember: async (data) => {
    const response = await api.post('/admin/organization-members', data);
    return response.data;
  },
  updateMember: async (id, data) => {
    if (data instanceof FormData) {
      data.append('_method', 'PUT');
      const response = await api.post(`/admin/organization-members/${id}`, data);
      return response.data;
    }
    const response = await api.put(`/admin/organization-members/${id}`, data);
    return response.data;
  },
  deleteMember: async (id) => {
    const response = await api.delete(`/admin/organization-members/${id}`);
    return response.data;
  },
};
