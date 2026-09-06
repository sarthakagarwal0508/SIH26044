import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle2, Sliders } from 'lucide-react';

export const SkillGapCharts = ({ skillGapData, departmentData, trendingSkills }) => {

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const student = payload.find(p => p.dataKey === 'studentAvg')?.value;
      const industry = payload.find(p => p.dataKey === 'industryDemand')?.value;
      const gap = student - industry;

      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200 text-xs space-y-1">
          <div className="font-bold text-slate-800">{label}</div>
          <div className="text-emerald-600 font-medium">Student Avg: {student}%</div>
          <div className="text-indigo-600 font-medium">Industry Demand: {industry}%</div>
          <div className={`font-semibold ${gap < -20 ? 'text-rose-600' : gap < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
            Skill Gap: {gap > 0 ? `+${gap}% (Surplus)` : `${gap}% (Deficit)`}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      
      {/* Chart 1: Skill Gap Comparison */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-600" />
              Skill Gap Heatmap: Student Proficiency vs. Industry Hiring Demand
            </h3>
            <p className="text-xs text-slate-500">
              Evaluated across 1,085 assessed students against active job opening criteria in Ayush sectors
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-emerald-500"></span> Student Average
            </span>
            <span className="flex items-center gap-1.5 font-medium text-slate-600">
              <span className="w-3 h-3 rounded-xs bg-indigo-600"></span> Industry Benchmark
            </span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={skillGapData}
              margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="skill" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                interval={0} 
                angle={-15} 
                textAnchor="end"
              />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="studentAvg" name="Student Avg" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="industryDemand" name="Industry Demand" fill="#4f46e5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Actionable highlight footer */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-rose-50 p-2.5 rounded-lg border border-rose-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-rose-900 block">Critical Gap: Health Data & Analytics</span>
              <span className="text-rose-700">38 point gap between industry demand and cohort proficiency.</span>
            </div>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-100 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-900 block">HPLC & Instrumentation</span>
              <span className="text-amber-700">36 point gap; wet-lab chromatography training recommended.</span>
            </div>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block">Strong Alignment: Panchakarma</span>
              <span className="text-emerald-700">Student cohort exceeds hiring baseline (+17%).</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Department Readiness & Trending Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Readiness */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-slate-900 text-base">Department-wise Industry Readiness</h3>
            <p className="text-xs text-slate-500">Percentage of students meeting minimum industry threshold</p>
          </div>

          <div className="space-y-3">
            {departmentData.map(dept => (
              <div key={dept.department} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-700">{dept.department}</span>
                  <span className="font-mono font-bold text-slate-900">{dept.ready}% Ready</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-2 transition-all"
                    style={{ width: `${dept.ready}%` }}
                    title={`Ready: ${dept.ready}%`}
                  ></div>
                  <div
                    className="bg-amber-400 h-2 transition-all"
                    style={{ width: `${dept.training}%` }}
                    title={`Needs Upskilling: ${dept.training}%`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-4 mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Placement Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Bridge Course Required
            </span>
          </div>
        </div>

        {/* Trending Industry Skills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Top In-Demand Industry Skills
              </h3>
              <p className="text-xs text-slate-500">Live demand growth over the last quarter</p>
            </div>
            <span className="text-xs font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              Q3 2026
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {trendingSkills.map((item, index) => (
              <div key={item.skill} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-mono font-bold text-[11px]">
                    {index + 1}
                  </span>
                  <span className="font-semibold text-slate-800">{item.skill}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-[11px]">{item.companiesHiring} Companies Hiring</span>
                  <span className="font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {item.demandGrowth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
