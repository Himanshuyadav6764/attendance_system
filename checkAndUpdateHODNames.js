const mongoose = require('mongoose');
const User = require('./models/User');
const HodId = require('./models/HodId');
require('dotenv').config();

const checkAndUpdateHODNames = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Check current HOD users in database
    const hodUsers = await User.find({ role: 'hod' });
    console.log('===========================================');
    console.log('Current HOD Users in Database:');
    console.log('===========================================');
    hodUsers.forEach(user => {
      console.log(`HOD ID: ${user.hodId}`);
      console.log(`  Current Name: ${user.name}`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Department: ${user.department}\n`);
    });

    // Check HOD IDs collection
    const hodIds = await HodId.find({});
    console.log('===========================================');
    console.log('HOD IDs Collection:');
    console.log('===========================================');
    hodIds.forEach(hod => {
      console.log(`HOD ID: ${hod.hodId}`);
      console.log(`  Name in IDs collection: ${hod.name}`);
      console.log(`  Department: ${hod.department}\n`);
    });

    // Update User names from HodId collection
    console.log('===========================================');
    console.log('Updating User Names from IDs Collection:');
    console.log('===========================================');
    
    let updated = 0;
    for (const hodId of hodIds) {
      const user = await User.findOne({ hodId: hodId.hodId, role: 'hod' });
      if (user && user.name !== hodId.name) {
        user.name = hodId.name;
        await user.save();
        console.log(`✓ Updated: ${hodId.hodId} → ${hodId.name}`);
        updated++;
      } else if (user) {
        console.log(`- Already correct: ${hodId.hodId} → ${hodId.name}`);
      } else {
        console.log(`⚠ User not found for: ${hodId.hodId}`);
      }
    }

    console.log(`\n===========================================`);
    console.log(`Total updated: ${updated}`);
    console.log(`===========================================\n`);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAndUpdateHODNames();
