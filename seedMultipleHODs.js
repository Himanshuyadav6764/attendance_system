const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Multiple HOD credentials - Add as many as you want
const HOD_ACCOUNTS = [
  {
    name: 'Head of Department - CS',
    email: 'hod.cs@college.com',
    password: 'HOD123',
    department: 'Computer Science',
    role: 'hod'
  },
  {
    name: 'Head of Department - IT',
    email: 'hod.it@college.com',
    password: 'HOD123',
    department: 'Information Technology',
    role: 'hod'
  },
  {
    name: 'Head of Department - ECE',
    email: 'hod.ece@college.com',
    password: 'HOD123',
    department: 'Electronics & Communication',
    role: 'hod'
  },
  {
    name: 'Head of Department - ME',
    email: 'hod.me@college.com',
    password: 'HOD123',
    department: 'Mechanical Engineering',
    role: 'hod'
  }
];

const seedMultipleHODs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    console.log('\nStarting HOD account creation...\n');

    for (const hodData of HOD_ACCOUNTS) {
      // Check if HOD already exists
      const existingHOD = await User.findOne({ email: hodData.email });
      
      if (existingHOD) {
        console.log(`HOD already exists: ${hodData.email}`);
        
        // Update existing HOD
        existingHOD.name = hodData.name;
        existingHOD.password = hodData.password;
        existingHOD.department = hodData.department;
        existingHOD.role = 'hod';
        await existingHOD.save();
        console.log(`Updated: ${hodData.name} (${hodData.department})`);
      } else {
        // Create new HOD user
        const hod = new User(hodData);
        await hod.save();
        console.log(`Created: ${hodData.name} (${hodData.department})`);
      }
    }

    console.log('\nAll HOD accounts processed successfully!');
    console.log('\nHOD Credentials:');
    console.log('=====================================');
    HOD_ACCOUNTS.forEach(hod => {
      console.log(`\nDepartment: ${hod.department}`);
      console.log(`Email: ${hod.email}`);
      console.log(`Password: ${hod.password}`);
    });
    console.log('\n=====================================');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding HODs:', error.message);
    process.exit(1);
  }
};

// Run the seeding
seedMultipleHODs();
