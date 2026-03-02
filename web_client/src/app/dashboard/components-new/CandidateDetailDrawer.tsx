"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiMail, FiPhone, FiMapPin, FiCalendar, FiFileText,
  FiBriefcase, FiAward, FiTarget, FiGlobe, FiCheckCircle,
  FiUser, FiCpu, FiTrendingUp, FiZap
} from "react-icons/fi";

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
    comment?: string;
    job_recommended?: string[];
    created_at: string;
    avatar_url?: string;
  };
  onClose: () => void;
}

type TabType = 'overview' | 'experience' | 'skills' | 'ai_insights';

export default function CandidateDetailDrawer({ candidate, onClose }: CandidateDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const displayName = candidate.full_name || candidate.candidate_name;
  const displayPhone = candidate.phone || candidate.phone_number;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'experience', label: 'Experience', icon: <FiBriefcase /> },
    { id: 'skills', label: 'Skills & Certs', icon: <FiTarget /> },
    { id: 'ai_insights', label: 'AI Analysis', icon: <FiCpu /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop glassmorphism */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col font-inter"
        >
          {/* Top Bar / Close Button */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-all duration-300 shadow-sm"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Sidebar - Profile Summary (Bento Style) */}
            <aside className="w-full md:w-[320px] bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <div className="relative group mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                {candidate.avatar_url ? (
                  <img
                    src={candidate.avatar_url}
                    alt={displayName}
                    className="relative w-32 h-32 rounded-[2rem] object-cover border-4 border-white dark:border-slate-800 shadow-xl"
                  />
                ) : (
                  <div className="relative w-32 h-32 rounded-[2rem] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="text-center space-y-1">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight font-jakarta">
                  {displayName}
                </h2>
                <p className="text-sm font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">
                  Candidate Profile
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <ContactItem icon={<FiMail />} label="Email" value={candidate.email} />
                <ContactItem icon={<FiPhone />} label="Phone" value={displayPhone} />
                {candidate.address && <ContactItem icon={<FiMapPin />} label="Address" value={candidate.address} />}
                {candidate.date_of_birth && <ContactItem icon={<FiCalendar />} label="Birthday" value={candidate.date_of_birth} />}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                    <FiFileText />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">CV File</p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{candidate.cv_name}</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Content - Tabs Area */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
              {/* Tab Navigation */}
              <nav className="px-8 pt-8 flex gap-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 sticky top-0 z-20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-[0_-4px_10px_rgba(99,102,241,0.5)]"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-8">
                        {candidate.summary && (
                          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-indigo-50/50 to-white dark:from-slate-900 dark:to-slate-900 border border-indigo-100 dark:border-indigo-900/30">
                            <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-4">
                              <FiZap className="text-amber-500" /> Executive Summary
                            </h3>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                              "{candidate.summary}"
                            </p>
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <InfoCard title="Education" icon={<FiAward className="text-emerald-500" />}>
                            {candidate.structured_education && candidate.structured_education.length > 0 ? (
                              <ul className="space-y-4">
                                {candidate.structured_education.map((edu, i) => (
                                  <li key={i} className="border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1">
                                    <div className="flex flex-col gap-1">
                                      <p className="font-bold text-slate-900 dark:text-white text-sm tracking-tight leading-snug">
                                        {edu.degree}
                                      </p>
                                      {edu.field_of_study && (
                                        <p className="text-xs font-semibold text-indigo-500/80 dark:text-indigo-400/80 italic">
                                          {edu.field_of_study}
                                        </p>
                                      )}
                                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                                        {edu.school_name}
                                      </p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : <p className="text-slate-400 italic text-sm">No education data</p>}
                          </InfoCard>

                          <InfoCard title="Highlights" icon={<FiTrendingUp className="text-rose-500" />}>
                            <div className="flex flex-wrap gap-2 pt-2">
                              {candidate.job_recommended?.map((job, i) => (
                                <span key={i} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold border border-emerald-100 dark:border-emerald-800/50 uppercase">
                                  {job}
                                </span>
                              ))}
                              {candidate.languages?.map((lang, i) => (
                                <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold border border-indigo-100 dark:border-indigo-800/50 uppercase">
                                  {lang.name}
                                </span>
                              ))}
                            </div>
                          </InfoCard>
                        </div>
                      </div>
                    )}

                    {activeTab === 'experience' && (
                      <div className="relative pl-8 space-y-12">
                        <div className="absolute left-[3px] top-2 bottom-0 w-1 bg-slate-100 dark:bg-slate-800 rounded-full" />
                        {candidate.structured_experience?.map((exp, i) => (
                          <div key={i} className="relative">
                            <div className="absolute -left-[33px] top-1.5 w-5 h-5 rounded-full border-4 border-white dark:border-slate-950 bg-indigo-600 shadow-sm" />
                            <div className="p-8 rounded-[2rem] bg-white dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all duration-300">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-jakarta tracking-tight">{exp.job_title}</h4>
                                <span className="text-[10px] font-bold py-1 px-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full border border-indigo-100 dark:border-indigo-800/50 uppercase tracking-widest h-fit">
                                  {exp.start_date} — {exp.end_date || 'Present'}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2 mb-4">
                                {exp.company_name} {exp.location && <span className="text-slate-300 dark:text-slate-700">•</span>} {exp.location}
                              </p>
                              {exp.responsibilities && (
                                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line border-t border-slate-50 dark:border-slate-800 pt-4 mt-2">
                                  {exp.responsibilities}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {activeTab === 'skills' && (
                      <div className="space-y-10">
                        <SectionTitle title="Core Capabilities" icon={<FiTarget />} />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {candidate.structured_skills?.map((skill, i) => (
                            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors shadow-sm flex items-center justify-between">
                              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{skill.name}</span>
                              {skill.level && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-black uppercase">
                                  {skill.level}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>

                        {candidate.structured_certifications && candidate.structured_certifications.length > 0 && (
                          <>
                            <SectionTitle title="Certifications" icon={<FiAward />} />
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                              {candidate.structured_certifications.map((cert, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
                                  <h4 className="font-black text-slate-900 dark:text-white leading-tight">{cert.name}</h4>
                                  <p className="text-xs font-bold text-indigo-500 uppercase">{cert.issuer}</p>
                                  <p className="text-[10px] font-medium text-slate-400 mt-2">{cert.issue_date} {cert.expiration_date && `• Expires ${cert.expiration_date}`}</p>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {activeTab === 'ai_insights' && (
                      <div className="space-y-8">
                        <div className="relative p-10 rounded-[3rem] overflow-hidden bg-slate-950 text-white min-h-[300px] flex flex-col justify-center">
                          <div className="absolute top-0 right-0 p-10 opacity-10">
                            <FiCpu size={200} />
                          </div>
                          <div className="relative z-10">
                            <h3 className="flex items-center gap-3 text-lg font-black uppercase tracking-[0.2em] text-indigo-400 mb-6">
                              <FiTrendingUp /> Match Analysis
                            </h3>
                            <p className="text-2xl font-medium leading-relaxed italic text-white/90">
                              "{candidate.comment || "AI is still processing the detailed traits for this candidate..."}"
                            </p>

                            <div className="mt-10 flex gap-4">
                              <div className="bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-4 px-6">
                                <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                  <span className="font-bold text-sm">Highly Compatible</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800 text-center">
                          <p className="text-slate-400 text-sm font-medium italic">Comprehensive competency breakdown available soon...</p>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </main>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ContactItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 break-all">{value}</p>
      </div>
    </div>
  );
}

function InfoCard({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-lg">{icon}</div>
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest">{title}</h4>
      </div>
      {children}
    </div>
  );
}

function SectionTitle({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
      <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white tracking-tight">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-indigo-500' })}
        {title}
      </h3>
    </div>
  );
}

