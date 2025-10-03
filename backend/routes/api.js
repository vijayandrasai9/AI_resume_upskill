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

// AI Chat (Gemini) — no auth required to allow public chatbot usage

module.exports = router;


