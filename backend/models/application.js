const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StudentProfile",
            required: true
        },

        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true
        },

        matchPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 0
        },

        status: {
            type: String,
            enum: ["applied", "shortlisted", "rejected", "interview", "selected"],
            default: "applied"
        },

        missingSkills: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Skill"
            }
        ]
    },
    {
        timestamps: true
    }
);

applicationSchema.index(
    { student: 1, job: 1 },
    { unique: true }
);

module.exports = mongoose.model("Application", applicationSchema);