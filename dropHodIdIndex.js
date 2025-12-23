const mongoose = require('mongoose');
require('dotenv').config();

const dropHodIdIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the users collection
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Drop the hodId unique index
    try {
      await usersCollection.dropIndex('hodId_1');
      console.log('✓ Successfully dropped hodId unique index');
    } catch (error) {
      if (error.code === 27 || error.codeName === 'IndexNotFound') {
        console.log('✓ Index hodId_1 does not exist (already dropped or never created)');
      } else {
        throw error;
      }
    }

    // List all remaining indexes
    const indexes = await usersCollection.indexes();
    console.log('\nRemaining indexes on users collection:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key));
    });

    console.log('\n✓ Operation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

dropHodIdIndex();
