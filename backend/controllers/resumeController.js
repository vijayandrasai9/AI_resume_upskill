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


