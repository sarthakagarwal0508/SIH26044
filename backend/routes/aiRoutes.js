const express = require("express");

const {
    extractResumeSkills
} = require("../controllers/aiController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/extract-skills",
    authMiddleware,
    extractResumeSkills
);

module.exports = router;