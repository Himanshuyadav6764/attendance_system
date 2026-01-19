import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StudentAttendance from './pages/StudentAttendance';
import StudentLeaves from './pages/StudentLeaves';
import AdminAttendance from './pages/AdminAttendance';
import AdminLeaves from './pages/AdminLeaves';
import HodProfile from './pages/HodProfile';
import AttendanceCalendar from './pages/AttendanceCalendar';
import TeacherMarkAttendance from './pages/TeacherMarkAttendance';
import './App.css';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Pages anyone can visit (without login) */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/" replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/" replace /> : <Register />} 
        />

        {/* Protected pages - need to be logged in */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Student-only pages */}
        <Route
          path="/attendance"
          element={
            <PrivateRoute requiredRole="student">
              <StudentAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/leaves"
          element={
            <PrivateRoute requiredRole="student">
              <StudentLeaves />
            </PrivateRoute>
          }
        />

        {/* Teacher-only pages */}
        <Route
          path="/teacher/mark-attendance"
          element={
            <PrivateRoute requiredRole="teacher">
              <TeacherMarkAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <PrivateRoute requiredRole="teacher">
              <AdminAttendance />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/leaves"
          element={
            <PrivateRoute requiredRole="teacher">
              <AdminLeaves />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/calendar"
          element={
            <PrivateRoute requiredRole="teacher">
              <AttendanceCalendar />
            </PrivateRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <PrivateRoute requiredRole="teacher">
              <HodProfile />
            </PrivateRoute>
          }
        />

        {/* If URL doesn't match any route, go to home page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

// Main App component - wraps everything with Router and Auth
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
