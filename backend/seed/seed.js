require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const connectDB = require("../config/db");

const User = require("../models/user");
const Skill = require("../models/skill");
const Role = require("../models/role");
const StudentProfile = require("../models/studentProfile");
const Company = require("../models/company");
const Job = require("../models/job");
const Application = require("../models/application");
const Assessment = require("../models/assessment");
const AssessmentAttempt = require("../models/assessmentAttempt");

// ============================================================
// SIH26044 - COMPLETE DEMO DATABASE SEED
// ============================================================
// Creates connected demo data:
//
// Skills
// Roles
// Companies
// Jobs / Internships / Training
// Students
// Applications
// Assessments
// Assessment Attempts
//
// Demo passwords:
// Students  -> Student@123
// Companies -> Company@123
// ============================================================


// ============================================================
// 1. SKILLS
// ============================================================

const skillsData = [
    ["JavaScript", "Programming", "Core JavaScript programming and ES6+ concepts."],
    ["Node.js", "Backend", "Server-side JavaScript runtime development."],
    ["Express.js", "Backend", "REST API development using Express.js."],
    ["MongoDB", "Database", "NoSQL document database development."],
    ["REST API", "Backend", "Designing and consuming RESTful APIs."],
    ["Git", "Tools", "Version control and collaborative development."],
    ["Testing", "Engineering", "Unit, integration and API testing."],
    ["React.js", "Frontend", "Component-based frontend development."],
    ["HTML", "Frontend", "Semantic web page structure."],
    ["CSS", "Frontend", "Responsive styling and layouts."],
    ["Python", "Programming", "Python programming and scripting."],
    ["SQL", "Database", "Relational database querying and design."],
    ["Java", "Programming", "Object-oriented Java development."],
    ["Data Structures", "CS Fundamentals", "Core data structures and implementation."],
    ["Algorithms", "CS Fundamentals", "Algorithmic problem solving and complexity."],
    ["Docker", "DevOps", "Containerization and development environments."],
    ["AWS", "Cloud", "Cloud infrastructure and deployment."],
    ["Communication", "Soft Skills", "Technical and professional communication."],
    ["Problem Solving", "Soft Skills", "Analytical thinking and structured problem solving."],
    ["System Design", "Architecture", "Designing scalable software systems."]
];


// ============================================================
// 2. ROLES
// ============================================================

const rolesData = [

    {
        title: "Backend Developer",
        description: "Build scalable APIs, backend services and database-driven applications.",
        skills: [
            ["Node.js", 3, 9, "must-have"],
            ["Express.js", 3, 8, "must-have"],
            ["MongoDB", 3, 8, "must-have"],
            ["REST API", 3, 9, "must-have"],
            ["Git", 2, 5, "desirable"],
            ["Testing", 2, 4, "bonus"]
        ]
    },

    {
        title: "Frontend Developer",
        description: "Build responsive and interactive web interfaces.",
        skills: [
            ["React.js", 3, 9, "must-have"],
            ["JavaScript", 3, 9, "must-have"],
            ["HTML", 3, 7, "must-have"],
            ["CSS", 3, 7, "must-have"],
            ["Git", 2, 4, "desirable"],
            ["Communication", 2, 3, "bonus"]
        ]
    },

    {
        title: "Full Stack Developer",
        description: "Develop complete web applications across frontend and backend.",
        skills: [
            ["JavaScript", 3, 9, "must-have"],
            ["React.js", 3, 8, "must-have"],
            ["Node.js", 3, 8, "must-have"],
            ["Express.js", 3, 7, "must-have"],
            ["MongoDB", 3, 7, "desirable"],
            ["REST API", 3, 7, "desirable"],
            ["Git", 2, 4, "bonus"]
        ]
    },

    {
        title: "Software Engineer",
        description: "Develop reliable software using strong programming and problem-solving skills.",
        skills: [
            ["JavaScript", 3, 7, "desirable"],
            ["Data Structures", 3, 9, "must-have"],
            ["Algorithms", 3, 9, "must-have"],
            ["Problem Solving", 3, 8, "must-have"],
            ["Git", 2, 4, "desirable"],
            ["Testing", 2, 4, "bonus"]
        ]
    },

    {
        title: "MERN Stack Developer",
        description: "Build modern applications using MongoDB, Express, React and Node.js.",
        skills: [
            ["MongoDB", 3, 8, "must-have"],
            ["Express.js", 3, 8, "must-have"],
            ["React.js", 3, 9, "must-have"],
            ["Node.js", 3, 9, "must-have"],
            ["JavaScript", 3, 9, "must-have"],
            ["REST API", 2, 6, "desirable"],
            ["Git", 2, 4, "bonus"]
        ]
    },

    {
        title: "Python Developer",
        description: "Develop backend services, automation and applications using Python.",
        skills: [
            ["Python", 3, 9, "must-have"],
            ["SQL", 3, 7, "must-have"],
            ["REST API", 2, 6, "desirable"],
            ["Git", 2, 4, "desirable"],
            ["Testing", 2, 4, "bonus"],
            ["Problem Solving", 3, 7, "must-have"]
        ]
    },

    {
        title: "Java Developer",
        description: "Build enterprise and backend applications using Java.",
        skills: [
            ["Java", 3, 9, "must-have"],
            ["SQL", 3, 7, "must-have"],
            ["REST API", 2, 6, "desirable"],
            ["Data Structures", 3, 8, "must-have"],
            ["Algorithms", 3, 8, "must-have"],
            ["Git", 2, 4, "desirable"],
            ["Testing", 2, 4, "bonus"]
        ]
    },

    {
        title: "Data Analyst",
        description: "Analyze data and generate actionable business insights.",
        skills: [
            ["Python", 3, 8, "must-have"],
            ["SQL", 3, 9, "must-have"],
            ["Problem Solving", 3, 8, "must-have"],
            ["Communication", 3, 7, "must-have"]
        ]
    },

    {
        title: "Cloud Engineer",
        description: "Deploy and manage reliable cloud-based infrastructure.",
        skills: [
            ["AWS", 3, 9, "must-have"],
            ["Docker", 3, 8, "must-have"],
            ["Git", 2, 6, "must-have"],
            ["Python", 2, 5, "desirable"],
            ["System Design", 3, 8, "must-have"],
            ["Problem Solving", 3, 7, "desirable"]
        ]
    },

    {
        title: "DevOps Engineer",
        description: "Automate deployment, infrastructure and software delivery workflows.",
        skills: [
            ["Docker", 3, 9, "must-have"],
            ["AWS", 3, 9, "must-have"],
            ["Git", 3, 8, "must-have"],
            ["Python", 2, 6, "desirable"],
            ["Testing", 2, 5, "desirable"],
            ["System Design", 3, 8, "must-have"]
        ]
    }
];


