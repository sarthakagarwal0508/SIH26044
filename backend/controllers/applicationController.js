const Application = require("../models/application");
const StudentProfile = require("../models/studentProfile");
const Job = require("../models/job");
const Company = require("../models/company");
const { calculateMatch } = require("../services/matchingService");

const applyForJob = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({ user: req.user.id });
        if (!student) return res.status(404).json({ success: false, message: "Student profile not found" });

        const job = await Job.findById(req.params.jobId);
        if (!job) return res.status(404).json({ success: false, message: "Job not found" });
        if (job.status !== "open") return res.status(400).json({ success: false, message: "This job is closed" });

        const existing = await Application.findOne({ student: student._id, job: job._id });
        if (existing) return res.status(400).json({ success: false, message: "Already applied for this job" });

        const match = await calculateMatch(student._id, job._id);
        const missingSkillDocs = [];
        for (const item of match.missingSkills || []) {
            const skill = await require("../models/skill").findOne({ name: item.skill });
            if (skill) missingSkillDocs.push(skill._id);
        }

        const application = await Application.create({
            student: student._id,
            job: job._id,
            matchPercentage: match.matchPercentage,
            missingSkills: missingSkillDocs
        });

        return res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            matchPercentage: match.matchPercentage,
            missingSkills: match.missingSkills,
            application
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({ user: req.user.id });
        if (!student) return res.status(404).json({ success: false, message: "Student profile not found" });

        const applications = await Application.find({ student: student._id })
            .populate({ path: "job", populate: { path: "company", select: "companyName industry location" } })
            .populate("missingSkills", "name category")
            .sort({ createdAt: -1 });

        return res.json({ success: true, count: applications.length, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCompanyApplications = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user.id });
        if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

        const jobs = await Job.find({ company: company._id }).select("_id");
        const applications = await Application.find({ job: { $in: jobs.map(j => j._id) } })
            .populate({ path: "student", populate: { path: "user", select: "name email" } })
            .populate({ path: "job", select: "title type location" })
            .populate("missingSkills", "name category")
            .sort({ createdAt: -1 });

        return res.json({ success: true, count: applications.length, applications });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const updateApplicationStatus = async (req, res) => {
    try {
        const company = await Company.findOne({ user: req.user.id });
        if (!company) return res.status(404).json({ success: false, message: "Company profile not found" });

        const allowed = ["shortlisted", "rejected", "interview", "selected"];
        if (!allowed.includes(req.body.status)) return res.status(400).json({ success: false, message: "Invalid application status" });

        const application = await Application.findById(req.params.applicationId).populate("job");
        if (!application) return res.status(404).json({ success: false, message: "Application not found" });
        if (application.job.company.toString() !== company._id.toString()) return res.status(403).json({ success: false, message: "Not authorized to update this application" });

        application.status = req.body.status;
        await application.save();
        return res.json({ success: true, message: `Application ${req.body.status} successfully`, application });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getCompanyApplications,
    updateApplicationStatus
};
