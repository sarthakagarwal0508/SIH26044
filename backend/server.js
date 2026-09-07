require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const matchingRoutes = require("./routes/matchingRoutes");
const studentRoutes = require("./routes/studentRoutes");
const skillRoutes = require("./routes/skillRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const assessmentRoutes = require("./routes/assessmentRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");
const aiRoutes = require("./routes/aiRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const companyRoutes = require("./routes/companyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (req, res) => {
    res.json({ success: true, message: "Backend is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/matching", matchingRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/roadmap", roadmapRoutes);
app.use("/api/ai", aiRoutes);
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ success: true, message: "You accessed a protected route!", user: req.user });
});
app.use("/api/company", companyRoutes);
connectDB();

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