// ============================================================
// 3. COMPANIES
// ============================================================

const companiesData = [
    [
        "AyurTech Innovations",
        "HealthTech",
        "Digital healthcare and Ayurveda technology solutions.",
        "New Delhi, India"
    ],
    [
        "Finova Systems",
        "FinTech",
        "Financial technology and secure digital payment products.",
        "Bengaluru, India"
    ],
    [
        "EduSphere Labs",
        "EdTech",
        "Technology platforms for modern learning and assessment.",
        "Pune, India"
    ],
    [
        "CloudNest Technologies",
        "Cloud & SaaS",
        "Cloud-native SaaS products for growing businesses.",
        "Hyderabad, India"
    ],
    [
        "ShopKart Digital",
        "E-commerce",
        "Scalable commerce and customer experience platforms.",
        "Mumbai, India"
    ],
    [
        "DataBridge Analytics",
        "Analytics",
        "Data analytics and business intelligence solutions.",
        "Gurugram, India"
    ],
    [
        "CodeCraft Solutions",
        "Software Services",
        "Product engineering and software development services.",
        "Noida, India"
    ],
    [
        "NextGen AI Labs",
        "AI & Software",
        "Applied AI products and intelligent automation solutions.",
        "Chennai, India"
    ],
    [
        "GreenGrid Technologies",
        "CleanTech",
        "Digital solutions for energy and sustainability management.",
        "Ahmedabad, India"
    ],
    [
        "SecureStack Systems",
        "Cybersecurity",
        "Security engineering and enterprise technology solutions.",
        "Kochi, India"
    ]
];


// ============================================================
// 4. STUDENTS
// ============================================================

