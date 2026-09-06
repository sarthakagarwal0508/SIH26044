import React, { useState } from 'react';
import { Search, GraduationCap, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export const StudentCohortTable = ({ cohort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');

  const filtered = cohort.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.roll.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || student.dept.includes(deptFilter);
    return matchesSearch && matchesDept;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Student Cohort Readiness & Assessment Registry
          </h3>
          <p className="text-xs text-slate-500">
            Real-time status of student skill assessment tests and placement readiness
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by student or roll no..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white"
          >
            <option value="all">All Departments</option>
            <option value="Dravyaguna">Dravyaguna (Pharmacology)</option>
            <option value="Kayachikitsa">Kayachikitsa (Medicine)</option>
            <option value="Rasa Shastra">Rasa Shastra</option>
            <option value="Swasthavritta">Swasthavritta (Yoga)</option>
            <option value="Biotech">Ayush Biotech</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Student Name</th>
              <th className="py-2.5 px-3">Roll Number</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3 text-center">Standard Assessment Score</th>
              <th className="py-2.5 px-3">Industry Readiness</th>
              <th className="py-2.5 px-3 text-right">Placement Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 px-3 font-semibold text-slate-900">
                  {student.name}
                </td>
                <td className="py-2.5 px-3 font-mono text-slate-500">
                  {student.roll}
                </td>
                <td className="py-2.5 px-3 text-slate-600">
                  {student.dept}
                </td>
                <td className="py-2.5 px-3 text-center">
                  <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                    student.score >= 85
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : student.score >= 70
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {student.score}%
                  </span>
                </td>
                <td className="py-2.5 px-3">
                  <span className={`inline-flex items-center gap-1 font-medium ${
                    student.readiness.includes('Ready') ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {student.readiness.includes('Ready') ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    )}
                    {student.readiness}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {student.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
