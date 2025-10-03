const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).select("name email theme skills desiredRoles appliedRoles resumes activities");
    if (!user) return res.status(404).json({ message: "User not found" });
    // derive desired/applied roles placeholders from roles array if available
    const desiredRoles = Array.isArray(user.desiredRoles) ? user.desiredRoles : [];
    const appliedRoles = Array.isArray(user.appliedRoles) ? user.appliedRoles : [];
    return res.json({
      name: user.name,
      email: user.email,
      
      skills: user.skills || [],
      desiredRoles,
      appliedRoles,
      activities: user.activities || []
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


