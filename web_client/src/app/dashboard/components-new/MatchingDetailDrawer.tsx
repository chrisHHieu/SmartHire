"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiCpu, FiBriefcase, FiTarget, FiAward, FiTerminal,
  FiBook, FiGlobe, FiCheckCircle, FiInfo, FiZap, FiUser,
  FiActivity, FiPieChart, FiBarChart2, FiMail, FiPhone, FiFileText
} from "react-icons/fi";

interface MatchingDetailProps {
  matching: {
    _id: string;
    candidate_name: string | null;
    email: string | null;
    phone_number: string | null;
    cv_name: string | null;
    job_name: string | null;
    score: number | null;
    summary_comment: string | null;
    degree?: { score: number | null; comment: string | null } | null;
    experience?: { score: number | null; comment: string | null } | null;
    responsibility?: { score: number | null; comment: string | null } | null;
    soft_skill?: { score: number | null; comment: string | null } | null;
    technical_skill?: { score: number | null; comment: string | null } | null;
    certificate?: { score: number | null; comment: string | null } | null;
    language?: { score: number | null; comment: string | null } | null;
    weight_analysis?: {
      dynamic_weights: any;
      ai_confidence: number;
      job_analysis: any;
      weight_reasoning: any;
    } | null;
  };
  onClose: () => void;
}

type TabType = 'overview' | 'analysis' | 'algorithm';

