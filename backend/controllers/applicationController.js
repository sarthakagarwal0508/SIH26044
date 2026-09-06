const Application = require("../models/application");
const StudentProfile = require("../models/studentProfile");
const Job = require("../models/job");
const Company = require("../models/company");

const applyForJob = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const job = await Job.findById(req.params.jobId);

        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        if (job.status !== "open") {
            return res.status(400).json({
                success: false,
                message: "This job is closed"
            });
        }

        const existingApplication = await Application.findOne({
            student: student._id,
            job: job._id
        });

        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "Already applied for this job"
            });
        }

        const application = await Application.create({
            student: student._id,
            job: job._id
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getMyApplications = async (req, res) => {
    try {
        const student = await StudentProfile.findOne({
            user: req.user.id
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student profile not found"
            });
        }

        const applications = await Application.find({
            student: student._id
        })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCompanyApplications = async (req, res) => {
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
        }).select("_id");

        const jobIds = jobs.map((job) => job._id);

        const applications = await Application.find({
            job: { $in: jobIds }
        })
            .populate({
                path: "student",
                populate: {
                    path: "user",
                    select: "name email"
                }
            })
            .populate("job", "title type location")
            .populate("missingSkills", "name category")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateApplicationStatus = async (req, res) => {
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

        const { status } = req.body;

        const allowedStatuses = [
            "shortlisted",
            "rejected",
            "interview",
            "selected"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid application status"
            });
        }

        const application = await Application.findById(
            req.params.applicationId
        ).populate("job");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.job.company.toString() !== company._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this application"
            });
        }

        application.status = status;

        await application.save();

        res.status(200).json({
            success: true,
            message: `Application ${status} successfully`,
            application
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    applyForJob,
    getMyApplications,
    getCompanyApplications,
    updateApplicationStatus
};