const studentsData = [

    {
        name: "Aarav Sharma",
        email: "aarav.student@sih26044.com",
        career: "Backend Development",
        degree: "B.Tech CSE",
        college: "Delhi Institute of Technology",
        year: 2027,
        cgpa: 8.7,
        skills: [
            ["JavaScript", 5],
            ["Node.js", 4],
            ["Express.js", 4],
            ["MongoDB", 4],
            ["REST API", 4],
            ["Git", 4],
            ["Testing", 3],
            ["Problem Solving", 4]
        ],
        projects: [
            ["Campus Placement API", "REST API for managing student placement data."]
        ],
        certifications: ["Node.js Backend Development"]
    },

    {
        name: "Diya Patel",
        email: "diya.student@sih26044.com",
        career: "Frontend Development",
        degree: "B.Tech IT",
        college: "Gujarat Technical University",
        year: 2027,
        cgpa: 9.1,
        skills: [
            ["JavaScript", 5],
            ["React.js", 5],
            ["HTML", 5],
            ["CSS", 4],
            ["Git", 4],
            ["Communication", 4],
            ["Problem Solving", 4]
        ],
        projects: [
            ["Health Dashboard", "Responsive React dashboard for health analytics."]
        ],
        certifications: ["React Frontend Developer"]
    },

    {
        name: "Rohan Verma",
        email: "rohan.student@sih26044.com",
        career: "Full Stack Development",
        degree: "B.Tech CSE",
        college: "MIT College of Engineering",
        year: 2026,
        cgpa: 8.4,
        skills: [
            ["JavaScript", 4],
            ["React.js", 4],
            ["Node.js", 4],
            ["Express.js", 4],
            ["MongoDB", 3],
            ["REST API", 4],
            ["Git", 4],
            ["Testing", 3]
        ],
        projects: [
            ["Internship Portal", "Full-stack internship discovery and application platform."]
        ],
        certifications: ["MERN Stack Certification"]
    },

    {
        name: "Ananya Singh",
        email: "ananya.student@sih26044.com",
        career: "Data Analytics",
        degree: "B.Tech CSE",
        college: "Amity University",
        year: 2027,
        cgpa: 8.9,
        skills: [
            ["Python", 5],
            ["SQL", 5],
            ["Problem Solving", 4],
            ["Communication", 4],
            ["JavaScript", 2]
        ],
        projects: [
            ["Student Performance Analytics", "Analyzed academic performance data to identify trends."]
        ],
        certifications: ["Python for Data Analysis"]
    },

    {
        name: "Kabir Mehta",
        email: "kabir.student@sih26044.com",
        career: "Java Development",
        degree: "B.Tech CSE",
        college: "VIT University",
        year: 2026,
        cgpa: 8.2,
        skills: [
            ["Java", 5],
            ["SQL", 4],
            ["Data Structures", 4],
            ["Algorithms", 4],
            ["Git", 3],
            ["Problem Solving", 4],
            ["REST API", 2]
        ],
        projects: [
            ["Banking Application", "Java-based banking management system."]
        ],
        certifications: ["Java Programming"]
    },

    {
        name: "Meera Iyer",
        email: "meera.student@sih26044.com",
        career: "DevOps",
        degree: "B.Tech IT",
        college: "SRM Institute",
        year: 2027,
        cgpa: 8.6,
        skills: [
            ["Docker", 4],
            ["AWS", 4],
            ["Git", 5],
            ["Python", 3],
            ["Testing", 3],
            ["System Design", 3],
            ["Problem Solving", 4]
        ],
        projects: [
            ["Containerized Web App", "Dockerized application with cloud deployment workflow."]
        ],
        certifications: ["AWS Cloud Practitioner"]
    },

    {
        name: "Arjun Kapoor",
        email: "arjun.student@sih26044.com",
        career: "Backend Development",
        degree: "B.Tech CSE",
        college: "Thapar Institute",
        year: 2027,
        cgpa: 8.0,
        skills: [
            ["JavaScript", 4],
            ["Node.js", 3],
            ["Express.js", 3],
            ["MongoDB", 2],
            ["REST API", 3],
            ["Git", 3],
            ["Testing", 2]
        ],
        projects: [
            ["Event Management API", "Backend API for managing college events."]
        ],
        certifications: ["Backend Development Basics"]
    },

    {
        name: "Ishita Rao",
        email: "ishita.student@sih26044.com",
        career: "Frontend Development",
        degree: "B.Tech CSE",
        college: "Christ University",
        year: 2027,
        cgpa: 8.8,
        skills: [
            ["JavaScript", 4],
            ["React.js", 4],
            ["HTML", 5],
            ["CSS", 5],
            ["Git", 3],
            ["Communication", 5]
        ],
        projects: [
            ["E-commerce UI", "Responsive shopping interface built with React."]
        ],
        certifications: ["Responsive Web Design"]
    },

    {
        name: "Vivaan Gupta",
        email: "vivaan.student@sih26044.com",
        career: "Software Engineering",
        degree: "B.Tech CSE",
        college: "Manipal Institute",
        year: 2026,
        cgpa: 8.5,
        skills: [
            ["JavaScript", 3],
            ["Data Structures", 5],
            ["Algorithms", 4],
            ["Problem Solving", 5],
            ["Git", 4],
            ["Testing", 3]
        ],
        projects: [
            ["Algorithm Visualizer", "Interactive tool for understanding common algorithms."]
        ],
        certifications: ["DSA with JavaScript"]
    },

    {
        name: "Nisha Joshi",
        email: "nisha.student@sih26044.com",
        career: "Python Development",
        degree: "B.Tech CSE",
        college: "PES University",
        year: 2027,
        cgpa: 8.3,
        skills: [
            ["Python", 4],
            ["SQL", 4],
            ["REST API", 3],
            ["Git", 3],
            ["Problem Solving", 4],
            ["Testing", 3]
        ],
        projects: [
            ["Expense Tracker API", "Python REST API for personal finance tracking."]
        ],
        certifications: ["Python Backend Development"]
    },

    {
        name: "Aditya Malhotra",
        email: "aditya.student@sih26044.com",
        career: "Cloud Engineering",
        degree: "B.Tech IT",
        college: "KIIT University",
        year: 2026,
        cgpa: 8.1,
        skills: [
            ["AWS", 5],
            ["Docker", 4],
            ["Git", 4],
            ["Python", 3],
            ["System Design", 4],
            ["Problem Solving", 4]
        ],
        projects: [
            ["Cloud Deployment Pipeline", "Automated deployment pipeline for a web application."]
        ],
        certifications: ["AWS Solutions Architecture Basics"]
    },

    {
        name: "Sara Khan",
        email: "sara.student@sih26044.com",
        career: "MERN Development",
        degree: "B.Tech CSE",
        college: "Jamia Millia Islamia",
        year: 2027,
        cgpa: 9.0,
        skills: [
            ["JavaScript", 5],
            ["React.js", 4],
            ["Node.js", 4],
            ["Express.js", 4],
            ["MongoDB", 4],
            ["REST API", 4],
            ["Git", 4],
            ["Testing", 3]
        ],
        projects: [
            ["Learning Platform", "MERN-based online learning platform."]
        ],
        certifications: ["Full Stack Web Development"]
    },

    {
        name: "Yash Thakur",
        email: "yash.student@sih26044.com",
        career: "Software Engineering",
        degree: "B.Tech CSE",
        college: "NIT Jaipur",
        year: 2026,
        cgpa: 8.7,
        skills: [
            ["Java", 4],
            ["Data Structures", 5],
            ["Algorithms", 5],
            ["SQL", 4],
            ["Git", 4],
            ["Problem Solving", 5],
            ["Communication", 3]
        ],
        projects: [
            ["Coding Practice Platform", "Platform for solving and tracking programming problems."]
        ],
        certifications: ["Advanced DSA"]
    },

    {
        name: "Tanya Desai",
        email: "tanya.student@sih26044.com",
        career: "Data Analytics",
        degree: "B.Tech IT",
        college: "Symbiosis Institute",
        year: 2027,
        cgpa: 8.6,
        skills: [
            ["Python", 4],
            ["SQL", 5],
            ["Problem Solving", 5],
            ["Communication", 4]
        ],
        projects: [
            ["Retail Sales Analysis", "Data analysis project for identifying retail sales patterns."]
        ],
        certifications: ["SQL for Analytics"]
    },

    {
        name: "Dev Raj",
        email: "dev.student@sih26044.com",
        career: "DevOps Engineering",
        degree: "B.Tech CSE",
        college: "Lovely Professional University",
        year: 2027,
        cgpa: 8.2,
        skills: [
            ["Docker", 3],
            ["AWS", 3],
            ["Git", 4],
            ["Python", 3],
            ["Testing", 2],
            ["System Design", 3]
        ],
        projects: [
            ["CI/CD Demo", "Basic continuous integration and deployment workflow."]
        ],
        certifications: ["Docker Fundamentals"]
    }
];


