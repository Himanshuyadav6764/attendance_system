require('dotenv').config();
const mongoose = require('mongoose');
const HodId = require('./models/HodId');

const createHodId = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-leave-db');
    console.log('✓ Database connected');

    // Create HOD ID record
    const hodIdData = {
      hodId: 'HOD_IT_001',
      name: 'Dr. John Smith',
      department: 'Information Technology',
      password: 'admin123',  // This will be hashed automatically
      isRegistered: false
    };

    // Check if HOD ID already exists
    const existing = await HodId.findOne({ hodId: hodIdData.hodId });
    if (existing) {
      console.log('✗ HOD ID already exists:', hodIdData.hodId);
      console.log('Use these credentials to register:');
      console.log('HOD ID:', hodIdData.hodId);
      console.log('Password: admin123');
      process.exit(0);
    }

    // Create new HOD ID
    const newHodId = await HodId.create(hodIdData);
    console.log('✓ HOD ID created successfully!');
    console.log('\n📋 HOD ID Details:');
    console.log('HOD ID:', newHodId.hodId);
    console.log('Name:', newHodId.name);
    console.log('Department:', newHodId.department);
    console.log('Password: admin123');
    console.log('\n📝 Next Steps:');
    console.log('1. Register with this HOD ID using: POST /api/auth/register');
    console.log('   Body: { "hodId": "HOD_IT_001", "email": "hod@example.com", "password": "admin123", "role": "hod", "department": "Information Technology" }');
    console.log('2. Then login with: POST /api/auth/login');
    console.log('   Body: { "email": "HOD_IT_001", "password": "admin123", "role": "hod" }');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

createHodId();
