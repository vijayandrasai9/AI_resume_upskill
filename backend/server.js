// Load environment variables
require("dotenv").config();  

const path        = require("path");
const express     = require("express");
const cors        = require("cors");
const connectDB   = require("./config/db");
const authRoutes  = require("./routes/auth");
const userRoutes  = require("./routes/user");
const apiRoutes   = require("./routes/api");
const chatRouter  = require("./routes/chat");

const app = express();

// Early validation of required env keys
const requiredEnvKeys = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN", "GEMINI_API_KEY"];
const missingEnvKeys  = requiredEnvKeys.filter(key => !process.env[key] || !process.env[key].trim());
if (missingEnvKeys.length) {
  console.error(`❌ Missing env vars: ${missingEnvKeys.join(", ")}`);
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/ping", (_, res) => res.json({ message: "pong" }));
app.get("/api/health/ai", (_, res) => {
  res.json({
    openAiKeyLoaded: Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim()),
    model: "gpt-3.5-turbo",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", apiRoutes);
app.use("/api", chatRouter);

// Database + Server start
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));