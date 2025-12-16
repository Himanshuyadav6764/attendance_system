import React, { useState, useEffect } from 'react';
import { leaveService } from '../services/leaveService';
import './StudentLeaves.css';

const StudentLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getMyLeaves();
      setLeaves(response.data.leaves);
      setStats(response.data.stats);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to fetch leaves' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApplying(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await leaveService.applyLeave(formData);
      setMessage({ type: 'success', text: response.message });
      setFormData({ startDate: '', endDate: '', reason: '' });
      setShowForm(false);
      fetchLeaves();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to apply for leave' 
      });
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this leave application?')) {
      return;
    }

    try {
      const response = await leaveService.deleteLeave(id);
      setMessage({ type: 'success', text: response.message });
      fetchLeaves();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to delete leave' 
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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
    <div className="student-leaves-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1>My Leave Applications</h1>
            <p>Manage your leave requests and track their status</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Apply for Leave'}
          </button>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Apply Leave Form */}
        {showForm && (
          <div className="card mb-3">
            <h2>Apply for Leave</h2>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="form-grid">
                <div className="input-group">
                  <label className="input-label">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="input-field"
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Reason</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="input-field"
                  placeholder="Please provide a detailed reason for your leave..."
                  rows="4"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={applying}
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-2 mb-3">
            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#fef7e0' }}>
                <span style={{ color: '#f9ab00' }}>⏳</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.pending}</div>
                <div className="stat-label">Pending</div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ background: '#e6f4ea' }}>
                <span style={{ color: '#1e8e3e' }}>✓</span>
              </div>
              <div className="stat-content">
                <div className="stat-value">{stats.approved}</div>
                <div className="stat-label">Approved</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaves List */}
        <div className="card">
          <h2>Leave History</h2>
          {leaves.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p>No leave applications found</p>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => setShowForm(true)}
              >
                Apply for Leave
              </button>
            </div>
          ) : (
            <div className="leaves-grid">
              {leaves.map((leave) => (
                <div key={leave._id} className="leave-item">
                  <div className="leave-header">
                    <div className="leave-dates">
                      <span className="date-badge">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </span>
                      <span className="duration-badge">
                        {leave.duration} {leave.duration === 1 ? 'day' : 'days'}
                      </span>
                    </div>
                    <span className={`badge badge-${leave.status}`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-content">
                    <p className="leave-reason">{leave.reason}</p>
                    
                    {leave.adminRemarks && (
                      <div className="admin-remarks">
                        <strong>Admin Remarks:</strong> {leave.adminRemarks}
                      </div>
                    )}

                    <div className="leave-meta">
                      <span>Applied: {formatDate(leave.createdAt)}</span>
                      {leave.approvedAt && (
                        <span>Processed: {formatDate(leave.approvedAt)}</span>
                      )}
                    </div>
                  </div>

                  {leave.status === 'pending' && (
                    <div className="leave-actions">
                      <button 
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(leave._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentLeaves;
