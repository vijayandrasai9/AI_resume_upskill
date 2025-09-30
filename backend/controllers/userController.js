const User = require("../models/User");

exports.updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const validThemes = ["light", "dark"];

    if (!validThemes.includes(theme)) {
      return res.status(400).json({ message: "Invalid theme value" });
    }

    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { theme } },
      { new: true, select: "_id name email theme" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ message: "Theme updated", user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateRoles = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { desiredRoles, appliedRoles } = req.body;
    const update = {};
    if (Array.isArray(desiredRoles)) update.desiredRoles = desiredRoles;
    if (Array.isArray(appliedRoles)) update.appliedRoles = appliedRoles;
    const user = await require("../models/User").findByIdAndUpdate(userId, { $set: update }, { new: true })
      .select("desiredRoles appliedRoles");
    return res.json({ message: "Roles updated", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.trackActivity = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const { type, detail, progress } = req.body;
    const activity = { type, detail, progress: Number(progress) || 0, createdAt: new Date() };
    const user = await require("../models/User").findByIdAndUpdate(
      userId,
      { $push: { activities: activity } },
      { new: true }
    ).select("activities");
    return res.status(201).json({ message: "Activity recorded", activities: user.activities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


