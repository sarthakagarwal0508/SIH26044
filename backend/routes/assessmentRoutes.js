const express = require("express");

const {
    getAssessments,
    getAssessmentById,
    generateSkillAssessment,
    submitAssessment,
    getMyAttempts
} = require("../controllers/assessmentController");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ============================================================
// GET ALL AVAILABLE ASSESSMENTS
// ============================================================

router.get(
    "/",
    authMiddleware,
    getAssessments
);


// ============================================================
// GET MY ASSESSMENT ATTEMPTS
// ============================================================

router.get(
    "/my-attempts",
    authMiddleware,
    getMyAttempts
);


// ============================================================
// GENERATE AI ASSESSMENT FOR ANY SKILL
// ============================================================
//
// Example:
// POST /api/assessments/skill/65abc123/generate
//
// This creates an assessment dynamically for a skill.
// Existing seeded assessments are not modified.
//

router.post(
    "/skill/:skillId/generate",
    authMiddleware,
    generateSkillAssessment
);


// ============================================================
// GET SINGLE ASSESSMENT
// ============================================================

router.get(
    "/:id",
    authMiddleware,
    getAssessmentById
);


// ============================================================
// SUBMIT ASSESSMENT
// ============================================================

router.post(
    "/:id/submit",
    authMiddleware,
    submitAssessment
);


module.exports = router;