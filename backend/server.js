const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

// Validate required environment variables early
const requiredEnvKeys = ["MONGO_URI", "JWT_SECRET", "JWT_EXPIRES_IN"];
const missingEnvKeys = requiredEnvKeys.filter((key) => !process.env[key] || String(process.env[key]).trim() === "");
if (missingEnvKeys.length > 0) {
	console.error(`❌ Missing required environment variables: ${missingEnvKeys.join(", ")}`);
	process.exit(1);
}

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
 // import user routes

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
 // add this line

// Connect DB
connectDB();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
