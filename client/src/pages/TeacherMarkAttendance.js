import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import { useAuth } from '../context/AuthContext';
import './TeacherMarkAttendance.css';

const TeacherMarkAttendance = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Get today's date in local timezone
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Fetch all students from the teacher's department
      const response = await attendanceService.getStudentsForAttendance();
      setStudents(response.data.students || []);
      
      // Initialize all students as not checked
      const initial = {};
      (response.data.students || []).forEach(student => {
        initial[student._id] = { checked: false, status: 'present' };
      });
      setSelectedStudents(initial);
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load students. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    const updated = {};
    students.forEach(student => {
      updated[student._id] = { checked: checked, status: 'present' };
    });
    setSelectedStudents(updated);
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        checked: !prev[studentId].checked
      }
    }));
  };

  const handleStatusChange = (studentId, status) => {
    setSelectedStudents(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: status
      }
    }));
  };

  const handleMarkAttendance = async () => {
    const attendanceData = Object.entries(selectedStudents)
      .filter(([_, data]) => data.checked)
      .map(([studentId, data]) => ({
        studentId,
        status: data.status,
        date: selectedDate
      }));

    if (attendanceData.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one student' });
      return;
    }

    try {
      setMarking(true);
      setMessage({ type: '', text: '' });
      
      const response = await attendanceService.markBulkAttendance({ attendance: attendanceData });
      
      setMessage({ 
        type: 'success', 
        text: `Attendance marked successfully for ${attendanceData.length} student(s)!` 
      });

      // Reset selections
      const resetSelections = {};
      students.forEach(student => {
        resetSelections[student._id] = { checked: false, status: 'present' };
      });
      setSelectedStudents(resetSelections);

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark attendance. Please try again.' 
      });
    } finally {
      setMarking(false);
    }
  };

  const selectedCount = Object.values(selectedStudents).filter(data => data.checked).length;
  const allSelected = students.length > 0 && selectedCount === students.length;

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '50vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="teacher-mark-attendance-page">
      <div className="container">
        <div className="page-header">
          <h1>Mark Student Attendance</h1>
          <p>Mark attendance for students in {user?.department} department</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="card">
          <div className="attendance-controls">
            <div className="date-selector">
              <label>Select Date:</label>
              <input 
                type="date" 
                value={selectedDate}
                max={getTodayDate()}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="selected-count">
              Selected: <strong>{selectedCount}</strong> / {students.length}
            </div>

            <button 
              className="btn btn-primary"
              onClick={handleMarkAttendance}
              disabled={marking || selectedCount === 0}
            >
              {marking ? 'Marking...' : `Mark Attendance (${selectedCount})`}
            </button>
          </div>

          {students.length === 0 ? (
            <div className="empty-state">
              <p>No students found in your department</p>
            </div>
          ) : (
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>
                      <input 
                        type="checkbox"
                        checked={allSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th>Roll Number</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr 
                      key={student._id}
                      className={selectedStudents[student._id]?.checked ? 'selected' : ''}
                    >
                      <td>
                        <input 
                          type="checkbox"
                          checked={selectedStudents[student._id]?.checked || false}
                          onChange={() => handleSelectStudent(student._id)}
                        />
                      </td>
                      <td>{student.rollNumber || 'N/A'}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>
                        <select
                          value={selectedStudents[student._id]?.status || 'present'}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                          disabled={!selectedStudents[student._id]?.checked}
                          className="status-select"
                        >
                          <option value="present">Present</option>
                          <option value="absent">Absent</option>
                          <option value="late">Late</option>
                        </select>
                      </td>
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

export default TeacherMarkAttendance;
