const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
    {
        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            enum: ["internship", "job", "training"],
            default: "internship"
        },

        location: {
            type: String,
            default: "Remote"
        },

        stipend: {
            type: Number,
            default: 0
        },

        duration: {
            type: String,
            default: ""
        },

        deadline: {
            type: Date
        },

        requiredSkills: [
            {
                skill: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill",
                    required: true
                },

                level: {
                    type: Number,
                    min: 1,
                    max: 5,
                    default: 1
                },

                weight: {
                    type: Number,
                    min: 1,
                    max: 10,
                    default: 5
                },

                importance: {
                    type: String,
                    enum: ["must-have", "desirable", "bonus"],
                    default: "desirable"
                }
            }
        ],

        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Job", jobSchema);