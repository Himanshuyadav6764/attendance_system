require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HodId = require('./models/HodId');
const User = require('./models/User');

const checkPassword = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-leave-db');
    console.log('✓ Database connected\n');

    const hodIdToCheck = 'HOD_IT_001';
    const passwordToCheck = 'admin123';

    console.log('━'.repeat(60));
    console.log('🔍 Checking HOD_IT_001 credentials...');
    console.log('━'.repeat(60));

    // Check in HodId collection
    const hodIdRecord = await HodId.findOne({ hodId: hodIdToCheck });
    
    if (hodIdRecord) {
      console.log('\n📋 HOD ID Record Found:');
      console.log('ID:', hodIdRecord.hodId);
      console.log('Name:', hodIdRecord.name);
      console.log('Department:', hodIdRecord.department);
      console.log('Registered:', hodIdRecord.isRegistered);
      console.log('Hashed Password:', hodIdRecord.password ? hodIdRecord.password.substring(0, 30) + '...' : 'NOT SET');
      
      // Verify password
      const isPasswordCorrect = hodIdRecord.password ? await bcrypt.compare(passwordToCheck, hodIdRecord.password) : false;
      console.log('\n🔐 Password Verification:');
      console.log('Testing password: "admin123"');
      console.log('Result:', isPasswordCorrect ? '✅ CORRECT' : '❌ INCORRECT');
      
      if (!isPasswordCorrect) {
        console.log('\n⚠️  Password does NOT match! Updating now...');
        const newHashedPassword = await bcrypt.hash(passwordToCheck, 10);
        hodIdRecord.password = newHashedPassword;
        await hodIdRecord.save();
        console.log('✓ Password updated to "admin123"');
      }
    } else {
      console.log('\n❌ HOD_IT_001 not found in HodId collection');
    }

    // Check in User collection
    console.log('\n' + '━'.repeat(60));
    console.log('🔍 Checking registered users with HOD_IT_001...');
    console.log('━'.repeat(60));
    
    const users = await User.find({ 
      $or: [
        { studentId: hodIdToCheck },
        { teacherId: hodIdToCheck },
        { email: /ajay/i }
      ]
    });
    
    if (users.length > 0) {
      for (const user of users) {
        console.log('\n📋 User Found:');
        console.log('Email:', user.email);
        console.log('Role:', user.role);
        console.log('Student ID:', user.studentId || 'N/A');
        console.log('Teacher ID:', user.teacherId || 'N/A');
        console.log('Department:', user.department);
        console.log('Hashed Password:', user.password ? user.password.substring(0, 30) + '...' : 'NOT SET');
        
        const isPasswordCorrect = user.password ? await bcrypt.compare(passwordToCheck, user.password) : false;
        console.log('\n🔐 Password Verification:');
        console.log('Testing password: "admin123"');
        console.log('Result:', isPasswordCorrect ? '✅ CORRECT' : '❌ INCORRECT');
        
        if (!isPasswordCorrect) {
          console.log('\n⚠️  Password does NOT match! Updating now...');
          user.password = passwordToCheck; // Will be hashed by pre-save hook
          await user.save();
          console.log('✓ Password updated to "admin123"');
        }
      }
    } else {
      console.log('\n❌ No registered user found with HOD_IT_001');
    }

    console.log('\n' + '━'.repeat(60));
    console.log('✅ Check complete!');
    console.log('━'.repeat(60));
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

checkPassword();
