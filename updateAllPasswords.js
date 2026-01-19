require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const HodId = require('./models/HodId');
const User = require('./models/User');

const updateAllPasswords = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-leave-db');
    console.log('✓ Database connected\n');

    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update all HOD/Teacher IDs in HodId collection
    console.log('🔄 Updating all Teacher/HOD ID passwords...');
    const hodIdResult = await HodId.updateMany(
      {},
      { $set: { password: hashedPassword } }
    );
    console.log(`✓ Updated ${hodIdResult.modifiedCount} Teacher/HOD ID records`);

    // Update all Teacher/HOD users in User collection
    console.log('\n🔄 Updating all Teacher/HOD user passwords...');
    const userResult = await User.updateMany(
      { role: { $in: ['hod', 'teacher'] } },
      { $set: { password: hashedPassword } }
    );
    console.log(`✓ Updated ${userResult.modifiedCount} Teacher/HOD user accounts`);

    // Show summary
    console.log('\n' + '━'.repeat(60));
    console.log('✓ All passwords updated successfully!');
    console.log('━'.repeat(60));
    console.log('📋 New Password for all Teacher/HOD accounts: admin123');
    console.log('━'.repeat(60));
    console.log('\n💡 You can now login with any Teacher/HOD ID using password: admin123');

    // List all Teacher/HOD IDs
    console.log('\n📋 Available Teacher/HOD IDs in database:');
    const allHodIds = await HodId.find({});
    if (allHodIds.length > 0) {
      console.log('━'.repeat(60));
      allHodIds.forEach((hod, index) => {
        console.log(`${index + 1}. ${hod.hodId} - ${hod.name} (${hod.department})`);
        console.log(`   Registered: ${hod.isRegistered ? 'Yes' : 'No'}`);
      });
      console.log('━'.repeat(60));
    } else {
      console.log('No Teacher/HOD IDs found in database');
    }

    // List all registered Teacher/HOD users
    console.log('\n📋 Registered Teacher/HOD Users:');
    const allTeachers = await User.find({ role: { $in: ['hod', 'teacher'] } });
    if (allTeachers.length > 0) {
      console.log('━'.repeat(60));
      allTeachers.forEach((teacher, index) => {
        console.log(`${index + 1}. ${teacher.email} (${teacher.studentId || teacher.teacherId || 'No ID'})`);
        console.log(`   Role: ${teacher.role} | Department: ${teacher.department}`);
      });
      console.log('━'.repeat(60));
    } else {
      console.log('No registered Teacher/HOD users found');
    }

    console.log('\n✅ Password update complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

updateAllPasswords();
