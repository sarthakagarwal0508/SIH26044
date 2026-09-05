// API Service Layer for SIH26044
// Designed to connect to Sarthak & Lakshya's Node.js + Express backend
// Equipped with an active Mock Data fallback layer for standalone demo & testing

import { INITIAL_JOBS, INITIAL_APPLICANTS, INSTITUTION_ANALYTICS, SKILLS_TAXONOMY } from '../data/mockData';

// Switch this to false when connecting to Sarthak & Lakshya's live Express server
export const USE_MOCK_DATA = true;
export const API_BASE_URL = 'http://localhost:5000/api';

// Initialize local storage persistence for mock data
const STORAGE_KEYS = {
  JOBS: 'sih_jobs',
  APPLICANTS: 'sih_applicants',
};

const getStoredData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

const setStoredData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
};

// Initialize if empty
if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
  setStoredData(STORAGE_KEYS.JOBS, INITIAL_JOBS);
}
if (!localStorage.getItem(STORAGE_KEYS.APPLICANTS)) {
  setStoredData(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
}

// ----------------- API Methods -----------------

export const apiService = {
  // 1. Jobs & Internships (Company Side)
  async getJobs() {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 200)); // simulate network delay
      return getStoredData(STORAGE_KEYS.JOBS, INITIAL_JOBS);
    }
    const res = await fetch(`${API_BASE_URL}/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
  },

  async createJob(jobData) {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 300));
      const jobs = getStoredData(STORAGE_KEYS.JOBS, INITIAL_JOBS);
      const newJob = {
        ...jobData,
        id: `job-${Date.now()}`,
        postedDate: new Date().toISOString().split('T')[0],
        applicantsCount: 0,
        shortlistedCount: 0,
        status: 'Active',
      };
      const updated = [newJob, ...jobs];
      setStoredData(STORAGE_KEYS.JOBS, updated);
      return newJob;
    }
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData),
    });
    if (!res.ok) throw new Error('Failed to create job');
    return res.json();
  },

  // 2. Applicants Management (Company Side)
  async getApplicantsByJobId(jobId) {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 200));
      const allApplicants = getStoredData(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
      if (!jobId || jobId === 'all') return allApplicants;
      return allApplicants.filter(a => a.jobId === jobId);
    }
    const res = await fetch(`${API_BASE_URL}/jobs/${jobId}/applicants`);
    if (!res.ok) throw new Error('Failed to fetch applicants');
    return res.json();
  },

  async updateApplicantStatus(applicantId, newStatus) {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 250));
      const applicants = getStoredData(STORAGE_KEYS.APPLICANTS, INITIAL_APPLICANTS);
      const updated = applicants.map(a => 
        a.id === applicantId ? { ...a, status: newStatus } : a
      );
      setStoredData(STORAGE_KEYS.APPLICANTS, updated);

      // Also update counts in jobs
      const targetApplicant = applicants.find(a => a.id === applicantId);
      if (targetApplicant) {
        const jobs = getStoredData(STORAGE_KEYS.JOBS, INITIAL_JOBS);
        const updatedJobs = jobs.map(j => {
          if (j.id === targetApplicant.jobId) {
            const jobApps = updated.filter(a => a.jobId === j.id);
            const shortlisted = jobApps.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
            return { ...j, shortlistedCount: shortlisted };
          }
          return j;
        });
        setStoredData(STORAGE_KEYS.JOBS, updatedJobs);
      }

      return updated.find(a => a.id === applicantId);
    }
    const res = await fetch(`${API_BASE_URL}/applications/${applicantId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // 3. Institution Analytics & Skill Gap (Institution Side)
  async getInstitutionAnalytics() {
    if (USE_MOCK_DATA) {
      await new Promise(r => setTimeout(r, 200));
      return INSTITUTION_ANALYTICS;
    }
    const res = await fetch(`${API_BASE_URL}/institution/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // 4. Skills Taxonomy
  async getSkillsTaxonomy() {
    if (USE_MOCK_DATA) {
      return SKILLS_TAXONOMY;
    }
    const res = await fetch(`${API_BASE_URL}/skills`);
    if (!res.ok) throw new Error('Failed to fetch skills');
    return res.json();
  }
};
