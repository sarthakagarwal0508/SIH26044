const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        companyName: {
            type: String,
            required: true,
            trim: true
        },

        industry: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        },

        website: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Company", companySchema);