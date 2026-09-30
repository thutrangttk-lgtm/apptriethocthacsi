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
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white px-4 py-2.5 shadow-inner">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm gap-2">
          <div className="flex items-center space-x-2 font-medium">
            <span className="bg-yellow-400 text-yellow-950 font-bold px-2 py-0.5 rounded-full text-[11px] shadow-sm">
              THẠC SĨ
            </span>
            <span className="tracking-wide">Hệ thống Học tập & Luyện thi Triết học Nguồn A</span>
          </div>

          {/* Learner Identity */}
          <div className="flex items-center space-x-3 bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <GraduationCap className="w-4 h-4 text-yellow-300" />
            <span className="font-bold text-yellow-200">TRẦN THỊ THU TRANG</span>
            <span className="text-blue-200 text-[11px] font-mono">LỚP CHTA.HCE2608</span>
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
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 p-0.5 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-950 to-blue-700 bg-clip-text text-transparent tracking-tight">
              TRIẾT HỌC THẠC SĨ
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Bộ Giáo Dục & Đào Tạo • Giáo Trình Nguồn A (Trang 7–556)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Tổng Quan</span>
          </button>

          <button
            onClick={() => setActiveTab('chapters')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'chapters'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>11 Chương (150 Chủ đề)</span>
          </button>

          <button
            onClick={() => setActiveTab('topic')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'topic'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4" />
            <span>Học Chủ Đề</span>
          </button>

          <button
            onClick={() => setActiveTab('map')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'map'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Map className="w-4 h-4" />
            <span>Sơ Đồ Tri Thức</span>
          </button>

          <button
            onClick={() => setActiveTab('recall')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'recall'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Active Recall</span>
          </button>

          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'outline'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Lập Dàn Ý</span>
          </button>

          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'exam'
                ? 'bg-amber-500 text-amber-950 shadow-md shadow-amber-500/20'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-900'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Thi Đóng Sách</span>
          </button>

          <button
            onClick={() => setActiveTab('mastery')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'mastery'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4 text-yellow-500" />
            <span>Tiến Độ</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
