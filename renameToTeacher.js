require('dotenv').config();
const mongoose = require('mongoose');

const renameHodToTeacher = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Database connected\n');

    console.log('━'.repeat(60));
    console.log('🔄 Renaming HOD_IT_001 to TEACHER_IT_001');
    console.log('━'.repeat(60));

    // 1. Update in ids collection (HodId collection)
    console.log('\n1️⃣ Updating ids collection...');
    const hodIdResult = await mongoose.connection.collection('ids').updateOne(
      { hodId: 'HOD_IT_001' },
      { $set: { hodId: 'TEACHER_IT_001' } }
    );
    console.log('✓ Updated:', hodIdResult.modifiedCount, 'record(s)');

    // 2. Update in users collection
    console.log('\n2️⃣ Updating users collection...');
    const userResult = await mongoose.connection.collection('users').updateMany(
      { teacherId: 'HOD_IT_001' },
      { $set: { teacherId: 'TEACHER_IT_001' } }
    );
    console.log('✓ Updated:', userResult.modifiedCount, 'user(s)');

    // 3. Verify the changes
    console.log('\n3️⃣ Verifying changes...');
    const newTeacherId = await mongoose.connection.collection('ids').findOne(
      { hodId: 'TEACHER_IT_001' }
    );
    
    if (newTeacherId) {
      console.log('✅ New Teacher ID found:');
      console.log('   ID:', newTeacherId.hodId);
      console.log('   Name:', newTeacherId.name);
      console.log('   Department:', newTeacherId.department);
    }

    const updatedUsers = await mongoose.connection.collection('users').find(
      { teacherId: 'TEACHER_IT_001' }
    ).toArray();
    
    console.log('✅ Users updated:', updatedUsers.length);
    updatedUsers.forEach(user => {
      console.log('   -', user.email, '(', user.name, ')');
    });

    console.log('\n' + '━'.repeat(60));
    console.log('✅ All changes completed successfully!');
    console.log('━'.repeat(60));
    console.log('\n📋 New Login Credentials:');
    console.log('Teacher ID: TEACHER_IT_001');
    console.log('Password: admin123');
    console.log('━'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

renameHodToTeacher();
