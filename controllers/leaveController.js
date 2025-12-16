const Leave = require('../models/Leave');

/**
 * @desc    Apply for leave (Student)
 * @route   POST /api/leave
 * @access  Private (Student)
 */
exports.applyLeave = async (req, res) => {
  try {
    const { startDate, endDate, reason } = req.body;
    const userId = req.user._id;

    // Validation
    if (!startDate || !endDate || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Please provide start date, end date, and reason.'
      });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date.'
      });
    }

    if (start < new Date().setHours(0, 0, 0, 0)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot apply for leave in the past.'
      });
    }

    // Create leave application
    const leave = await Leave.create({
      user: userId,
      startDate: start,
      endDate: end,
      reason,
      status: 'pending'
    });

    // Populate user details
    await leave.populate('user', 'name email rollNumber department');

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully.',
      data: { leave }
    });
  } catch (error) {
    console.error('Apply leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error applying for leave.',
      error: error.message
    });
  }
};

// Get student's own leave applications
exports.getMyLeaves = async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 20 } = req.query;

    // Build query
    let query = { user: userId };
    if (status) {
      query.status = status;
    }

    // Get leave records
    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email rollNumber department')
      .populate('approvedBy', 'name email');

    // Calculate statistics
    const stats = {
      total: leaves.length,
      pending: leaves.filter(l => l.status === 'pending').length,
      approved: leaves.filter(l => l.status === 'approved').length,
      rejected: leaves.filter(l => l.status === 'rejected').length
    };

    res.json({
      success: true,
      count: leaves.length,
      data: { 
        leaves,
        stats
      }
    });
  } catch (error) {
    console.error('Get leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave records.',
      error: error.message
    });
  }
};

// Get all leave applications for admin
exports.getAllLeaves = async (req, res) => {
  try {
    const { status, userId, limit = 50, page = 1 } = req.query;

    // Build query
    let query = {};
    if (status) {
      query.status = status;
    }
    if (userId) {
      query.user = userId;
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get leave records
    const leaves = await Leave.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email rollNumber department')
      .populate('approvedBy', 'name email');

    // Get total count
    const total = await Leave.countDocuments(query);

    res.json({
      success: true,
      count: leaves.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: { leaves }
    });
  } catch (error) {
    console.error('Get all leaves error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leave records.',
      error: error.message
    });
  }
};

// Update leave status (approve or reject)
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminRemarks } = req.body;
    const adminId = req.user._id;

    // Validation
    if (!status || !['approved', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid status (approved or rejected).'
      });
    }

    // Find leave application
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found.'
      });
    }

    // Check if already processed
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Leave application is already ${leave.status}.`
      });
    }

    // Update leave status
    leave.status = status;
    leave.adminRemarks = adminRemarks;
    leave.approvedBy = adminId;
    leave.approvedAt = new Date();

    await leave.save();

    // Populate user details
    await leave.populate('user', 'name email rollNumber department');
    await leave.populate('approvedBy', 'name email');

    res.json({
      success: true,
      message: `Leave application ${status} successfully.`,
      data: { leave }
    });
  } catch (error) {
    console.error('Update leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating leave application.',
      error: error.message
    });
  }
};

// Delete leave application
exports.deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    // Find leave application
    const leave = await Leave.findById(id);
    if (!leave) {
      return res.status(404).json({
        success: false,
        message: 'Leave application not found.'
      });
    }

    // Check ownership
    if (leave.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own leave applications.'
      });
    }

    // Can only delete pending leaves
    if (leave.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete leave application that is already processed.'
      });
    }

    await Leave.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Leave application deleted successfully.'
    });
  } catch (error) {
    console.error('Delete leave error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting leave application.',
      error: error.message
    });
  }
};
