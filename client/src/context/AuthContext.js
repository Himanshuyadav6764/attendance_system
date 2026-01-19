import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

// Create a context to share login/user info across the whole app
const AuthContext = createContext();

// Custom hook to easily use auth anywhere in the app
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};

// Wrap the app with this to provide login/user info everywhere
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Currently logged in user
  const [loading, setLoading] = useState(true); // Loading state

  // When app loads, check if someone is already logged in
  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    setUser(savedUser);
    setLoading(false);
  }, []);

  // Login function
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data.user);
    return response;
  };

  // Register/Signup function
  const register = async (userData) => {
    const response = await authService.register(userData);
    setUser(response.data.user);
    return response;
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // All the values we want to share across the app
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user, // Is someone logged in?
    isAdmin: user?.role === 'teacher', // Is logged in user a Teacher?
    isStudent: user?.role === 'student' // Is logged in user a student?
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
