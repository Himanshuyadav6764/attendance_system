require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function checkRollNumbers() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database');

    // Find all students
    const students = await User.find({ role: 'student' }).select('name rollNumber department');
    
    console.log('\n=== All Students ===');
    students.forEach(student => {
      console.log(`Name: ${student.name}, Roll Number: "${student.rollNumber}", Type: ${typeof student.rollNumber}, Department: ${student.department}`);
    });

    // Test exact match for roll number "11"
    console.log('\n=== Testing Roll Number "11" ===');
    const student11 = await User.findOne({ role: 'student', rollNumber: '11' });
    if (student11) {
      console.log('Found student:', student11.name, student11.rollNumber);
    } else {
      console.log('No student found with exact roll number "11"');
    }

    // Test what happens with number type
    console.log('\n=== Testing Roll Number as Number 11 ===');
    const student11Num = await User.findOne({ role: 'student', rollNumber: 11 });
    if (student11Num) {
      console.log('Found student:', student11Num.name, student11Num.rollNumber);
    } else {
      console.log('No student found with roll number 11 as number');
    }

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkRollNumbers();
