require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "Backend is running!"
    });
});

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});