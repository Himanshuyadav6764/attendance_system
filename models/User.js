const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.role === 'student';
    },
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['student', 'teacher'],
    default: 'student'
  },
  teacherId: {
    type: String,
    sparse: true,
    trim: true,
    required: function() {
      return this.role === 'teacher';
    }
  },
  rollNumber: {
    type: String,
    sparse: true,
    trim: true
  },
  department: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate rollNumber uniqueness only for students
userSchema.pre('save', async function(next) {
  // Check for duplicate roll number only if it's a student and rollNumber is provided
  if (this.role === 'student' && this.rollNumber) {
    const existingStudent = await mongoose.model('User').findOne({
      rollNumber: this.rollNumber,
      _id: { $ne: this._id }
    });
    if (existingStudent) {
      const error = new Error('This rollNumber is already taken. Please use a different one');
      error.code = 11000;
      error.keyPattern = { rollNumber: 1 };
      return next(error);
    }
  }
  next();
});

// Generate Teacher ID automatically for Teacher users
userSchema.pre('save', async function(next) {
  // Only generate Teacher ID if it's a Teacher and ID not already set
  if (this.role === 'teacher' && !this.teacherId && this.isNew) {
    try {
      // Create department abbreviation (first 3 letters, uppercase)
      const deptAbbr = this.department 
        ? this.department.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '')
        : 'GEN';
      
      // Find the last Teacher in this department
      const lastTeacher = await mongoose.model('User').findOne({
        role: 'teacher',
        department: this.department
      }).sort({ createdAt: -1 });

      let sequence = 1;
      if (lastTeacher && lastTeacher.teacherId) {
        // Extract sequence number from last Teacher ID
        const match = lastTeacher.teacherId.match(/(\d+)$/);
        if (match) {
          sequence = parseInt(match[1]) + 1;
        }
      }

      // Generate Teacher ID: TCH_DEPT_001
      this.teacherId = `TCH_${deptAbbr}_${sequence.toString().padStart(3, '0')}`;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
