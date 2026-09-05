const StudentProfile = require("../models/studentProfile");
const Job = require("../models/job");

const calculateMatch = async (studentId, jobId) => {
    const student = await StudentProfile.findById(studentId).populate(
        "skills.skill",
        "name category"
    );

    const job = await Job.findById(jobId).populate(
        "requiredSkills.skill",
        "name category"
    );

    if (!student) {
        throw new Error("Student profile not found");
    }

    if (!job) {
        throw new Error("Job not found");
    }

    if (!job.requiredSkills || job.requiredSkills.length === 0) {
        return {
            matchPercentage: 0,
            matchedSkills: [],
            missingSkills: []
        };
    }

    const studentSkills = new Map();

    student.skills.forEach((item) => {
        if (item.skill) {
            studentSkills.set(
                item.skill._id.toString(),
                item.level || 0
            );
        }
    });

    let totalWeight = 0;
    let earnedWeight = 0;

    const matchedSkills = [];
    const missingSkills = [];

    job.requiredSkills.forEach((required) => {
        if (!required.skill) {
            return;
        }

        const skillId = required.skill._id.toString();

        const requiredLevel = required.level || 1;
        const weight = required.weight || 1;

        totalWeight += weight;

        const studentLevel = studentSkills.get(skillId) || 0;

        const skillScore = Math.min(
            studentLevel / requiredLevel,
            1
        );

        earnedWeight += skillScore * weight;

        if (studentLevel >= requiredLevel) {
            matchedSkills.push({
                skill: required.skill.name,
                studentLevel,
                requiredLevel,
                weight,
                importance: required.importance
            });
        } else {
            missingSkills.push({
                skill: required.skill.name,
                studentLevel,
                requiredLevel,
                gap: requiredLevel - studentLevel,
                importance: required.importance
            });
        }
    });

    const matchPercentage =
        totalWeight === 0
            ? 0
            : Math.round((earnedWeight / totalWeight) * 100);

    return {
        matchPercentage,
        matchedSkills,
        missingSkills
    };
};

module.exports = {
    calculateMatch
};