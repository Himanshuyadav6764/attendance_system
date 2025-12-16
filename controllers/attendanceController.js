const Attendance = require('../models/Attendance');

/**
 * @desc    Mark attendance (Student only - once per day)
 * @route   POST /api/attendance
 * @access  Private (Student)
 */
exports.markAttendance = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const userId = req.user._id;

    // Set date to today at midnight for consistency
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if attendance already marked for today
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: today
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today.'
      });
    }

    // Create attendance record
    const attendance = await Attendance.create({
      user: userId,
      date: today,
      status: status || 'present',
      remarks,
      checkInTime: new Date()
    });

    // Populate user details
    await attendance.populate('user', 'name email rollNumber');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully.',
      data: { attendance }
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    
    // Handle duplicate key error (should be caught by check above)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for today.'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error marking attendance.',
      error: error.message
    });
  }
};

// Get student's own attendance records
exports.getMyAttendance = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    // Build query
    let query = { user: userId };

    // Add date filters if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Get attendance records
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit))
      .populate('user', 'name email rollNumber');

    // Calculate statistics
    const stats = {
      total: attendance.length,
      present: attendance.filter(a => a.status === 'present').length,
      absent: attendance.filter(a => a.status === 'absent').length,
      late: attendance.filter(a => a.status === 'late').length
    };

    res.json({
      success: true,
      count: attendance.length,
      data: { 
        attendance,
        stats
      }
    });
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records.',
      error: error.message
    });
  }
};

// Get all attendance records for admin
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, userId, status, limit = 100, page = 1 } = req.query;

    // Build query
    let query = {};

    if (userId) {
      query.user = userId;
    }

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get attendance records
    const attendance = await Attendance.find(query)
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email rollNumber department');

    // Get total count
    const total = await Attendance.countDocuments(query);

    res.json({
      success: true,
      count: attendance.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: { attendance }
    });
  } catch (error) {
    console.error('Get all attendance error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance records.',
      error: error.message
    });
  }
};

// Get attendance statistics
exports.getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.date = {};
      if (startDate) {
        dateQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateQuery.date.$lte = new Date(endDate);
      }
    }

    const stats = await Attendance.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const total = await Attendance.countDocuments(dateQuery);

    res.json({
      success: true,
      data: {
        total,
        breakdown: stats
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics.',
      error: error.message
    });
  }
};
