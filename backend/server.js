require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const PORT = 5000;

// Middleware
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