// ============================================================
// 5. JOBS / INTERNSHIPS / TRAINING
// ============================================================

const jobTemplates = [

    ["Backend Developer Intern", "internship", "New Delhi, India", 18000, "6 Months"],
    ["Frontend Developer Intern", "internship", "Bengaluru, India", 20000, "6 Months"],
    ["Full Stack Developer", "job", "Pune, India", 65000, "Full-time"],
    ["MERN Stack Intern", "internship", "Remote", 22000, "5 Months"],
    ["Software Engineer Trainee", "training", "Hyderabad, India", 15000, "4 Months"],
    ["Python Developer Intern", "internship", "Gurugram, India", 20000, "6 Months"],
    ["Java Developer", "job", "Chennai, India", 70000, "Full-time"],
    ["Data Analyst Intern", "internship", "Mumbai, India", 18000, "6 Months"],
    ["Cloud Engineer Intern", "internship", "Ahmedabad, India", 25000, "6 Months"],
    ["DevOps Engineer", "job", "Kochi, India", 80000, "Full-time"],

    ["Backend API Developer", "job", "Noida, India", 60000, "Full-time"],
    ["React Developer", "job", "Bengaluru, India", 65000, "Full-time"],
    ["Junior Software Engineer", "job", "Pune, India", 55000, "Full-time"],
    ["Python Backend Trainee", "training", "Remote", 12000, "3 Months"],
    ["AWS Cloud Intern", "internship", "Hyderabad, India", 24000, "6 Months"],
    ["Data Analytics Trainee", "training", "Gurugram, India", 14000, "4 Months"],
    ["Java Backend Intern", "internship", "Chennai, India", 19000, "6 Months"],
    ["Full Stack Developer Intern", "internship", "Remote", 21000, "6 Months"],
    ["Docker & Cloud Intern", "internship", "Ahmedabad, India", 23000, "5 Months"],
    ["Software Testing Intern", "internship", "Noida, India", 16000, "4 Months"],

    ["Node.js Developer", "job", "New Delhi, India", 62000, "Full-time"],
    ["React Frontend Intern", "internship", "Mumbai, India", 19000, "6 Months"],
    ["Data Analyst", "job", "Pune, India", 58000, "Full-time"],
    ["Cloud Operations Engineer", "job", "Hyderabad, India", 75000, "Full-time"],
    ["DevOps Trainee", "training", "Remote", 16000, "4 Months"],
    ["MERN Developer", "job", "Bengaluru, India", 72000, "Full-time"],
    ["Backend Engineering Intern", "internship", "Gurugram, India", 20000, "6 Months"],
    ["System Engineering Trainee", "training", "Chennai, India", 15000, "4 Months"]
];


// ============================================================
// 6. ASSESSMENTS
// ============================================================

