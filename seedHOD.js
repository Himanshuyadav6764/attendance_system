const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// HOD credentials
const HOD_CREDENTIALS = {
  name: 'Head of Department',
  email: 'HOD123123@gmail.com',
  password: 'HOD123',
  role: 'hod'
};

const seedHOD = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if HOD already exists
    const existingHOD = await User.findOne({ email: HOD_CREDENTIALS.email });
    
    if (existingHOD) {
      console.log('HOD user already exists');
      console.log('Email:', HOD_CREDENTIALS.email);
      
      // Update existing HOD if needed
      existingHOD.name = HOD_CREDENTIALS.name;
      existingHOD.password = HOD_CREDENTIALS.password;
      existingHOD.role = 'hod';
      await existingHOD.save();
      console.log('HOD user updated successfully');
    } else {
      // Create new HOD user
      const hod = new User(HOD_CREDENTIALS);
      await hod.save();
      console.log('HOD user created successfully');
    }

    console.log('\nHOD Credentials:');
    console.log('Email:', HOD_CREDENTIALS.email);
    console.log('Password:', HOD_CREDENTIALS.password);
    console.log('Role: HOD');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding HOD:', error.message);
    process.exit(1);
  }
};

// Run the seed function
seedHOD();
