import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon"></span>
            <span>Attendance System</span>
          </Link>

          <div className="navbar-links">
            <Link to="/" className="nav-link">Dashboard</Link>
            {isAdmin ? (
              <>
                <Link to="/hod/calendar" className="nav-link">View Attendance</Link>
                <Link to="/hod/attendance" className="nav-link">Attendance Records</Link>
                <Link to="/hod/leaves" className="nav-link">Leave Requests</Link>
              </>
            ) : (
              <>
                <Link to="/attendance" className="nav-link">Mark Attendance</Link>
                <Link to="/leaves" className="nav-link">Mark Leave</Link>
              </>
            )}
          </div>

          <div className="navbar-user">
            <div className="user-info">
              <div className="user-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="user-name">{user.name}</div>
                <div className="user-role">{user.role}</div>
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-sm">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
