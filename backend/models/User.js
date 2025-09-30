const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema({
  name: String,
  level: Number
});

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  theme:     { type: String, default: "light" },
  roles:     [String],
  desiredRoles: [String],
  appliedRoles: [String],
  skills:    [skillSchema],
  resumeUrl: String,
  resumes: [
    new mongoose.Schema({
      name: String,
      url: String,
      uploadedAt: { type: Date, default: Date.now }
    }, { _id: false })
  ],
  activities: [
    new mongoose.Schema({
      type: { type: String },
      detail: { type: String },
      progress: { type: Number, default: 0 },
      createdAt: { type: Date, default: Date.now }
    }, { _id: false })
  ],
  stats: {
    projects:     { type: Number, default: 0 },
    rolesApplied: { type: Number, default: 0 },
    downloads:    { type: Number, default: 0 }
  }
});

// Export the model
module.exports = mongoose.model("User", userSchema);
