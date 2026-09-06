import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { CompanyDashboard } from './components/company/CompanyDashboard';
import { InstitutionDashboard } from './components/institution/InstitutionDashboard';
import { StudentPreview } from './components/student/StudentPreview';
import { apiService } from './services/api';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

function App() {
  const [activeRole, setActiveRole] = useState('company'); // Default to Shreyash's primary module
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [institutionAnalytics, setInstitutionAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [jobsData, applicantsData, analyticsData] = await Promise.all([
          apiService.getJobs(),
          apiService.getApplicantsByJobId('all'),
          apiService.getInstitutionAnalytics()
        ]);
        setJobs(jobsData);
        setApplicants(applicantsData);
        setInstitutionAnalytics(analyticsData);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Handler: Company posts a new job
  const handleJobCreated = async (newJobData) => {
    const created = await apiService.createJob(newJobData);
    setJobs(prev => [created, ...prev]);
    showToast(`Opportunity "${created.title}" successfully posted!`);
  };

  // Handler: Company shortlists / rejects / schedules interview
  const handleUpdateApplicantStatus = async (applicantId, newStatus) => {
    const updated = await apiService.updateApplicantStatus(applicantId, newStatus);
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, status: newStatus } : a));
    
    // Refresh jobs to update shortlisted counts
    const updatedJobs = await apiService.getJobs();
    setJobs(updatedJobs);

    const actionLabels = {
      shortlisted: 'Shortlisted for Next Round',
      rejected: 'Marked as Not Selected',
      interview: 'Interview Scheduled'
    };
    showToast(`Applicant status updated: ${actionLabels[newStatus] || newStatus}`);
  };

  // Handler: Student applies to a job
  const handleStudentApply = async (jobId) => {
    const targetJob = jobs.find(j => j.id === jobId);
    const simulatedApp = {
      id: `app-${Date.now()}`,
      jobId: jobId,
      name: "Aaditya Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      email: "aaditya.sharma@allindiaayurveda.edu.in",
      phone: "+91 98765 43210",
      college: "All India Institute of Ayurveda (AIIA), New Delhi",
      degree: "M.D. (Ayurveda) - Dravyaguna Vigyana",
      year: "Final Year (2026)",
      cgpa: "8.9 / 10",
      matchScore: 94,
      status: "applied",
      appliedDate: new Date().toISOString().split('T')[0],
      skills: [
        { name: "HPLC / GC-MS Analytical Techniques", level: "Advanced", score: 92 },
        { name: "Phytochemical Screening & Extraction", level: "Expert", score: 96 },
        { name: "Ayurvedic Pharmacopoeia of India (API) Standards", level: "Advanced", score: 90 },
        { name: "GLP / GMP Cleanroom Documentation", level: "Intermediate", score: 78 }
      ],
      matchedSkills: ["HPLC / GC-MS Analytical Techniques", "Phytochemical Screening & Extraction"],
      missingSkills: [],
      assessmentScore: 92,
      verifiedByUniversity: true,
      projects: ["HPTLC fingerprinting analysis"],
      experienceSummary: "Ayush Council laboratory training"
    };

    setApplicants(prev => [simulatedApp, ...prev]);
    showToast(`Applied to "${targetJob?.title}". Visible in Company Dashboard!`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-700">Loading Ayush Skill Bridge Portal...</p>
          <p className="text-xs text-slate-400 font-mono">SIH 2026 &middot; PS-26044</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Global Navigation Header & Role Switcher */}
      <Header activeRole={activeRole} setActiveRole={setActiveRole} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Role Alert / Helper for Hackathon Evaluation */}
        <div className="mb-5 bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-xl p-3.5 px-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded font-mono font-bold">
              SIH-26044 DEMO
            </span>
            <span className="text-slate-200">
              {activeRole === 'company' && 'Active View: Industry / Company Portal (Shreyash Work Division)'}
              {activeRole === 'institution' && 'Active View: Academic Institution & Skill-Gap Analytics (Shreyash Work Division)'}
              {activeRole === 'student' && 'Active View: Student Application & Learning Pathway Flow'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-300 font-mono text-[11px]">
            <span>Switch roles using top navbar buttons</span>
          </div>
        </div>

        {/* View Switcher based on Active Role */}
        {activeRole === 'company' && (
          <CompanyDashboard
            jobs={jobs}
            applicants={applicants}
            onJobCreated={handleJobCreated}
            onUpdateStatus={handleUpdateApplicantStatus}
          />
        )}

        {activeRole === 'institution' && institutionAnalytics && (
          <InstitutionDashboard
            analytics={institutionAnalytics}
          />
        )}

        {activeRole === 'student' && (
          <StudentPreview
            jobs={jobs}
            onApplyToJob={handleStudentApply}
            userApplications={applicants}
          />
        )}
      </main>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">AyurSetu Platform</span>
            <span>&middot; Smart India Hackathon 2026</span>
            <span className="text-emerald-700 font-mono font-semibold">PS-26044</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Frontend Developed by <span className="font-semibold text-slate-700">Shreyash</span> (Person 4 - Company & Institution Lead)
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
