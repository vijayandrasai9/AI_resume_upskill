const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const User = require("../models/User");

exports.listResumes = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(userId).select("resumes");
    return res.json(user?.resumes || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    if (!req.file) return res.status(400).json({ message: "Resume file is required" });

    const uploadsDir = path.join(__dirname, "..", "uploads");
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

    const original = req.file.originalname;
    const ext = path.extname(original) || ".pdf";
    const filename = `${uuid()}${ext}`;
    const destPath = path.join(uploadsDir, filename);
    fs.writeFileSync(destPath, req.file.buffer);

    const publicUrl = `/uploads/${filename}`;

    const update = {
      $push: {
        resumes: { name: original, url: publicUrl, uploadedAt: new Date() },
      },
    };
    await User.findByIdAndUpdate(userId, update);

    return res.status(201).json({ message: "Uploaded", url: publicUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const filename = String(req.params.filename || "").trim();
    if (!filename) return res.status(400).json({ message: "Filename is required" });

    // Remove resume entry from the user's document
    const user = await User.findById(userId).select("resumes");
    if (!user) return res.status(404).json({ message: "User not found" });

    const before = Array.isArray(user.resumes) ? user.resumes.length : 0;
    user.resumes = (user.resumes || []).filter((r) => {
      const url = String(r?.url || "");
      const f = url.split("/uploads/")[1];
      return f !== filename;
    });

    const after = user.resumes.length;
    if (after === before) {
      return res.status(404).json({ message: "Resume not found for user" });
    }

    await user.save();

    // Clear stored skills if no resumes remain
    if (user.resumes.length === 0) {
      await User.findByIdAndUpdate(userId, { 
        resumeDetectedSkills: [] 
      });
    }

    // Delete the file from disk if it exists
    const filePath = path.join(__dirname, "..", "uploads", filename);
    try {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch {}

    return res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


