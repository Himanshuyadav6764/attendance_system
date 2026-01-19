const express = require('express');
const router = express.Router();
const {
  createHOD: createTeacher,
  getAllHODs: getAllTeachers,
  updateHOD: updateTeacher,
  deleteHOD: deleteTeacher,
  resetHODPassword: resetTeacherPassword
} = require('../controllers/hodController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require authentication
// Only Teacher can access these routes

/**
 * @route   POST /api/teacher
 * @desc    Create a new Teacher account
 * @access  Private (Teacher only)
 */
router.post('/', authenticate, authorize('teacher'), createTeacher);

/**
 * @route   GET /api/teacher
 * @desc    Get all Teacher accounts
 * @access  Private (Teacher only)
 */
router.get('/', authenticate, authorize('teacher'), getAllTeachers);

/**
 * @route   PUT /api/teacher/:id
 * @desc    Update Teacher account details
 * @access  Private (Teacher only)
 */
router.put('/:id', authenticate, authorize('teacher'), updateTeacher);

/**
 * @route   DELETE /api/teacher/:id
 * @desc    Delete Teacher account
 * @access  Private (Teacher only)
 */
router.delete('/:id', authenticate, authorize('teacher'), deleteTeacher);

/**
 * @route   PUT /api/teacher/:id/reset-password
 * @desc    Reset Teacher password
 * @access  Private (Teacher only)
 */
router.put('/:id/reset-password', authenticate, authorize('teacher'), resetTeacherPassword);

module.exports = router;
