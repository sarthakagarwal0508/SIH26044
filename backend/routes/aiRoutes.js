const express = require("express");

const {
    extractResumeSkills,
    semanticMatch,
    careerSuggestions,
    personalizedRoadmap,
    matchExplanation,
    analyzeJob,
    analyzeResume
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/extract-skills", authMiddleware, extractResumeSkills);
router.post("/semantic-match", authMiddleware, semanticMatch);
router.get("/career-suggestions", authMiddleware, careerSuggestions);
router.post("/personalized-roadmap", authMiddleware, personalizedRoadmap);
router.get("/match-explanation/:studentId/:jobId", authMiddleware, matchExplanation);
router.post("/analyze-job", authMiddleware, analyzeJob);
router.post("/analyze-resume", authMiddleware, analyzeResume);

module.exports = router;
