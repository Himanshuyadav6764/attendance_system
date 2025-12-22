const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Create a login token for the user (like a temporary ID card that expires)
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d' // Token valid for 7 days
  });
};

// Handle new user registration (signup)
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;

    // Make sure user filled in all required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your name, email, and password'
      });
    }

    // Check if someone already registered with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'This email is already registered. Please use a different email'
      });
    }

    // Prepare user data - only include rollNumber and department for students
    const userData = {
      name,
      email,
      password,
      role: role || 'student' // Default to student if role not specified
    };
    
    // Add student-specific fields only if role is student
    if (userData.role === 'student') {
      userData.rollNumber = rollNumber;
      userData.department = department;
    }
    
    // Create new user account in database
    const newUser = await User.create(userData);

    // Give them a login token so they're automatically logged in
    const loginToken = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome!',
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
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
    const { email, password } = req.body;

    // Make sure they entered both email and password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter both email and password'
      });
    }

    // Find user with this email (also get password to check it)
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect'
      });
    }

    // Check if the password matches
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Email or password is incorrect'
      });
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
