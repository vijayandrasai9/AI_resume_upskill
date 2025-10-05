const mongoose = require('mongoose');
const User = require('./models/User');
const { analyzeLatestResume } = require('./controllers/aiController');

// Test script to verify skills detection
async function testSkillsDetection() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/ai_resume_upskill', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Find a user with resumes
    const user = await User.findOne({ resumes: { $exists: true, $not: { $size: 0 } } });
    if (!user) {
      console.log('No user with resumes found');
      return;
    }

    console.log('Found user:', user.email);
    console.log('User resumes:', user.resumes.length);

    // Create a mock request object
    const mockReq = {
      user: { id: user._id }
    };

    // Create a mock response object
    const mockRes = {
      status: (code) => ({
        json: (data) => {
          console.log('Response status:', code);
          console.log('Response data:', JSON.stringify(data, null, 2));
        }
      }),
      json: (data) => {
        console.log('Response data:', JSON.stringify(data, null, 2));
      }
    };

    // Test the analyzeLatestResume function
    console.log('\n--- Testing analyzeLatestResume ---');
    await analyzeLatestResume(mockReq, mockRes);

    // Check if skills were stored
    const updatedUser = await User.findById(user._id);
    console.log('\n--- Updated user resumeDetectedSkills ---');
    console.log('Stored skills:', updatedUser.resumeDetectedSkills);

  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testSkillsDetection();
