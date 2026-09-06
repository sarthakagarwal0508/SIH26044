const StudentProfile = require("../models/studentProfile");
const Skill = require("../models/skill");

const roadmapData = {
    "JavaScript": [
        "JavaScript fundamentals",
        "ES6+ features",
        "Async/Await and Promises",
        "Build a small JavaScript project"
    ],
    "Node.js": [
        "Node.js fundamentals",
        "Modules and npm",
        "File system and asynchronous programming",
        "Build a Node.js REST server"
    ],
    "Express.js": [
        "Express.js fundamentals",
        "Routing and middleware",
        "REST API development",
        "Build a CRUD API"
    ],
    "MongoDB": [
        "MongoDB fundamentals",
        "Collections and documents",
        "CRUD operations",
        "MongoDB with Node.js"
    ],
    "REST API": [
        "HTTP methods and status codes",
        "REST API principles",
        "API authentication",
        "Build and test a REST API"
    ],
    "Git": [
        "Git fundamentals",
        "Branches and merging",
        "Pull requests",
        "Collaborative Git workflow"
    ],
    "Testing": [
        "Testing fundamentals",
        "API testing",
        "Unit testing basics",
        "Automated testing"
    ]
};

const getRoadmap = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({
            user: req.user.id
        }).populate("skills.skill", "name category");

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const studentSkillIds = new Set(
            student.skills
                .filter((item) => item.skill)
                .map((item) => item.skill._id.toString())
        );

        const allSkills = await Skill.find();

        const missingSkills = allSkills.filter(
            (skill) => !studentSkillIds.has(skill._id.toString())
        );

        const roadmap = missingSkills.map((skill, index) => ({
            priority: index + 1,
            skill: skill.name,
            category: skill.category,
            steps: roadmapData[skill.name] || [
                `Learn ${skill.name} fundamentals`,
                `Practice ${skill.name} with examples`,
                `Build a project using ${skill.name}`
            ]
        }));

        res.status(200).json({
            success: true,
            message: "Learning roadmap generated successfully",
            roadmap
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRoadmap
};