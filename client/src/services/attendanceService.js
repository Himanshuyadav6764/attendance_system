import api from './api';

export const attendanceService = {
  // Mark attendance (Student)
  markAttendance: async (data) => {
    const response = await api.post('/attendance', data);
    return response.data;
  },

  // Get own attendance (Student)
  getMyAttendance: async (params) => {
    const response = await api.get('/attendance', { params });
    return response.data;
  },

  // Get all attendance (Admin)
  getAllAttendance: async (params) => {
    const response = await api.get('/attendance/all', { params });
    return response.data;
  },

  // Get attendance stats (Admin)
  getAttendanceStats: async (params) => {
    const response = await api.get('/attendance/stats', { params });
    return response.data;
  }
};
