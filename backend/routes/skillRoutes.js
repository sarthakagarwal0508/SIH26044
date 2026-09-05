const express = require("express");
const Skill = require("../models/skill");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const skills = await Skill.find().sort({ name: 1 });

        res.json({
            success: true,
            count: skills.length,
            skills
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;