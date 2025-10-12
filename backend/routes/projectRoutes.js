const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Generate AI-powered project recommendations
router.post('/generate-projects', projectController.generateProjects);

// Get project recommendations for user
router.get('/project-recommendations', projectController.getProjectRecommendations);

module.exports = router;