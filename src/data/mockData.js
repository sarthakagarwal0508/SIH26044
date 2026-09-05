// SIH26044: Portal for Academia-Industry Collaboration (Ministry of Ayush)
// Comprehensive dataset with realistic Ayush, Biotech, Pharmaceutical & Clinical Research data

export const SKILLS_TAXONOMY = [
  { id: "sk-1", name: "Phytochemical Screening & Extraction", category: "Pharmacognosy", popularity: "High" },
  { id: "sk-2", name: "HPLC / GC-MS Analytical Techniques", category: "Quality Control", popularity: "Very High" },
  { id: "sk-3", name: "Ayurvedic Pharmacopoeia of India (API) Standards", category: "Regulatory", popularity: "High" },
  { id: "sk-4", name: "Clinical Trial Protocols (GCP - Ayush)", category: "Clinical Research", popularity: "Very High" },
  { id: "sk-5", name: "Herbal Formulation & Standardization", category: "Manufacturing", popularity: "High" },
  { id: "sk-6", name: "Yoga Asana Biomechanics & Therapy", category: "Yoga & Wellness", popularity: "Medium" },
  { id: "sk-7", name: "Panchakarma Protocol Management", category: "Clinical Practice", popularity: "High" },
  { id: "sk-8", name: "Pharmacovigilance for ASU Drugs", category: "Safety & Surveillance", popularity: "High" },
  { id: "sk-9", name: "Medicinal Plant Taxonomy & Herbarium Prep", category: "Botany", popularity: "Medium" },
  { id: "sk-10", name: "Biostatistics & Health Data Analysis (R / Python)", category: "Data & Digital Health", popularity: "Very High" },
  { id: "sk-11", name: "GLP / GMP Cleanroom Documentation", category: "Compliance", popularity: "High" },
  { id: "sk-12", name: "Ayush Telemedicine & EHR Platforms", category: "Digital Health", popularity: "Medium" },
  { id: "sk-13", name: "Heavy Metal Toxicity Limit Testing", category: "Quality Control", popularity: "High" },
  { id: "sk-14", name: "In-vitro Antimicrobial & Antioxidant Assays", category: "Biotechnology", popularity: "High" },
  { id: "sk-15", name: "Ayush Clinical Case Documentation (NAMASTE Code)", category: "Informatics", popularity: "Medium" }
];

export const INITIAL_JOBS = [
  {
    id: "job-101",
    title: "Phytochemical QC & Analytical Research Intern",
    company: "Himalaya Wellness Research Labs",
    companyLogo: "🌿",
    location: "Bengaluru, Karnataka (On-site)",
    type: "Internship (6 Months)",
    stipend: "₹22,000 / month",
    postedDate: "2026-08-28",
    deadline: "2026-09-20",
    description: "Seeking analytical minds for standardization of polyherbal extracts, monograph verification under Ayurvedic Pharmacopoeia of India (API) guidelines, and hands-on HPLC/HPTLC profiling.",
    department: "Quality Assurance & Standardization",
    requiredSkills: [
      { name: "HPLC / GC-MS Analytical Techniques", importance: "Must-Have", weight: 9 },
      { name: "Phytochemical Screening & Extraction", importance: "Must-Have", weight: 9 },
      { name: "Ayurvedic Pharmacopoeia of India (API) Standards", importance: "Desirable", weight: 7 },
      { name: "GLP / GMP Cleanroom Documentation", importance: "Bonus", weight: 5 }
    ],
    applicantsCount: 14,
    shortlistedCount: 4,
    status: "Active"
  },
  {
    id: "job-102",
    title: "Clinical Research & Pharmacovigilance Fellow",
    company: "Dabur Research & Development Centre",
    companyLogo: "🍃",
    location: "Ghaziabad / Delhi NCR (Hybrid)",
    type: "Full-Time Trainee",
    stipend: "₹35,000 / month",
    postedDate: "2026-08-25",
    deadline: "2026-09-18",
    description: "Assist our clinical team in conducting multi-centric clinical trials for classical Ayurvedic formulations and reporting adverse drug reactions to the National Pharmacovigilance Coordination Centre (NPvCC).",
    department: "Clinical Trials & Safety",
    requiredSkills: [
      { name: "Clinical Trial Protocols (GCP - Ayush)", importance: "Must-Have", weight: 10 },
      { name: "Pharmacovigilance for ASU Drugs", importance: "Must-Have", weight: 9 },
      { name: "Biostatistics & Health Data Analysis (R / Python)", importance: "Desirable", weight: 7 },
      { name: "Panchakarma Protocol Management", importance: "Bonus", weight: 4 }
    ],
    applicantsCount: 19,
    shortlistedCount: 5,
    status: "Active"
  },
  {
    id: "job-103",
    title: "Digital Ayush & Yoga Biometrics Developer",
    company: "ArogyaTech Innovations",
    companyLogo: "🧘",
    location: "Pune / Remote",
    type: "Internship (3 Months)",
    stipend: "₹28,000 / month",
    postedDate: "2026-09-01",
    deadline: "2026-09-30",
    description: "Building next-generation computer vision algorithms for real-time posture correction during Therapeutic Yoga and integration with Ayush National EHR standards.",
    department: "Digital Health AI",
    requiredSkills: [
      { name: "Biostatistics & Health Data Analysis (R / Python)", importance: "Must-Have", weight: 9 },
      { name: "Yoga Asana Biomechanics & Therapy", importance: "Must-Have", weight: 8 },
      { name: "Ayush Telemedicine & EHR Platforms", importance: "Desirable", weight: 6 }
    ],
    applicantsCount: 8,
    shortlistedCount: 2,
    status: "Active"
  },
  {
    id: "job-104",
    title: "Herbal Formulation & Novel Drug Delivery Specialist",
    company: "Charak Pharma R&D Division",
    companyLogo: "💊",
    location: "Mumbai, Maharashtra",
    type: "Full-Time Trainee",
    stipend: "₹32,000 / month",
    postedDate: "2026-08-20",
    deadline: "2026-09-15",
    description: "Formulation of effervescent herbal granules, nanoliposomal delivery systems for curcumin and boswellic acids, and stability testing.",
    department: "Pharmaceutics & Formulation",
    requiredSkills: [
      { name: "Herbal Formulation & Standardization", importance: "Must-Have", weight: 10 },
      { name: "GLP / GMP Cleanroom Documentation", importance: "Must-Have", weight: 8 },
      { name: "Phytochemical Screening & Extraction", importance: "Desirable", weight: 7 }
    ],
    applicantsCount: 11,
    shortlistedCount: 3,
    status: "Active"
  }
];