const assessmentsData = [

    [
        "Backend Fundamentals Assessment",
        "Backend Developer",
        [
            [
                "Which HTTP method is normally used to create a resource?",
                ["GET", "POST", "PUT", "DELETE"],
                "POST",
                "REST API",
                "easy"
            ],
            [
                "Node.js is based on which JavaScript engine?",
                ["V8", "SpiderMonkey", "JVM", "WebKit"],
                "V8",
                "Node.js",
                "easy"
            ],
            [
                "Which database is a document-oriented NoSQL database?",
                ["MongoDB", "MySQL", "Oracle", "PostgreSQL"],
                "MongoDB",
                "MongoDB",
                "easy"
            ],
            [
                "Which framework is commonly used to build Node.js APIs?",
                ["Express.js", "Django", "Spring", "Laravel"],
                "Express.js",
                "Express.js",
                "easy"
            ],
            [
                "Which command creates a Git commit?",
                ["git push", "git commit", "git merge", "git clone"],
                "git commit",
                "Git",
                "easy"
            ]
        ]
    ],

    [
        "JavaScript Essentials",
        "Frontend Developer",
        [
            [
                "Which keyword declares a block-scoped variable?",
                ["var", "let", "define", "static"],
                "let",
                "JavaScript",
                "easy"
            ],
            [
                "Which method converts JSON text into a JavaScript object?",
                ["JSON.parse", "JSON.stringify", "JSON.object", "JSON.convert"],
                "JSON.parse",
                "JavaScript",
                "easy"
            ],
            [
                "Which symbol is used for strict equality?",
                ["==", "=", "===", "!="],
                "===",
                "JavaScript",
                "easy"
            ],
            [
                "Which array method creates a new array by transforming elements?",
                ["map", "push", "pop", "shift"],
                "map",
                "JavaScript",
                "medium"
            ],
            [
                "Which feature allows asynchronous code to be written more clearly?",
                ["Promises", "Pointers", "Structs", "Headers"],
                "Promises",
                "JavaScript",
                "medium"
            ]
        ]
    ],

    [
        "React Fundamentals",
        "Frontend Developer",
        [
            [
                "React applications are primarily built using what?",
                ["Components", "Tables", "Threads", "Sockets"],
                "Components",
                "React.js",
                "easy"
            ],
            [
                "Which hook is commonly used for component state?",
                ["useState", "useRoute", "useClass", "useData"],
                "useState",
                "React.js",
                "easy"
            ],
            [
                "JSX is mainly used to describe what?",
                ["UI structure", "Database schema", "Network packets", "File permissions"],
                "UI structure",
                "React.js",
                "easy"
            ],
            [
                "Which hook is commonly used for side effects?",
                ["useEffect", "useState", "useMemoOnly", "useHTML"],
                "useEffect",
                "React.js",
                "medium"
            ]
        ]
    ],

    [
        "MongoDB & Database Basics",
        "Backend Developer",
        [
            [
                "MongoDB stores data primarily as what?",
                ["Documents", "Rows only", "CSV files", "Binary tables"],
                "Documents",
                "MongoDB",
                "easy"
            ],
            [
                "Which language is used to query relational databases?",
                ["SQL", "HTML", "CSS", "XML"],
                "SQL",
                "SQL",
                "easy"
            ],
            [
                "MongoDB documents are similar in structure to which format?",
                ["JSON", "CSV", "TXT", "HTML"],
                "JSON",
                "MongoDB",
                "easy"
            ],
            [
                "Which database type is MongoDB?",
                ["NoSQL", "Relational only", "Graph only", "Spreadsheet"],
                "NoSQL",
                "MongoDB",
                "easy"
            ]
        ]
    ],

    [
        "Python Programming",
        "Python Developer",
        [
            [
                "Which keyword defines a function in Python?",
                ["def", "func", "function", "define"],
                "def",
                "Python",
                "easy"
            ],
            [
                "Which structure stores key-value pairs?",
                ["Dictionary", "Tuple", "Set only", "String"],
                "Dictionary",
                "Python",
                "easy"
            ],
            [
                "Which symbol starts a Python comment?",
                ["#", "//", "<!--", "**"],
                "#",
                "Python",
                "easy"
            ],
            [
                "Which library is commonly used for data analysis?",
                ["Pandas", "Express", "React", "Mongoose"],
                "Pandas",
                "Python",
                "medium"
            ]
        ]
    ],

    [
        "Data Structures & Algorithms",
        "Software Engineer",
        [
            [
                "Which data structure follows FIFO?",
                ["Stack", "Queue", "Tree", "Graph"],
                "Queue",
                "Data Structures",
                "easy"
            ],
            [
                "Which data structure follows LIFO?",
                ["Queue", "Stack", "Heap only", "Graph"],
                "Stack",
                "Data Structures",
                "easy"
            ],
            [
                "Binary search works efficiently on what kind of array?",
                ["Sorted", "Random only", "Empty only", "Circular only"],
                "Sorted",
                "Algorithms",
                "medium"
            ],
            [
                "What is the average time complexity of binary search?",
                ["O(n)", "O(log n)", "O(n²)", "O(1)"],
                "O(log n)",
                "Algorithms",
                "medium"
            ],
            [
                "Which approach repeatedly chooses the locally best option?",
                ["Greedy", "Backtracking only", "Brute force only", "Hashing"],
                "Greedy",
                "Algorithms",
                "medium"
            ]
        ]
    ],

    [
        "Java Developer Assessment",
        "Java Developer",
        [
            [
                "Java is primarily what type of language?",
                ["Object-oriented", "Markup", "Query", "Styling"],
                "Object-oriented",
                "Java",
                "easy"
            ],
            [
                "Which keyword creates a new object?",
                ["new", "create", "object", "alloc"],
                "new",
                "Java",
                "easy"
            ],
            [
                "Which collection stores unique elements?",
                ["Set", "List only", "String", "Array only"],
                "Set",
                "Java",
                "medium"
            ],
            [
                "Which database query language is commonly used with Java applications?",
                ["SQL", "CSS", "HTML", "Markdown"],
                "SQL",
                "SQL",
                "easy"
            ]
        ]
    ],

    [
        "Cloud & Docker Basics",
        "Cloud Engineer",
        [
            [
                "Which service is a major cloud platform?",
                ["AWS", "Git", "React", "MongoDB"],
                "AWS",
                "AWS",
                "easy"
            ],
            [
                "Docker is primarily used for what?",
                ["Containerization", "Spreadsheet editing", "UI design", "DNS registration"],
                "Containerization",
                "Docker",
                "easy"
            ],
            [
                "Which technology helps package applications into containers?",
                ["Docker", "React", "SQL", "GitHub Pages"],
                "Docker",
                "Docker",
                "easy"
            ],
            [
                "What does a cloud deployment aim to provide?",
                ["Hosted infrastructure and services", "Only local storage", "Only source code", "Only HTML"],
                "Hosted infrastructure and services",
                "AWS",
                "medium"
            ]
        ]
    ],

    [
        "DevOps & CI/CD Basics",
        "DevOps Engineer",
        [
            [
                "What does CI commonly stand for?",
                ["Continuous Integration", "Code Inspection", "Cloud Installation", "Computer Interface"],
                "Continuous Integration",
                "Git",
                "easy"
            ],
            [
                "What does CD commonly refer to in CI/CD?",
                ["Continuous Delivery/Deployment", "Code Database", "Cloud Data", "Central Directory"],
                "Continuous Delivery/Deployment",
                "AWS",
                "easy"
            ],
            [
                "Which technology is commonly used for containers?",
                ["Docker", "React", "MongoDB", "HTML"],
                "Docker",
                "Docker",
                "easy"
            ],
            [
                "Which practice automates software delivery?",
                ["CI/CD", "Manual copying", "Screen sharing", "File printing"],
                "CI/CD",
                "Git",
                "medium"
            ]
        ]
    ],

    [
        "REST API & Testing",
        "Backend Developer",
        [
            [
                "Which HTTP status means resource not found?",
                ["200", "201", "404", "500"],
                "404",
                "REST API",
                "easy"
            ],
            [
                "Which status commonly indicates successful creation?",
                ["201", "301", "401", "404"],
                "201",
                "REST API",
                "easy"
            ],
            [
                "What is API testing used to validate?",
                ["API behavior and responses", "Only CSS", "Only images", "Only database hardware"],
                "API behavior and responses",
                "Testing",
                "easy"
            ],
            [
                "Which HTTP method is commonly used to update a resource?",
                ["GET", "PUT", "OPTIONS", "TRACE"],
                "PUT",
                "REST API",
                "medium"
            ]
        ]
    ]
];


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function buildSkillMap(skills) {
    return Object.fromEntries(
        skills.map(skill => [skill.name, skill._id])
    );
}

