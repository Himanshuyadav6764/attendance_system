require('dotenv').config();
const mongoose = require('mongoose');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Database connected\n');

    // Find user with email containing ajay
    const user = await mongoose.connection.collection('users').findOne(
      { email: /ajay/i }
    );
    
    console.log('User found:', JSON.stringify(user, null, 2));

    // Also check the HodId record
    const hodId = await mongoose.connection.collection('ids').findOne(
      { hodId: 'HOD_IT_001' }
    );
    
    console.log('\n\nHodId record:', JSON.stringify(hodId, null, 2));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkUser();
