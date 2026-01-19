const User = require('../models/User');
const TeacherId = require('../models/HodId');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

exports.validateTeacherId = async (req, res) => {
  try {
    const { teacherId } = req.body;

    if (!teacherId) {
      return res.status(400).json({
        success: false,
        message: 'Teacher ID is required'
      });
    }

    const existingTeacherId = await TeacherId.findOne({ hodId: teacherId.trim() });

    if (existingTeacherId) {
      if (existingTeacherId.isRegistered) {
        return res.status(400).json({
          success: false,
          message: 'This Teacher ID is already registered',
          data: {
            valid: false,
            alreadyRegistered: true
          }
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Valid Teacher ID',
        data: {
          valid: true,
          department: existingTeacherId.department,
          alreadyRegistered: false
        }
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Invalid Teacher ID',
        data: {
          valid: false
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (role === 'student' && !name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required for students'
      });
    }

    if (role && !['student', 'teacher'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    if (role === 'student' && !rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required for students'
      });
    }

    if (role === 'teacher' && !department) {
      return res.status(400).json({
        success: false,
        message: 'Department is required for Teacher registration'
      });
    }

    // For Teacher registration, validate Teacher ID and Department match
    if (role === 'teacher') {
      const { teacherId } = req.body;
      
      if (!teacherId) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID is required for Teacher registration'
        });
      }

      // Check if Teacher ID exists in ids collection
      const teacherIdRecord = await TeacherId.findOne({ hodId: teacherId.trim() });
      
      if (!teacherIdRecord) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID not found in database. Please contact admin for correct Teacher ID.'
        });
      }

      // Check if Teacher ID and Department match
      if (teacherIdRecord.department !== department) {
        return res.status(400).json({
          success: false,
          message: 'Teacher ID and Department do not match. Please check your details.'
        });
      }

      // Check if email already exists
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered. Please use a different email.'
        });
      }

      // Save password to TeacherId collection
      teacherIdRecord.password = password;
      teacherIdRecord.isRegistered = true;
      await teacherIdRecord.save();

      // Use predefined name from TeacherId collection
      const teacherName = teacherIdRecord.name || name || 'Teacher';

      // Create new Teacher user
      const newTeacher = await User.create({
        name: teacherName,
        email,
        password,
        role: 'teacher',
        teacherId: teacherId.trim(),
        department
      });

      // Update registeredUserId in TeacherId collection
      teacherIdRecord.registeredUserId = newTeacher._id;
      await teacherIdRecord.save();

      console.log('Teacher Registration successful:', { 
        teacherId: newTeacher.teacherId, 
        email: newTeacher.email,
        role: newTeacher.role,
        passwordSavedInIds: true
      });

      // Give them a login token
      const loginToken = generateToken(newTeacher._id);

      return res.status(201).json({
        success: true,
        message: 'Teacher account registered successfully! You can now login with your Teacher ID.',
        data: {
          user: {
            id: newTeacher._id,
            name: newTeacher.name,
            email: newTeacher.email,
            role: newTeacher.role,
            teacherId: newTeacher.teacherId,
            department: newTeacher.department
          },
          token: loginToken
        }
      });
    }

    // Student registration - check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email'
      });
    }

    // Prepare user data for student
    const userData = {
      name,
      email,
      password,
      role: role || 'student',
      rollNumber,
      department
    };
    
    // Create new student account in database
    const newUser = await User.create(userData);

    // Give them a login token so they're automatically logged in
    const loginToken = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Student account created successfully!',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          teacherId: newUser.teacherId,
          rollNumber: newUser.rollNumber,
          department: newUser.department
        },
        token: loginToken
      }
    });
  } catch (error) {
    console.error('Registration failed:', error);
    
    // Check if error is because email/roll number already exists
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `This ${duplicateField} is already taken. Please use a different one`
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create account. Please try again',
      error: error.message
    });
  }
};

// Handle user login
exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Make sure they entered both email/Teacher ID and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email/Teacher ID and password'
      });
    }

    // For Teacher: login with Teacher ID only
    // For Student: login with email
    let user;
    if (role === 'teacher') {
      // Teacher login - check password from TeacherId collection
      const teacherIdToSearch = email.trim();
      const teacherIdRecord = await TeacherId.findOne({ hodId: teacherIdToSearch }).select('+password');
      
      console.log('Teacher Login attempt:', { teacherIdToSearch, teacherIdRecordFound: !!teacherIdRecord });
      
      if (!teacherIdRecord || !teacherIdRecord.password) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Teacher ID or password'
        });
      }

      // Check if the password matches from TeacherId collection
      const isPasswordCorrect = await teacherIdRecord.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Teacher ID or password'
        });
      }

      // Get user details from User collection
      user = await User.findOne({ teacherId: teacherIdToSearch, role: 'teacher' });
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid Teacher ID or password'
        });
      }
    } else {
      // Student login - search by email
      user = await User.findOne({ email: email, role: 'student' }).select('+password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Check if the password matches
      const isPasswordCorrect = await user.comparePassword(password);
      if (!isPasswordCorrect) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }
    }

    // Give them a login token
    const loginToken = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful! Welcome back!',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          teacherId: user.teacherId,
          rollNumber: user.rollNumber,
          department: user.department
        },
        token: loginToken
      }
    });
  } catch (error) {
    console.error('Login failed:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed. Please try again',
      error: error.message
    });
  }
};

// Get logged-in user's profile information
exports.getMe = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: { user: currentUser }
    });
  } catch (error) {
    console.error('Failed to get user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Could not load your profile. Please try again',
      error: error.message
    });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, department } = req.body;
    const userId = req.user._id;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: 'This email is already in use'
        });
      }
    }

    // Prepare update data
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (department) updateData.department = department;

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile. Please try again',
      error: error.message
    });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both current and new password'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully!'
    });
  } catch (error) {
    console.error('Failed to change password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password. Please try again',
      error: error.message
    });
  }
};
