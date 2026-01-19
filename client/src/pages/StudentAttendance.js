import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getMyAttendance();
      setAttendance(response.data.attendance);
      setStats(response.data.stats);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to fetch attendance' 
      });
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="student-attendance-page">
      <div className="container">
        <div className="page-header">
          <h1>My Attendance</h1>
          <p>Track and manage your attendance records</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {stats && (
          <div className="grid grid-2 mt-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e6f4ea' }}>
                <span style={{ color: '#1e8e3e' }}>P</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.present}</div>
                <div className="stat-label">Present Days</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef7e0' }}>
                <span style={{ color: '#f9ab00' }}>L</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.late}</div>
                <div className="stat-label">Late Days</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fce8e6' }}>
                <span style={{ color: '#d93025' }}>A</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.absent}</div>
                <div className="stat-label">Absent Days</div>
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
        )}

        {/* Attendance History */}
        <div className="card mt-3">
          <h2>Attendance History</h2>
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
                    <th>Date</th>
                    <th>Check-In Time</th>
                    <th>Status</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record) => (
                    <tr key={record._id}>
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

export default StudentAttendance;
