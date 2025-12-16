import api from './api';

export const leaveService = {
  // Apply for leave (Student)
  applyLeave: async (data) => {
    const response = await api.post('/leave', data);
    return response.data;
  },

  // Get own leaves (Student)
  getMyLeaves: async (params) => {
    const response = await api.get('/leave', { params });
    return response.data;
  },

  // Get all leaves (Admin)
  getAllLeaves: async (params) => {
    const response = await api.get('/leave/all', { params });
    return response.data;
  },

  // Update leave status (Admin)
  updateLeaveStatus: async (id, data) => {
    const response = await api.patch(`/leave/${id}`, data);
    return response.data;
  },

  // Delete leave (Student)
  deleteLeave: async (id) => {
    const response = await api.delete(`/leave/${id}`);
    return response.data;
  }
};
