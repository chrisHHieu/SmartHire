"use client";
import React, { PropsWithChildren, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiBell, FiPlus, FiCommand, FiHome, FiUsers, FiFilter, FiSun, FiMoon } from "react-icons/fi";
import "./globals.css";

const DashboardLayoutNew = (props: PropsWithChildren) => {
  const pathname = usePathname();
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage on mount
  React.useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else if (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setIsDarkMode(true);
    }
  }, []);

  // Update localStorage and document class when theme changes
  React.useEffect(() => {
    if (isDarkMode) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const navItems = [
    { href: "/dashboard/jobs", label: "Jobs", icon: <FiHome /> },
    { href: "/dashboard/candidates", label: "Candidates", icon: <FiUsers /> },
    { href: "/dashboard/matching", label: "Matching", icon: <FiFilter /> },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <div className={`min-h-screen font-inter ${isDarkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        {/* Top App Bar - Refined Glassmorphism */}
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-2rem)] max-w-7xl">
          <nav className="glass rounded-[20px] px-6 py-3 flex items-center justify-between shadow-xl border-white/50">
            {/* Left: Logo & Navigation */}
            <div className="flex items-center gap-10">
              <a href="/dashboard/jobs" className="flex items-center gap-3 no-underline group">
                <div className="relative w-10 h-10 rounded-xl bg-slate-900 dark:bg-indigo-500 flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-105 overflow-hidden">
                  <svg className="w-5 h-5 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {/* Candidate / Human silhouette */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    {/* AI Sparkles / Magic Stars */}
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 2l1 2.5 2.5 1-2.5 1L19 9l-1-2.5-2.5-1 2.5-1L19 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-jakarta">
                  SmartHire<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">.</span>
                </span>
              </a>

              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 no-underline
                    ${isActive(item.href)
                        ? "bg-slate-900 text-white shadow-lg"
                        : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"}
                  `}
                  >
                    <span className="text-lg opacity-80">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              {/* Search Trigger */}
              <button
                onClick={() => setShowCommandPalette(true)}
                className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100 hover:bg-slate-200/70 border border-slate-200 rounded-xl transition-all duration-200 group"
              >
                <FiSearch className="text-slate-500 group-hover:text-slate-900" />
                <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Search...</span>
                <kbd className="hidden xl:inline-flex h-5 items-center gap-1 rounded border border-white bg-white px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

              <div className="h-8 w-[1px] bg-slate-200 mx-2 hidden sm:block" />

              {/* Quick Actions */}
              <button className="btn btn-primary shadow-indigo-200 hidden sm:flex">
                <FiPlus />
                <span>New Job</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group overflow-hidden"
              >
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.div
                    animate={{ y: isDarkMode ? 40 : 0, opacity: isDarkMode ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <FiSun className="text-xl text-amber-500" />
                  </motion.div>
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: isDarkMode ? 0 : -40, opacity: isDarkMode ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute"
                  >
                    <FiMoon className="text-xl text-indigo-400" />
                  </motion.div>
                </div>
              </button>

              {/* Notifications */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors group">
                <FiBell className="text-xl text-slate-600 group-hover:text-indigo-600" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>

              {/* Profile */}
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm hover:scale-105 transition-transform shadow-lg shadow-slate-200">
                AD
              </button>
            </div>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="pt-28 pb-12 px-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            {props.children}
          </motion.div>
        </main>

        {/* Command Palette - Animated Modal */}
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

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
              >
                <div className="p-4 border-bottom border-slate-100 flex items-center gap-3">
                  <FiSearch className="text-xl text-slate-400" />
                  <input
                    type="text"
                    placeholder="Type a command or search..."
                    autoFocus
                    className="w-full text-lg font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Esc
                  </div>
                </div>

                <div className="bg-slate-50/50 p-2 max-h-[400px] overflow-y-auto">
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
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-white shadow-sm text-lg ${cmd.color}`}>
                          {cmd.icon}
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-slate-900">{cmd.label}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                        {cmd.shortcut}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-3 border-t border-slate-100 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] text-slate-400">
                    <span className="flex items-center gap-1"><FiCommand /> Search</span>
                    <span className="flex items-center gap-1">↑↓ Navigate</span>
                  </div>
                  <div className="text-[10px] text-slate-400 italic">
                    Powered by SmartHire AI
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayoutNew;
