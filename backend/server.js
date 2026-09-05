require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const matchingRoutes = require("./routes/matchingRoutes");

const authMiddleware = require("./middleware/authMiddleware");
const studentRoutes = require("./routes/studentRoutes");
const skillRoutes = require("./routes/skillRoutes");

const app = express();

const PORT = 5000;

// ==================== MIDDLEWARE ====================

app.use(express.json());

// ==================== PUBLIC ROUTES ====================

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// Job routes
app.use("/api/jobs", jobRoutes);

//Student routes
app.use("/api/student", studentRoutes); 

// Matching routes
app.use("/api/matching", matchingRoutes);

// Skill routes
app.use("/api/skills", skillRoutes);

// ==================== PROTECTED ROUTE ====================

// Temporary protected route for testing JWT
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "You accessed a protected route!",
        user: req.user
    });
});

// ==================== TEMPORARY DATABASE TEST ====================

app.get("/api/test-user", async (req, res) => {
    try {
        const User = require("./models/user");

        const user = await User.create({
            name: "Test Student",
            email: "teststudent@example.com",
            password: "test123",
            role: "student"
        });

        res.json({
            success: true,
            message: "User saved successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// ==================== DATABASE ====================

connectDB();

// ==================== START SERVER ====================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});