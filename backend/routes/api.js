const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const { getProfile } = require("../controllers/profileController");
const { listResumes, uploadResume, deleteResume } = require("../controllers/resumeController");
const { getGuides, getRecommendations, getProjectRecommendations } = require("../controllers/contentController");
const { analyzeLatestResume } = require("../controllers/aiController");

// Profile
router.get("/profile", protect, getProfile);

// Resumes
router.get("/resumes", protect, listResumes);
router.post("/resumes", protect, upload.single("resume"), uploadResume);
router.delete("/resumes/:filename", protect, deleteResume);

// Content
router.get("/guides", protect, getGuides);
router.get("/recommendations", protect, getRecommendations);
router.get("/project-recommendations", protect, getProjectRecommendations);

// AI: analyze latest uploaded resume for missing skills
router.get("/analyze-resume", protect, analyzeLatestResume);

// AI Chat — no auth required to allow public chatbot usage
const aiChatController = require("../controllers/aiChatController");
router.post("/chat", aiChatController.chat);

// Available roles endpoint
router.get("/roles", (req, res) => {
  try {
    const aiController = require("../controllers/aiController");
    // Get the ROLE_SKILL_MAP from aiController
    const roles = Object.keys(aiController.ROLE_SKILL_MAP || {});
    res.json({ roles: roles.sort() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Required skills endpoint for selected roles
router.post("/roles/skills", (req, res) => {
  try {
    const { roles } = req.body;
    if (!Array.isArray(roles)) {
      return res.status(400).json({ message: "Roles must be an array" });
    }

    const aiController = require("../controllers/aiController");
    const ROLE_SKILL_MAP = aiController.ROLE_SKILL_MAP || {};
    
    const requiredSkills = new Set();
    const roleSkillsMap = {};
    
    roles.forEach((role) => {
      const roleStr = String(role || "").trim();
      let skills = ROLE_SKILL_MAP[roleStr] || [];
      
      // Try exact match first, then case-insensitive match, then partial matching
      if (skills.length === 0) {
        // Try case-insensitive exact match
        const lowerRoleStr = roleStr.toLowerCase();
        for (const [key, value] of Object.entries(ROLE_SKILL_MAP)) {
          if (key.toLowerCase() === lowerRoleStr) {
            skills = value;
            break;
          }
        }
        
        // Try partial matching if still no match
        if (skills.length === 0) {
          for (const [key, value] of Object.entries(ROLE_SKILL_MAP)) {
            if (key.toLowerCase().includes(lowerRoleStr) || lowerRoleStr.includes(key.toLowerCase())) {
              skills = value;
              break;
            }
          }
        }
      }
      
      skills.forEach((skill) => requiredSkills.add(skill));
      roleSkillsMap[role] = skills;
    });

    res.json({
      requiredSkills: Array.from(requiredSkills).sort(),
      roleSkillsMap
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// NEW: AI Project Generation Endpoints
const { generateProjects } = require("../controllers/aiController"); // Add this import

// Generate AI-powered project recommendations for a specific role
router.post("/generate-projects", protect, generateProjects);

// Get detailed project guide (optional - you can add this later)
router.get("/project-guide", protect, (req, res) => {
  const { title, role } = req.query;
  // This would typically generate or fetch a detailed project guide
  res.json({
    title,
    role,
    guide: `Detailed guide for ${title} (${role}) will be generated here.`,
    steps: [
      "Step 1: Project setup and planning",
      "Step 2: Core functionality implementation", 
      "Step 3: Testing and refinement",
      "Step 4: Deployment and documentation"
    ]
  });
});

module.exports = router;