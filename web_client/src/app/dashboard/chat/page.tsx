"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
    FiSend,
    FiZap,
    FiUser,
    FiCpu,
    FiLayout,
} from "react-icons/fi";
import { useGlobalContext } from "@/app/context/ContextProvider";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

const ChatPage = () => {
    const { language } = useGlobalContext();
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const translations = {
        EN: {
            welcome: "I'm your **SmartHire AI Assistant**. I can see the data on this page and help you with complex actions like:\n\n*   **Summarizing** candidate profiles.\n*   **Comparing** top matches.\n*   **Drafting** outreach emails.\n\nHow can I help you today?",
            deepContext: "Deep Context Active",
            placeholder: "Ask about candidates or jobs...",
            poweredBy: "Powered by SmartHire Pro AI",
            suggestions: {
                analyze: "Analyze Matching",
                compare: "Compare Top 3"
            }
        },
        VI: {
            welcome: "Tôi là **Trợ lý AI SmartHire**. Tôi có thể phân tích dữ liệu trên trang này và giúp bạn thực hiện các tác vụ phức tạp như:\n\n*   **Tóm tắt** hồ sơ ứng viên.\n*   **So sánh** các ứng viên tiềm năng.\n*   **Soạn thảo** email liên hệ.\n\nTôi có thể giúp gì cho bạn hôm nay?",
            deepContext: "Đang phân tích ngữ cảnh",
            placeholder: "Hỏi về ứng viên hoặc vị trí công việc...",
            poweredBy: "Cung cấp bởi SmartHire Pro AI",
            suggestions: {
                analyze: "Phân tích phù hợp",
                compare: "So sánh Top 3"
            }
        }
    };

    const t = translations[language];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            role: "assistant",
            content: t.welcome,
            timestamp: new Date(),
        },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSend = () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: language === 'VI'
                    ? `Dựa trên mô tả công việc **React Developer**, đây là so sánh nhanh giữa 2 ứng viên hàng đầu:\n\n| Ứng viên | Độ phù hợp | Kinh nghiệm | Đề xuất |\n| :--- | :--- | :--- | :--- |\n| **Trần Văn A** | 95% (React, TS) | 5 năm | Ưu tiên tuyển |\n| **Lê Thị B** | 82% (Vue, JS) | 3 năm | Cân nhắc |\n\nBạn có muốn tôi lập **Bảng phân tích lỗ hổng kỹ năng** cho Lê Thị B không?`
                    : `Based on the **React Developer** JD, here is a quick comparison of the top 2 candidates:\n\n| Candidate | Skills Match | Experience | Recommendation |\n| :--- | :--- | :--- | :--- |\n| **John Doe** | 95% (React, TS) | 5 years | Strong Hire |\n| **Jane Smith** | 82% (Vue, JS) | 3 years | Consider |\n\nWould you like me to generate a **Skill Gap Analysis** for Jane Smith?`,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const suggestions = [
        { label: t.suggestions.analyze, icon: <FiLayout className="text-amber-400" /> },
        { label: t.suggestions.compare, icon: <FiCpu className="text-indigo-400" /> },
    ];

    const handleSuggestionClick = (label: string) => {
        setInputValue(label);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                        <FiZap size={20} />
                    </div>
                    <div>
                        <h1 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider leading-none mb-1">
                            SmartHire AI
                        </h1>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                                {t.deepContext}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth custom-scrollbar"
            >
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                            <div
                                className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${msg.role === "assistant"
                                    ? "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                                    : "bg-slate-900 dark:bg-indigo-600 text-white"
                                    }`}
                            >
                                {msg.role === "assistant" ? <FiCpu size={20} /> : <FiUser size={20} />}
                            </div>
                            <div
                                className={`relative p-5 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                    ? "bg-slate-900 dark:bg-indigo-600 text-white rounded-tr-none shadow-md"
                                    : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm"
                                    }`}
                            >
                                <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        rehypePlugins={[rehypeRaw]}
                                        components={{
                                            p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                                            table: ({ node, ...props }) => (
                                                <div className="overflow-x-auto my-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                                                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => <thead className="bg-slate-50 dark:bg-slate-800/50" {...props} />,
                                            th: ({ node, ...props }) => <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider" {...props} />,
                                            td: ({ node, ...props }) => <td className="px-4 py-3 text-sm border-t border-slate-100 dark:border-slate-800" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="font-bold text-indigo-600 dark:text-indigo-400" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 mb-4" {...props} />,
                                            li: ({ node, ...props }) => <li className="text-slate-600 dark:text-slate-300" {...props} />,
                                        }}
                                    >
                                        {msg.content}
                                    </ReactMarkdown>
                                </div>
                                <span className={`text-[10px] mt-3 block opacity-40 font-medium ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex gap-4 max-w-[85%]">
                            <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400">
                                <FiCpu size={20} />
                            </div>
                            <div className="relative p-5 rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-1.5 h-14">
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                                <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Footer Area */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                {/* Suggestions */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => handleSuggestionClick(s.label)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all flex items-center gap-2 shadow-sm"
                        >
                            {s.icon}
                            {s.label}
                        </button>
                    ))}
                </div>

                {/* Input Box */}
                <div className="relative group flex items-end gap-3 outline-none">
                    <textarea
                        rows={1}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder={t.placeholder}
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-5 py-4 pr-14 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none shadow-sm min-h-[56px] max-h-[150px]"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputValue.trim() || isTyping}
                        className="absolute right-2 bottom-2 w-10 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all active:scale-90 shadow-md"
                    >
                        <FiSend size={18} />
                    </button>
                </div>
                <div className="mt-3 text-center">
                    <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                        {t.poweredBy}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
