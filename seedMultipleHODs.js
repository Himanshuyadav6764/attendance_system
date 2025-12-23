const mongoose = require('mongoose');
const HodId = require('./models/HodId');
require('dotenv').config();

// Admin creates HOD IDs with departments only
// HODs will register themselves using these IDs
const HOD_IDS = [
  {
    hodId: 'HOD_CS_001',
    name: 'Tripti Sharma',
    department: 'Computer Science Engineering'
  },
  {
    hodId: 'HOD_IT_001',
    name: 'Dr. Ajay Kushwaha',
    department: 'Information Technology'
  },
  {
    hodId: 'HOD_ECE_001',
    name: 'abcde',
    department: 'Electronics and Communication Engineering'
  },
  {
    hodId: 'HOD_EE_001',
    name: 'XYZ',
    department: 'Electrical Engineering'
  },
  {
    hodId: 'HOD_ME_001',
    name: 'xxxxxxxxx',
    department: 'Mechanical Engineering'
  },
  {
    hodId: 'HOD_CE_001',
    name: 'Civil Engineering',
    department: 'Civil Engineering'
  },
  {
    hodId: 'HOD_CHE_001',
    name: 'Chemical Engineering',
    department: 'Chemical Engineering'
  },
  {
    hodId: 'HOD_BT_001',
    name: 'abcdefrgf',
    department: 'Biotechnology'
  }
];

const seedMultipleHODs = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    let created = 0;
    let updated = 0;
    let errors = 0;

    for (const hodData of HOD_IDS) {
      try {
        // Check if HOD ID already exists
        const existingHOD = await HodId.findOne({ hodId: hodData.hodId });

        if (existingHOD) {
          // Update name and department if changed
          existingHOD.name = hodData.name;
          existingHOD.department = hodData.department;
          await existingHOD.save();
          updated++;
          console.log(`✓ Updated: ${hodData.hodId} - ${hodData.name} - ${hodData.department}`);
        } else {
          // Create HOD ID record with name and department
          const hodId = new HodId({
            hodId: hodData.hodId,
            name: hodData.name,
            department: hodData.department,
            isRegistered: false
          });
          await hodId.save();
          created++;
          console.log(`✓ Created: ${hodData.hodId} - ${hodData.name} - ${hodData.department}`);
        }
      } catch (err) {
        errors++;
        console.error(`✗ Error for ${hodData.hodId}:`, err.message);
      }
    }

    console.log('\n===========================================');
    console.log('HOD IDs Summary:');
    console.log('===========================================');
    console.log(`Created: ${created}`);
    console.log(`Updated: ${updated}`);
    console.log(`Errors: ${errors}`);
    console.log('===========================================');
    
    if (created > 0 || updated > 0) {
      console.log('\nAvailable HOD IDs for Registration:');
      console.log('-------------------------------------------');
      HOD_IDS.forEach(hod => {
        console.log(`\nHOD ID: ${hod.hodId}`);
        console.log(`  Name: ${hod.name}`);
        console.log(`  Department: ${hod.department}`);
      });
      console.log('\n-------------------------------------------');
      console.log('INSTRUCTIONS:');
      console.log('1. Share these HOD IDs with respective department heads');
      console.log('2. HODs must register using their assigned HOD ID');
      console.log('3. During registration, name will be auto-filled from database');
      console.log('4. HODs only need to provide email and password');
      console.log('5. To add more HOD IDs, add them to HOD_IDS array in this file.\n');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding HOD IDs:', error.message);
    process.exit(1);
  }
};

// Run the seeding
seedMultipleHODs();
