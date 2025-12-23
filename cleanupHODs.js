const mongoose = require('mongoose');
const User = require('./models/User');
const HodId = require('./models/HodId');
require('dotenv').config();

const cleanupDuplicateHODs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all HOD users with temporary emails
    const tempHODs = await User.find({
      role: 'hod',
      email: { $regex: '@temp.com$' }
    });

    console.log(`\nFound ${tempHODs.length} temporary HOD records to clean up`);

    for (const hod of tempHODs) {
      console.log(`Deleting: ${hod.hodId} - ${hod.email}`);
      await User.deleteOne({ _id: hod._id });
      
      // Reset isRegistered flag in ids collection
      await HodId.updateOne(
        { hodId: hod.hodId },
        { $set: { isRegistered: false, registeredUserId: null } }
      );
    }

    // Also find any HODs that might have been created through seed
    const seedHODs = await User.find({
      role: 'hod',
      name: 'Pending Registration'
    });

    console.log(`\nFound ${seedHODs.length} pending registration HOD records`);

    for (const hod of seedHODs) {
      console.log(`Deleting: ${hod.hodId} - ${hod.name}`);
      await User.deleteOne({ _id: hod._id });
      
      // Reset isRegistered flag in ids collection
      if (hod.hodId) {
        await HodId.updateOne(
          { hodId: hod.hodId },
          { $set: { isRegistered: false, registeredUserId: null } }
        );
      }
    }

    console.log('\n===========================================');
    console.log('Cleanup Complete!');
    console.log('===========================================');
    console.log('All HOD IDs are now available for registration.');
    console.log('HODs can now register using their assigned HOD IDs.\n');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error.message);
    process.exit(1);
  }
};

// Run the cleanup
cleanupDuplicateHODs();
