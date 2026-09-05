const StudentProfile = require("../models/studentProfile");
const Skill = require("../models/skill");

const createProfile = async (req, res) => {
    try {
        const existingProfile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (existingProfile) {
            return res.status(400).json({
                success: false,
                message: "Student profile already exists"
            });
        }

        const {
            education,
            careerInterest,
            skills,
            projects,
            certifications
        } = req.body;

        const profile = await StudentProfile.create({
            user: req.user.id,
            education,
            careerInterest,
            skills: skills || [],
            projects: projects || [],
            certifications: certifications || []
        });

        res.status(201).json({
            success: true,
            message: "Student profile created successfully",
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyProfile = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({
            user: req.user.id
        }).populate("skills.skill", "name category");

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add / update student skills
const updateSkills = async (req, res) => {
    try {
        const { skills } = req.body;

        if (!Array.isArray(skills)) {
            return res.status(400).json({
                success: false,
                message: "Skills must be an array"
            });
        }

        const profile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        for (const item of skills) {
            if (!item.skill) {
                return res.status(400).json({
                    success: false,
                    message: "Each skill must contain a skill ID"
                });
            }

            if (item.level < 1 || item.level > 5) {
                return res.status(400).json({
                    success: false,
                    message: "Skill level must be between 1 and 5"
                });
            }

            const skillExists = await Skill.findById(item.skill);

            if (!skillExists) {
                return res.status(404).json({
                    success: false,
                    message: `Skill not found: ${item.skill}`
                });
            }
        }

        profile.skills = skills;

        await profile.save();

        const updatedProfile = await StudentProfile.findById(profile._id)
            .populate("skills.skill", "name category");

        res.status(200).json({
            success: true,
            message: "Student skills updated successfully",
            profile: updatedProfile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createProfile,
    getMyProfile,
    updateSkills
};