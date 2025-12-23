import React, { useState, useEffect } from 'react';
import { attendanceService } from '../services/attendanceService';
import './AttendanceCalendar.css';

/**
 * Attendance Calendar Component
 * Allows HOD to view attendance records by date with an interactive calendar interface
 * Features: Month navigation, date selection, attendance statistics
 */
const AttendanceCalendar = () => {
  // State management for calendar navigation and data
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [monthAttendance, setMonthAttendance] = useState({});

  // Calendar display constants
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  /**
   * Calculate total days in a given month
   * @param {Date} date - The date to check
   * @returns {number} Number of days in the month
   */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * Get the day of week for the first day of the month
   * @param {Date} date - The date to check
   * @returns {number} Day of week (0=Sunday, 6=Saturday)
   */
  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  /**
   * Fetch attendance records for a specific date
   * Filters all attendance by the selected date and updates state
   * @param {Date} date - The date to fetch attendance for
   */
  const fetchAttendanceForDate = async (date) => {
    try {
      setLoading(true);
      const dateStr = date.toISOString().split('T')[0];
      const response = await attendanceService.getAllAttendance();
      
      // Filter attendance records for the selected date
      const dayAttendance = response.data.attendance.filter(a => 
        a.date.split('T')[0] === dateStr
      );
      
      setAttendanceData(dayAttendance);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch attendance overview for entire month
   * Groups attendance data by date to show indicators on calendar
   * @param {Date} date - The month to fetch overview for
   */
  const fetchMonthOverview = async (date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const startDate = new Date(year, month, 1);
      const endDate = new Date(year, month + 1, 0);
      
      const response = await attendanceService.getAllAttendance();
      const monthData = {};
      
      // Group attendance by date and count status types
      response.data.attendance.forEach(a => {
        const dateKey = a.date.split('T')[0];
        if (!monthData[dateKey]) {
          monthData[dateKey] = { present: 0, absent: 0, late: 0 };
        }
        monthData[dateKey][a.status]++;
      });
      
      setMonthAttendance(monthData);
    } catch (error) {
      console.error('Failed to fetch month overview:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    fetchMonthOverview(currentDate);
  }, [currentDate]);

  /**
   * Handle date selection on calendar
   * @param {number} day - The day of month clicked
   */
  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
  };

  // Navigate to previous month
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  // Navigate to next month
  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Quick navigation to today's date
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  /**
   * Render the calendar grid with all days of the month
   * Includes empty cells for alignment and attendance indicators
   */
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before month starts (for proper alignment)
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Render each day of the month with attendance data
    for (let day = 1; day <= daysInMonth; day++) {
      // Generate date string for this day
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
        .toISOString().split('T')[0];
      
      // Check if this day is selected, today, or has attendance data
      const isSelected = selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();
      const isToday = new Date().toDateString() === 
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
      
      const dayData = monthAttendance[dateStr] || {};
      const hasData = dayData.present > 0 || dayData.absent > 0 || dayData.late > 0;

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''} ${hasData ? 'has-data' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <span className="day-number">{day}</span>
          {hasData && (
            <div className="day-indicators">
              {dayData.present > 0 && <span className="indicator present" title={`${dayData.present} present`}>{dayData.present}</span>}
              {dayData.absent > 0 && <span className="indicator absent" title={`${dayData.absent} absent`}>{dayData.absent}</span>}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  // Calculate attendance statistics for selected date
  const stats = attendanceData.reduce((acc, record) => {
    acc[record.status] = (acc[record.status] || 0) + 1;
    return acc;
  }, { present: 0, absent: 0, late: 0 });

  return (
    <div className="attendance-calendar-container">
      <div className="calendar-header">
        <h2>Attendance Calendar</h2>
        <p>View attendance records by date</p>
      </div>

      <div className="calendar-section">
        <div className="calendar-controls">
          <button onClick={handlePrevMonth} className="btn-nav">
            ← Previous
          </button>
          <div className="current-month">
            <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          </div>
          <button onClick={handleNextMonth} className="btn-nav">
            Next →
          </button>
        </div>

        <button onClick={handleToday} className="btn-today">Today</button>

        <div className="calendar-grid-container">
          <div className="calendar-weekdays">
            {dayNames.map(day => (
              <div key={day} className="weekday">{day}</div>
            ))}
          </div>
          <div className="calendar-grid">
            {renderCalendar()}
          </div>
        </div>
      </div>

      <div className="attendance-details">
        <div className="details-header">
          <h3>Attendance for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
          <div className="details-stats">
            <span className="stat-badge present">Present: {stats.present}</span>
            <span className="stat-badge absent">Absent: {stats.absent}</span>
            <span className="stat-badge late">Late: {stats.late}</span>
          </div>
        </div>

        {loading ? (
          <div className="loading">Loading attendance data...</div>
        ) : attendanceData.length === 0 ? (
          <div className="no-data">
            <p>No attendance records for this date</p>
          </div>
        ) : (
          <div className="attendance-list">
            {attendanceData.map(record => (
              <div key={record._id} className="attendance-item">
                <div className="student-info">
                  <div className="student-avatar">
                    {record.user?.name?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div className="student-details">
                    <h4>{record.user?.name || 'Unknown Student'}</h4>
                    <p>Roll: {record.user?.rollNumber || 'N/A'} | {record.user?.department || 'N/A'}</p>
                  </div>
                </div>
                <div className={`status-badge ${record.status}`}>
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </div>
                <div className="check-time">
                  {new Date(record.checkInTime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
