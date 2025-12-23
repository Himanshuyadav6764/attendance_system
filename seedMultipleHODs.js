const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Initial HOD accounts for setup only
// After seeding, new HODs should register through the registration page
const HOD_ACCOUNTS = [
  {
    name: 'HOD - Computer Science',
    email: 'hod.cs@college.com',
    password: 'HOD@CS123', // Will be hashed automatically
    department: 'Computer Science',
    role: 'hod'
  },
  {
    name: 'HOD - Information Technology',
    email: 'hod.it@college.com',
    password: 'HOD@IT123',
    department: 'Information Technology',
    role: 'hod'
  },
  {
    name: 'HOD - Electronics & Communication',
    email: 'hod.ece@college.com',
    password: 'HOD@ECE123',
    department: 'Electronics & Communication',
    role: 'hod'
  },
  {
    name: 'HOD - Mechanical Engineering',
    email: 'hod.me@college.com',
    password: 'HOD@ME123',
    department: 'Mechanical Engineering',
    role: 'hod'
  }
];

const seedMultipleHODs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    console.log('Starting HOD account creation...\n');
    console.log('===========================================');

    for (const hodData of HOD_ACCOUNTS) {
      // Check if HOD already exists
      const existingHOD = await User.findOne({ email: hodData.email });
      
      if (existingHOD) {
        console.log(`Already exists: ${hodData.email}`);
        
        // Update existing HOD
        existingHOD.name = hodData.name;
        existingHOD.password = hodData.password;
        existingHOD.department = hodData.department;
        existingHOD.role = 'hod';
        await existingHOD.save();
        console.log(`Updated: ${hodData.name}`);
      } else {
        // Create new HOD user
        const hod = new User(hodData);
        await hod.save();
        console.log(`Created: ${hodData.name}`);
      }
    }

    console.log('\n===========================================');
    console.log('All HOD accounts processed successfully!');
    console.log('===========================================\n');
    console.log('Initial Login Credentials:');
    console.log('-------------------------------------------');
    HOD_ACCOUNTS.forEach(hod => {
      console.log(`\n${hod.department}`);
      console.log(`  Email: ${hod.email}`);
      console.log(`  Password: ${hod.password}`);
    });
    console.log('\n===========================================');
    console.log('\nIMPORTANT NOTES:');
    console.log('1. Change passwords after first login!');
    console.log('2. New HODs should register through registration page');
    console.log('3. Keep these credentials secure\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding HODs:', error.message);
    process.exit(1);
  }
};

// Run the seeding
seedMultipleHODs();
