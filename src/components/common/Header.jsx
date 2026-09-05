import React from 'react';
import { Building2, Landmark, GraduationCap, Bell, ShieldCheck, Sparkles } from 'lucide-react';

export const Header = ({ activeRole, setActiveRole }) => {
  const roles = [
    {
      id: 'company',
      label: 'Company / Industry',
      subtitle: 'Post Internships, Evaluate Applicants',
      icon: Building2,
      badge: 'Shreyash Module',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      id: 'institution',
      label: 'Institution / College',
      subtitle: 'Skill Gap Heatmaps & Analytics',
      icon: Landmark,
      badge: 'Shreyash Module',
      badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300'
    },
    {
      id: 'student',
      label: 'Student Portal',
      subtitle: 'Assessments & Roadmap Preview',
      icon: GraduationCap,
      badge: 'Flow Preview',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300'
    }
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Ministry Ribbon */}
      <div className="bg-linear-to-r from-emerald-800 via-teal-800 to-slate-900 text-white px-4 py-1.5 text-xs flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            <span className="text-amber-300">🇮🇳</span> Ministry of Ayush &middot; Government of India
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-emerald-200 hidden sm:inline">National Academia-Industry Collaborative Platform</span>
        </div>
        <div className="flex items-center space-x-3 font-mono">
          <span className="bg-emerald-700/60 px-2 py-0.5 rounded text-[11px] text-emerald-200 border border-emerald-500/30">
            SIH 2026 &middot; PS-26044
          </span>
          <span className="text-xs text-slate-300 hidden md:inline flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" /> Production Prototype
          </span>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl bg-linear-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">AyurSetu</h1>
              <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                Skill Mapping Portal
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Bridging Ayush Academia & Industries for Smart Internships & Placements
            </p>
          </div>
        </div>

        {/* Role Switcher Nav */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
          {roles.map(role => {
            const Icon = role.icon;
            const isActive = activeRole === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-sm font-semibold border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                <span>{role.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono border ${role.badgeColor}`}>
                  {role.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Action Profile / Notification */}
        <div className="hidden lg:flex items-center space-x-3">
          <button 
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center border border-emerald-200">
              SY
            </div>
            <div className="text-left">
              <div className="text-xs font-semibold text-slate-800">Shreyash</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Frontend Lead</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
