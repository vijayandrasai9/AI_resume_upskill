require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const apiRoutes = require("./routes/api");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// test route
app.get("/api/ping", (req, res) => res.json({ message: "pong" }));

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api", apiRoutes);

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));