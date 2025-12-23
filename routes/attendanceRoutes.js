const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  getAttendanceStats
} = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/attendance
 * @desc    Mark attendance (Student only - once per day)
 * @access  Private (Student)
 */
router.post('/', authenticate, authorize('student'), markAttendance);

/**
 * @route   GET /api/attendance
 * @desc    Get own attendance records
 * @access  Private (Student)
 */
router.get('/', authenticate, authorize('student'), getMyAttendance);

/**
 * @route   GET /api/attendance/all
 * @desc    Get all attendance records
 * @access  Private (Admin)
 */
router.get('/all', authenticate, authorize('admin'), getAllAttendance);

/**
 * @route   GET /api/attendance/stats
 * @desc    Get attendance statistics (HOD)
 * @access  Private (HOD)
 */
router.get('/stats', authenticate, authorize('hod'), getAttendanceStats);

module.exports = router;
