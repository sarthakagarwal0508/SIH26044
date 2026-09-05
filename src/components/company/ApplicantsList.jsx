import React, { useState } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Calendar, ArrowUpDown, Sparkles, UserCheck } from 'lucide-react';
import { MatchScoreBadge, StatusBadge, SkillTag } from '../common/Badge';
import { CandidateProfileModal } from './CandidateProfileModal';

export const ApplicantsList = ({ applicants, jobs, onUpdateStatus, selectedJobId, onSelectJob }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [minMatchFilter, setMinMatchFilter] = useState(0);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  // Filter applicants
  const filteredApplicants = applicants.filter(app => {
    const matchesJob = selectedJobId === 'all' || app.jobId === selectedJobId;
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          app.degree.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesScore = app.matchScore >= minMatchFilter;

    return matchesJob && matchesSearch && matchesStatus && matchesScore;
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId);

  return (
    <div className="space-y-4">
      {/* Controls: Job Selector + Search + Score Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Job selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase whitespace-nowrap">Filter by Opening:</span>
          <select
            value={selectedJobId}
            onChange={(e) => onSelectJob(e.target.value)}
            className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          >
            <option value="all">All Postings ({applicants.length} Applicants)</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>
                {j.title} ({j.applicantsCount})
              </option>
            ))}
          </select>
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search candidate, college, or degree..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Status & Min Match Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview">Interview Scheduled</option>
            <option value="rejected">Not Selected</option>
          </select>

          <select
            value={minMatchFilter}
            onChange={(e) => setMinMatchFilter(Number(e.target.value))}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value={0}>Any Match %</option>
            <option value={80}>≥ 80% Match</option>
            <option value={90}>≥ 90% Match</option>
          </select>
        </div>
      </div>

      {/* Selected Job Context Banner */}
      {selectedJob && selectedJobId !== 'all' && (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-bold text-emerald-950 flex items-center gap-1.5">
              <span>{selectedJob.companyLogo}</span>
              <span>{selectedJob.title}</span>
              <span className="font-normal text-emerald-700">&middot; {selectedJob.department}</span>
            </div>
            <div className="text-emerald-800/80 mt-0.5 flex items-center gap-2 flex-wrap">
              <span>Required:</span>
              {selectedJob.requiredSkills.map(s => (
                <SkillTag key={s.name} name={s.name} importance={s.importance} />
              ))}
            </div>
          </div>
          <div className="font-mono text-emerald-900 font-bold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            {filteredApplicants.length} Candidates
          </div>
        </div>
      )}

      {/* Applicants Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredApplicants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Candidate & Academic Background</th>
                  <th className="py-3 px-4">Applied Opening</th>
                  <th className="py-3 px-4 text-center">AI Skill Match</th>
                  <th className="py-3 px-4">Matched vs Gaps</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplicants.map(applicant => {
                  const job = jobs.find(j => j.id === applicant.jobId);
                  return (
                    <tr key={applicant.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Candidate Column */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={applicant.avatar}
                            alt={applicant.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                          />
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {applicant.name}
                              {applicant.verifiedByUniversity && (
                                <span title="Verified by Academic Institute" className="text-emerald-600 font-normal">
                                  ✓
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 text-[11px] truncate max-w-xs">
                              {applicant.degree} &middot; CGPA: {applicant.cgpa}
                            </div>
                            <div className="text-slate-400 text-[10px] truncate max-w-xs">
                              {applicant.college}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Job Column */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{job ? job.title : 'General Pool'}</div>
                        <div className="text-slate-400 text-[11px]">{job ? job.company : ''}</div>
                      </td>

                      {/* Match Score Column */}
                      <td className="py-3 px-4 text-center">
                        <MatchScoreBadge score={applicant.matchScore} size="sm" />
                      </td>

                      {/* Skills match pill summary */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {applicant.matchedSkills.slice(0, 2).map(s => (
                            <span key={s} className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">
                              {s}
                            </span>
                          ))}
                          {applicant.missingSkills.length > 0 && (
                            <span className="text-[10px] bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded border border-rose-200">
                              Missing: {applicant.missingSkills[0]}
                            </span>
                          )}
                          {applicant.matchedSkills.length > 2 && (
                            <span className="text-[10px] text-slate-400 self-center">
                              +{applicant.matchedSkills.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={applicant.status} />
                      </td>

                      {/* Action Buttons Column */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Profile */}
                          <button
                            onClick={() => setSelectedApplicant(applicant)}
                            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                            title="View Full Profile & Verification"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Shortlist */}
                          {applicant.status !== 'shortlisted' && (
                            <button
                              onClick={() => onUpdateStatus(applicant.id, 'shortlisted')}
                              className="p-1.5 text-emerald-700 hover:bg-emerald-100 bg-emerald-50 rounded-lg border border-emerald-200 transition-colors cursor-pointer"
                              title="Shortlist Candidate"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Quick Reject */}
                          {applicant.status !== 'rejected' && (
                            <button
                              onClick={() => onUpdateStatus(applicant.id, 'rejected')}
                              className="p-1.5 text-rose-700 hover:bg-rose-100 bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                              title="Reject Application"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <UserCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No applicants match your filter criteria</p>
            <p className="text-xs text-slate-400 mt-1">Try selecting a different opening or adjusting the match percentage filter.</p>
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      {selectedApplicant && (
        <CandidateProfileModal
          applicant={selectedApplicant}
          isOpen={Boolean(selectedApplicant)}
          onClose={() => setSelectedApplicant(null)}
          onUpdateStatus={onUpdateStatus}
        />
      )}
    </div>
  );
};
