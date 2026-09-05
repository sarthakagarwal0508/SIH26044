import React from 'react';
import { Landmark, Users, Award, Briefcase, TrendingUp, CheckCircle, FileText, Download } from 'lucide-react';
import { SkillGapCharts } from './SkillGapCharts';
import { CurriculumRecommendations } from './CurriculumRecommendations';
import { StudentCohortTable } from './StudentCohortTable';

export const InstitutionDashboard = ({ analytics }) => {
  const { metrics, skillGapComparison, departmentReadiness, trendingSkills, curriculumRecommendations, studentCohort } = analytics;

  return (
    <div className="space-y-6">
      
      {/* College / Dean Welcome Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-2xl">🏛️</span>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{analytics.institutionName}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {analytics.accreditation} &middot; Institutional Skill Gap Intelligence & Curriculum Alignment
          </p>
        </div>

        <button
          onClick={() => alert('Generating Institutional Skill Gap & NAAC Accreditation Report...')}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-slate-900/10 transition-all cursor-pointer flex items-center gap-2 self-start md:self-auto whitespace-nowrap"
        >
          <FileText className="w-4 h-4" /> Download Dean's Report
        </button>
      </div>

      {/* Institutional KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Scholars</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{metrics.totalStudents}</div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            {metrics.assessedStudents} Assessed ({metrics.assessmentRate})
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Industry Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{metrics.averageEmployabilityScore}</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Institutional Employability Index</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Internships Awarded</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{metrics.internshipPlacements}</div>
          <div className="text-[11px] text-blue-600 font-medium mt-1">Current academic session</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Corporate Partners</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">{metrics.activeIndustryPartners}</div>
          <div className="text-[11px] text-teal-600 font-medium mt-1">Active pharmaceutical & research MoUs</div>
        </div>
      </div>

      {/* Skill Gap Analytics & Charts */}
      <SkillGapCharts
        skillGapData={skillGapComparison}
        departmentData={departmentReadiness}
        trendingSkills={trendingSkills}
      />

      {/* Curriculum & Bridge Courses Recommendations */}
      <CurriculumRecommendations recommendations={curriculumRecommendations} />

      {/* Student Cohort Registry */}
      <StudentCohortTable cohort={studentCohort} />

    </div>
  );
};
