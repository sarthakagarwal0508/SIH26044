const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
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
        ]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Role", roleSchema);