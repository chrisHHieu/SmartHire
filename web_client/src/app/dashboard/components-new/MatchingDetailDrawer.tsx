"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  FiX,
  FiCpu,
  FiBriefcase,
  FiTarget,
  FiAward,
  FiTerminal,
  FiBook,
  FiGlobe,
  FiCheckCircle,
  FiInfo,
  FiZap
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

export default function MatchingDetailDrawer({ matching, onClose }: MatchingDetailProps) {
  const score = matching.score ?? 0;

  const getScoreStatus = (val: number) => {
    if (val >= 80) return { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', bar: 'bg-emerald-500' };
    if (val >= 60) return { label: 'Good Match', color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', bar: 'bg-indigo-500' };
    if (val >= 40) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', bar: 'bg-amber-500' };
    return { label: 'Weak Match', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', bar: 'bg-rose-500' };
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

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[150]"
      />

      {/* Drawer */}
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
              Analysis Results
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Match Report ID:</span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">{matching._id.slice(-8)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <FiX className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar">

          {/* Hero Overall Score */}
          <section className={`p-8 rounded-3xl border ${status.border} ${status.bg} relative overflow-hidden group`}>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  {/* Flat Circular Visualization Placeholder */}
                  <div className="w-24 h-24 rounded-full border-[6px] border-white dark:border-slate-800 flex items-center justify-center bg-white dark:bg-slate-900 shadow-sm ring-4 ring-slate-100 dark:ring-slate-700/50">
                    <span className={`text-3xl font-black ${status.color}`}>
                      {Math.round(score)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className={`text-[11px] font-bold uppercase tracking-[0.2em] mb-1 ${status.color} opacity-70`}>
                    Overall Matching Score
                  </div>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-none font-jakarta">
                    {status.label}
                  </h4>
                  <p className="text-sm text-slate-500 mt-2 font-medium">AI Analysis confident score</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur px-4 py-3 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Applying For</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <FiBriefcase className="text-indigo-500" />
                    {matching.job_name || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
            {/* Background Accent */}
            <FiZap className={`absolute -right-8 -bottom-8 text-[160px] opacity-[0.03] rotate-12 ${status.color}`} />
          </section>

          {/* Candidate Profile Info */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate Profile</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">Name</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">{matching.candidate_name || 'N/A'}</div>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-400 uppercase mb-2">Contact</div>
                <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{matching.email || 'N/A'}</div>
                <div className="text-xs text-slate-500 mt-1">{matching.phone_number || 'N/A'}</div>
              </div>
            </div>
          </section>

          {/* Overview Comment */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">AI Executive Summary</h5>
            </div>
            <div className="p-6 bg-slate-900 rounded-3xl text-slate-300 relative overflow-hidden">
              <FiInfo className="absolute top-4 right-4 text-slate-700 text-6xl opacity-20" />
              <p className="text-[15px] leading-relaxed relative z-10 italic">
                "{matching.summary_comment || 'No summary available.'}"
              </p>
            </div>
          </section>

          {/* Detailed Breakdown */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1 h-4 bg-indigo-500 rounded-full" />
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">In-depth Analysis</h5>
            </div>
            <div className="space-y-6">
              {criteria.map((criterion, idx) => {
                const cStatus = getScoreStatus(criterion.data!.score ?? 0);
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={criterion.key}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg text-slate-500 dark:text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          {criterion.icon}
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight">
                          {criterion.label}
                        </span>
                      </div>
                      <div className={`text-base font-black ${cStatus.color}`}>
                        {Math.round(criterion.data!.score ?? 0)}%
                      </div>
                    </div>

                    <div className="pl-[52px]">
                      <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${criterion.data!.score ?? 0}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${cStatus.bar}`}
                        />
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm italic text-slate-600 dark:text-slate-400 leading-relaxed group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                        {criterion.data!.comment || 'No detailed feedback.'}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* AI Confidence & Weights */}
          {matching.weight_analysis && (
            <section className="p-8 bg-indigo-900 rounded-[32px] text-white">
              <div className="flex items-center gap-2 mb-6">
                <FiCpu className="text-indigo-300 text-xl" />
                <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-[0.2em]">Algorithm Insights</h5>
              </div>

              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="text-[10px] font-bold text-indigo-300 uppercase mb-2">System Confidence</div>
                  <div className="text-4xl font-black">
                    {(matching.weight_analysis.ai_confidence * 100).toFixed(1)}%
                  </div>
                  <div className="h-1.5 w-full bg-indigo-950/50 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-indigo-400" style={{ width: `${matching.weight_analysis.ai_confidence * 100}%` }} />
                  </div>
                </div>

                {matching.weight_analysis.dynamic_weights && (
                  <div className="flex-[1.5]">
                    <div className="text-[10px] font-bold text-indigo-300 uppercase mb-4">Criteria Weighting</div>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(matching.weight_analysis.dynamic_weights).map(([key, value]) => (
                        <div key={key} className="px-3 py-1.5 bg-indigo-800/50 border border-indigo-700/50 rounded-xl text-[11px] font-bold flex items-center gap-2">
                          <span className="text-indigo-300 opacity-60 uppercase tracking-tighter">{key}</span>
                          <span className="text-indigo-100">{((value as number) * 100).toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
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
