import React from 'react';

export const StatusBadge = ({ status }) => {
  const styles = {
    applied: 'bg-slate-100 text-slate-700 border-slate-300',
    shortlisted: 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-1 ring-emerald-400/30',
    interview: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    rejected: 'bg-rose-100 text-rose-800 border-rose-300',
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  const labels = {
    applied: 'Application Received',
    shortlisted: 'Shortlisted',
    interview: 'Interview Scheduled',
    rejected: 'Not Selected',
    active: 'Active Posting',
    closed: 'Closed'
  };

  const normalized = status ? status.toLowerCase() : 'applied';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[normalized] || styles.applied}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        normalized === 'shortlisted' ? 'bg-emerald-500' :
        normalized === 'rejected' ? 'bg-rose-500' :
        normalized === 'interview' ? 'bg-indigo-500' : 'bg-slate-400'
      }`}></span>
      {labels[normalized] || status}
    </span>
  );
};

export const MatchScoreBadge = ({ score, size = 'md' }) => {
  let color = 'text-amber-700 bg-amber-50 border-amber-300';
  let badgeText = 'Moderate Fit';

  if (score >= 85) {
    color = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    badgeText = 'High Match';
  } else if (score < 65) {
    color = 'text-rose-700 bg-rose-50 border-rose-300';
    badgeText = 'Low Match';
  }

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3.5 py-1.5'
  };

  return (
    <div className="inline-flex items-center gap-1.5">
      <span className={`font-mono font-bold rounded-lg border flex items-center gap-1 ${sizes[size]} ${color}`}>
        <span>{score}%</span>
        <span className="text-[10px] font-sans font-medium uppercase tracking-wider opacity-85">
          {badgeText}
        </span>
      </span>
    </div>
  );
};

export const SkillTag = ({ name, importance, isMissing = false }) => {
  if (isMissing) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200 line-through decoration-rose-400">
        {name}
      </span>
    );
  }

  const importanceStyles = {
    'Must-Have': 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold',
    'Desirable': 'bg-blue-50 text-blue-800 border-blue-200',
    'Bonus': 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${importanceStyles[importance] || 'bg-slate-100 text-slate-800 border-slate-200'}`}>
      {name}
      {importance && (
        <span className="ml-1 text-[9px] opacity-75 uppercase">
          ({importance === 'Must-Have' ? 'Required' : importance})
        </span>
      )}
    </span>
  );
};