export const INITIAL_APPLICANTS = [
  {
    id: "app-201",
    jobId: "job-101",
    name: "Aaditya Sharma",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    email: "aaditya.sharma@allindiaayurveda.edu.in",
    phone: "+91 98765 43210",
    college: "All India Institute of Ayurveda (AIIA), New Delhi",
    degree: "M.D. (Ayurveda) - Dravyaguna Vigyana",
    year: "Final Year (2026)",
    cgpa: "8.9 / 10",
    matchScore: 94,
    status: "shortlisted",
    appliedDate: "2026-08-30",
    skills: [
      { name: "HPLC / GC-MS Analytical Techniques", level: "Advanced", score: 92 },
      { name: "Phytochemical Screening & Extraction", level: "Expert", score: 96 },
      { name: "Ayurvedic Pharmacopoeia of India (API) Standards", level: "Advanced", score: 90 },
      { name: "GLP / GMP Cleanroom Documentation", level: "Intermediate", score: 78 }
    ],
    matchedSkills: [
      "HPLC / GC-MS Analytical Techniques",
      "Phytochemical Screening & Extraction",
      "Ayurvedic Pharmacopoeia of India (API) Standards",
      "GLP / GMP Cleanroom Documentation"
    ],
    missingSkills: [],
    assessmentScore: 92,
    verifiedByUniversity: true,
    projects: [
      "Comparative HPTLC fingerprinting of Tinospora cordifolia harvested in different seasons.",
      "Heavy metal limit testing in Rasoushadhis as per WHO guidelines."
    ],
    experienceSummary: "6-month research assistantship at Central Council for Research in Ayurvedic Sciences (CCRAS)."
  },
  {
    id: "app-202",
    jobId: "job-101",
    name: "Pooja V. Nair",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    email: "pooja.nair@keralaayur.ac.in",
    phone: "+91 98234 11223",
    college: "Government Ayurveda College, Thiruvananthapuram",
    degree: "BAMS (Bachelor of Ayurvedic Medicine and Surgery)",
    year: "Internship Year",
    cgpa: "8.4 / 10",
    matchScore: 82,
    status: "applied",
    appliedDate: "2026-09-02",
    skills: [
      { name: "Phytochemical Screening & Extraction", level: "Advanced", score: 88 },
      { name: "Ayurvedic Pharmacopoeia of India (API) Standards", level: "Intermediate", score: 75 },
      { name: "Medicinal Plant Taxonomy & Herbarium Prep", level: "Advanced", score: 85 }
    ],
    matchedSkills: [
      "Phytochemical Screening & Extraction",
      "Ayurvedic Pharmacopoeia of India (API) Standards"
    ],
    missingSkills: [
      "HPLC / GC-MS Analytical Techniques",
      "GLP / GMP Cleanroom Documentation"
    ],
    assessmentScore: 80,
    verifiedByUniversity: true,
    projects: [
      "Taxonomical identification and secondary metabolite study of Western Ghats endemic herbs."
    ],
    experienceSummary: "Undergraduate laboratory volunteer at Regional Raw Drug Repository."
  },
  {
    id: "app-203",
    jobId: "job-101",
    name: "Rohan Kulkarni",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    email: "rohan.kulkarni@punepharma.edu",
    phone: "+91 97654 88712",
    college: "Poona College of Pharmacy, Pune",
    degree: "M.Pharm (Pharmacognosy & Phytochemistry)",
    year: "2026 Passout",
    cgpa: "7.8 / 10",
    matchScore: 71,
    status: "applied",
    appliedDate: "2026-09-03",
    skills: [
      { name: "HPLC / GC-MS Analytical Techniques", level: "Intermediate", score: 72 },
      { name: "GLP / GMP Cleanroom Documentation", level: "Intermediate", score: 70 }
    ],
    matchedSkills: [
      "HPLC / GC-MS Analytical Techniques",
      "GLP / GMP Cleanroom Documentation"
    ],
    missingSkills: [
      "Phytochemical Screening & Extraction",
      "Ayurvedic Pharmacopoeia of India (API) Standards"
    ],
    assessmentScore: 73,
    verifiedByUniversity: true,
    projects: [
      "Standardization parameter estimation for commercially available polyherbal syrups."
    ],
    experienceSummary: "Academic laboratory project on solvent extraction optimization."
  },
  {
    id: "app-204",
    jobId: "job-102",
    name: "Meera Sen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "meera.sen@bhu.ac.in",
    phone: "+91 94152 66789",
    college: "Banaras Hindu University (Faculty of Ayurveda), Varanasi",
    degree: "M.D. (Ayurveda) - Kayachikitsa",
    year: "Final Year (2026)",
    cgpa: "9.2 / 10",
    matchScore: 91,
    status: "shortlisted",
    appliedDate: "2026-08-29",
    skills: [
      { name: "Clinical Trial Protocols (GCP - Ayush)", level: "Advanced", score: 95 },
      { name: "Pharmacovigilance for ASU Drugs", level: "Advanced", score: 92 },
      { name: "Panchakarma Protocol Management", level: "Expert", score: 98 }
    ],
    matchedSkills: [
      "Clinical Trial Protocols (GCP - Ayush)",
      "Pharmacovigilance for ASU Drugs",
      "Panchakarma Protocol Management"
    ],
    missingSkills: [
      "Biostatistics & Health Data Analysis (R / Python)"
    ],
    assessmentScore: 94,
    verifiedByUniversity: true,
    projects: [
      "Randomized controlled trial of Ashwagandha Rasayana in chronic fatigue syndrome patients."
    ],
    experienceSummary: "1 year clinical residency in Sir Sunderlal Hospital, BHU."
  },
  {
    id: "app-205",
    jobId: "job-102",
    name: "Vikas Deshpande",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    email: "vikas.d@nia.edu.in",
    phone: "+91 91234 56789",
    college: "National Institute of Ayurveda, Jaipur",
    degree: "BAMS (Bachelor of Ayurvedic Medicine & Surgery)",
    year: "Internship Year",
    cgpa: "8.1 / 10",
    matchScore: 68,
    status: "applied",
    appliedDate: "2026-09-04",
    skills: [
      { name: "Panchakarma Protocol Management", level: "Advanced", score: 85 },
      { name: "Pharmacovigilance for ASU Drugs", level: "Basic", score: 60 }
    ],
    matchedSkills: [
      "Panchakarma Protocol Management",
      "Pharmacovigilance for ASU Drugs"
    ],
    missingSkills: [
      "Clinical Trial Protocols (GCP - Ayush)",
      "Biostatistics & Health Data Analysis (R / Python)"
    ],
    assessmentScore: 65,
    verifiedByUniversity: true,
    projects: [
      "Adverse drug event observational survey in OPD patient cohorts."
    ],
    experienceSummary: "Hospital clinical postings during BAMS curriculum."
  }
];

