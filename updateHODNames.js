const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// HOD IDs with their correct names
const HOD_NAMES = [
  {
    hodId: 'HOD_CS_001',
    name: 'Tripti Sharma'
  },
  {
    hodId: 'HOD_IT_001',
    name: 'Dr. Ajay Kushwaha'
  },
  {
    hodId: 'HOD_ECE_001',
    name: 'abcde'
  },
  {
    hodId: 'HOD_EE_001',
    name: 'XYZ'
  },
  {
    hodId: 'HOD_ME_001',
    name: 'xxxxxxxxx'
  },
  {
    hodId: 'HOD_CE_001',
    name: 'Civil Engineering'
  },
  {
    hodId: 'HOD_CHE_001',
    name: 'Chemical Engineering'
  },
  {
    hodId: 'HOD_BT_001',
    name: 'abcdefrgf'
  }
];

const updateHODNames = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let updated = 0;
    let notFound = 0;

    console.log('\n===========================================');
    console.log('Updating HOD Names in Database');
    console.log('===========================================\n');

    for (const hod of HOD_NAMES) {
      // Find and update HOD user by hodId
      const result = await User.findOneAndUpdate(
        { hodId: hod.hodId, role: 'hod' },
        { $set: { name: hod.name } },
        { new: true }
      );

      if (result) {
        console.log(`✓ Updated: ${hod.hodId} → ${hod.name}`);
        updated++;
      } else {
        console.log(`⚠ Not found: ${hod.hodId} (User not registered yet)`);
        notFound++;
      }
    }

    console.log('\n===========================================');
    console.log('Summary:');
    console.log('===========================================');
    console.log(`Updated: ${updated}`);
    console.log(`Not Found: ${notFound}`);
    console.log('===========================================\n');

    if (notFound > 0) {
      console.log('Note: HOD IDs that are not found means those HODs have not');
      console.log('registered yet. Names will be set when they register.\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateHODNames();
