const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        education: {
            degree: {
                type: String,
                default: ""
            },
            institution: {
                type: String,
                default: ""
            },
            graduationYear: {
                type: Number
            },
            cgpa: {
                type: Number,
                min: 0,
                max: 10
            }
        },

        careerInterest: {
            type: String,
            default: ""
        },

        skills: [
            {
                skill: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill"
                },
                level: {
                    type: Number,
                    min: 1,
                    max: 5
                }
            }
        ],

        projects: [
            {
                title: String,
                description: String
            }
        ],

        certifications: [
            {
                name: String,
                issuer: String
            }
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);