export const INSTITUTION_ANALYTICS = {
  institutionName: "National Institute of Ayurveda (Deemed to be University), Jaipur",
  accreditation: "NAAC A++ | Ministry of Ayush Centre of Excellence",
  metrics: {
    totalStudents: 1240,
    assessedStudents: 1085,
    assessmentRate: "87.5%",
    averageEmployabilityScore: "76.4%",
    internshipPlacements: 342,
    activeIndustryPartners: 48
  },
  // Skill Gap: Comparing Student Cohort Avg vs Industry Demand Score (0 - 100)
  skillGapComparison: [
    { skill: "HPLC / GC-MS Analytics", studentAvg: 52, industryDemand: 88, gap: -36, status: "Critical Gap" },
    { skill: "GCP Clinical Trials", studentAvg: 64, industryDemand: 90, gap: -26, status: "Moderate Gap" },
    { skill: "API Standards & Monographs", studentAvg: 78, industryDemand: 82, gap: -4, status: "Well Aligned" },
    { skill: "ASU Pharmacovigilance", studentAvg: 58, industryDemand: 84, gap: -26, status: "Moderate Gap" },
    { skill: "Panchakarma Protocols", studentAvg: 92, industryDemand: 75, gap: 17, status: "Surplus" },
    { skill: "Health Data Biostatistics", studentAvg: 41, industryDemand: 79, gap: -38, status: "Critical Gap" },
    { skill: "GLP / GMP Documentation", studentAvg: 60, industryDemand: 85, gap: -25, status: "Moderate Gap" }
  ],
  departmentReadiness: [
    { department: "Dravyaguna (Pharmacology)", ready: 78, training: 22 },
    { department: "Rasa Shastra (Pharmaceutics)", ready: 72, training: 28 },
    { department: "Kayachikitsa (Medicine)", ready: 86, training: 14 },
    { department: "Panchakarma (Therapy)", ready: 91, training: 9 },
    { department: "Swasthavritta (Yoga/Life)", ready: 83, training: 17 },
    { department: "Ayush Biotech & Lab", ready: 58, training: 42 }
  ],
  trendingSkills: [
    { skill: "HPLC / GC-MS Instrumentation", demandGrowth: "+42%", companiesHiring: 26 },
    { skill: "Ayush Clinical Research GCP", demandGrowth: "+38%", companiesHiring: 22 },
    { skill: "Digital EHR & Health Informatics", demandGrowth: "+31%", companiesHiring: 18 },
    { skill: "Herbal Formulation Standardization", demandGrowth: "+24%", companiesHiring: 19 },
    { skill: "Ayurvedic Cosmetic Formulations", demandGrowth: "+19%", companiesHiring: 14 }
  ],
  curriculumRecommendations: [
    {
      id: "rec-1",
      title: "Bridge Module: Hands-on Chromatography & Spectrophotometry",
      targetDept: "Dravyaguna & Rasa Shastra",
      urgency: "High",
      reason: "Industry demand for HPLC/GC-MS skills exceeds student cohort average by 36 points.",
      suggestedAction: "Integrate 30 hours of certified wet-lab training in collaboration with CSIR-CDRI or analytical pharma partner.",
      projectedImpact: "+28% increase in QC lab placements"
    },
    {
      id: "rec-2",
      title: "Ayush Clinical Trial Data & Biostatistics Workshop",
      targetDept: "Kayachikitsa & Postgraduate Scholars",
      urgency: "High",
      reason: "Pharmaceutical sponsors require GCP compliance and R/Python biostatistics capabilities.",
      suggestedAction: "Launch 4-weekend bootcamp covering ICMR/Ayush GCP guidelines and trial electronic data capture (EDC).",
      projectedImpact: "+35% eligibility for CRO & pharmaceutical clinical trials"
    },
    {
      id: "rec-3",
      title: "GMP Cleanroom & Auditing Protocol Simulation",
      targetDept: "All Postgraduate streams",
      urgency: "Medium",
      reason: "Standard regulatory manufacturing facilities mandate ISO and WHO-GMP audit readiness.",
      suggestedAction: "Virtual laboratory simulation on validation protocols and documentation audit trails.",
      projectedImpact: "+20% placement rate in ASU drug manufacturing units"
    }
  ],
  studentCohort: [
    { id: "std-1", name: "Aaditya Sharma", roll: "AY-2024-019", dept: "Dravyaguna", score: 92, readiness: "Industry Ready", status: "Internship Offered" },
    { id: "std-2", name: "Meera Sen", roll: "AY-2024-042", dept: "Kayachikitsa", score: 94, readiness: "Industry Ready", status: "Shortlisted (Dabur)" },
    { id: "std-3", name: "Kunal Verma", roll: "AY-2024-008", dept: "Rasa Shastra", score: 71, readiness: "Needs Bridge Course", status: "In Assessment" },
    { id: "std-4", name: "Pooja V. Nair", roll: "AY-2024-031", dept: "Dravyaguna", score: 80, readiness: "Industry Ready", status: "Applied (Himalaya)" },
    { id: "std-5", name: "Tanvi Deshmukh", roll: "AY-2024-055", dept: "Swasthavritta", score: 68, readiness: "Bridge Course Assigned", status: "Upskilling" },
    { id: "std-6", name: "Aniket Joshi", roll: "AY-2024-077", dept: "Ayush Biotech", score: 84, readiness: "Industry Ready", status: "Active Applicant" }
  ]
};
