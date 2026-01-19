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

  // Get all attendance (Teacher)
  getAllAttendance: async (params) => {
    const response = await api.get('/attendance/all', { params });
    return response.data;
  },

  // Get attendance stats (Teacher)
  getAttendanceStats: async (params) => {
    const response = await api.get('/attendance/stats', { params });
    return response.data;
  },

  // Get students list for marking attendance (Teacher)
  getStudentsForAttendance: async () => {
    const response = await api.get('/attendance/students');
    return response.data;
  },

  // Mark bulk attendance (Teacher)
  markBulkAttendance: async (data) => {
    const response = await api.post('/attendance/bulk', data);
    return response.data;
  }
};

