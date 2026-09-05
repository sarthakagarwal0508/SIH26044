const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role"
        },

        questions: [
            {
                question: {
                    type: String,
                    required: true
                },

                options: [
                    {
                        type: String
                    }
                ],

                correctAnswer: {
                    type: String,
                    required: true
                },

                skill: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Skill"
                },

                difficulty: {
                    type: String,
                    enum: ["easy", "medium", "hard"],
                    default: "medium"
                }
            }
        ],

        durationMinutes: {
            type: Number,
            default: 30
        },

        passingPercentage: {
            type: Number,
            min: 0,
            max: 100,
            default: 60
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Assessment", assessmentSchema);