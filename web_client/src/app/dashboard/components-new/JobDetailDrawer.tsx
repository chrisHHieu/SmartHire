"use client";
import React from "react";
import { motion } from "framer-motion";
import { FiX, FiCheckCircle, FiBook, FiBriefcase, FiTarget, FiClipboard, FiAward, FiGlobe } from "react-icons/fi";

interface JobDetailProps {
  job: {
    _id: string;
    job_name: string;
    job_description?: string;
    degree?: string[];
    experience?: string[];
    technical_skill?: string[];
    responsibility?: string[];
    soft_skill?: string[];
    certificate?: string[];
    language?: string[];
    created_at: string;
    dynamic_weights?: any;
    weight_analysis?: any;
  };
  onClose: () => void;
}

export default function JobDetailDrawer({ job, onClose }: JobDetailProps) {
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
              Chi Tiết Phân Tích Công Việc
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Job ID:</span>
              <span className="text-[11px] font-mono text-slate-500 uppercase">{job._id.slice(-8)}</span>
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
          {/* Job Name Card */}
          <section className="p-8 rounded-3xl border border-indigo-100 dark:border-slate-800 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-900 relative overflow-hidden group">
            <div className="flex items-start gap-6 relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm flex-shrink-0">
                <FiBriefcase className="text-3xl" />
              </div>
              <div className="flex-1 text-slate-700 dark:text-slate-300 text-sm space-y-2">
                <div className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-1">
                  Tên Vị Trí
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2 leading-none font-jakarta">
                  {job.job_name}
                </h3>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-indigo-200/50 dark:border-slate-700/50 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>Ngày tạo: {new Date(job.created_at).toLocaleDateString('vi-VN')}</span>
            </div>
          </section>

          {/* Học Vấn */}
          <Section title="Học Vấn" icon={<FiBook className="text-emerald-500" />}>
            {job.degree && job.degree.length > 0 ? (
              <div className="space-y-3">
                {job.degree.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Kinh Nghiệm */}
          <Section title="Kinh Nghiệm" icon={<FiBriefcase className="text-amber-500" />}>
            {job.experience && job.experience.length > 0 ? (
              <div className="space-y-3">
                {job.experience.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Kỹ Năng Chuyên Môn */}
          <Section title="Kỹ Năng Chuyên Môn" icon={<FiTarget className="text-rose-500" />}>
            {job.technical_skill && job.technical_skill.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.technical_skill.map((skill, i) => (
                  <span key={i} className="badge bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 px-3 py-1.5 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Trách Nhiệm */}
          <Section title="Trách Nhiệm" icon={<FiClipboard className="text-indigo-500" />}>
            {job.responsibility && job.responsibility.length > 0 ? (
              <div className="space-y-3">
                {job.responsibility.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Kỹ Năng Mềm */}
          <Section title="Kỹ Năng Mềm" icon={<FiTarget className="text-purple-500" />}>
            {job.soft_skill && job.soft_skill.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {job.soft_skill.map((skill, i) => (
                  <span key={i} className="badge bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-100 dark:border-purple-800/50 px-3 py-1.5 rounded-xl text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Chứng Chỉ */}
          <Section title="Chứng Chỉ" icon={<FiAward className="text-cyan-500" />}>
            {job.certificate && job.certificate.length > 0 ? (
              <div className="space-y-3">
                {job.certificate.map((item, i) => (
                  <div key={i} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState text="Không có yêu cầu" />
            )}
          </Section>

          {/* Ngôn Ngữ */}
          {job.language && job.language.length > 0 && (
            <Section title="Ngôn Ngữ" icon={<FiGlobe className="text-teal-500" />}>
              <div className="flex flex-wrap gap-2">
                {job.language.map((lang, i) => (
                  <span key={i} className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl text-sm font-medium">
                    {lang}
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

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-6 bg-slate-50 dark:bg-[#1A2652]/30 dark:border-[#1A2652] rounded-2xl border border-slate-100 border-dashed text-center text-sm text-slate-400 dark:text-slate-500 italic">
      {text}
    </div>
  );
}
