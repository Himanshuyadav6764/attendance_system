const express = require('express');
const router = express.Router();
const {
  markAttendance,
  getMyAttendance,
  getAllAttendance,
  getAttendanceStats,
  getStudentsForAttendance,
  markBulkAttendance
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
 * @desc    Get all attendance records (filtered by department for Teacher)
 * @access  Private (Admin/Teacher)
 */
router.get('/all', authenticate, authorize('admin', 'teacher'), getAllAttendance);

/**
 * @route   GET /api/attendance/stats
 * @desc    Get attendance statistics (Teacher)
 * @access  Private (Teacher)
 */
router.get('/stats', authenticate, authorize('teacher'), getAttendanceStats);

/**
 * @route   GET /api/attendance/students
 * @desc    Get list of students for marking attendance (Teacher only)
 * @access  Private (Teacher)
 */
router.get('/students', authenticate, authorize('teacher'), getStudentsForAttendance);

/**
 * @route   POST /api/attendance/bulk
 * @desc    Mark attendance for multiple students (Teacher only)
 * @access  Private (Teacher)
 */
router.post('/bulk', authenticate, authorize('teacher'), markBulkAttendance);

module.exports = router;
