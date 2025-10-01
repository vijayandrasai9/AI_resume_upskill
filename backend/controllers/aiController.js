const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const fetch = require("node-fetch");
const User = require("../models/User");

// Simple role -> required skills map (can be expanded or moved to DB)
const ROLE_SKILL_MAP = {
  "frontend developer": [
    "javascript",
    "react",
    "html",
    "css",
    "typescript",
    "webpack",
    "testing",
  ],
  "backend developer": [
    "node",
    "express",
    "mongodb",
    "postgresql",
    "rest",
    "testing",
    "docker",
  ],
  "full stack developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
  ],
  // Alias: treat generic "software developer" similar to full-stack for broader coverage
  "software developer": [
    "javascript",
    "react",
    "node",
    "express",
    "mongodb",
    "html",
    "css",
    "testing",
    "git"
  ],
};

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9+.# ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTokens(text) {
  const base = normalize(text);
  const tokens = new Set();
  base.split(" ").forEach((t) => {
    if (!t) return;
    tokens.add(t);
  });
  return tokens;
}

exports.analyzeLatestResume = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("resumes desiredRoles");
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!Array.isArray(user.resumes) || user.resumes.length === 0) {
      return res.status(200).json({ message: "No resumes uploaded", missingSkills: [], presentSkills: [], desiredRoles: user.desiredRoles || [], noResume: true });
    }

    // Use the most recent resume
    const latest = user.resumes[user.resumes.length - 1];
    const url = latest.url || ""; // format: /uploads/<file>
    const filename = url.split("/uploads/")[1];
    if (!filename) return res.status(400).json({ message: "Invalid resume URL" });

    const filePath = path.join(__dirname, "..", "uploads", filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Resume file not found" });

    const buffer = fs.readFileSync(filePath);
    const parsed = await pdfParse(buffer).catch(() => ({ text: "" }));
    const text = parsed.text || "";
    const normalizedText = normalize(text);

    // Optionally call external AI service (spaCy) if configured
    let externalTokens = [];
    const serviceUrl = process.env.AI_SERVICE_URL;
    if (serviceUrl) {
      try {
        const resp = await fetch(`${serviceUrl.replace(/\/$/, "")}/analyze`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          timeout: 10000,
        });
        if (resp.ok) {
          const data = await resp.json().catch(() => ({}));
          if (Array.isArray(data?.tokens)) externalTokens = data.tokens.map((t) => String(t).toLowerCase());
        }
      } catch {}
    }

    // Extract present skills from resume text
    const tokens = new Set([...extractTokens(text), ...externalTokens]);

    // Determine target skills from desired roles
    const desiredRoles = Array.isArray(user.desiredRoles) ? user.desiredRoles : [];
    const requiredSkillSet = new Set();
    desiredRoles.forEach((role) => {
      const key = String(role || "").toLowerCase().trim();
      const skills = ROLE_SKILL_MAP[key] || [];
      skills.forEach((s) => requiredSkillSet.add(s));
    });

    // If no desired roles, default to a general set
    if (requiredSkillSet.size === 0) {
      [
        "javascript",
        "react",
        "node",
        "express",
        "mongodb",
        "html",
        "css",
      ].forEach((s) => requiredSkillSet.add(s));
    }

    // Heuristic presence check: mark as present only if found in resume text/tokens
    const present = new Set();
    for (const reqSkill of requiredSkillSet) {
      const lower = reqSkill.toLowerCase();
      // Quick token check for exact match (e.g., "react", "node")
      const inTokens = tokens.has(lower);
      // Word-boundary check within normalized resume text (special chars escaped)
      const escaped = lower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const boundaryRe = new RegExp(`\\b${escaped}\\b`, "i");
      if (inTokens || boundaryRe.test(normalizedText)) {
        present.add(reqSkill);
      }
    }

    const missing = Array.from(requiredSkillSet).filter((s) => !present.has(s));

    return res.json({
      resume: { name: latest.name, url: latest.url, uploadedAt: latest.uploadedAt },
      desiredRoles,
      presentSkills: Array.from(present).sort(),
      missingSkills: missing.sort(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


