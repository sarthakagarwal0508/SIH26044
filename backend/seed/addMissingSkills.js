require("dotenv").config();
const connectDB = require("../config/db");
const Skill = require("../models/skill");

const skills = [
    ["C++", "Programming"],
    ["JWT Authentication", "Backend"],
    ["MySQL", "Database"],
    ["GitHub", "Tools"],
    ["Postman", "Testing"],
    ["Linux", "Tools"],
    ["Teamwork", "Soft Skills"],
    ["Time Management", "Soft Skills"],
    ["Adaptability", "Soft Skills"]
];

(async () => {
    try {
        await connectDB();
        for (const [name, category] of skills) {
            await Skill.findOneAndUpdate(
                { name: { $regex: `^${name.replace(/[.*+?^${}()|[\\]\\]/g, "\\\\$&")}$`, $options: "i" } },
                { $setOnInsert: { name, category, description: "Platform skill catalog entry." } },
                { upsert: true, new: true }
            );
            console.log(`✓ ${name}`);
        }
        console.log("Skill catalog update complete.");
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();
