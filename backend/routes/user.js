const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const { updateTheme, updateRoles, trackActivity } = require("../controllers/userController");

// @route   POST /api/user/theme
// @desc    Update current user's theme
// @access  Private
router.post("/theme", protect, updateTheme);
router.post("/roles", protect, updateRoles);
router.post("/activities", protect, trackActivity);

module.exports = router;


