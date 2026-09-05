require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/user");
const Company = require("../models/company");
const Skill = require("../models/skill");
const Role = require("../models/role");
const Job = require("../models/job");
const Assessment = require("../models/assessment");

const connectDB = require("../config/db");

const seedData = async () => {
    try {
        await connectDB();

        console.log("Clearing existing demo data...");

        await Assessment.deleteMany({});
        await Job.deleteMany({});
        await Role.deleteMany({});
        await Skill.deleteMany({});
        await Company.deleteMany({});
        await User.deleteMany({
            email: {
                $in: [
                    "company@sih26044.com"
                ]
            }
        });

        // ==================== SKILLS ====================

        const skills = await Skill.insertMany([
            {
                name: "JavaScript",
                category: "Programming",
                description: "Programming and scripting using JavaScript"
            },
            {
                name: "Node.js",
                category: "Backend",
                description: "Server-side development using Node.js"
            },
            {
                name: "Express.js",
                category: "Backend",
                description: "REST API development using Express.js"
            },
            {
                name: "MongoDB",
                category: "Database",
                description: "NoSQL database management using MongoDB"
            },
            {
                name: "REST API",
                category: "Backend",
                description: "Design and development of REST APIs"
            },
            {
                name: "Git",
                category: "Tools",
                description: "Version control using Git"
            },
            {
                name: "Testing",
                category: "Software Engineering",
                description: "API and application testing"
            }
        ]);

        console.log(`Created ${skills.length} skills`);

        const skillMap = {};

        skills.forEach((skill) => {
            skillMap[skill.name] = skill._id;
        });

        // ==================== ROLE ====================

        const role = await Role.create({
            title: "Backend Developer",
            description:
                "Develop scalable backend services, APIs and database-driven applications.",

            requiredSkills: [
                {
                    skill: skillMap["JavaScript"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Node.js"],
                    level: 3,
                    weight: 9,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Express.js"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["MongoDB"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["REST API"],
                    level: 3,
                    weight: 9,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Git"],
                    level: 2,
                    weight: 6,
                    importance: "desirable"
                },
                {
                    skill: skillMap["Testing"],
                    level: 2,
                    weight: 5,
                    importance: "desirable"
                }
            ]
        });

        console.log("Created Backend Developer role");

        // ==================== COMPANY USER ====================

        const hashedPassword = await bcrypt.hash(
            "Company@123",
            10
        );

        const companyUser = await User.create({
            name: "Demo Company Admin",
            email: "company@sih26044.com",
            password: hashedPassword,
            role: "company"
        });

        // ==================== COMPANY ====================

        const company = await Company.create({
            user: companyUser._id,
            companyName: "AyurTech Innovations",
            industry: "HealthTech",
            description:
                "Demo organization for SIH26044 industry opportunity testing.",
            location: "New Delhi",
            website: "https://example.com"
        });

        console.log("Created demo company");

        // ==================== JOB ====================

        const job = await Job.create({
            company: company._id,
            title: "Backend Developer Intern",
            description:
                "Work on REST APIs, backend services and database-driven applications.",
            type: "internship",
            location: "Hybrid",
            stipend: 15000,
            duration: "6 Months",
            deadline: new Date("2026-12-31"),

            requiredSkills: [
                {
                    skill: skillMap["JavaScript"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Node.js"],
                    level: 3,
                    weight: 9,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Express.js"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["MongoDB"],
                    level: 3,
                    weight: 8,
                    importance: "must-have"
                },
                {
                    skill: skillMap["REST API"],
                    level: 3,
                    weight: 9,
                    importance: "must-have"
                },
                {
                    skill: skillMap["Git"],
                    level: 2,
                    weight: 5,
                    importance: "desirable"
                },
                {
                    skill: skillMap["Testing"],
                    level: 2,
                    weight: 4,
                    importance: "bonus"
                }
            ],

            status: "open"
        });

        console.log(`Created job: ${job.title}`);

        // ==================== ASSESSMENT ====================

        const assessment = await Assessment.create({
            title: "Backend Fundamentals Assessment",
            role: role._id,
            durationMinutes: 20,
            passingPercentage: 60,

            questions: [
                {
                    question:
                        "Which HTTP method is generally used to create a new resource?",
                    options: ["GET", "POST", "PUT", "DELETE"],
                    correctAnswer: "POST",
                    skill: skillMap["REST API"],
                    difficulty: "easy"
                },
                {
                    question:
                        "Which runtime is commonly used to execute JavaScript on the server?",
                    options: ["Node.js", "Django", "Laravel", "Spring"],
                    correctAnswer: "Node.js",
                    skill: skillMap["Node.js"],
                    difficulty: "easy"
                },
                {
                    question:
                        "Which database is a document-oriented NoSQL database?",
                    options: ["MySQL", "MongoDB", "Oracle", "PostgreSQL"],
                    correctAnswer: "MongoDB",
                    skill: skillMap["MongoDB"],
                    difficulty: "easy"
                },
                {
                    question:
                        "Which framework is used with Node.js to build web APIs?",
                    options: ["Express.js", "TensorFlow", "React Native", "Pandas"],
                    correctAnswer: "Express.js",
                    skill: skillMap["Express.js"],
                    difficulty: "easy"
                },
                {
                    question:
                        "Which command is commonly used to create a Git commit?",
                    options: [
                        "git push",
                        "git pull",
                        "git commit",
                        "git clone"
                    ],
                    correctAnswer: "git commit",
                    skill: skillMap["Git"],
                    difficulty: "easy"
                }
            ]
        });

        console.log(`Created assessment: ${assessment.title}`);

        console.log("\n✅ Demo data seeded successfully!");
        console.log("\nCompany Login:");
        console.log("Email: company@sih26044.com");
        console.log("Password: Company@123");

        await mongoose.connection.close();
        process.exit(0);

    } catch (error) {
        console.error("❌ Seeding failed:", error.message);

        await mongoose.connection.close();
        process.exit(1);
    }
};

seedData();