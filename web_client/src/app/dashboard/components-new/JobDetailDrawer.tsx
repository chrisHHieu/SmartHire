"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX, FiCheckCircle, FiBook, FiBriefcase, FiTarget,
  FiClipboard, FiAward, FiGlobe, FiInfo, FiCalendar,
  FiHash, FiFileText, FiZap, FiCpu, FiLayout, FiActivity, FiTerminal,
  FiTrendingUp, FiLayers, FiShield
} from "react-icons/fi";
import { useGlobalContext } from "@/app/context/ContextProvider";

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
    weight_analysis?: {
      reasoning: Record<string, string>;
      confidence: number;
      job_context?: any;
    };
  };
  onClose: () => void;
}

type TabType = 'overview' | 'requirements' | 'competencies' | 'logic';

export default function JobDetailDrawer({ job, onClose }: JobDetailProps) {
  const { language } = useGlobalContext();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  const translations = {
    EN: {
      tabs: {
        overview: "Overview",
        requirements: "Requirements",
        competencies: "Competencies",
        logic: "AI Logic"
      },
      weights: {
        degree: 'Education',
        experience: 'Work Experience',
        technical_skill: 'Technical Skills',
        responsibility: 'Responsibilities',
        certificate: 'Certifications',
        soft_skill: 'Soft Skills',
        language: 'Languages'
      },
      sidebar: {
        analysisTime: "Analysis Timestamp",
        seniority: "Seniority",
        industry: "Industry",
        roleType: "Role Type",
        engine: "SmartHire AI Engine",
        analyzedLevel: "Analyzed Level",
        generalSector: "General Sector",
        dynamicModel: "Dynamic Model"
      },
      overview: {
        title: "Full Description",
        analysisActive: "Deep analysis active",
        noDescription: "No job description text detected.",
        strategyTitle: "AI Strategy Guardrails"
      },
      requirements: {
        education: "Educational Foundation",
        experience: "Work Experience",
        certs: "Official Certifications"
      },
      competencies: {
        technical: "Technical Toolbox",
        responsibilities: "Core Responsibilities",
        humanFactors: "Human Factors",
        communication: "Communication"
      },
      logic: {
        matrixTitle: "AI Weighted Decision Matrix",
        modelHigh: "Model Integrity: High",
        standardWeights: "Standard weight allocation used.",
        successPredictors: "Success Predictors",
        riskFactors: "Risk Factors Identified",
        reasoningLogs: "Strategic Reasoning Logs",
        optimizationLevel: "Dynamic AI Model Optimization Level",
        reasoningSuffix: "Reasoning"
      },
      noSpecific: "System analysis found no specific entries."
    },
    VI: {
      tabs: {
        overview: "Tổng quan",
        requirements: "Yêu cầu",
        competencies: "Năng lực",
        logic: "Phân tích AI"
      },
      weights: {
        degree: 'Học vấn',
        experience: 'Kinh nghiệm',
        technical_skill: 'Kỹ năng chuyên môn',
        responsibility: 'Trách nhiệm',
        certificate: 'Chứng chỉ',
        soft_skill: 'Kỹ năng mềm',
        language: 'Ngôn ngữ'
      },
      sidebar: {
        analysisTime: "Thời điểm phân tích",
        seniority: "Cấp bậc",
        industry: "Ngành nghề",
        roleType: "Loại hình",
        engine: "Hệ thống AI SmartHire",
        analyzedLevel: "Cấp độ đã phân tích",
        generalSector: "Lĩnh vực chung",
        dynamicModel: "Mô hình linh hoạt"
      },
      overview: {
        title: "Mô tả chi tiết",
        analysisActive: "Đang phân tích chuyên sâu",
        noDescription: "Không tìm thấy nội dung mô tả công việc.",
        strategyTitle: "Chiến lược phân tích AI"
      },
      requirements: {
        education: "Nền tảng học vấn",
        experience: "Kinh nghiệm làm việc",
        certs: "Chứng chỉ chuyên môn"
      },
      competencies: {
        technical: "Kỹ năng chuyên môn",
        responsibilities: "Trách nhiệm cốt lõi",
        humanFactors: "Yếu tố con người",
        communication: "Khả năng giao tiếp"
      },
      logic: {
        matrixTitle: "Ma trận trọng số định điểm AI",
        modelHigh: "Độ tin cậy mô hình: Cao",
        standardWeights: "Đang sử dụng phân bổ trọng số tiêu chuẩn.",
        successPredictors: "Chỉ số thành công",
        riskFactors: "Các yếu tố rủi ro",
        reasoningLogs: "Nhật ký suy luận chiến lược",
        optimizationLevel: "Mức độ tối ưu AI linh hoạt",
        reasoningSuffix: "Suy luận"
      },
      noSpecific: "Hệ thống không tìm thấy dữ liệu cụ thể."
    }
  };

  const t = translations[language];

  const tabs = [
    { id: 'overview', label: t.tabs.overview, icon: <FiInfo /> },
    { id: 'requirements', label: t.tabs.requirements, icon: <FiCheckCircle /> },
    { id: 'competencies', label: t.tabs.competencies, icon: <FiTarget /> },
    { id: 'logic', label: t.tabs.logic, icon: <FiCpu /> },
  ];

  const getWeightLabel = (key: string) => {
    return (t.weights as any)[key] || key;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 md:p-10 font-inter text-slate-900 dark:text-white">
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
          className="relative w-full max-w-6xl max-h-[92vh] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Close Button */}
          <div className="absolute top-8 right-8 z-50">
            <button
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 hover:text-rose-600 transition-all duration-300 shadow-sm border border-slate-200 dark:border-slate-800"
            >
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left Sidebar - Job Info */}
            <aside className="w-full md:w-[340px] bg-slate-50/50 dark:bg-slate-900/40 border-r border-slate-100 dark:border-slate-800 p-10 flex flex-col gap-8 overflow-y-auto custom-scrollbar">
              <div className="text-center space-y-6">
                {/* Modern Graphic Instead of Avatar */}
                <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-[2.5rem] blur-2xl animate-pulse" />
                  <div className="relative w-full h-full rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-5xl shadow-2xl shadow-indigo-500/20">
                    <FiBriefcase />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg border-4 border-white dark:border-slate-950">
                    <FiActivity size={18} />
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight px-2 font-jakarta">
                    {job.job_name}
                  </h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                    JD ID: {job._id.slice(-8).toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4 text-left">
                <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-white dark:border-slate-800 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5 font-jakarta">
                    <FiCalendar /> {t.sidebar.analysisTime}
                  </p>
                  <div className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase">
                    {new Date(job.created_at).toLocaleDateString(language === 'VI' ? 'vi-VN' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div className="space-y-4 px-2 tracking-tight">
                  <SidebarItem icon={<FiLayers className="text-indigo-500" />} label={t.sidebar.seniority} value={job.weight_analysis?.job_context?.role_characteristics?.seniority || t.sidebar.analyzedLevel} />
                  <SidebarItem icon={<FiGlobe className="text-blue-500" />} label={t.sidebar.industry} value={job.weight_analysis?.job_context?.industry?.primary || t.sidebar.generalSector} />
                  <SidebarItem icon={<FiShield className="text-rose-500" />} label={t.sidebar.roleType} value={job.weight_analysis?.job_context?.role_characteristics?.type?.replace('_', ' ') || t.sidebar.dynamicModel} />
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between opacity-40">
                  <span className="text-[9px] font-black uppercase tracking-widest">{t.sidebar.engine}</span>
                  <FiCpu className="text-indigo-500 text-lg" />
                </div>
              </div>
            </aside>

            {/* Right Content */}
            <main className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-slate-950">
              {/* Premium Tabs Style */}
              <nav className="px-10 pt-10 flex gap-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl z-20">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center gap-2.5 px-6 pb-6 text-sm font-bold transition-all relative ${activeTab === tab.id
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                      }`}
                  >
                    <span className={`text-lg transition-transform ${activeTab === tab.id ? 'scale-110' : 'opacity-60'}`}>
                      {tab.icon}
                    </span>
                    <span className="tracking-tight">{tab.label}</span>
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTabJobPrimary"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-t-full shadow-[0_-4px_12px_rgba(99,102,241,0.6)]"
                      />
                    )}
                  </button>
                ))}
              </nav>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                  >
                    {activeTab === 'overview' && (
                      <div className="space-y-10">
                        <div className="flex items-center justify-between">
                          <SectionTitle title={t.overview.title} icon={<FiFileText />} />
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-xl text-[9px] font-black uppercase text-slate-400 border border-slate-200 dark:border-slate-800">
                            <FiTrendingUp /> {t.overview.analysisActive}
                          </div>
                        </div>

                        <div className="p-10 rounded-[3.5rem] bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/20 relative overflow-hidden group">
                          <FiBook className="absolute -right-10 -bottom-10 text-[220px] opacity-[0.03] rotate-12 text-indigo-500" />

                          <div className="relative z-10 prose prose-slate dark:prose-invert max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:font-black prose-headings:tracking-tight prose-li:text-base prose-li:font-medium">
                            {job.job_description ? (
                              <div dangerouslySetInnerHTML={{ __html: job.job_description }} />
                            ) : (
                              <div className="py-20 text-center flex flex-col items-center gap-4 opacity-50 font-inter">
                                <FiFileText size={48} className="text-slate-300" />
                                <p className="text-base italic">{t.overview.noDescription}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-10 rounded-[3rem] bg-slate-900 text-white shadow-2xl relative overflow-hidden border border-white/5">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-[80px] rounded-full" />
                          <FiZap className="absolute top-10 right-10 text-indigo-400 opacity-20 text-7xl" />
                          <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mb-4 font-jakarta text-left">{t.overview.strategyTitle}</h5>
                          <p className="text-xl font-medium leading-relaxed italic text-indigo-50/90 relative z-10 text-left">
                            {language === 'VI'
                              ? `"Hệ thống xác định các yêu cầu ngữ nghĩa trong vị trí này. Ưu tiên chấm điểm được điều chỉnh linh hoạt để đảm bảo cả chuyên môn kỹ thuật và sự phù hợp với tổ chức."`
                              : `"The engine identifies semantic requirements in this position. Scoring priority is dynamically adjusted to ensure both technical expertise and organizational alignment."`
                            }
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'requirements' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <SectionBento title={t.requirements.education} icon={<FiBook className="text-emerald-500" />}>
                          <RequirementsList items={job.degree} iconColor="bg-emerald-500" t={t} />
                        </SectionBento>

                        <SectionBento title={t.requirements.experience} icon={<FiBriefcase className="text-amber-500" />}>
                          <RequirementsList items={job.experience} iconColor="bg-amber-500" t={t} />
                        </SectionBento>

                        <div className="lg:col-span-2">
                          <SectionBento title={t.requirements.certs} icon={<FiAward className="text-indigo-500" />}>
                            <div className="flex flex-wrap gap-3">
                              {job.certificate && job.certificate.length > 0 ? (
                                job.certificate.map((cert, i) => (
                                  <div key={i} className="px-5 py-3 bg-gradient-to-tr from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950/20 border border-indigo-100 dark:border-indigo-800 rounded-[1.2rem] text-sm font-bold text-indigo-700 dark:text-indigo-300 shadow-sm transition-all hover:bg-indigo-100 dark:hover:bg-indigo-900">
                                    {cert}
                                  </div>
                                ))
                              ) : <EmptyRequirement t={t} />}
                            </div>
                          </SectionBento>
                        </div>
                      </div>
                    )}

                    {activeTab === 'competencies' && (
                      <div className="space-y-12">
                        <SectionDetailed title={t.competencies.technical} icon={<FiTerminal />}>
                          <div className="flex flex-wrap gap-3">
                            {job.technical_skill && job.technical_skill.length > 0 ? (
                              job.technical_skill.map((skill, i) => (
                                <span key={i} className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.2rem] text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform cursor-pointer shadow-lg shadow-indigo-500/10">
                                  {skill}
                                </span>
                              ))
                            ) : <EmptyRequirement t={t} />}
                          </div>
                        </SectionDetailed>

                        <SectionDetailed title={t.competencies.responsibilities} icon={<FiClipboard />}>
                          <div className="grid grid-cols-1 gap-5">
                            {job.responsibility && job.responsibility.length > 0 ? (
                              job.responsibility.map((item, i) => (
                                <div key={i} className="p-6 rounded-[2.5rem] bg-slate-50/50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 flex items-start gap-5 group hover:border-indigo-200 dark:hover:border-indigo-900 transition-all font-inter">
                                  <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 group-hover:scale-125 transition-transform" />
                                  <p className="text-[15px] font-medium text-slate-700 dark:text-slate-300 leading-relaxed text-left">{item}</p>
                                </div>
                              ))
                            ) : <EmptyRequirement t={t} />}
                          </div>
                        </SectionDetailed>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                          <SectionBento title={t.competencies.humanFactors} icon={<FiTarget className="text-rose-500" />}>
                            <div className="flex flex-wrap gap-2.5">
                              {job.soft_skill && job.soft_skill.length > 0 ? (
                                job.soft_skill.map((skill, i) => (
                                  <span key={i} className="px-4 py-2 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 rounded-2xl text-[11px] font-black uppercase border border-rose-100 dark:border-rose-900/50">
                                    {skill}
                                  </span>
                                ))
                              ) : <EmptyRequirement t={t} />}
                            </div>
                          </SectionBento>

                          <SectionBento title={t.competencies.communication} icon={<FiGlobe className="text-blue-400" />}>
                            <div className="flex flex-wrap gap-2.5">
                              {job.language && job.language.length > 0 ? (
                                job.language.map((lang, i) => (
                                  <span key={i} className="px-4 py-2 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 rounded-2xl text-[11px] font-black uppercase border border-blue-100 dark:border-blue-900/50">
                                    {lang}
                                  </span>
                                ))
                              ) : <EmptyRequirement t={t} />}
                            </div>
                          </SectionBento>
                        </div>
                      </div>
                    )}

                    {activeTab === 'logic' && (
                      <div className="space-y-10 pb-10">
                        <div className="p-10 rounded-[3.5rem] bg-indigo-950 text-white relative overflow-hidden shadow-2xl">
                          <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                            <FiCpu size={280} />
                          </div>

                          <div className="relative z-10 space-y-12">
                            <div>
                              <div className="flex items-center justify-between mb-8">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{t.logic.matrixTitle}</h4>
                                <div className="text-[10px] font-black text-indigo-300 uppercase px-3 py-1 bg-white/5 rounded-lg border border-white/5 font-mono">
                                  {t.logic.modelHigh}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {job.dynamic_weights ? (
                                  Object.entries(job.dynamic_weights).map(([key, value]) => {
                                    const weightVal = (value as number) * 100;
                                    return (
                                      <div key={key} className="p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl group hover:bg-white/10 transition-colors">
                                        <div className="flex justify-between items-end mb-2">
                                          <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest leading-none font-jakarta">{getWeightLabel(key)}</span>
                                          <span className="text-xl font-black text-white leading-none font-mono">{weightVal.toFixed(0)}%</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${weightVal}%` }}
                                            className="h-full bg-indigo-400 shadow-[0_0_10px_rgba(129,140,248,0.5)]"
                                          />
                                        </div>
                                      </div>
                                    )
                                  })
                                ) : <p className="text-indigo-200/40 italic text-sm col-span-full">{t.logic.standardWeights}</p>}
                              </div>
                            </div>

                            {/* Analysis Meta-Logs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-white/5 pt-10">
                              <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em]">{t.logic.successPredictors}</h4>
                                <div className="space-y-3">
                                  {job.weight_analysis?.job_context?.success_predictors?.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-emerald-100/70">
                                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-rose-400 uppercase tracking-[0.4em]">{t.logic.riskFactors}</h4>
                                <div className="space-y-3">
                                  {job.weight_analysis?.job_context?.risk_factors?.map((item: string, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-rose-100/70">
                                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]" />
                                      {item}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {job.weight_analysis?.reasoning && (
                              <div className="space-y-6 pt-10 border-t border-white/5 text-left">
                                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{t.logic.reasoningLogs}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {Object.entries(job.weight_analysis.reasoning).map(([key, reason]) => (
                                    <div key={key} className="flex gap-4 p-5 rounded-2xl bg-indigo-900/40 border border-white/5 transition-all hover:bg-indigo-900/60">
                                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 shrink-0 border border-indigo-500/20">
                                        <FiInfo size={14} />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{getWeightLabel(key)} {t.logic.reasoningSuffix}</p>
                                        <p className="text-xs text-indigo-50/80 leading-relaxed font-medium italic">
                                          "{reason}"
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-10 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-4 text-center grayscale opacity-40">
                          <FiZap className="text-slate-300 text-4xl" />
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest font-mono">{t.logic.optimizationLevel}: {((job.weight_analysis?.confidence || 0.9) * 100).toFixed(0)}/100</p>
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

function SidebarItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-[1rem] bg-white dark:bg-slate-800 flex items-center justify-center text-indigo-500 shadow-sm border border-slate-100 dark:border-slate-800 flex-shrink-0">
        {icon}
      </div>
      <div className="pt-0.5">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1 font-jakarta">{label}</p>
        <p className="text-[13px] font-black text-slate-700 dark:text-slate-200 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function SectionBento({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="p-8 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm space-y-6 transition-all hover:shadow-xl hover:shadow-indigo-500/5 group text-left">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-[1.2rem] bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
          {icon}
        </div>
        <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">{title}</h4>
      </div>
      <div className="px-2">{children}</div>
    </div>
  );
}

function SectionDetailed({ title, icon, children }: { title: string, icon: React.ReactNode, children: React.ReactNode }) {
  return (
    <div className="space-y-8 text-left">
      <div className="flex items-center gap-4">
        <div className="w-2 h-8 bg-indigo-500 rounded-full" />
        <h3 className="flex items-center gap-3 text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase font-jakarta">
          <span className="text-indigo-500 scale-125">{icon}</span>
          {title}
        </h3>
      </div>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function SectionTitle({ title, icon }: { title: string, icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 text-left">
      <div className="w-1.5 h-6 bg-indigo-500 rounded-full" />
      <h3 className="flex items-center gap-2 text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none uppercase font-jakarta">
        {React.cloneElement(icon as React.ReactElement, { className: 'text-indigo-500' })}
        {title}
      </h3>
    </div>
  );
}

function RequirementsList({ items, iconColor, t }: { items?: string[], iconColor: string, t: any }) {
  if (!items || items.length === 0) return <EmptyRequirement t={t} />;
  return (
    <div className="space-y-4 text-left">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-4">
          <div className={`mt-1.5 w-2 h-2 rounded-full ${iconColor} shrink-0 ring-4 ${iconColor.replace('bg-', 'ring-')}/20`} />
          <span className="text-[15px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed font-inter">{item}</span>
        </div>
      ))}
    </div>
  );
}

function EmptyRequirement({ t }: { t: any }) {
  return <p className="text-sm italic text-slate-400 font-medium py-2 text-left">{t.noSpecific}</p>;
}
