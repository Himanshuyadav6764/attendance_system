require('dotenv').config();
const mongoose = require('mongoose');

const fixTeacherIdField = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Database connected\n');

    // Rename hodId field to teacherId for all teacher users
    const result = await mongoose.connection.collection('users').updateMany(
      { hodId: { $exists: true } },
      { $rename: { hodId: 'teacherId' } }
    );

    console.log('✓ Updated', result.modifiedCount, 'users - renamed hodId to teacherId');
    console.log('\n✅ Fix complete! You can now login with HOD_IT_001 and password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

fixTeacherIdField();
