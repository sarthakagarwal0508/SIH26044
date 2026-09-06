const { extractSkillsFromResume } = require("../services/aiService");
const Skill = require("../models/skill");
const StudentProfile = require("../models/studentProfile");

const extractResumeSkills = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).json({
                success: false,
                message: "Resume text is required"
            });
        }

        const aiResult = await extractSkillsFromResume(resumeText);

        const matchedSkills = [];
        const unmatchedSkills = [];

        for (const aiSkill of aiResult.skills) {
            const skill = await Skill.findOne({
                name: {
                    $regex: `^${aiSkill.name}$`,
                    $options: "i"
                }
            });

            if (skill) {
                matchedSkills.push({
                    skill: skill._id,
                    name: skill.name,
                    category: skill.category,
                    level: Math.min(Math.max(aiSkill.level, 1), 5)
                });
            } else {
                unmatchedSkills.push(aiSkill);
            }
        }

        const studentProfile = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!studentProfile) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        studentProfile.skills = matchedSkills.map(item => ({
            skill: item.skill,
            level: item.level
        }));

        await studentProfile.save();

        res.status(200).json({
            success: true,
            message: "Resume skills extracted and saved successfully",
            skills: matchedSkills,
            unmatchedSkills
        });

    } catch (error) {
        console.error("AI skill extraction error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to extract and save resume skills"
        });
    }
};

module.exports = {
    extractResumeSkills
};