require('dotenv').config();
const mongoose = require('mongoose');

const fixHodRole = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/attendance-leave-db');
    console.log('✓ Database connected\n');

    // Update all users with role 'hod' to 'teacher'
    const result = await mongoose.connection.collection('users').updateMany(
      { role: 'hod' },
      { $set: { role: 'teacher' } }
    );

    console.log('✓ Updated', result.modifiedCount, 'users from role "hod" to "teacher"');

    // Now update passwords
    const bcrypt = require('bcryptjs');
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update HOD_IT_001 in HodId collection
    const hodIdResult = await mongoose.connection.collection('hodids').updateOne(
      { hodId: 'HOD_IT_001' },
      { $set: { password: hashedPassword } }
    );
    console.log('✓ Updated HOD_IT_001 password in HodId collection');

    // Update all teacher users
    const userResult = await mongoose.connection.collection('users').updateMany(
      { role: 'teacher' },
      { $set: { password: hashedPassword } }
    );
    console.log('✓ Updated', userResult.modifiedCount, 'teacher user passwords');

    console.log('\n✅ All fixes complete!');
    console.log('━'.repeat(60));
    console.log('You can now login with:');
    console.log('ID: HOD_IT_001');
    console.log('Password: admin123');
    console.log('━'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
};

fixHodRole();
