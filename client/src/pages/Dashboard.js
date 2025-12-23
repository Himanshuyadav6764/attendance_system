import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { attendanceService } from '../services/attendanceService';
import { leaveService } from '../services/leaveService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalDays: 0,
    presentDays: 0,
    pendingLeaves: 0,
    attendanceRate: 0,
    totalStudents: 0,
    todayPresent: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      
      if (isAdmin) {
        // Fetch admin stats
        const [attendanceRes, leavesRes] = await Promise.all([
          attendanceService.getAllAttendance(),
          leaveService.getAllLeaves()
        ]);
        
        const pendingLeaves = leavesRes.data.leaves.filter(l => l.status === 'pending').length;
        const today = new Date().toISOString().split('T')[0];
        const todayAttendance = attendanceRes.data.attendance.filter(a => 
          a.date.split('T')[0] === today && a.status === 'present'
        ).length;
        
        setStats({
          totalStudents: 120,
          todayPresent: todayAttendance,
          pendingLeaves: pendingLeaves,
        });
      } else {
        // Fetch student stats
        const [attendanceRes, leavesRes] = await Promise.all([
          attendanceService.getMyAttendance(),
          leaveService.getMyLeaves()
        ]);
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthAttendance = attendanceRes.data.attendance.filter(a => {
          const date = new Date(a.date);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });
        
        const presentDays = thisMonthAttendance.filter(a => a.status === 'present').length;
        const totalDays = thisMonthAttendance.length;
        const attendanceRate = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
        const pendingLeaves = leavesRes.data.leaves.filter(l => l.status === 'pending').length;
        
        setStats({
          totalDays: totalDays,
          presentDays: presentDays,
          attendanceRate: attendanceRate,
          pendingLeaves: pendingLeaves
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const studentCards = [
    {
      title: 'Mark Attendance',
      description: 'Mark your daily attendance',
      icon: 'CHECK',
      color: '#4a7cff',
      colorLight: '#6b94ff',
      action: () => navigate('/attendance')
    },
    {
      title: 'My Attendance',
      description: 'View your attendance history',
      icon: 'LIST',
      color: '#5cb85c',
      colorLight: '#7bc67e',
      action: () => navigate('/attendance')
    },
    {
      title: 'Apply for Leave',
      description: 'Submit a new leave request',
      icon: 'FORM',
      color: '#ffa726',
      colorLight: '#ffb74d',
      action: () => navigate('/leaves')
    },
    {
      title: 'My Leaves',
      description: 'Track your leave applications',
      icon: 'LEAVES',
      color: '#ef5350',
      colorLight: '#f44336',
      action: () => navigate('/leaves')
    }
  ];

  const adminCards = [
    {
      title: 'All Attendance',
      description: 'View all students attendance',
      icon: 'RECORDS',
      color: '#4a7cff',
      colorLight: '#6b94ff',
      action: () => navigate('/hod/attendance')
    },
    {
      title: 'Leave Requests',
      description: 'Approve or reject leave applications',
      icon: 'INBOX',
      color: '#5cb85c',
      colorLight: '#7bc67e',
      action: () => navigate('/hod/leaves')
    },
    {
      title: 'Statistics',
      description: 'View attendance statistics',
      icon: 'CHART',
      color: '#ffa726',
      colorLight: '#ffb74d',
      action: () => navigate('/hod/attendance')
    },
    {
      title: 'My Profile',
      description: 'Manage account and settings',
      icon: 'PROFILE',
      color: '#ef5350',
      colorLight: '#f44336',
      action: () => navigate('/hod/profile')
    }
  ];

  const cards = isAdmin ? adminCards : studentCards;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome, {user?.name}!</h1>
            <p>
              {isAdmin 
                ? 'Manage attendance and leave applications efficiently' 
                : 'Track your attendance and manage your leave requests'}
            </p>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="overview-stats">
          <div className="stat-box" style={{ animationDelay: '0.1s' }}>
            <div className="stat-header">
              <span className="stat-title">
                {isAdmin ? 'Total Students' : 'Total Days'}
              </span>
              <div className="stat-dots">
                <span className="stat-dot pulse-dot" style={{background: '#ef5350', animationDelay: '0s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#ffa726', animationDelay: '0.15s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#5cb85c', animationDelay: '0.3s'}}></span>
              </div>
            </div>
            <div className="stat-value">
              {loading ? '...' : (isAdmin ? stats.totalStudents : stats.totalDays)}
            </div>
            <div className="stat-label">{isAdmin ? 'Enrolled Students' : 'This Month'}</div>
          </div>

          <div className="stat-box" style={{ animationDelay: '0.2s' }}>
            <div className="stat-header">
              <span className="stat-title">
                {isAdmin ? "Today's Attendance" : 'Present Days'}
              </span>
              <div className="stat-dots">
                <span className="stat-dot pulse-dot" style={{background: '#ffa726', animationDelay: '0.1s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#5cb85c', animationDelay: '0.25s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#4a7cff', animationDelay: '0.4s'}}></span>
              </div>
            </div>
            <div className="stat-value">
              {loading ? '...' : (isAdmin ? stats.todayPresent : stats.presentDays)}
            </div>
            <div className="stat-label">
              {isAdmin ? 'Students Present' : `Attendance Rate: ${stats.attendanceRate}%`}
            </div>
          </div>

          <div className="stat-box" style={{ animationDelay: '0.3s' }}>
            <div className="stat-header">
              <span className="stat-title">Pending Leaves</span>
              <div className="stat-dots">
                <span className="stat-dot pulse-dot" style={{background: '#4a7cff', animationDelay: '0.2s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#ffa726', animationDelay: '0.35s'}}></span>
                <span className="stat-dot pulse-dot" style={{background: '#ef5350', animationDelay: '0.5s'}}></span>
              </div>
            </div>
            <div className="stat-value">
              {loading ? '...' : stats.pendingLeaves}
            </div>
            <div className="stat-label">{isAdmin ? 'Requests Waiting' : 'Awaiting Approval'}</div>
          </div>
        </div>

        <div className="dashboard-grid">
          {cards.map((card, index) => (
            <div 
              key={index} 
              className="dashboard-card"
              onClick={card.action}
              style={{ '--card-color': card.color, '--card-color-light': card.colorLight }}
            >
              <div className="card-icon" style={{ background: `linear-gradient(135deg, ${card.color} 0%, ${card.colorLight || card.color} 100%)` }}>
                {card.icon}
              </div>
              <div className="card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
              <div className="card-arrow">→</div>
            </div>
          ))}
        </div>

        <div className="quick-tips card mt-3">
          <h2>Quick Tips</h2>
          <ul>
            {isAdmin ? (
              <>
                <li>Review pending leave requests regularly</li>
                <li>Monitor attendance patterns to identify issues early</li>
                <li>Use filters to view specific students or date ranges</li>
                <li>Provide clear feedback in admin remarks</li>
              </>
            ) : (
              <>
                <li>Mark your attendance daily to maintain good records</li>
                <li>Apply for leave in advance whenever possible</li>
                <li>Provide detailed reasons for leave applications</li>
                <li>Check your attendance regularly to track your presence</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
