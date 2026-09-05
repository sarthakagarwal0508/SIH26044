const express = require("express");

const {
    createJob,
    getJobs,
    getJobById,
    getMyJobs
} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getJobs);
router.get("/company/my-jobs", authMiddleware, getMyJobs);
router.get("/:id", getJobById);

// Protected route
router.post("/", authMiddleware, createJob);

module.exports = router;