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
// Get detailed project guide
router.get("/project-guide", protect, async (req, res) => {
  try {
    const { title, role } = req.query;
    
    if (!title || !role) {
      return res.status(400).json({ error: "Title and role are required" });
    }

    // Generate detailed project guide
    const projectGuide = await generateDetailedProjectGuide(title, role);
    
    res.json(projectGuide);
  } catch (error) {
    console.error("Project guide error:", error);
    // Return a structured fallback guide
    const { title, role } = req.query;
    res.json(generateFallbackGuide(title, role));
  }
});

// Helper function to generate detailed project guide
async function generateDetailedProjectGuide(title, role) {
  // This would be your actual AI service call
  // For now, return a structured guide
  return {
    title: title,
    role: role,
    overview: `A comprehensive project to demonstrate ${role} skills through "${title}". This project will help you build practical experience and create a strong portfolio piece.`,
    steps: [
      {
        phase: "Phase 1: Planning & Research",
        estimatedTime: "2-3 days",
        tasks: [
          "Define project requirements and objectives",
          "Research similar projects and best practices",
          "Create wireframes or design mockups",
          "Set up project repository and development environment",
          "Plan the technical architecture"
        ]
      },
      {
        phase: "Phase 2: Core Development",
        estimatedTime: "1-2 weeks",
        tasks: [
          "Set up the basic project structure",
          "Implement core features and functionality",
          "Write clean, maintainable code with proper documentation",
          "Add error handling and validation",
          "Implement user interface components"
        ]
      },
      {
        phase: "Phase 3: Testing & Refinement",
        estimatedTime: "3-5 days",
        tasks: [
          "Write unit tests and integration tests",
          "Test all functionality thoroughly",
          "Fix bugs and optimize performance",
          "Get feedback from peers or mentors",
          "Refine user experience and interface"
        ]
      },
      {
        phase: "Phase 4: Deployment & Documentation",
        estimatedTime: "2-3 days",
        tasks: [
          "Deploy to a production environment",
          "Set up continuous integration/delivery",
          "Write comprehensive documentation",
          "Create a project README with setup instructions",
          "Update your portfolio with the completed project"
        ]
      }
    ],
    technologies: getTechnologiesForRole(role),
    bestPractices: [
      "Write clean, readable code with consistent formatting",
      "Use version control (Git) effectively with meaningful commit messages",
      "Follow the DRY (Don't Repeat Yourself) principle",
      "Test your code thoroughly before deployment",
      "Document your code and project setup process",
      "Consider scalability and maintainability in your design"
    ],
    resources: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        type: "documentation"
      },
      {
        title: "GitHub Learning Lab",
        url: "https://lab.github.com",
        type: "tutorials"
      },
      {
        title: "Stack Overflow",
        url: "https://stackoverflow.com",
        type: "community"
      }
    ],
    note: "This guide provides a structured approach to complete your project. Adjust timelines based on your experience level and project complexity."
  };
}

// Helper function to generate technologies based on role
function getTechnologiesForRole(role) {
  const roleLower = role.toLowerCase();
  
  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('ui')) {
    return ["HTML5", "CSS3", "JavaScript", "React", "Git", "Responsive Design"];
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('api')) {
    return ["Node.js", "Express", "REST APIs", "Database", "Authentication", "Git"];
  } else if (roleLower.includes('fullstack')) {
    return ["HTML5", "CSS3", "JavaScript", "React", "Node.js", "Express", "Database", "Git"];
  } else if (roleLower.includes('mobile')) {
    return ["React Native", "JavaScript", "Mobile UI", "APIs", "Git"];
  } else {
    return ["Core Programming", "Version Control", "Problem Solving", "Documentation"];
  }
}

// Fallback guide generator
function generateFallbackGuide(title, role) {
  return {
    title: title,
    role: role,
    overview: `Build a ${title} to demonstrate your ${role} skills and create a valuable portfolio project.`,
    steps: [
      {
        phase: "Planning & Setup",
        estimatedTime: "2-3 days",
        tasks: ["Define requirements", "Set up environment", "Plan architecture"]
      },
      {
        phase: "Core Development", 
        estimatedTime: "1-2 weeks",
        tasks: ["Build features", "Write clean code", "Add error handling"]
      },
      {
        phase: "Testing & Improvement",
        estimatedTime: "3-5 days",
        tasks: ["Test functionality", "Fix issues", "Optimize performance"]
      },
      {
        phase: "Deployment & Docs",
        estimatedTime: "2-3 days",
        tasks: ["Deploy project", "Write documentation", "Add to portfolio"]
      }
    ],
    technologies: ["Relevant technologies for your role"],
    bestPractices: ["Write clean code", "Use version control", "Test thoroughly", "Document your work"],
    resources: [
      {
        title: "MDN Web Docs",
        url: "https://developer.mozilla.org",
        type: "documentation"
      }
    ]
  };
}

module.exports = router;