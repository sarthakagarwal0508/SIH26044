const express = require("express");

const {
    createProfile,
    getMyProfile,
    updateSkills
} = require("../controllers/studentController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", authMiddleware, createProfile);

router.get("/profile", authMiddleware, getMyProfile);

router.put("/skills", authMiddleware, updateSkills);

module.exports = router;