import React from 'react';
import { X, CheckCircle, XCircle, Calendar, GraduationCap, Award, Building, Mail, Phone, ExternalLink, Check, Sparkles } from 'lucide-react';
import { MatchScoreBadge, StatusBadge, SkillTag } from '../common/Badge';

export const CandidateProfileModal = ({ applicant, isOpen, onClose, onUpdateStatus }) => {
  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Header with Candidate Banner */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={applicant.avatar}
              alt={applicant.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md"
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{applicant.name}</h2>
                <StatusBadge status={applicant.status} />
                {applicant.verifiedByUniversity && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3 text-emerald-600" /> College Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium mt-0.5">{applicant.degree} &middot; {applicant.year}</p>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                <Building className="w-3.5 h-3.5 text-slate-400" /> {applicant.college}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 text-sm">

          {/* AI Match Overview Banner */}
          <div className="bg-linear-to-r from-emerald-50 via-teal-50 to-slate-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-xs border border-emerald-200">
                <Sparkles className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs text-emerald-900 font-semibold uppercase tracking-wider">AI Skill-Fit Evaluation</div>
                <div className="text-sm text-slate-600">Calculated against your customized role weights and assessment scores</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-xs text-slate-500">Match Index</div>
                <MatchScoreBadge score={applicant.matchScore} size="lg" />
              </div>
            </div>
          </div>

          {/* Contact & Academic Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-medium">Academic CGPA</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{applicant.cgpa}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Standard Assessment</span>
              <span className="font-mono font-bold text-emerald-700 text-sm">{applicant.assessmentScore} / 100</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Email</span>
              <span className="font-medium text-slate-700 truncate block">{applicant.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium">Phone</span>
              <span className="font-medium text-slate-700 block">{applicant.phone}</span>
            </div>
          </div>

          {/* Skills Breakdown */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" /> Verified Competencies & Scores
            </h3>
            <div className="space-y-2">
              {applicant.skills.map(skill => (
                <div key={skill.name} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-slate-800">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">{skill.level}</span>
                      <span className="font-mono font-bold text-emerald-700">{skill.score}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all"
                      style={{ width: `${skill.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Matched vs Missing Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
              <div className="text-xs font-bold text-emerald-900 mb-2 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Matched Role Requirements
              </div>
              <div className="flex flex-wrap gap-1.5">
                {applicant.matchedSkills.length > 0 ? (
                  applicant.matchedSkills.map(s => (
                    <span key={s} className="text-xs bg-white text-emerald-800 px-2.5 py-1 rounded-md border border-emerald-200 font-medium">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400">No direct matches</span>
                )}
              </div>
            </div>

            <div className="bg-rose-50/50 p-3.5 rounded-xl border border-rose-100">
              <div className="text-xs font-bold text-rose-900 mb-2 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5 text-rose-500" /> Skill Gaps for this Role
              </div>
              <div className="flex flex-wrap gap-1.5">
                {applicant.missingSkills.length > 0 ? (
                  applicant.missingSkills.map(s => (
                    <span key={s} className="text-xs bg-white text-rose-700 px-2.5 py-1 rounded-md border border-rose-200 font-medium">
                      {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> None! Candidate satisfies all requirements.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Research Experience & Projects */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">Research Projects & Laboratory Highlights</h3>
            <ul className="space-y-1.5">
              {applicant.projects.map((proj, idx) => (
                <li key={idx} className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{proj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Clinical/Work Experience */}
          <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
            <span className="font-semibold text-slate-800 block">Practical Experience:</span>
            <p className="text-slate-600">{applicant.experienceSummary}</p>
          </div>
        </div>

        {/* Modal Footer Actions: Shortlist / Reject / Interview */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Applied on: {applicant.appliedDate}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onUpdateStatus(applicant.id, 'rejected');
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateStatus(applicant.id, 'interview');
                onClose();
              }}
              className="px-3.5 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Calendar className="w-4 h-4" /> Schedule Interview
            </button>
            <button
              type="button"
              onClick={() => {
                onUpdateStatus(applicant.id, 'shortlisted');
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-1"
            >
              <CheckCircle className="w-4 h-4" /> Shortlist Candidate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
