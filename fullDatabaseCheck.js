require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const fullDatabaseCheck = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Database connected\n');

    const teacherId = 'HOD_IT_001';
    const password = 'admin123';

    console.log('━'.repeat(60));
    console.log('🔍 COMPLETE DATABASE CHECK FOR HOD_IT_001');
    console.log('━'.repeat(60));

    // 1. Check HodId/TeacherId collection
    console.log('\n1️⃣ Checking ids collection...');
    const hodIdRecord = await mongoose.connection.collection('ids').findOne({ hodId: teacherId });
    
    if (hodIdRecord) {
      console.log('✓ Record found');
      console.log('  Name:', hodIdRecord.name);
      console.log('  Department:', hodIdRecord.department);
      console.log('  Registered:', hodIdRecord.isRegistered);
      console.log('  Has Password:', !!hodIdRecord.password);
      
      if (hodIdRecord.password) {
        const isCorrect = await bcrypt.compare(password, hodIdRecord.password);
        console.log('  Password Check:', isCorrect ? '✅ CORRECT' : '❌ WRONG');
        
        if (!isCorrect) {
          console.log('  ⚠️  Fixing password...');
          const newHash = await bcrypt.hash(password, 10);
          await mongoose.connection.collection('ids').updateOne(
            { hodId: teacherId },
            { $set: { password: newHash } }
          );
          console.log('  ✓ Password fixed!');
        }
      } else {
        console.log('  ⚠️  No password set! Fixing...');
        const newHash = await bcrypt.hash(password, 10);
        await mongoose.connection.collection('ids').updateOne(
          { hodId: teacherId },
          { $set: { password: newHash } }
        );
        console.log('  ✓ Password set!');
      }
    } else {
      console.log('❌ No record found in ids collection!');
    }

    // 2. Check User collection
    console.log('\n2️⃣ Checking users collection...');
    const user = await mongoose.connection.collection('users').findOne({
      $or: [
        { teacherId: teacherId },
        { hodId: teacherId },
        { email: /ajay/i }
      ]
    });
    
    if (user) {
      console.log('✓ User found');
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  teacherId:', user.teacherId || 'NOT SET');
      console.log('  hodId:', user.hodId || 'NOT SET');
      console.log('  Department:', user.department);
      console.log('  Has Password:', !!user.password);
      
      // Fix role if needed
      if (user.role === 'hod') {
        console.log('  ⚠️  Role is "hod", changing to "teacher"...');
        await mongoose.connection.collection('users').updateOne(
          { _id: user._id },
          { $set: { role: 'teacher' } }
        );
        console.log('  ✓ Role fixed!');
      }
      
      // Fix teacherId field
      if (user.hodId && !user.teacherId) {
        console.log('  ⚠️  Has hodId but no teacherId, fixing...');
        await mongoose.connection.collection('users').updateOne(
          { _id: user._id },
          { 
            $set: { teacherId: user.hodId },
            $unset: { hodId: "" }
          }
        );
        console.log('  ✓ teacherId field fixed!');
      } else if (!user.teacherId) {
        console.log('  ⚠️  No teacherId set, setting it...');
        await mongoose.connection.collection('users').updateOne(
          { _id: user._id },
          { $set: { teacherId: teacherId } }
        );
        console.log('  ✓ teacherId set!');
      }
      
      // Fix password
      if (user.password) {
        const isCorrect = await bcrypt.compare(password, user.password);
        console.log('  Password Check:', isCorrect ? '✅ CORRECT' : '❌ WRONG');
        
        if (!isCorrect) {
          console.log('  ⚠️  Fixing password...');
          const newHash = await bcrypt.hash(password, 10);
          await mongoose.connection.collection('users').updateOne(
            { _id: user._id },
            { $set: { password: newHash } }
          );
          console.log('  ✓ Password fixed!');
        }
      } else {
        console.log('  ⚠️  No password! Setting it...');
        const newHash = await bcrypt.hash(password, 10);
        await mongoose.connection.collection('users').updateOne(
          { _id: user._id },
          { $set: { password: newHash } }
        );
        console.log('  ✓ Password set!');
      }
    } else {
      console.log('❌ No user found!');
    }

    // 3. Final verification
    console.log('\n3️⃣ FINAL VERIFICATION...');
    const finalHodId = await mongoose.connection.collection('ids').findOne({ hodId: teacherId });
    const finalUser = await mongoose.connection.collection('users').findOne({ teacherId: teacherId });
    
    console.log('\n✅ Final Status:');
    console.log('━'.repeat(60));
    if (finalHodId && finalHodId.password) {
      const passCheck1 = await bcrypt.compare(password, finalHodId.password);
      console.log('ids collection password:', passCheck1 ? '✅ CORRECT' : '❌ WRONG');
    }
    
    if (finalUser) {
      console.log('User teacherId field:', finalUser.teacherId || '❌ NOT SET');
      console.log('User role:', finalUser.role);
      if (finalUser.password) {
        const passCheck2 = await bcrypt.compare(password, finalUser.password);
        console.log('User password:', passCheck2 ? '✅ CORRECT' : '❌ WRONG');
      }
    }
    
    console.log('━'.repeat(60));
    console.log('\n🎉 All fixes applied!');
    console.log('Login with: HOD_IT_001 / admin123');
    console.log('━'.repeat(60));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fullDatabaseCheck();
