const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });

const { getProfile } = require("../controllers/profileController");
const { listResumes, uploadResume } = require("../controllers/resumeController");
const { getGuides, getRecommendations } = require("../controllers/contentController");

// Profile
router.get("/profile", protect, getProfile);

// Resumes
router.get("/resumes", protect, listResumes);
router.post("/resumes", protect, upload.single("resume"), uploadResume);

// Content
router.get("/guides", protect, getGuides);
router.get("/recommendations", protect, getRecommendations);

module.exports = router;


