import React, { useState, useEffect, useCallback } from 'react';
import { leaveService } from '../services/leaveService';
import './AdminLeaves.css';

const AdminLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]); // Store all leaves for stats calculation
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filter, setFilter] = useState('pending');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [adminRemarks, setAdminRemarks] = useState('');

  // Fetch all leaves for stats (no filter)
  const fetchAllLeaves = useCallback(async () => {
    try {
      const response = await leaveService.getAllLeaves({});
      setAllLeaves(response.data.leaves);
    } catch (error) {
      console.error('Failed to fetch all leaves for stats:', error);
    }
  }, []);

  // Fetch filtered leaves for display
  const fetchLeaves = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter ? { status: filter } : {};
      const response = await leaveService.getAllLeaves(params);
      setLeaves(response.data.leaves);
      // Also fetch all leaves for accurate stats
      await fetchAllLeaves();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to fetch leaves' 
      });
    } finally {
      setLoading(false);
    }
  }, [filter, fetchAllLeaves]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  // Auto-dismiss success/error messages after 5 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleUpdateStatus = async (leaveId, status) => {
    setProcessing(leaveId);
    setMessage({ type: '', text: '' });

    try {
      const response = await leaveService.updateLeaveStatus(leaveId, {
        status,
        adminRemarks: selectedLeave === leaveId ? adminRemarks : ''
      });
      setMessage({ type: 'success', text: response.message });
      setSelectedLeave(null);
      setAdminRemarks('');
      fetchLeaves();
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update leave status' 
      });
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusCounts = () => {
    // Calculate stats from all leaves, not just filtered ones
    const pending = allLeaves.filter(l => l.status === 'pending').length;
    const approved = allLeaves.filter(l => l.status === 'approved').length;
    const rejected = allLeaves.filter(l => l.status === 'rejected').length;
    return { pending, approved, rejected, total: allLeaves.length };
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
    <div className="admin-leaves-page">
      <div className="container">
        <div className="page-header">
          <h1>Leave Management</h1>
          <p>Review and process student leave applications</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-2 mb-3">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fef7e0' }}>
              <span style={{ color: '#f9ab00' }}>P</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e6f4ea' }}>
              <span style={{ color: '#1e8e3e' }}>A</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#fce8e6' }}>
              <span style={{ color: '#d93025' }}>R</span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: '#e8f0fe' }}>
              <span style={{ color: '#1967d2' }}></span>
            </div>
            <div className="stat-content">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total</div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs mb-3">
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
          <button 
            className={`filter-tab ${filter === '' ? 'active' : ''}`}
            onClick={() => setFilter('')}
          >
            All
          </button>
        </div>

        {/* Leave Applications */}
        <div className="card">
          <h2>Leave Applications ({leaves.length})</h2>
          {leaves.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"></div>
              <p>No leave applications found</p>
            </div>
          ) : (
            <div className="leaves-grid">
              {leaves.map((leave) => (
                <div key={leave._id} className="leave-item">
                  <div className="leave-header">
                    <div className="student-info">
                      <div className="student-avatar">
                        {leave.user?.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="student-name">{leave.user?.name}</div>
                        <div className="student-meta">
                          {leave.user?.rollNumber && `Roll: ${leave.user.rollNumber}`}
                          {leave.user?.department && ` • ${leave.user.department}`}
                        </div>
                      </div>
                    </div>
                    <span className={`badge badge-${leave.status}`}>
                      {leave.status}
                    </span>
                  </div>

                  <div className="leave-content">
                    <div className="leave-dates">
                      <strong>Period:</strong> {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      <span className="duration-badge">
                        ({leave.duration} {leave.duration === 1 ? 'day' : 'days'})
                      </span>
                    </div>

                    <div className="leave-reason-section">
                      <strong>Reason:</strong>
                      <p>{leave.reason}</p>
                    </div>

                    {leave.adminRemarks && (
                      <div className="admin-remarks-display">
                        <strong>HOD Remarks:</strong> {leave.adminRemarks}
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
                    <div className="leave-actions-section">
                      {selectedLeave === leave._id ? (
                        <div className="remarks-section">
                          <textarea
                            value={adminRemarks}
                            onChange={(e) => setAdminRemarks(e.target.value)}
                            className="input-field"
                            placeholder="Add remarks (optional)..."
                            rows="2"
                          />
                          <div className="action-buttons">
                            <button 
                              className="btn btn-success"
                              onClick={() => handleUpdateStatus(leave._id, 'approved')}
                              disabled={processing === leave._id}
                            >
                              {processing === leave._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button 
                              className="btn btn-error"
                              onClick={() => handleUpdateStatus(leave._id, 'rejected')}
                              disabled={processing === leave._id}
                            >
                              {processing === leave._id ? 'Processing...' : 'Reject'}
                            </button>
                            <button 
                              className="btn btn-secondary"
                              onClick={() => {
                                setSelectedLeave(null);
                                setAdminRemarks('');
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-primary"
                          onClick={() => setSelectedLeave(leave._id)}
                        >
                          Review Application
                        </button>
                      )}
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

export default AdminLeaves;
