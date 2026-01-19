const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const loginToken = authHeader.split(' ')[1];

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const decodedToken = jwt.verify(loginToken, process.env.JWT_SECRET);

    const currentUser = await User.findById(decodedToken.id).select('-password');
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

// Check if user has permission (admin or student)
exports.authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Make sure user is logged in first
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please log in first'
      });
    }

    // Check if user's role matches the required roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. You need to be ${allowedRoles.join(' or ')} to access this`
      });
    }

    next(); // User has permission, continue
  };
};

// Make sure students can only access their own data (not other students' data)
exports.verifyOwnership = (DatabaseModel) => {
  return async (req, res, next) => {
    try {
      const itemId = req.params.id;
      const item = await DatabaseModel.findById(itemId);

      // Check if the item exists
      if (!item) {
        return res.status(404).json({
          success: false,
          message: 'Item not found'
        });
      }

      // HOD can access everything
      if (req.user.role === 'hod') {
        req.resource = item;
        return next();
      }

      // Students can only access their own items
      if (item.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own data'
        });
      }

      req.resource = item;
      next(); // User owns this item, allow access
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong while checking ownership'
      });
    }
  };
};
