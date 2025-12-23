import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    rollNumber: '',
    department: '',
    hodId: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hodId, setHodId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTabChange = (role) => {
    setActiveTab(role);
    const baseFormData = {
      email: '',
      password: '',
      confirmPassword: '',
      role: role,
      rollNumber: '',
      department: '',
      hodId: ''
    };
    
    // Only include name field for student role
    if (role === 'student') {
      baseFormData.name = '';
    }
    
    setFormData(baseFormData);
    setError('');
    setSuccess('');
    setHodId('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      
      // Remove name field for HOD registration
      if (activeTab === 'hod') {
        delete registrationData.name;
      } else if (activeTab === 'student' && !registrationData.name) {
        // Validate name for students
        setError('Please provide your name');
        setLoading(false);
        return;
      }
      
      const response = await register(registrationData);
      
      setSuccess('Account created successfully!');
      
      // Navigate after showing success message for 2 seconds
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our attendance management system</p>
          
          <div className="auth-tabs">
            <button 
              className={`auth-tab ${activeTab === 'student' ? 'active' : ''}`}
              onClick={() => handleTabChange('student')}
              type="button"
            >
              Student
            </button>
            <button 
              className={`auth-tab ${activeTab === 'hod' ? 'active' : ''}`}
              onClick={() => handleTabChange('hod')}
              type="button"
            >
              HOD
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {success && hodId && (
          <div className="alert alert-success">
            <div style={{ marginBottom: '10px' }}>{success}</div>
            <div style={{ 
              padding: '10px', 
              background: 'rgba(255,255,255,0.9)', 
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '16px',
              color: '#1967d2'
            }}>
              {hodId}
            </div>
            <div style={{ marginTop: '8px', fontSize: '14px' }}>
              Please save this HOD ID for login
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {activeTab === 'student' && (
            <div className="input-group">
              <label htmlFor="name" className="input-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>
          )}

          <div className="input-group">
            <label htmlFor="email" className="input-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder={activeTab === 'hod' ? 'Enter your official email' : 'Enter your email'}
              required
            />
          </div>

          {activeTab === 'hod' && (
            <>
              <div className="input-group">
                <label htmlFor="hodId" className="input-label">HOD ID</label>
                <input
                  type="text"
                  id="hodId"
                  name="hodId"
                  value={formData.hodId}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your assigned HOD ID"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="department" className="input-label">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science Engineering">Computer Science Engineering (CSE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication Engineering (ECE)</option>
                  <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                  <option value="Electronics and Electrical Engineering">Electronics and Electrical Engineering (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                  <option value="Civil Engineering">Civil Engineering (CE)</option>
                  <option value="Chemical Engineering">Chemical Engineering (CHE)</option>
                  <option value="Biotechnology">Biotechnology (BT)</option>
                  <option value="Aerospace Engineering">Aerospace Engineering (AE)</option>
                  <option value="Automobile Engineering">Automobile Engineering (AU)</option>
                  <option value="Industrial Engineering">Industrial Engineering (IE)</option>
                  <option value="Production Engineering">Production Engineering (PE)</option>
                  <option value="Instrumentation Engineering">Instrumentation Engineering (IE)</option>
                  <option value="Petroleum Engineering">Petroleum Engineering (PT)</option>
                </select>
              </div>
            </>
          )}

          {activeTab === 'student' && (
            <>
              <div className="input-group">
                <label htmlFor="rollNumber" className="input-label">Roll Number</label>
                <input
                  type="text"
                  id="rollNumber"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your roll number"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="department" className="input-label">Department</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="input-field"
                  required
                  style={{ cursor: 'pointer' }}
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science Engineering">Computer Science Engineering (CSE)</option>
                  <option value="Information Technology">Information Technology (IT)</option>
                  <option value="Electronics and Communication Engineering">Electronics and Communication Engineering (ECE)</option>
                  <option value="Electrical Engineering">Electrical Engineering (EE)</option>
                  <option value="Electronics and Electrical Engineering">Electronics and Electrical Engineering (EEE)</option>
                  <option value="Mechanical Engineering">Mechanical Engineering (ME)</option>
                  <option value="Civil Engineering">Civil Engineering (CE)</option>
                  <option value="Chemical Engineering">Chemical Engineering (CHE)</option>
                </select>
              </div>
            </>
          )}

          <div className="input-group">
            <label htmlFor="password" className="input-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Create a password (min 6 characters)"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" className="input-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Re-enter your password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
