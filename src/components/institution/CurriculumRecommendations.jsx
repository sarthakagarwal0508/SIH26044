import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle, ArrowRight, Download, Clock } from 'lucide-react';

export const CurriculumRecommendations = ({ recommendations }) => {
  const [implementedCourses, setImplementedCourses] = useState([]);

  const handleImplement = (id) => {
    if (implementedCourses.includes(id)) {
      setImplementedCourses(implementedCourses.filter(cId => cId !== id));
    } else {
      setImplementedCourses([...implementedCourses, id]);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              AI-Generated Curriculum & Bridge Course Recommendations
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated syllabus interventions derived from real-time industry skill gap deficits
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Bridge Curriculum Modules (PDF)...')}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" /> Export Action Plan (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map(rec => {
          const isImplemented = implementedCourses.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                isImplemented
                  ? 'bg-emerald-50/60 border-emerald-300'
                  : 'bg-slate-50/70 border-slate-200 hover:border-indigo-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                    rec.urgency === 'High'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rec.urgency} Urgency
                  </span>
                  <span className="text-[11px] font-medium text-slate-500 truncate">
                    {rec.targetDept}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug mb-2">
                  {rec.title}
                </h4>

                <p className="text-xs text-slate-600 mb-3">
                  <span className="font-semibold text-slate-700">Diagnosis:</span> {rec.reason}
                </p>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs space-y-1 mb-3">
                  <span className="font-semibold text-indigo-900 block flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Proposed Action:
                  </span>
                  <p className="text-slate-600 text-[11px]">{rec.suggestedAction}</p>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-medium text-emerald-800 bg-emerald-100/60 px-2.5 py-1 rounded mb-3">
                  🎯 Projected Impact: <span className="font-bold">{rec.projectedImpact}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleImplement(rec.id)}
                  className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isImplemented
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isImplemented ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" /> Course Initiated in Academic Council
                    </>
                  ) : (
                    <>
                      Schedule Bridge Module <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