function buildSkillRefs(items, skillIds) {
    return items.map(
        ([name, level, weight, importance]) => ({
            skill: skillIds[name],
            level,
            weight,
            importance
        })
    );
}


// Calculate same weighted matching logic used by backend
function calculateMatch(studentSkills, requiredSkills) {

    const levelMap = new Map(
        studentSkills.map(
            skill => [String(skill.skill), skill.level]
        )
    );

    let totalWeight = 0;
    let earnedWeight = 0;

    const missingSkills = [];

    for (const required of requiredSkills) {

        const weight = required.weight || 1;

        totalWeight += weight;

        const studentLevel =
            levelMap.get(String(required.skill)) || 0;

        const ratio =
            Math.min(studentLevel / required.level, 1);

        earnedWeight += ratio * weight;

        if (studentLevel < required.level) {
            missingSkills.push(required.skill);
        }
    }

    return {
        matchPercentage: totalWeight
            ? Math.round((earnedWeight / totalWeight) * 100)
            : 0,

        missingSkills
    };
}


// ============================================================
// MAIN SEED FUNCTION
// ============================================================

async function seedDatabase() {

    try {

        await connectDB();

        console.log("\n========================================");
        console.log("     SIH26044 DEMO DATABASE SEED");
        console.log("========================================\n");


        // ====================================================
        // CLEAR OLD DEMO DATA
        // ====================================================

        console.log("1. Clearing old demo data...");

        await AssessmentAttempt.deleteMany({});
        await Application.deleteMany({});
        await Assessment.deleteMany({});
        await Job.deleteMany({});
        await StudentProfile.deleteMany({});
        await Role.deleteMany({});
        await Company.deleteMany({});
        await Skill.deleteMany({});

        const demoEmails = [
            ...studentsData.map(student => student.email),

            ...companiesData.map(
                (_, index) =>
                    `company${index + 1}@sih26044.com`
            )
        ];

        await User.deleteMany({
            email: {
                $in: demoEmails
            }
        });

        console.log("Old demo data cleared.");


        // ====================================================
        // CREATE SKILLS
        // ====================================================

        console.log("\n2. Creating skills...");

        const skills = await Skill.insertMany(
            skillsData.map(
                ([name, category, description]) => ({
                    name,
                    category,
                    description
                })
            )
        );

        const skillIds = buildSkillMap(skills);

        console.log(`Created ${skills.length} skills.`);


        // ====================================================
        // CREATE ROLES
        // ====================================================

        console.log("\n3. Creating roles...");

        const roles = [];

        for (const roleData of rolesData) {

            const role = await Role.create({

                title: roleData.title,

                description: roleData.description,

                requiredSkills:
                    buildSkillRefs(
                        roleData.skills,
                        skillIds
                    )
            });

            roles.push(role);
        }

        const roleByTitle =
            Object.fromEntries(
                roles.map(
                    role => [role.title, role]
                )
            );

        console.log(`Created ${roles.length} roles.`);


        // ====================================================
        // CREATE COMPANIES
        // ====================================================

        console.log("\n4. Creating companies...");

        const companies = [];

        for (
            let i = 0;
            i < companiesData.length;
            i++
        ) {

            const [
                companyName,
                industry,
                description,
                location
            ] = companiesData[i];

            const email =
                `company${i + 1}@sih26044.com`;

            const password =
                await bcrypt.hash(
                    "Company@123",
                    10
                );

            const user =
                await User.create({

                    name:
                        `${companyName} Admin`,

                    email,

                    password,

                    role: "company"
                });


            const company =
                await Company.create({

                    user: user._id,

                    companyName,

                    industry,

                    description,

                    location,

                    website:
                        `https://www.${companyName
                            .toLowerCase()
                            .replace(
                                /[^a-z0-9]+/g,
                                ""
                            )}.example.com`
                });

            companies.push(company);
        }

        console.log(
            `Created ${companies.length} companies.`
        );


        // ====================================================
        // CREATE STUDENTS
        // ====================================================

        console.log("\n5. Creating students...");

        const students = [];

        for (const studentData of studentsData) {

            const password =
                await bcrypt.hash(
                    "Student@123",
                    10
                );

            const user =
                await User.create({

                    name: studentData.name,

                    email: studentData.email,

                    password,

                    role: "student"
                });


            const profile =
                await StudentProfile.create({

                    user: user._id,

                    education: {

                        degree:
                            studentData.degree,

                        institution:
                            studentData.college,

                        graduationYear:
                            studentData.year,

                        cgpa:
                            studentData.cgpa
                    },

                    careerInterest:
                        studentData.career,

                    skills:
                        studentData.skills.map(
                            ([name, level]) => ({

                                skill:
                                    skillIds[name],

                                level
                            })
                        ),

                    projects:
                        studentData.projects.map(
                            ([title, description]) => ({

                                title,
                                description
                            })
                        ),

                    certifications:
                        studentData.certifications.map(
                            name => ({

                                name,

                                issuer:
                                    "Demo Certification Program"
                            })
                        )
                });

            students.push(profile);
        }

        console.log(
            `Created ${students.length} students.`
        );


        // ====================================================
        // CREATE JOBS
        // ====================================================

        console.log("\n6. Creating jobs and internships...");

        const jobs = [];

        const companyRolePairs = [

            [0, "Backend Developer"],
            [1, "Frontend Developer"],
            [2, "Full Stack Developer"],
            [3, "Cloud Engineer"],
            [4, "MERN Stack Developer"],
            [5, "Data Analyst"],
            [6, "Software Engineer"],
            [7, "Python Developer"],
            [8, "DevOps Engineer"],
            [9, "DevOps Engineer"],

            [0, "Backend Developer"],
            [1, "Frontend Developer"],
            [2, "Software Engineer"],
            [3, "Python Developer"],
            [4, "Cloud Engineer"],
            [5, "Data Analyst"],
            [6, "Java Developer"],
            [7, "Full Stack Developer"],
            [8, "Cloud Engineer"],
            [9, "Software Engineer"],

            [0, "Backend Developer"],
            [1, "Frontend Developer"],
            [2, "Data Analyst"],
            [3, "Cloud Engineer"],
            [4, "DevOps Engineer"],
            [5, "MERN Stack Developer"],
            [6, "Backend Developer"],
            [7, "Software Engineer"]
        ];


        for (
            let i = 0;
            i < jobTemplates.length;
            i++
        ) {

            const [
                title,
                type,
                location,
                stipend,
                duration
            ] = jobTemplates[i];


            const [
                companyIndex,
                roleTitle
            ] = companyRolePairs[i];


            const role =
                roleByTitle[roleTitle];


            const job =
                await Job.create({

                    company:
                        companies[companyIndex]._id,

                    title,

                    description:
                        `${title} opportunity focused on practical ` +
                        `${roleTitle.toLowerCase()} skills, real project work ` +
                        `and industry readiness.`,

                    type,

                    location,

                    stipend,

                    duration,

                    deadline:
                        new Date("2026-12-31"),

                    requiredSkills:
                        role.requiredSkills,

                    status: "open"
                });


            jobs.push(job);
        }

        console.log(
            `Created ${jobs.length} opportunities.`
        );


        // ====================================================
        // CREATE ASSESSMENTS
        // ====================================================

        console.log("\n7. Creating assessments...");

        const assessments = [];

        for (
            const [
                title,
                roleTitle,
                questions
            ] of assessmentsData
        ) {

            const assessment =
                await Assessment.create({

                    title,

                    role:
                        roleByTitle[
                            roleTitle
                        ]?._id,

                    questions:
                        questions.map(
                            ([
                                question,
                                options,
                                correctAnswer,
                                skillName,
                                difficulty
                            ]) => ({

                                question,

                                options,

                                correctAnswer,

                                skill:
                                    skillIds[
                                        skillName
                                    ],

                                difficulty
                            })
                        ),

                    durationMinutes: 20,

                    passingPercentage: 60
                });


            assessments.push(assessment);
        }

        console.log(
            `Created ${assessments.length} assessments.`
        );


        // ====================================================
        // CREATE APPLICATIONS
        // ====================================================

        console.log("\n8. Creating applications...");

        const applicationPairs = [

            [0, 0, "shortlisted"],
            [1, 1, "selected"],
            [2, 2, "interview"],
            [3, 7, "shortlisted"],
            [4, 6, "applied"],
            [5, 8, "shortlisted"],
            [6, 0, "applied"],
            [7, 1, "shortlisted"],
            [8, 12, "interview"],
            [9, 5, "applied"],

            [10, 20, "shortlisted"],
            [11, 11, "selected"],
            [12, 12, "shortlisted"],
            [13, 15, "applied"],
            [14, 9, "selected"],
            [0, 3, "selected"],
            [2, 17, "shortlisted"],
            [4, 13, "applied"],
            [5, 22, "shortlisted"],
            [6, 16, "selected"],

            [7, 21, "applied"],
            [8, 24, "shortlisted"],
            [9, 23, "applied"],
            [10, 26, "interview"],
            [11, 1, "shortlisted"],
            [12, 18, "applied"],
            [13, 6, "shortlisted"],
            [14, 27, "selected"],
            [1, 10, "applied"],
            [3, 14, "shortlisted"],

            [5, 25, "applied"],
            [7, 4, "shortlisted"],
            [9, 19, "interview"],
            [10, 0, "applied"],
            [12, 20, "shortlisted"],
            [14, 8, "applied"]
        ];


        for (
            const [
                studentIndex,
                jobIndex,
                status
            ] of applicationPairs
        ) {

            const student =
                students[studentIndex];

            const job =
                jobs[jobIndex];


            const match =
                calculateMatch(
                    student.skills,
                    job.requiredSkills
                );


            await Application.create({

                student:
                    student._id,

                job:
                    job._id,

                matchPercentage:
                    match.matchPercentage,

                status,

                missingSkills:
                    match.missingSkills
            });
        }

        console.log(
            `Created ${applicationPairs.length} applications.`
        );


        // ====================================================
        // CREATE ASSESSMENT ATTEMPTS
        // ====================================================

        console.log(
            "\n9. Creating assessment attempts..."
        );

        const attemptData = [

            [0, 0, 100],
            [1, 2, 100],
            [2, 0, 80],
            [3, 4, 100],
            [4, 5, 80],
            [5, 7, 100],
            [6, 0, 80],
            [7, 2, 75],
            [8, 5, 100],
            [9, 4, 75],
            [10, 7, 100],
            [11, 1, 100],
            [12, 5, 100],
            [13, 8, 75],
            [14, 7, 80]
        ];


        for (
            const [
                studentIndex,
                assessmentIndex,
                score
            ] of attemptData
        ) {

            const assessment =
                assessments[assessmentIndex];


            const correctCount =
                Math.round(
                    (score / 100) *
                    assessment.questions.length
                );


            const answers =
                assessment.questions.map(
                    (question, index) => ({

                        questionId:
                            question._id,

                        selectedAnswer:
                            index < correctCount
                                ? question.correctAnswer
                                : "Not Attempted",

                        isCorrect:
                            index < correctCount
                    })
                );


            await AssessmentAttempt.create({

                student:
                    students[studentIndex]._id,

                assessment:
                    assessment._id,

                answers,

                score,

                completedAt:
                    new Date()
            });
        }

        console.log(
            `Created ${attemptData.length} assessment attempts.`
        );


        // ====================================================
        // FINAL SUMMARY
        // ====================================================

        console.log("\n========================================");
        console.log("       SIH26044 DATABASE READY");
        console.log("========================================");

        console.log(
            `Skills              : ${skills.length}`
        );

        console.log(
            `Roles               : ${roles.length}`
        );

        console.log(
            `Companies           : ${companies.length}`
        );

        console.log(
            `Jobs/Opportunities  : ${jobs.length}`
        );

        console.log(
            `Assessments         : ${assessments.length}`
        );

        console.log(
            `Students            : ${students.length}`
        );

        console.log(
            `Applications        : ${applicationPairs.length}`
        );

        console.log(
            `Assessment Attempts : ${attemptData.length}`
        );

        console.log("========================================");


        console.log("\nLOGIN CREDENTIALS");
        console.log("----------------------------------------");

        console.log(
            "Students: aarav.student@sih26044.com"
        );

        console.log(
            "          diya.student@sih26044.com"
        );

        console.log(
            "          rohan.student@sih26044.com"
        );

        console.log(
            "          ... 15 student accounts"
        );

        console.log(
            "Student Password: Student@123"
        );


        console.log(
            "\nCompanies: company1@sih26044.com"
        );

        console.log(
            "          company2@sih26044.com"
        );

        console.log(
            "          ... company10@sih26044.com"
        );

        console.log(
            "Company Password: Company@123"
        );


        console.log("\nSeed completed successfully.");
        console.log("========================================\n");


        await mongoose.connection.close();

        console.log(
            "Database connection closed."
        );

    } catch (error) {

        console.error("\n========================================");
        console.error("             SEED FAILED");
        console.error("========================================");

        console.error(error);

        console.error("========================================\n");

        try {
            await mongoose.connection.close();
        } catch (_) {}

        process.exit(1);
    }
}


// ============================================================
// RUN
// ============================================================

seedDatabase();