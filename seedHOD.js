const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// HOD credentials - Only for initial setup
// After this, HODs should register through the registration page
const HOD_CREDENTIALS = {
  name: 'Head of Department',
  email: 'hod@college.com',
  password: 'HOD@123456', // This will be hashed automatically
  department: 'Computer Science',
  role: 'hod'
};

const seedHOD = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if HOD already exists
    const existingHOD = await User.findOne({ email: HOD_CREDENTIALS.email });
    
    if (existingHOD) {
      console.log('HOD user already exists');
      console.log('Email:', HOD_CREDENTIALS.email);
      
      // Update existing HOD if needed
      existingHOD.name = HOD_CREDENTIALS.name;
      existingHOD.password = HOD_CREDENTIALS.password;
      existingHOD.department = HOD_CREDENTIALS.department;
      existingHOD.role = 'hod';
      await existingHOD.save();
      console.log('HOD user updated successfully');
    } else {
      // Create new HOD user
      const hod = new User(HOD_CREDENTIALS);
      await hod.save();
      console.log('HOD user created successfully');
    }

    console.log('\n===========================================');
    console.log('Initial HOD Account Created!');
    console.log('===========================================');
    console.log('Email:', HOD_CREDENTIALS.email);
    console.log('Password:', HOD_CREDENTIALS.password);
    console.log('Department:', HOD_CREDENTIALS.department);
    console.log('===========================================');
    console.log('\nIMPORTANT: For security, change this password after first login!');
    console.log('New HODs should register through the registration page.\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding HOD:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedHOD();