export default function MatchingDetailDrawer({ matching, onClose }: MatchingDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const score = matching.score ?? 0;

  const getScoreStatus = (val: number) => {
    if (val >= 80) return {
      label: 'Strong Match',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/20',
      border: 'border-emerald-100 dark:border-emerald-800/30',
      bar: 'bg-emerald-500'
    };
    if (val >= 60) return {
      label: 'Good Match',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/20',
      border: 'border-indigo-100 dark:border-indigo-800/30',
      bar: 'bg-indigo-500'
    };
    if (val >= 40) return {
      label: 'Fair Match',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/20',
      border: 'border-amber-100 dark:border-amber-800/30',
      bar: 'bg-amber-500'
    };
    return {
      label: 'Weak Match',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-50 dark:bg-rose-950/20',
      border: 'border-rose-100 dark:border-rose-800/30',
      bar: 'bg-rose-500'
    };
  };

  const status = getScoreStatus(score);

  const criteria = [
    { key: 'technical_skill', label: 'Technical Skills', icon: <FiTerminal />, data: matching.technical_skill },
    { key: 'experience', label: 'Work Experience', icon: <FiBriefcase />, data: matching.experience },
    { key: 'degree', label: 'Education', icon: <FiBook />, data: matching.degree },
    { key: 'soft_skill', label: 'Soft Skills', icon: <FiTarget />, data: matching.soft_skill },
    { key: 'responsibility', label: 'Responsibilities', icon: <FiCheckCircle />, data: matching.responsibility },
    { key: 'certificate', label: 'Certifications', icon: <FiAward />, data: matching.certificate },
    { key: 'language', label: 'Languages', icon: <FiGlobe />, data: matching.language },
  ].filter(c => c.data);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiActivity /> },
    { id: 'analysis', label: 'Analysis', icon: <FiBarChart2 /> },
    { id: 'algorithm', label: 'AI Logic', icon: <FiCpu /> },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10 font-inter">
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
          className="relative w-full max-w-5xl max-h-[90vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <div className="absolute top-6 right-6 z-50">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-all duration-300 shadow-sm"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Sidebar - Candidate Summary (Bento Style) */}
            <aside className="w-full md:w-[320px] bg-slate-50/50 dark:bg-slate-900/30 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
              <div className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-black shadow-xl">
                  {matching.candidate_name?.charAt(0).toUpperCase() || <FiUser />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                    {matching.candidate_name || 'Anonymous'}
                  </h2>
                  <p className="text-xs font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mt-2">
                    Match Report
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-white dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Applying for</p>
                  <div className="flex items-center gap-2 text-sm font-black text-slate-800 dark:text-slate-200">
                    <FiBriefcase className="text-indigo-500" />
                    <span className="truncate">{matching.job_name || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-3 px-1">
                  <DetailItem label="Email" value={matching.email || 'N/A'} icon={<FiMail />} />
                  <DetailItem label="Phone" value={matching.phone_number || 'N/A'} icon={<FiPhone />} />
                  <DetailItem label="CV Source" value={matching.cv_name || 'N/A'} icon={<FiFileText />} />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400">ID: {matching._id.slice(-8).toUpperCase()}</span>
                <FiZap className={`text-xl ${status.color} opacity-50`} />
              </div>
            </aside>

            {/* Right Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
              {/* Tabs Area */}
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
                        layoutId="activeTabMatching"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-[0_-4px_10px_rgba(99,102,241,0.5)]"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar pt-10">
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
                        {/* Hero Score Section */}
                        <div className={`p-10 rounded-[3rem] border ${status.border} ${status.bg} flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group`}>
                          {/* Circle Gauge */}
                          <div className="relative flex items-center justify-center scale-110">
                            <svg className="w-44 h-44 transform -rotate-90 drop-shadow-2xl">
                              <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/40 dark:text-slate-800" />
                              <motion.circle
                                cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="12" fill="transparent"
                                strokeDasharray="490"
                                initial={{ strokeDashoffset: 490 }}
                                animate={{ strokeDashoffset: 490 - (490 * score) / 100 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                strokeLinecap="round" className={status.color}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className={`text-5xl font-black ${status.color}`}>{Math.round(score)}%</span>
                              <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</span>
                            </div>
                          </div>

                          <div className="flex-1 space-y-4 relative z-10 text-center md:text-left">
                            <div className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${status.color} bg-white/50 dark:bg-slate-900/50 border border-current`}>
                              Matching Confidence
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight font-jakarta">
                              {status.label}
                            </h3>
                            <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-sm">This candidate matches {Math.round(score)}% of your job profile requirements.</p>
                          </div>

                          <FiZap className={`absolute -right-10 -bottom-10 text-[200px] opacity-5 rotate-12 transition-transform group-hover:scale-110 duration-1000 ${status.color}`} />
                        </div>

                        {/* Summary Block */}
                        <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden shadow-2xl">
                          <FiInfo className="absolute top-10 right-10 text-indigo-500 text-7xl opacity-20" />
                          <h4 className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6">
                            <FiCpu /> AI Executive Insights
                          </h4>
                          <p className="text-xl font-medium leading-relaxed italic text-slate-200/90 relative z-10">
                            "{matching.summary_comment || 'Our AI engine is still generating the final report...'}"
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'analysis' && (
                      <div className="space-y-10">
                        <div className="flex items-center justify-between">
                          <SectionTitle title="Gap Analysis" icon={<FiBarChart2 />} />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-depth breakdown</span>
                        </div>

                        <div className="grid grid-cols-1 gap-10">
                          {criteria.map((criterion, idx) => {
                            const cScore = criterion.data!.score ?? 0;
                            const cStatus = getScoreStatus(cScore);
                            return (
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                key={criterion.key}
                                className="group"
                              >
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-indigo-500/20 transition-all duration-300">
                                      {criterion.icon}
                                    </div>
                                    <div>
                                      <h5 className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-wide">{criterion.label}</h5>
                                      <p className={`text-[10px] font-bold ${cStatus.color}`}>{getScoreStatus(cScore).label}</p>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">{Math.round(cScore)}%</div>
                                </div>

                                <div className="ml-16">
                                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${cScore}%` }}
                                      transition={{ duration: 1.2, ease: "circOut" }}
                                      className={`h-full rounded-full ${cStatus.bar} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                    />
                                  </div>
                                  <div className="p-6 rounded-[2rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-300 leading-relaxed group-hover:border-indigo-200 dark:group-hover:border-indigo-900/30 transition-all">
                                    {criterion.data!.comment || 'No specific data found for this category.'}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeTab === 'algorithm' && (
                      <div className="space-y-8">
                        <div className="p-10 rounded-[3rem] bg-indigo-950 text-white relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                            <FiCpu size={300} />
                          </div>

                          <div className="relative z-10 space-y-12">
                            <div>
                              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8">AI Dynamic Weight Balancing</h4>
                              <div className="flex flex-wrap gap-4">
                                {matching.weight_analysis?.dynamic_weights ? (
                                  Object.entries(matching.weight_analysis.dynamic_weights).map(([key, value]) => (
                                    <div key={key} className="px-6 py-4 bg-white/5 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col gap-1 min-w-[140px] hover:bg-white/10 transition-colors">
                                      <span className="text-[9px] font-black text-indigo-300/60 uppercase tracking-widest">{key}</span>
                                      <span className="text-2xl font-black text-white">{((value as number) * 100).toFixed(0)}%</span>
                                    </div>
                                  ))
                                ) : <p className="text-indigo-200/40 italic text-sm">Balanced weighting model applied.</p>}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10 border-t border-white/5 uppercase">
                              <div>
                                <p className="text-[10px] font-black text-indigo-400 tracking-widest mb-3">Model Accuracy</p>
                                <div className="text-6xl font-black text-white flex items-baseline gap-1">
                                  {((matching.weight_analysis?.ai_confidence || 0.88) * 100).toFixed(1)}
                                  <span className="text-2xl text-indigo-400">%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-900 rounded-full mt-6 overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.4)]" style={{ width: `${(matching.weight_analysis?.ai_confidence || 0.88) * 100}%` }} />
                                </div>
                              </div>
                              <div className="p-8 rounded-[2.5rem] bg-indigo-900/30 border border-white/5 flex flex-col justify-center">
                                <p className="text-xs text-indigo-100/70 leading-loose font-medium italic normal-case">
                                  Our AI dynamically assigns weights to JD criteria based on semantic importance. Technical competencies have been given higher priority for this match.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-10 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center grayscale opacity-60">
                          <FiActivity className="text-slate-300 text-3xl animate-pulse" />
                          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Self-Optimization Active</p>
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

function DetailItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-800 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5 tracking-tighter">{label}</p>
        <p className="text-xs font-bold text-slate-700 dark:text-slate-300 break-all leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SectionTitle({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
      <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-indigo-500' })}
        {title}
      </h3>
    </div>
  );
}
