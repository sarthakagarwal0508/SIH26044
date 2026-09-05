import React, { useState } from 'react';
import { X, Briefcase, Building, MapPin, IndianRupee, Calendar, CheckCircle2 } from 'lucide-react';
import { SkillWeightSelector } from './SkillWeightSelector';

export const CreateJobModal = ({ isOpen, onClose, onJobCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    company: 'Ayush BioPharma Labs Ltd.',
    companyLogo: '🌿',
    department: 'Quality Assurance & Standardization',
    type: 'Internship (6 Months)',
    location: 'New Delhi / Hybrid',
    stipend: '₹25,000 / month',
    deadline: '2026-09-25',
    description: '',
    requiredSkills: [
      { name: 'HPLC / GC-MS Analytical Techniques', importance: 'Must-Have', weight: 9 },
      { name: 'Phytochemical Screening & Extraction', importance: 'Must-Have', weight: 8 },
      { name: 'Ayurvedic Pharmacopoeia of India (API) Standards', importance: 'Desirable', weight: 6 }
    ]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || formData.requiredSkills.length === 0) {
      alert('Please provide a title and at least one required skill');
      return;
    }

    setIsSubmitting(true);
    try {
      await onJobCreated(formData);
      setSuccessMessage(true);
      setTimeout(() => {
        setSuccessMessage(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error(err);
      alert('Error creating listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Post New Internship / Job Opening</h2>
              <p className="text-xs text-slate-500">Define role requirements and skill importance weights for student matching</p>
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
        {successMessage ? (
          <div className="p-12 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Opportunity Successfully Posted!</h3>
            <p className="text-sm text-slate-500">
              Students from accredited Ayush & Pharmacy institutes can now view and match with this role.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Job / Internship Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Phytochemical Standardization Research Fellow"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Department / Domain *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Quality Assurance & Standardization">Quality Assurance & Standardization</option>
                  <option value="Clinical Trials & Pharmacovigilance">Clinical Trials & Pharmacovigilance</option>
                  <option value="Pharmaceutics & Herbal Formulation">Pharmaceutics & Herbal Formulation</option>
                  <option value="Digital Health & Yoga Biometrics">Digital Health & Yoga Biometrics</option>
                  <option value="Ayurvedic Hospital & Panchakarma Services">Ayurvedic Hospital & Panchakarma</option>
                  <option value="Regulatory Affairs & Export Compliance">Regulatory Affairs & Export Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-500" /> Hiring Organization / Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Engagement Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                >
                  <option value="Internship (3 Months)">Internship (3 Months)</option>
                  <option value="Internship (6 Months)">Internship (6 Months)</option>
                  <option value="Full-Time Graduate Trainee">Full-Time Graduate Trainee</option>
                  <option value="Research Fellowship">Research Fellowship</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" /> Location & Work Mode
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-500" /> Stipend / CTC
                  </label>
                  <input
                    type="text"
                    value={formData.stipend}
                    onChange={(e) => setFormData({ ...formData, stipend: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" /> Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                Role Description & Key Deliverables
              </label>
              <textarea
                rows={3}
                placeholder="Describe project scope, laboratory facilities, and what the intern will learn..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            {/* Skill Weightage Selector */}
            <div className="pt-2 border-t border-slate-200">
              <SkillWeightSelector
                selectedSkills={formData.requiredSkills}
                onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
              />
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
              >
                {isSubmitting ? 'Posting Opportunity...' : 'Publish Internship / Job'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
