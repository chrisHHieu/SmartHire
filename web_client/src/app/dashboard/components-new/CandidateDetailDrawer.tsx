"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText, FiBriefcase, FiAward, FiTarget, FiGlobe, FiCheckCircle } from "react-icons/fi";

interface CandidateDetailProps {
  candidate: {
    _id: string;
    candidate_name: string;
    full_name?: string;
    email: string;
    phone_number: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
    summary?: string;
    cv_name: string;
    structured_education?: Array<{
      school_name: string;
      degree?: string;
      field_of_study?: string;
      start_year?: number;
      end_year?: number;
      gpa?: number;
    }>;
    structured_experience?: Array<{
      job_title: string;
      company_name: string;
      location?: string;
      start_date?: string;
      end_date?: string;
      responsibilities?: string;
    }>;
    structured_skills?: Array<{
      name: string;
      level?: string;
    }>;
    structured_certifications?: Array<{
      name: string;
      issuer?: string;
      issue_date?: string;
      expiration_date?: string;
    }>;
    languages?: Array<{
      name: string;
      proficiency?: string;
    }>;
    awards?: Array<{
      title: string;
      description?: string;
      year?: number;
    }>;
    // Legacy fields
    degree?: string[];
    experience?: string[];
    technical_skill?: string[];
    soft_skill?: string[];
    certificate?: string[];
    job_recommended?: string[];
    created_at: string;
  };
  onClose: () => void;
}

export default function CandidateDetailDrawer({ candidate, onClose }: CandidateDetailProps) {
  const displayName = candidate.full_name || candidate.candidate_name;
  const displayPhone = candidate.phone || candidate.phone_number;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
      />

      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full max-w-2xl h-screen bg-white dark:bg-slate-950 shadow-2xl z-[160] flex flex-col font-inter"
      >
        {/* Header - Minimalist */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-950 relative">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight font-jakarta">
              Candidate Profile
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ID:</span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">{candidate._id.slice(-8)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">
          {/* Profile Card */}
          <section className="p-8 rounded-3xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900 relative overflow-hidden group">
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm flex-shrink-0">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 text-slate-700 dark:text-slate-300 text-sm space-y-2">
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-none font-jakarta">
                  {displayName}
                </h3>
                <div className="flex items-center gap-2">
                  <FiMail className="text-indigo-500" />
                  <span>{candidate.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="text-indigo-500" />
                  <span>{displayPhone}</span>
                </div>
                {candidate.address && (
                  <div className="flex items-center gap-2">
                    <FiMapPin className="text-indigo-500" />
                    <span>{candidate.address}</span>
                  </div>
                )}
                {candidate.date_of_birth && (
                  <div className="flex items-center gap-2">
                    <FiCalendar className="text-indigo-500" />
                    <span>{candidate.date_of_birth}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-200/50 dark:border-slate-700/50 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <FiFileText />
              Source File: {candidate.cv_name}
            </div>
          </section>

          {/* Summary */}
          {candidate.summary && (
            <Section title="Executive Summary" icon={<FiCheckCircle className="text-indigo-500" />}>
              <p className="text-[15px] italic text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                "{candidate.summary}"
              </p>
            </Section>
          )}

          {/* Structured Education */}
          {candidate.structured_education && candidate.structured_education.length > 0 && (
            <Section title="Education" icon={<FiAward className="text-emerald-500" />}>
              <div className="space-y-4">
                {candidate.structured_education.map((edu, i) => (
                  <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {edu.degree} {edu.field_of_study && `- ${edu.field_of_study}`}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {edu.school_name}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-1">
                      {edu.start_year} - {edu.end_year || 'Present'} {edu.gpa && `• GPA: ${edu.gpa}`}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Structured Experience */}
          {candidate.structured_experience && candidate.structured_experience.length > 0 && (
            <Section title="Work Experience" icon={<FiBriefcase className="text-amber-500" />}>
              <div className="space-y-4">
                {candidate.structured_experience.map((exp, i) => (
                  <div key={i} className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                    <div className="text-base font-bold text-slate-900 dark:text-white">
                      {exp.job_title}
                    </div>
                    <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      {exp.company_name} {exp.location && `• ${exp.location}`}
                    </div>
                    <div className="text-xs font-medium text-slate-400 mt-1 mb-2">
                      {exp.start_date} - {exp.end_date || 'Present'}
                    </div>
                    {exp.responsibilities && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                        {exp.responsibilities}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Structured Skills */}
          {candidate.structured_skills && candidate.structured_skills.length > 0 && (
            <Section title="Skills" icon={<FiTarget className="text-rose-500" />}>
              <div className="flex flex-wrap gap-2">
                {candidate.structured_skills.map((skill, i) => (
                  <span key={i} className="badge badge-info bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
                    {skill.name} {skill.level && `(${skill.level})`}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Certifications */}
          {candidate.structured_certifications && candidate.structured_certifications.length > 0 && (
            <Section title="Certifications" icon={<FiAward className="text-indigo-500" />}>
              <div className="space-y-3">
                {candidate.structured_certifications.map((cert, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        {cert.name}
                      </div>
                      {cert.issuer && (
                        <div className="text-xs text-slate-500 mt-0.5">
                          {cert.issuer}
                        </div>
                      )}
                    </div>
                    {cert.issue_date && (
                      <div className="text-xs font-medium text-slate-400 text-right">
                        {cert.issue_date} <br /> {cert.expiration_date ? `Valid till ${cert.expiration_date}` : ''}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Languages */}
          {candidate.languages && candidate.languages.length > 0 && (
            <Section title="Languages" icon={<FiGlobe className="text-emerald-500" />}>
              <div className="flex flex-wrap gap-2">
                {candidate.languages.map((lang, i) => (
                  <span key={i} className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {lang.name} {lang.proficiency && `(${lang.proficiency})`}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Awards */}
          {candidate.awards && candidate.awards.length > 0 && (
            <Section title="Honors & Awards" icon={<FiAward className="text-amber-500" />}>
              <div className="space-y-3">
                {candidate.awards.map((award, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {award.title} {award.year && `(${award.year})`}
                    </div>
                    {award.description && (
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {award.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* Job Recommended */}
          {candidate.job_recommended && candidate.job_recommended.length > 0 && (
            <Section title="Recommended Positions" icon={<FiBriefcase className="text-indigo-500" />}>
              <div className="flex flex-wrap gap-2">
                {candidate.job_recommended.map((job, i) => (
                  <span key={i} className="badge badge-success bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50">
                    {job}
                  </span>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button onClick={onClose} className="btn border border-slate-200 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition px-8">Close Details</button>
        </div>
      </motion.div>
    </>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-slate-100 dark:border-slate-800/60">
        <span className="text-xl flex items-center justify-center p-2 rounded-lg bg-slate-50 dark:bg-slate-900">{icon}</span>
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-[0.1em]">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

