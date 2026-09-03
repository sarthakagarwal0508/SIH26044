require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

app.use("/api/auth", authRoutes);

// Temporary database test route
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

// Connect database
connectDB();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});