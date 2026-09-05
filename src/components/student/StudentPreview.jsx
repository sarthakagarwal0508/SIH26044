import React, { useState } from 'react';
import { GraduationCap, Award, BookOpen, CheckCircle, ArrowRight, Sparkles, Send } from 'lucide-react';
import { MatchScoreBadge, StatusBadge, SkillTag } from '../common/Badge';

export const StudentPreview = ({ jobs, onApplyToJob, userApplications }) => {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'roadmap' | 'assessment'
  const [appliedJobs, setAppliedJobs] = useState({});

  // Student Profile Data
  const student = {
    name: "Aaditya Sharma",
    degree: "M.D. (Ayurveda) - Dravyaguna Vigyana",
    college: "All India Institute of Ayurveda (AIIA), New Delhi",
    cgpa: "8.9 / 10",
    skills: [
      { name: "Phytochemical Screening & Extraction", score: 96, level: "Expert" },
      { name: "HPLC / GC-MS Analytical Techniques", score: 92, level: "Advanced" },
      { name: "Ayurvedic Pharmacopoeia of India (API) Standards", score: 90, level: "Advanced" },
      { name: "GLP / GMP Cleanroom Documentation", score: 78, level: "Intermediate" }
    ]
  };

  const handleApply = (jobId) => {
    setAppliedJobs(prev => ({ ...prev, [jobId]: true }));
    onApplyToJob(jobId);
  };

  return (
    <div className="space-y-6">
      
      {/* Student Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xl border border-amber-200">
            AS
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">{student.name}</h2>
              <span className="bg-amber-50 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-200">
                Student View (Demo Flow)
              </span>
            </div>
            <p className="text-xs text-slate-600">{student.degree}</p>
            <p className="text-xs text-slate-400">{student.college} &middot; CGPA: {student.cgpa}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 text-xs">
          <Award className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-600 font-medium">Verified Skills:</span>
          <span className="font-mono font-bold text-emerald-800">4 Certified</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('browse')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'browse'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Matched Industry Opportunities ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
            activeTab === 'roadmap'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Personalized Learning Roadmap & Skill Gaps
        </button>
      </div>

      {/* Tab 1: Matched Jobs */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => {
            const isApplied = appliedJobs[job.id];
            // Compute simulated match
            const match = job.id === 'job-101' ? 94 : job.id === 'job-102' ? 68 : 82;

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700">{job.company}</span>
                      <h3 className="font-bold text-slate-900 text-base mt-0.5">{job.title}</h3>
                      <p className="text-xs text-slate-500">{job.location} &middot; {job.stipend}</p>
                    </div>
                    <MatchScoreBadge score={match} size="md" />
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {job.description}
                  </p>

                  <div className="mt-3 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">Required Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map(s => (
                        <SkillTag key={s.name} name={s.name} importance={s.importance} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Deadline: {job.deadline}</span>
                  <button
                    onClick={() => handleApply(job.id)}
                    disabled={isApplied}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isApplied
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Applied (In Review)
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Apply with AI Profile
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Learning Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              AI Upskilling Pathway to Reach 98% Match Rate
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Based on your target career in Analytical QC & Standardization, here are recommended micro-credentials.
            </p>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Advanced HPTLC Method Development (Monograph Verification)</h4>
                  <p className="text-[11px] text-slate-500">20 Hours &middot; CCRAS & Pharmacopoeia Commission certified</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                +8% Match Boost
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">GCP Clinical Trial Data Management in R / Python</h4>
                  <p className="text-[11px] text-slate-500">15 Hours &middot; ICMR-Ayush Clinical Protocol series</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
                +14% Match Boost
              </span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
