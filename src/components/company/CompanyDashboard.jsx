import React, { useState } from 'react';
import { Briefcase, Users, UserCheck, Sparkles, Plus, Search, Calendar, MapPin, IndianRupee, ArrowRight } from 'lucide-react';
import { ApplicantsList } from './ApplicantsList';
import { CreateJobModal } from './CreateJobModal';
import { SkillTag } from '../common/Badge';

export const CompanyDashboard = ({ jobs, applicants, onJobCreated, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState('applicants'); // 'applicants' | 'jobs'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('all');

  // Stats calculation
  const totalPostings = jobs.length;
  const totalApplicants = applicants.length;
  const shortlistedCount = applicants.filter(a => a.status === 'shortlisted' || a.status === 'interview').length;
  const highMatchCount = applicants.filter(a => a.matchScore >= 85).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Industry Collaboration Portal</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Post specialized Ayush research internships, configure required skill weightages, and evaluate AI-matched student talent.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Post New Internship / Job
        </button>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Postings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{totalPostings}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Live in Ayush University Network</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Applicants</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{totalApplicants}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">From 48 accredited Ayush colleges</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Shortlisted Talent</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{shortlistedCount}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">Ready for technical interviews</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">High Match Fit (≥85%)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{highMatchCount}</div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Instant skill qualification</div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-4">
        <button
          onClick={() => setActiveTab('applicants')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            activeTab === 'applicants'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Candidate Screening & Shortlist ({totalApplicants})
        </button>
        <button
          onClick={() => setActiveTab('jobs')}
          className={`pb-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            activeTab === 'jobs'
              ? 'text-emerald-700 border-b-2 border-emerald-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Manage Openings & Skill Weights ({totalPostings})
        </button>
      </div>

      {/* Tab 1: Applicants List */}
      {activeTab === 'applicants' && (
        <ApplicantsList
          applicants={applicants}
          jobs={jobs}
          onUpdateStatus={onUpdateStatus}
          selectedJobId={selectedJobId}
          onSelectJob={setSelectedJobId}
        />
      )}

      {/* Tab 2: Manage Jobs & Openings */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobs.map(job => (
              <div
                key={job.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{job.companyLogo || '🌿'}</span>
                      <div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {job.title}
                        </h3>
                        <p className="text-xs text-slate-500">{job.company} &middot; {job.department}</p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {job.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {job.description}
                  </p>

                  {/* Metadata Chips */}
                  <div className="flex flex-wrap gap-2 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" /> {job.stipend}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Deadline: {job.deadline}
                    </span>
                  </div>

                  {/* Required Skills & Importance Matrix */}
                  <div className="mt-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Skill Importance Matrix:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {job.requiredSkills.map(skill => (
                        <div
                          key={skill.name}
                          className="text-xs bg-slate-50 text-slate-700 px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5"
                        >
                          <span className="font-medium">{skill.name}</span>
                          <span className={`text-[9px] px-1 py-0.2 rounded font-mono font-bold ${
                            skill.importance === 'Must-Have' ? 'bg-emerald-100 text-emerald-800' :
                            skill.importance === 'Desirable' ? 'bg-blue-100 text-blue-800' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {skill.importance} (Wt: {skill.weight})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    <span className="font-bold text-slate-800">{job.applicantsCount}</span> Applicants &middot;{' '}
                    <span className="font-bold text-emerald-700">{job.shortlistedCount}</span> Shortlisted
                  </div>
                  <button
                    onClick={() => {
                      setSelectedJobId(job.id);
                      setActiveTab('applicants');
                    }}
                    className="font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    View Applicants <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      <CreateJobModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onJobCreated={onJobCreated}
      />
    </div>
  );
};
