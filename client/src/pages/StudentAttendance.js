import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import './StudentAttendance.css';

const StudentAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    status: 'present',
    remarks: ''
  });

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

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    setMarking(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await attendanceService.markAttendance(formData);
      setMessage({ type: 'success', text: response.message });
      setFormData({ status: 'present', remarks: '' });
      fetchAttendance();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark attendance' 
      });
    } finally {
      setMarking(false);
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

        {/* Mark Attendance Card - DISABLED */}
        <div className="card mark-attendance-card disabled-section">
          <div className="disabled-overlay">
            <div className="disabled-message">
              <h3>Attendance Marking Disabled</h3>
              <p>Your teacher will mark attendance for you. You can view your attendance records below.</p>
            </div>
          </div>
          <h2>Mark Today's Attendance</h2>
          <form onSubmit={handleMarkAttendance} className="mark-attendance-form">
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Remarks (Optional)</label>
                <input
                  type="text"
                  name="remarks"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="input-field"
                  placeholder="Add any notes..."
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={marking}
              >
                {marking ? 'Marking...' : 'Mark Attendance'}
              </button>
            </div>
          </form>
        </div>

        {/* Stats Cards */}
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
