import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import './AdminAttendance.css';

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    userId: ''
  });

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.status) params.status = filters.status;
      if (filters.userId) params.userId = filters.userId;

      const response = await attendanceService.getAllAttendance(params);
      setAttendance(response.data.attendance);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    fetchAttendance();
  };

  const handleResetFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      status: '',
      userId: ''
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusCounts = () => {
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    return { present, absent, late, total: attendance.length };
  };

  const stats = getStatusCounts();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="admin-attendance-page">
      <div className="container">
        <div className="page-header">
          <h1>All Attendance Records</h1>
          <p>Monitor and manage student attendance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e6f4ea' }}>
              <span style={{ color: '#1e8e3e' }}>✓</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.present}</div>
              <div className="stat-label">Present</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef7e0' }}>
              <span style={{ color: '#f9ab00' }}>⏰</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.late}</div>
              <div className="stat-label">Late</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fce8e6' }}>
              <span style={{ color: '#d93025' }}>✗</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.absent}</div>
              <div className="stat-label">Absent</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f0fe' }}>
              <span style={{ color: '#1967d2' }}></span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Records</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-3">
          <h2>Filters</h2>
          <div className="filters-grid">
            <div className="input-group">
              <label className="input-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            <div className="input-group">
              <label className="input-label">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="absent">Absent</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Student ID</label>
              <input
                type="text"
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="input-field"
                placeholder="Enter student ID"
              />
            </div>
          </div>

          <div className="filter-actions">
            <button className="btn btn-primary" onClick={handleApplyFilters}>
              Apply Filters
            </button>
            <button className="btn btn-secondary" onClick={handleResetFilters}>
              Reset
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="card">
          <h2>Attendance Records ({attendance.length})</h2>
          {attendance.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p>No attendance records found</p>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll Number</th>
                    <th>Department</th>
                    <th>Date</th>
                    <th>Check-In Time</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id}>
                      <td>{record.user?.name}</td>
                      <td>{record.user?.rollNumber || '-'}</td>
                      <td>{record.user?.department || '-'}</td>
                      <td>{formatDate(record.date)}</td>
                      <td>{formatTime(record.checkInTime)}</td>
                      <td>
                        <span className={`badge badge-${record.status}`}>
                          {record.status}
                        </span>
                      </td>
                      <td>{record.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAttendance;
