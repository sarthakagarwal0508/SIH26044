const Job = require("../models/job");
const Company = require("../models/company");
const Skill = require("../models/skill");

// Create a new job
const createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            location,
            stipend,
            duration,
            deadline,
            requiredSkills
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Job title is required"
            });
        }

        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const job = await Job.create({
            company: company._id,
            title,
            description,
            type,
            location,
            stipend,
            duration,
            deadline,
            requiredSkills: requiredSkills || []
        });

        res.status(201).json({
            success: true,
            message: "Job created successfully",
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all open jobs
const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ status: "open" })
            .populate("company", "companyName industry location")
            .populate("requiredSkills.skill", "name category");

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get single job
const getJobById = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate("company", "companyName industry location")
            .populate("requiredSkills.skill", "name category");

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get jobs created by logged-in company
const getMyJobs = async (req, res) => {
    try {
        const company = await Company.findOne({
            user: req.user.id
        });

        if (!company) {
            return res.status(404).json({
                success: false,
                message: "Company profile not found"
            });
        }

        const jobs = await Job.find({
            company: company._id
        })
            .populate("requiredSkills.skill", "name category")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: jobs.length,
            jobs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createJob,
    getJobs,
    getJobById,
    getMyJobs
};