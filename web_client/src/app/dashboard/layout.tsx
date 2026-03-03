"use client";
import React, { PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiBell, FiPlus, FiCommand, FiHome, FiUsers, FiFilter, FiSun, FiMoon, FiZap } from "react-icons/fi";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Link from "next/link";
import { useGlobalContext } from "@/app/context/ContextProvider";

const DashboardLayoutNew = (props: PropsWithChildren) => {
  const pathname = usePathname();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const { isDarkMode, toggleDarkMode, language, setLanguage } = useGlobalContext();

  const translations = {
    EN: {
      jobs: "Jobs",
      candidates: "Candidates",
      matching: "Matching",
      aiSmartHire: "AI Smart Hire",
      management: "Management",
      tools: "Tools",
      notifications: "Notifications",
      search: "Search anything...",
      systemAdmin: "System Admin",
      liveSession: "Live Session",
      light: "LIGHT",
      dark: "DARK",
      systemOnline: "System Online"
    },
    VI: {
      jobs: "Vị trí tuyển dụng",
      candidates: "Danh sách ứng viên",
      matching: "Phân tích phù hợp",
      aiSmartHire: "Trợ lý Tuyển dụng AI",
      management: "QUẢN LÝ",
      tools: "HỆ THỐNG",
      notifications: "Thông báo",
      search: "Tìm kiếm nhanh...",
      systemAdmin: "Quản trị viên",
      liveSession: "Phiên làm việc",
      light: "SÁNG",
      dark: "TỐI",
      systemOnline: "Trực tuyến"
    }
  };

  const t = translations[language];

  const navItems = [
    { href: "/dashboard/jobs", label: t.jobs, icon: <FiHome className="text-lg" /> },
    { href: "/dashboard/candidates", label: t.candidates, icon: <FiUsers className="text-lg" /> },
    { href: "/dashboard/matching", label: t.matching, icon: <FiFilter className="text-lg" /> },
    { href: "/dashboard/chat", label: t.aiSmartHire, icon: <FiZap className="text-lg" /> },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className={`flex h-screen overflow-hidden font-inter ${isDarkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className="w-[280px] flex flex-col bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-r border-slate-200 dark:border-slate-800 h-full flex-shrink-0 transition-all duration-500 z-20 overflow-hidden relative group/side">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-40">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]" />
          <div className="absolute top-[60%] -right-[10%] w-[30%] h-[30%] bg-violet-600 rounded-full blur-[80px]" />
        </div>

        {/* Brand Logo Section */}
        <div className="px-7 py-10 flex items-center relative z-10">
          <Link href="/dashboard/jobs" className="flex items-center gap-3.5 no-underline group hover:no-underline">
            <div className="relative">
              <div className="w-11 h-11 bg-indigo-600 dark:bg-gradient-to-tr dark:from-indigo-600 dark:to-violet-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ease-out">
                <FiZap className="text-white w-6 h-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full shadow-sm animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] font-black tracking-tighter text-indigo-700 dark:text-white leading-none">
                SmartHire
              </span>
              <span className="text-[10px] font-black text-slate-500 dark:text-indigo-400 uppercase tracking-[0.25em] leading-none mt-2 ml-0.5">
                AI RECRUITMENT
              </span>
            </div>
          </Link>
        </div>

        {/* Command Search */}
        <div className="px-5 mb-8 relative z-10">
          <button
            onClick={() => setShowCommandPalette(true)}
            className="w-full flex items-center relative group/search p-[1px] rounded-2xl bg-slate-300 dark:bg-slate-800 hover:bg-indigo-400 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm"
          >
            <div className="w-full h-11 bg-slate-100 dark:bg-slate-950/40 rounded-[15px] flex items-center px-4 gap-3 backdrop-blur-md border border-slate-200 dark:border-transparent group-hover/search:border-indigo-300 dark:group-hover/search:border-indigo-500 transition-all">
              <FiSearch className="text-slate-500 dark:text-slate-400 group-hover/search:text-indigo-600 transition-colors w-4 h-4" />
              <span className="text-[13px] font-semibold text-slate-700 dark:text-slate-400 flex-1 text-left">{t.search}</span>
              <div className="flex items-center gap-1 opacity-70 group-hover/search:opacity-100 transition-opacity">
                <kbd className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm transition-transform group-hover/search:-translate-y-0.5">⌘</kbd>
                <kbd className="text-[9px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 shadow-sm transition-transform group-hover/search:-translate-y-0.5">K</kbd>
              </div>
            </div>
          </button>
        </div>

        {/* Navigation Categories */}
        <div className="flex-1 px-5 space-y-9 overflow-y-auto no-scrollbar relative z-10 pt-2">
          <section>
            <div className="px-4 mb-4 flex items-center justify-between">
              <p className="text-[11px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-[0.2em]">{t.management}</p>
              <div className="h-[1px] flex-1 ml-4 bg-slate-300 dark:bg-slate-800 opacity-80" />
            </div>

            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[14px] font-extrabold transition-all duration-300 no-underline group/item
                      ${active
                        ? "text-white bg-indigo-600 shadow-lg shadow-indigo-500/25"
                        : "text-slate-800 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800/80 hover:text-indigo-600 dark:hover:text-white hover:pl-5 shadow-indigo-500/5 hover:shadow-xl"
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl hidden md:block"
                        initial={false}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <div className="relative flex items-center gap-3.5 w-full">
                      <div className={`
                        w-6 h-6 flex items-center justify-center transition-all duration-300
                        ${active ? "text-white" : "text-slate-500 group-hover/item:text-indigo-600 group-hover/item:scale-110 group-hover/item:rotate-3"}
                      `}>
                        {item.icon}
                      </div>
                      <span className="flex-1">{item.label}</span>
                      {active ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                      ) : (
                        <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-700 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </section>

          <section>
            <div className="px-4 mb-4 flex items-center justify-between opacity-80">
              <p className="text-[10px] font-black text-slate-500 dark:text-slate-500 uppercase tracking-[0.2em]">{t.tools}</p>
              <div className="h-[1px] flex-1 ml-4 bg-slate-300 dark:bg-slate-800" />
            </div>
            <nav className="space-y-1">
              <button className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-[13px] font-bold text-slate-600 dark:text-slate-500 hover:bg-white dark:hover:bg-slate-800 hover:text-indigo-600 transition-all group">
                <div className="w-6 h-6 flex items-center justify-center group-hover:text-indigo-600 transition-colors"><FiBell /></div>
                <span>{t.notifications}</span>
                <div className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">3</div>
              </button>
            </nav>
          </section>
        </div>

        {/* Enhanced Bottom Profile Section */}
        <div className="p-5 mt-auto relative z-10">
          <div className="mb-4 space-y-3">
            <div className="p-3.5 bg-white/60 dark:bg-slate-800/40 rounded-3xl border border-slate-300 dark:border-slate-800 transition-all duration-300 group/profile cursor-pointer hover:border-indigo-400/50 hover:shadow-xl hover:shadow-indigo-500/5">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center shadow-inner overflow-hidden border border-slate-300 dark:border-slate-700 group-hover/profile:border-indigo-500/30 transition-colors">
                    <FiUsers className="w-6 h-6 text-slate-500 group-hover/profile:text-indigo-600 transition-all duration-300" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-lg" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-black text-slate-900 dark:text-white leading-none truncate">{t.systemAdmin}</span>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-500 mt-1.5 flex items-center gap-1.5 uppercase tracking-tighter">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t.liveSession}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleDarkMode}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all shadow-sm group/theme"
            >
              {isDarkMode ? (
                <><FiMoon className="text-indigo-400 w-4 h-4 group-hover/theme:rotate-[15deg] transition-transform" /><span className="text-[11px] font-bold text-slate-400 tracking-wider font-inter">{t.dark}</span></>
              ) : (
                <><FiSun className="text-amber-500 w-4 h-4 group-hover/theme:rotate-90 transition-transform duration-500" /><span className="text-[11px] font-bold text-slate-700 tracking-wider font-inter">{t.light}</span></>
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setLanguage(language === 'EN' ? 'VI' : 'EN');
              }}
              className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-600 dark:hover:border-indigo-500 transition-all shadow-sm text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter"
            >
              {language}
            </button>
            <button className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all shadow-sm text-slate-400 hover:text-indigo-600">
              <FiPlus className="rotate-45" />
            </button>
          </div>
        </div>
      </aside>



      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
        {/* We can keep a subtle header area here if needed inside main, but let's stick to content */}
        <div className="p-6 md:p-8">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {props.children}
          </motion.div>
        </div>
      </main>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {showCommandPalette && (
          <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCommandPalette(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Same command palette content as before */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 bg-white dark:bg-slate-900">
                <FiSearch className="text-xl text-slate-400" />
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  autoFocus
                  className="w-full text-lg font-medium text-slate-900 dark:text-white bg-transparent outline-none placeholder:text-slate-400"
                />
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Esc
                </div>
              </div>

              <div className="bg-slate-50/50 dark:bg-slate-900 p-2 max-h-[400px] overflow-y-auto">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Quick Actions
                </div>
                {[
                  { icon: <FiPlus />, label: 'Create New Job', shortcut: '⌘ + J', color: 'text-indigo-600' },
                  { icon: <FiUsers />, label: 'Upload Candidate CV', shortcut: '⌘ + U', color: 'text-emerald-600' },
                  { icon: <FiFilter />, label: 'Run Matching Analysis', shortcut: '⌘ + M', color: 'text-amber-600' },
                ].map((cmd, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm border border-transparent hover:border-slate-100 dark:hover:border-slate-700 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm text-lg ${cmd.color}`}>
                        {cmd.icon}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{cmd.label}</span>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                      {cmd.shortcut}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? "dark" : "light"}
      />
    </div>
  );
};

export default DashboardLayoutNew;
