import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protect pages - only logged in users can see them
// Can also require specific role (admin or student)
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking if user is logged in
  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If page requires specific role and user doesn't have it, go to home
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // User is logged in and has permission, show the page
  return children;
};

export default PrivateRoute;
