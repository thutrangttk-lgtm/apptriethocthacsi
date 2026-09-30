"use client";

import React, { useState } from 'react';
import { Home, BookOpen, Brain, FileText, GraduationCap, Award, Lock, ShieldCheck, Sparkles, Map } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isClosedBookMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        {/* Top Learner Identity Bar with Google Color Accents */}
        <div className="bg-slate-900 text-white px-4 py-2 border-b border-slate-800 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-row justify-between items-center text-xs gap-2">
            <div className="flex items-center space-x-2 font-bold">
              <span className="bg-[#FBBC04] text-slate-950 font-black px-2.5 py-0.5 rounded-full text-[10px] tracking-wide shadow-2xs">
                THẠC SĨ
              </span>
              <span className="tracking-wide text-slate-200 hidden sm:inline">
                Hệ thống Học tập Triết học Nguồn A
              </span>
            </div>

            {/* Learner Identity */}
            <div className="flex items-center space-x-2.5 bg-slate-800/90 px-3 py-1 rounded-full border border-slate-700 shadow-xs">
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#4285F4] to-[#34A853] overflow-hidden flex items-center justify-center font-black text-[10px] text-white shrink-0 border border-white/20">
                {!imgError ? (
                  <img
                    src="/images/thu-trang-profile.jpg"
                    alt="Thu Trang"
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span>TT</span>
                )}
              </div>
              <span className="font-black text-[#FBBC04] tracking-wide text-xs">TRẦN THỊ THU TRANG</span>
              <span className="text-slate-300 text-[10px] font-mono font-bold hidden md:inline">CHTA.HCE2608</span>
            </div>
          </div>
        </div>

        {/* Desktop Main Header & Simplified Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo & App Title */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#4285F4] via-[#34A853] to-[#FBBC04] p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <span className="text-xl">🧠</span>
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>TRIẾT HỌC THẠC SĨ</span>
                <span className="w-2 h-2 rounded-full bg-[#34A853]" />
              </h1>
              <p className="text-[10px] sm:text-[11px] text-slate-600 font-bold">
                Giáo Trình Nguồn A (Trang 7–556)
              </p>
            </div>
          </div>

          {/* Primary Navigation Bar (Desktop) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/90">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>🏠 Trang chủ</span>
            </button>

            <button
              onClick={() => setActiveTab('chapters')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'chapters' || activeTab === 'topic' || activeTab === 'map'
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>📚 Học</span>
            </button>

            <button
              onClick={() => setActiveTab('recall')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'recall'
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Brain className="w-4 h-4" />
              <span>🧠 Ôn nhớ</span>
            </button>

            <button
              onClick={() => setActiveTab('outline')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'outline'
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>✍️ Luyện viết</span>
            </button>

            <button
              onClick={() => setActiveTab('exam')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'exam'
                  ? 'bg-[#EA4335] text-white shadow-md'
                  : 'text-slate-800 bg-amber-200/80 hover:bg-amber-300 border border-amber-300'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>🎓 Thi</span>
            </button>

            <button
              onClick={() => setActiveTab('mastery')}
              className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                activeTab === 'mastery'
                  ? 'bg-[#4285F4] text-white shadow-md'
                  : 'text-slate-700 hover:bg-white hover:text-slate-900'
              }`}
            >
              <Award className="w-4 h-4 text-[#FBBC04]" />
              <span>📊 Tiến độ</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-xl px-2 py-1.5">
        <div className="grid grid-cols-5 text-center">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'text-[#4285F4] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'chapters' || activeTab === 'topic' ? 'text-[#4285F4] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <span className="text-lg">📚</span>
            <span className="text-[10px]">Học</span>
          </button>

          <button
            onClick={() => setActiveTab('recall')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'recall' ? 'text-[#4285F4] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <span className="text-lg">🧠</span>
            <span className="text-[10px]">Ôn</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'exam' ? 'text-[#EA4335] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <span className="text-lg">🎓</span>
            <span className="text-[10px]">Thi</span>
          </button>

          <button
            onClick={() => setActiveTab('mastery')}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
              activeTab === 'mastery' ? 'text-[#4285F4] font-black' : 'text-slate-600 font-bold'
            }`}
          >
            <span className="text-lg">👤</span>
            <span className="text-[10px]">Tôi</span>
          </button>
        </div>
      </div>
    </>
  );
};
