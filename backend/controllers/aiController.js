const Skill = require("../models/skill");
const Role = require("../models/role");
const Job = require("../models/job");
const StudentProfile = require("../models/studentProfile");
const { calculateMatch } = require("../services/matchingService");
const {
    extractSkillsFromResume,
    semanticSkillMatch,
    generateCareerSuggestions,
    generatePersonalizedRoadmap,
    generateMatchExplanation,
    analyzeJobDescription,
    analyzeResume
} = require("../services/aiService");

const aliases = {
    "REST APIs": "REST API",
    "REST API Development": "REST API",
    "JWT": "JWT Authentication",
    "JSON Web Token": "JWT Authentication",
    "Github": "GitHub",
    "Git Hub": "GitHub",
    "C Plus Plus": "C++",
    "My SQL": "MySQL",
    "Postman API": "Postman",
    "Team Work": "Teamwork",
    "Time-management": "Time Management"
};

function normalizeSkillName(name) {
    const clean = String(name || "").trim().replace(/\s+/g, " ");
    if (!clean) return "";
    const exact = Object.keys(aliases).find(k => k.toLowerCase() === clean.toLowerCase());
    return exact ? aliases[exact] : clean;
}

function escapeRegex(value) {
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function getOrCreateSkill(aiSkill) {
    const name = normalizeSkillName(aiSkill.name);
    if (!name) return null;

    let skill = await Skill.findOne({
        name: { $regex: `^${escapeRegex(name)}$`, $options: "i" }
    });

    if (skill) return skill;

    skill = await Skill.create({
        name,
        category: aiSkill.category || "Other",
        description: `Discovered through AI resume analysis.`
    });

    return skill;
}

async function extractResumeSkills(req, res) {
    try {
        const { resumeText } = req.body;
        if (!resumeText?.trim()) {
            return res.status(400).json({ success: false, message: "Resume text is required" });
        }

        const aiResult = await extractSkillsFromResume(resumeText);
        const profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: "Student profile not found" });
        }

        const current = new Map();
        for (const item of profile.skills || []) {
            if (item.skill) {
                current.set(item.skill.toString(), {
                    skill: item.skill,
                    level: Number(item.level) || 1
                });
            }
        }

        const savedSkills = [];
        const failedSkills = [];

        for (const aiSkill of aiResult.skills || []) {
            try {
                const skill = await getOrCreateSkill(aiSkill);
                if (!skill) continue;

                const level = Math.min(Math.max(Number(aiSkill.level) || 1, 1), 5);
                current.set(skill._id.toString(), { skill: skill._id, level });
                savedSkills.push({
                    skill: skill._id,
                    name: skill.name,
                    category: skill.category,
                    level
                });
            } catch (error) {
                console.error(`Could not save AI skill ${aiSkill.name}:`, error.message);
                failedSkills.push(aiSkill);
            }
        }

        profile.skills = Array.from(current.values());
        await profile.save();

        const updated = await StudentProfile.findById(profile._id)
            .populate("skills.skill", "name category description");

        return res.status(200).json({
            success: true,
            message: "Resume skills extracted and saved successfully",
            skills: savedSkills,
            unmatchedSkills: failedSkills,
            profile: updated
        });
    } catch (error) {
        console.error("AI skill extraction error:", error);
        return res.status(500).json({ success: false, message: error.message || "Failed to extract skills" });
    }
}

async function semanticMatch(req, res) {
    try {
        const { skillName } = req.body;
        if (!skillName?.trim()) return res.status(400).json({ success: false, message: "skillName is required" });
        const skills = await Skill.find().select("name").sort({ name: 1 });
        const result = await semanticSkillMatch(skillName, skills.map(s => s.name));
        return res.json({ success: true, ...result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function careerSuggestions(req, res) {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate("skills.skill", "name category");
        if (!profile) return res.status(404).json({ success: false, message: "Student profile not found" });
        const roles = await Role.find().populate("requiredSkills.skill", "name category");
        const result = await generateCareerSuggestions(profile, roles);
        return res.json({ success: true, ...result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function personalizedRoadmap(req, res) {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate("skills.skill", "name category");
        if (!profile) return res.status(404).json({ success: false, message: "Student profile not found" });

        const targetRole = req.body.targetRole || profile.careerInterest || "Backend Developer";
        const existing = new Set((profile.skills || []).filter(s => s.skill).map(s => s.skill._id.toString()));
        const allSkills = await Skill.find().select("name category");
        const missing = allSkills.filter(s => !existing.has(s._id.toString())).map(s => ({ name: s.name, category: s.category }));

        const result = await generatePersonalizedRoadmap(profile, targetRole, missing.slice(0, 20));
        return res.json({ success: true, targetRole, ...result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function matchExplanation(req, res) {
    try {
        const { studentId, jobId } = req.params;
        const [student, job] = await Promise.all([
            StudentProfile.findById(studentId).populate("user", "name email").populate("skills.skill", "name category"),
            Job.findById(jobId).populate("company", "companyName industry location").populate("requiredSkills.skill", "name category")
        ]);

        if (!student) return res.status(404).json({ success: false, message: "Student profile not found" });
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });

        const match = await calculateMatch(studentId, jobId);
        const explanation = await generateMatchExplanation(student, job, match);

        return res.json({
            success: true,
            matchPercentage: match.matchPercentage,
            matchedSkills: match.matchedSkills,
            missingSkills: match.missingSkills,
            explanation: explanation.explanation,
            strengths: explanation.strengths || [],
            gaps: explanation.gaps || [],
            recommendation: explanation.recommendation || ""
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function analyzeJob(req, res) {
    try {
        if (!req.body.jobDescription?.trim()) return res.status(400).json({ success: false, message: "jobDescription is required" });
        const analysis = await analyzeJobDescription(req.body.jobDescription);
        return res.json({ success: true, analysis });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function analyzeResumeController(req, res) {
    try {
        if (!req.body.resumeText?.trim()) return res.status(400).json({ success: false, message: "resumeText is required" });
        const analysis = await analyzeResume(req.body.resumeText);
        return res.json({ success: true, analysis });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    extractResumeSkills,
    semanticMatch,
    careerSuggestions,
    personalizedRoadmap,
    matchExplanation,
    analyzeJob,
    analyzeResume: analyzeResumeController
};
