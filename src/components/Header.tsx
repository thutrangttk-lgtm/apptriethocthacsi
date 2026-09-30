"use client";

import React from 'react';
import { Brain, GraduationCap, BookOpen, Map, Clock, FileText, Lock, ShieldCheck, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isClosedBookMode?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, isClosedBookMode = false }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Top Banner for Learner Profile */}
      <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white px-4 py-2.5 shadow-inner border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2">
          <div className="flex items-center space-x-2 font-semibold">
            <span className="bg-amber-400 text-amber-950 font-black px-2.5 py-0.5 rounded-full text-[11px] shadow-sm tracking-wide">
              THẠC SĨ
            </span>
            <span className="tracking-wide text-slate-100">Hệ thống Học tập & Luyện thi Triết học Nguồn A</span>
          </div>

          {/* Learner Identity */}
          <div className="flex items-center space-x-3 bg-blue-900/80 px-3.5 py-1 rounded-full border border-blue-400/30 shadow-xs">
            <GraduationCap className="w-4 h-4 text-amber-300" />
            <span className="font-extrabold text-amber-300 tracking-wide">TRẦN THỊ THU TRANG</span>
            <span className="text-blue-100 text-[11px] font-mono font-bold">LỚP CHTA.HCE2608</span>
          </div>
        </div>
      </div>

      {/* Main Header & Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & App Title */}
        <div 
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-700" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black text-blue-950 tracking-tight">
              TRIẾT HỌC THẠC SĨ
            </h1>
            <p className="text-[11px] text-slate-600 font-bold">
              Bộ Giáo Dục & Đào Tạo • Giáo Trình Nguồn A (Trang 7–556)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'chapters'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>11 Chương (150 Chủ đề)</span>
          </button>

          <button
            onClick={() => setActiveTab('topic')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'topic'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Học Chủ Đề</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'map'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Sơ Đồ Tri Thức</span>
          </button>

          <button
            onClick={() => setActiveTab('recall')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'recall'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Active Recall</span>
          </button>

          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'outline'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lập Dàn Ý</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exam'
                ? 'bg-amber-400 text-amber-950 shadow-md shadow-amber-500/20 border border-amber-500/30'
                : 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-900" />
            <span>Thi Đóng Sách</span>
          </button>

          <button
            onClick={() => setActiveTab('mastery')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mastery'
                ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                : 'text-slate-700 hover:bg-slate-100 hover:text-blue-950'
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Tiến Độ</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
