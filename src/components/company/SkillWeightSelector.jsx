import React, { useState } from 'react';
import { Plus, X, Sliders, CheckCircle2, Sparkles } from 'lucide-react';
import { SKILLS_TAXONOMY } from '../../data/mockData';

export const SkillWeightSelector = ({ selectedSkills, onChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customSkill, setCustomSkill] = useState('');

  const handleAddSkill = (skillName) => {
    if (selectedSkills.some(s => s.name.toLowerCase() === skillName.toLowerCase())) return;
    const newSkill = {
      name: skillName,
      importance: 'Must-Have',
      weight: 8
    };
    onChange([...selectedSkills, newSkill]);
    setSearchTerm('');
  };

  const handleRemoveSkill = (skillName) => {
    onChange(selectedSkills.filter(s => s.name !== skillName));
  };

  const handleUpdateImportance = (skillName, importance) => {
    const defaultWeights = {
      'Must-Have': 9,
      'Desirable': 6,
      'Bonus': 3
    };
    onChange(
      selectedSkills.map(s => 
        s.name === skillName ? { ...s, importance, weight: defaultWeights[importance] } : s
      )
    );
  };

  const handleUpdateWeight = (skillName, weight) => {
    onChange(
      selectedSkills.map(s => 
        s.name === skillName ? { ...s, weight: Number(weight) } : s
      )
    );
  };

  const availableSkills = SKILLS_TAXONOMY.filter(
    s => !selectedSkills.some(sel => sel.name.toLowerCase() === s.name.toLowerCase()) &&
         s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <label className="block text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-emerald-600" />
            Required Skills & Importance Weighting
          </label>
          <p className="text-xs text-slate-500">
            Select essential competencies. The AI matching engine uses these weights to score student applicants.
          </p>
        </div>
        <span className="text-xs font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          {selectedSkills.length} skills selected
        </span>
      </div>

      {/* Selected Skills List with Weightage Controls */}
      {selectedSkills.length > 0 ? (
        <div className="space-y-2.5 bg-slate-50/80 p-3.5 rounded-xl border border-slate-200">
          {selectedSkills.map((skill, index) => (
            <div 
              key={skill.name}
              className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 w-5">#{index + 1}</span>
                <span className="text-sm font-semibold text-slate-800">{skill.name}</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Importance Selector Pills */}
                <div className="flex rounded-md shadow-2xs p-0.5 bg-slate-100 border border-slate-200 text-xs">
                  {['Must-Have', 'Desirable', 'Bonus'].map((imp) => {
                    const isSelected = skill.importance === imp;
                    return (
                      <button
                        type="button"
                        key={imp}
                        onClick={() => handleUpdateImportance(skill.name, imp)}
                        className={`px-2.5 py-1 rounded text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? imp === 'Must-Have'
                              ? 'bg-emerald-600 text-white shadow-2xs font-semibold'
                              : imp === 'Desirable'
                              ? 'bg-blue-600 text-white shadow-2xs font-semibold'
                              : 'bg-slate-700 text-white shadow-2xs font-semibold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {imp}
                      </button>
                    );
                  })}
                </div>

                {/* Weight Slider (1 to 10) */}
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                  <span className="text-xs text-slate-500">Weight:</span>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={skill.weight}
                    onChange={(e) => handleUpdateWeight(skill.name, e.target.value)}
                    className="w-16 accent-emerald-600 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-emerald-800 w-4">
                    {skill.weight}
                  </span>
                </div>

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill.name)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove skill"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <p className="text-xs text-slate-500">No skills selected yet. Choose from recommended catalog below.</p>
        </div>
      )}

      {/* Search & Suggestions from Taxonomy */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search from standard Ayush skills (e.g. HPLC, GCP, Formulation)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
          />
          <button
            type="button"
            onClick={() => {
              if (searchTerm.trim()) {
                handleAddSkill(searchTerm.trim());
              }
            }}
            disabled={!searchTerm.trim()}
            className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-900 disabled:opacity-40 cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
          {availableSkills.slice(0, 8).map(skill => (
            <button
              type="button"
              key={skill.id}
              onClick={() => handleAddSkill(skill.name)}
              className="text-xs bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 px-2.5 py-1 rounded-full flex items-center gap-1 transition-all cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-600" />
              <span>{skill.name}</span>
              <span className="text-[10px] text-slate-400">({skill.category})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
