const Attendance = require('../models/Attendance');

// Student marks their attendance for today (can only mark once per day)
exports.markAttendance = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const studentId = req.user._id;

    // Get today's date at midnight (so all attendance for same day matches)
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // Check if student already marked attendance today
    const alreadyMarked = await Attendance.findOne({
      user: studentId,
      date: todayDate
    });

    if (alreadyMarked) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked attendance for today!'
      });
    }

    // Save the attendance record
    const attendanceRecord = await Attendance.create({
      user: studentId,
      date: todayDate,
      status: status || 'present', // Default to 'present' if not specified
      remarks,
      checkInTime: new Date() // Exact time when they marked attendance
    });

    // Add student details to the response
    await attendanceRecord.populate('user', 'name email rollNumber');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully!',
      data: { attendance: attendanceRecord }
    });
  } catch (error) {
    console.error('Failed to mark attendance:', error);
    
    // Just in case duplicate entry error happens
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already marked attendance for today!'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance. Please try again',
      error: error.message
    });
  }
};

// Get student's own attendance history
exports.getMyAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { startDate, endDate, limit = 30 } = req.query;

    // Start building our search query
    let searchQuery = { user: studentId };

    // Add date range filter if user wants specific dates
    if (startDate || endDate) {
      searchQuery.date = {};
      if (startDate) {
        searchQuery.date.$gte = new Date(startDate); // From this date onwards
      }
      if (endDate) {
        searchQuery.date.$lte = new Date(endDate); // Up to this date
      }
    }

    // Get attendance records (newest first)
    const attendanceRecords = await Attendance.find(searchQuery)
      .sort({ date: -1 }) // Show newest dates first
      .limit(parseInt(limit)) // Don't load too many records at once
      .populate('user', 'name email rollNumber');

    // Calculate some useful statistics
    const statistics = {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(record => record.status === 'present').length,
      absent: attendanceRecords.filter(record => record.status === 'absent').length,
      late: attendanceRecords.filter(record => record.status === 'late').length
    };

    res.json({
      success: true,
      count: attendanceRecords.length,
      data: { 
        attendance: attendanceRecords,
        stats: statistics
      }
    });
  } catch (error) {
    console.error('Failed to get attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load attendance records. Please try again',
      error: error.message
    });
  }
};

// Teacher can view all students' attendance records
exports.getAllAttendance = async (req, res) => {
  try {
    const { startDate, endDate, userId, status, limit = 100, page = 1 } = req.query;

    // Build search query based on what Teacher wants to filter
    let searchQuery = {};

    // If user is Teacher, filter by their department only
    if (req.user.role === 'teacher') {
      // Find all users in the same department
      const User = require('../models/User');
      const departmentStudents = await User.find({
        department: req.user.department,
        role: 'student'
      }).select('_id');
      
      const studentIds = departmentStudents.map(s => s._id);
      searchQuery.user = { $in: studentIds };
    }

    // Filter by specific student if needed
    if (userId) {
      searchQuery.user = userId;
    }

    // Filter by attendance status (present/absent/late)
    if (status) {
      searchQuery.status = status;
    }

    // Filter by date range if needed
    if (startDate || endDate) {
      searchQuery.date = {};
      if (startDate) {
        searchQuery.date.$gte = new Date(startDate);
      }
      if (endDate) {
        searchQuery.date.$lte = new Date(endDate);
      }
    }

    // Calculate which records to skip for pagination
    const recordsToSkip = (parseInt(page) - 1) * parseInt(limit);

    // Get attendance records with pagination
    const attendanceRecords = await Attendance.find(searchQuery)
      .sort({ date: -1 }) // Newest first
      .skip(recordsToSkip) // Skip previous pages
      .limit(parseInt(limit)) // How many per page
      .populate('user', 'name email rollNumber department');

    // Count total records matching the filter
    const totalRecords = await Attendance.countDocuments(searchQuery);

    res.json({
      success: true,
      count: attendanceRecords.length,
      total: totalRecords,
      page: parseInt(page),
      pages: Math.ceil(totalRecords / parseInt(limit)), // Total pages
      data: { attendance: attendanceRecords }
    });
  } catch (error) {
    console.error('Failed to get all attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load attendance records. Please try again',
      error: error.message
    });
  }
};

// Get attendance statistics (how many present/absent/late)
exports.getAttendanceStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Build date filter
    let dateFilter = {};
    if (startDate || endDate) {
      dateFilter.date = {};
      if (startDate) {
        dateFilter.date.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.date.$lte = new Date(endDate);
      }
    }

    // Group attendance by status and count them
    const statusBreakdown = await Attendance.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status', // Group by status (present/absent/late)
          count: { $sum: 1 } // Count how many in each group
        }
      }
    ]);

    // Get total count of all attendance records
    const totalAttendance = await Attendance.countDocuments(dateFilter);

    res.json({
      success: true,
      data: {
        total: totalAttendance,
        breakdown: statusBreakdown // Shows count for each status
      }
    });
  } catch (error) {
    console.error('Failed to get statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load statistics. Please try again',
      error: error.message
    });
  }
};

// Get list of students for teacher to mark attendance (Teacher only)
exports.getStudentsForAttendance = async (req, res) => {
  try {
    const User = require('../models/User');
    const teacherDepartment = req.user.department;

    // Get all students from teacher's department
    const students = await User.find({
      role: 'student',
      department: teacherDepartment
    })
    .select('name email rollNumber department')
    .sort({ rollNumber: 1 });

    res.json({
      success: true,
      count: students.length,
      data: {
        students
      }
    });
  } catch (error) {
    console.error('Failed to get students:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load students. Please try again',
      error: error.message
    });
  }
};

// Mark bulk attendance for multiple students (Teacher only)
exports.markBulkAttendance = async (req, res) => {
  try {
    const { attendance } = req.body; // Array of { studentId, status, date }
    const teacherId = req.user._id;

    if (!attendance || !Array.isArray(attendance) || attendance.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide attendance data for at least one student'
      });
    }

    const results = {
      success: [],
      failed: [],
      skipped: []
    };

    // Process each student's attendance
    for (const record of attendance) {
      try {
        const { studentId, status, date } = record;

        // Set date to midnight for consistency
        const attendanceDate = new Date(date);
        attendanceDate.setHours(0, 0, 0, 0);

        // Check if attendance already exists for this student on this date
        const existing = await Attendance.findOne({
          user: studentId,
          date: attendanceDate
        });

        if (existing) {
          // Update existing record
          existing.status = status;
          existing.markedBy = teacherId;
          existing.checkInTime = new Date();
          await existing.save();
          results.skipped.push({ studentId, message: 'Updated existing record' });
        } else {
          // Create new attendance record
          const attendanceRecord = await Attendance.create({
            user: studentId,
            date: attendanceDate,
            status: status,
            markedBy: teacherId,
            checkInTime: new Date()
          });
          results.success.push(studentId);
        }
      } catch (error) {
        results.failed.push({ studentId: record.studentId, error: error.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Attendance marked for ${results.success.length + results.skipped.length} student(s)`,
      data: {
        marked: results.success.length,
        updated: results.skipped.length,
        failed: results.failed.length,
        details: results
      }
    });
  } catch (error) {
    console.error('Failed to mark bulk attendance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark attendance. Please try again',
      error: error.message
    });
  }
};

