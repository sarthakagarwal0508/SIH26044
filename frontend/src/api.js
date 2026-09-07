const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "https://sih26044-wooc.onrender.com/api";


// ============================================================
// SESSION HELPERS
// ============================================================

export function getSession() {
  try {
    const rawUser =
      localStorage.getItem("user");

    if (!rawUser) {
      return null;
    }

    return JSON.parse(rawUser);

  } catch {
    return null;
  }
}


export function saveSession(
  data,
  fallbackRole
) {
  const user =
    data?.user || null;

  const token =
    data?.token ||
    data?.accessToken ||
    "";

  const role =
    user?.role ||
    fallbackRole ||
    localStorage.getItem("userRole") ||
    "student";


  if (token) {
    localStorage.setItem(
      "token",
      token
    );
  }


  if (user) {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    if (user.name) {
      localStorage.setItem(
        "userName",
        user.name
      );
    }
  }


  localStorage.setItem(
    "userRole",
    role
  );
}


export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
}


// ============================================================
// COMMON REQUEST HELPER
// ============================================================

async function request(
  endpoint,
  options = {}
) {
  const token =
    localStorage.getItem("token");


  const isFormData =
    options.body instanceof FormData;


  const headers = {
    ...(isFormData
      ? {}
      : {
          "Content-Type":
            "application/json",
        }),

    ...(options.headers || {}),
  };


  if (token) {
    headers.Authorization =
      `Bearer ${token}`;
  }


  const response =
    await fetch(
      `${API_BASE}${endpoint}`,
      {
        ...options,
        headers,
      }
    );


  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }


  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed (${response.status})`
    );
  }


  return data;
}


// ============================================================
// AUTH
// ============================================================

export function signup(
  payload
) {
  return request(
    "/auth/signup",
    {
      method: "POST",
      body:
        JSON.stringify(payload),
    }
  );
}


export function login(
  payload
) {
  return request(
    "/auth/login",
    {
      method: "POST",
      body:
        JSON.stringify(payload),
    }
  );
}


// ============================================================
// STUDENT PROFILE
// ============================================================

export function getStudentProfile() {
  return request(
    "/student/profile"
  );
}


export function createStudentProfile(
  payload
) {
  return request(
    "/student/profile",
    {
      method: "POST",
      body:
        JSON.stringify(payload),
    }
  );
}


export function updateStudentProfile(
  payload
) {
  return request(
    "/student/profile",
    {
      method: "PUT",
      body:
        JSON.stringify(payload),
    }
  );
}


export function updateStudentSkills(
  payload
) {
  return request(
    "/student/skills",
    {
      method: "PUT",
      body:
        JSON.stringify(payload),
    }
  );
}


// ============================================================
// COMPANY
// ============================================================

export function getCompanyProfile() {
  return request(
    "/company/profile"
  );
}


export function createCompanyProfile(
  payload
) {
  return request(
    "/company/profile",
    {
      method: "POST",
      body:
        JSON.stringify(payload),
    }
  );
}


export function getCompanyJobs() {
  return request(
    "/jobs/company/my-jobs"
  );
}


export function getCompanyApplications() {
  return request(
    "/applications/company/applications"
  );
}


// ============================================================
// SKILLS
// ============================================================

export function getSkills() {
  return request(
    "/skills"
  );
}


// ============================================================
// ASSESSMENTS
// ============================================================

export function getAssessments() {
  return request(
    "/assessments"
  );
}


export function getAssessment(
  assessmentId
) {
  return request(
    `/assessments/${assessmentId}`
  );
}


export function getMyAttempts() {
  return request(
    "/assessments/my-attempts"
  );
}


export function getMyAssessmentAttempts() {
  return getMyAttempts();
}


export function submitAssessment(
  assessmentId,
  answers
) {
  return request(
    `/assessments/${assessmentId}/submit`,
    {
      method: "POST",

      body:
        JSON.stringify({
          answers,
        }),
    }
  );
}


// ============================================================
// AI GENERATED ASSESSMENT
// ============================================================

export function generateSkillAssessment(
  skillId,
  questionCount = 5
) {
  return request(
    `/assessments/skill/${skillId}/generate`,
    {
      method: "POST",

      body:
        JSON.stringify({
          questionCount,
        }),
    }
  );
}


// ============================================================
// ROADMAP
// ============================================================

export function getRoadmap() {
  return request(
    "/roadmap"
  );
}


// ============================================================
// JOBS
// ============================================================

export function getJobs() {
  return request(
    "/jobs"
  );
}


export function getJob(
  jobId
) {
  return request(
    `/jobs/${jobId}`
  );
}


export function createJob(
  payload
) {
  return request(
    "/jobs",
    {
      method: "POST",
      body:
        JSON.stringify(payload),
    }
  );
}


// ============================================================
// APPLICATIONS
// ============================================================

export function applyForJob(
  jobId
) {
  return request(
    `/applications/${jobId}`,
    {
      method: "POST",
    }
  );
}


export function applyToJob(
  jobId
) {
  return applyForJob(jobId);
}


export function getMyApplications() {
  return request(
    "/applications/my-applications"
  );
}


export function updateApplicationStatus(
  applicationId,
  status
) {
  return request(
    `/applications/${applicationId}/status`,
    {
      method: "PUT",

      body:
        JSON.stringify({
          status,
        }),
    }
  );
}


// ============================================================
// MATCHING
// ============================================================

export function getMatch(
  studentId,
  jobId
) {
  return request(
    `/matching/${studentId}/${jobId}`
  );
}


// ============================================================
// AI
// ============================================================

export function semanticMatch(
  skillName
) {
  return request(
    "/ai/semantic-match",
    {
      method: "POST",

      body:
        JSON.stringify({
          skillName,
        }),
    }
  );
}


export function extractResumeSkills(
  resumeText
) {
  return request(
    "/ai/extract-skills",
    {
      method: "POST",

      body:
        JSON.stringify({
          resumeText,
        }),
    }
  );
}


export function extractSkillsFromResume(
  resumeText
) {
  return extractResumeSkills(
    resumeText
  );
}


export function analyzeResume(
  resumeText
) {
  return request(
    "/ai/analyze-resume",
    {
      method: "POST",

      body:
        JSON.stringify({
          resumeText,
        }),
    }
  );
}


export function careerSuggestions() {
  return request(
    "/ai/career-suggestions"
  );
}


export function getCareerSuggestions() {
  return careerSuggestions();
}


export function personalizedRoadmap(
  payload
) {
  return request(
    "/ai/personalized-roadmap",
    {
      method: "POST",

      body:
        JSON.stringify(
          payload
        ),
    }
  );
}


export function generatePersonalizedRoadmap(
  targetRole
) {
  return personalizedRoadmap({
    targetRole,
  });
}


export function matchExplanation(
  studentId,
  jobId
) {
  return request(
    `/ai/match-explanation/${studentId}/${jobId}`
  );
}


export function getMatchExplanation(
  studentId,
  jobId
) {
  return matchExplanation(
    studentId,
    jobId
  );
}


export function analyzeJob(
  jobDescription
) {
  return request(
    "/ai/analyze-job",
    {
      method: "POST",

      body:
        JSON.stringify({
          jobDescription,
        }),
    }
  );
}


// ============================================================
// API OBJECT
// ============================================================

export const api = {

  // Session
  getSession,
  saveSession,
  clearSession,

  // Auth
  signup,
  login,

  // Student
  getStudentProfile,
  createStudentProfile,
  updateStudentProfile,
  updateStudentSkills,

  // Company
  getCompanyProfile,
  createCompanyProfile,
  getCompanyJobs,
  getCompanyApplications,

  // Skills
  getSkills,

  // Assessments
  getAssessments,
  getAssessment,
  getMyAttempts,
  getMyAssessmentAttempts,
  submitAssessment,
  generateSkillAssessment,

  // Roadmap
  getRoadmap,

  // Jobs
  getJobs,
  getJob,
  createJob,

  // Applications
  applyForJob,
  applyToJob,
  getMyApplications,
  updateApplicationStatus,

  // Matching
  getMatch,

  // AI
  semanticMatch,
  extractResumeSkills,
  extractSkillsFromResume,
  analyzeResume,
  careerSuggestions,
  getCareerSuggestions,
  personalizedRoadmap,
  generatePersonalizedRoadmap,
  matchExplanation,
  getMatchExplanation,
  analyzeJob,
};


// ============================================================
// DEFAULT EXPORT
// ============================================================

export default api;