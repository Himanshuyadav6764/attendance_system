require('dotenv').config();
const mongoose = require('mongoose');
const HodId = require('./models/HodId');

// ============================================
// CUSTOMIZE YOUR HOD CREDENTIALS HERE
// ============================================
const YOUR_HOD_ID = 'HOD_CS_101';          // Change this to your HOD ID
const YOUR_PASSWORD = 'admin123';           // Change this to your password
const YOUR_NAME = 'Dr. Your Name';          // Change this to your name
const YOUR_DEPARTMENT = 'Computer Science'; // Change this to your department
// ============================================

const createCustomHodId = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-leave-db');
    console.log('✓ Database connected\n');

    // Check if HOD ID already exists
    const existing = await HodId.findOne({ hodId: YOUR_HOD_ID });
    if (existing) {
      console.log('✗ This HOD ID already exists:', YOUR_HOD_ID);
      console.log('\nYou can still use these credentials:');
      console.log('━'.repeat(50));
      console.log('HOD ID:', YOUR_HOD_ID);
      console.log('Password:', YOUR_PASSWORD);
      console.log('━'.repeat(50));
      process.exit(0);
    }

    // Create new HOD ID with your credentials
    const hodIdData = {
      hodId: YOUR_HOD_ID,
      name: YOUR_NAME,
      department: YOUR_DEPARTMENT,
      password: YOUR_PASSWORD,  // This will be hashed automatically
      isRegistered: false
    };

    const newHodId = await HodId.create(hodIdData);
    
    console.log('✓ Your HOD ID created successfully!\n');
    console.log('━'.repeat(50));
    console.log('📋 Your HOD Credentials:');
    console.log('━'.repeat(50));
    console.log('HOD ID:    ', newHodId.hodId);
    console.log('Password:  ', YOUR_PASSWORD);
    console.log('Name:      ', newHodId.name);
    console.log('Department:', newHodId.department);
    console.log('━'.repeat(50));
    
    console.log('\n📝 STEP 1: Register HOD Account');
    console.log('━'.repeat(50));
    console.log('URL: POST http://localhost:5000/api/auth/register');
    console.log('Body:');
    console.log(JSON.stringify({
      hodId: YOUR_HOD_ID,
      email: 'your.email@example.com',  // Use any email
      password: YOUR_PASSWORD,
      role: 'hod',
      department: YOUR_DEPARTMENT
    }, null, 2));
    
    console.log('\n📝 STEP 2: Login with HOD ID');
    console.log('━'.repeat(50));
    console.log('URL: POST http://localhost:5000/api/auth/login');
    console.log('Body:');
    console.log(JSON.stringify({
      email: YOUR_HOD_ID,    // Use HOD ID here, not email!
      password: YOUR_PASSWORD,
      role: 'hod'
    }, null, 2));
    console.log('━'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

createCustomHodId();
