const express = require("express");

const {
    getAssessments,
    getAssessmentById,
    submitAssessment,
    getMyAttempts
} = require("../controllers/assessmentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getAssessments);

router.get("/my-attempts", authMiddleware, getMyAttempts);

router.get("/:id", authMiddleware, getAssessmentById);

router.post("/:id/submit", authMiddleware, submitAssessment);

module.exports = router;