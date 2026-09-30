"use client";

import React from 'react';
import { ChapterCard, ChapterItem } from './ChapterCard';
import { Brain, GraduationCap, Award, BookOpen, Clock, ShieldCheck, Sparkles, Target, Zap } from 'lucide-react';

interface DashboardViewProps {
  chapters: ChapterItem[];
  onSelectTopic: (topicId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ chapters, onSelectTopic, setActiveTab }) => {
  const totalTopics = chapters.reduce((acc, c) => acc + c.topics.length, 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Personalized Dashboard Hero Section */}
      <div className="card-3d p-6 sm:p-8 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Lớp Thạc sĩ Tiếng Anh (CHTA.HCE2608)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Xin chào, Thu Trang 👋
            </h2>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              Hôm nay mình học Triết học Thạc sĩ một cách dễ hiểu và trực quan nhé! Toàn bộ nội dung chuẩn hóa theo <span className="text-yellow-300 font-bold">Giáo trình Nguồn A (Trang 7–556)</span>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('topic')}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-yellow-950 font-bold text-xs px-5 py-3 rounded-xl shadow-lg shadow-yellow-500/20 hover:scale-105 transition-all flex items-center space-x-2"
              >
                <Zap className="w-4 h-4 fill-yellow-950" />
                <span>Học Chủ Đề Ngay</span>
              </button>

              <button
                onClick={() => setActiveTab('exam')}
                className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs px-5 py-3 rounded-xl backdrop-blur-md border border-white/20 hover:border-white/40 transition-all flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Luyện Thi Đóng Sách</span>
              </button>
            </div>
          </div>

          {/* Learner Identity Card */}
          <div className="w-full lg:w-auto shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 space-y-3 shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-500 text-yellow-950 flex items-center justify-center font-black text-xl shadow-md">
                  TT
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">
                    TRẦN THỊ THU TRANG
                  </h3>
                  <p className="text-xs text-blue-200 font-medium">
                    Học viên Thạc sĩ • CHTA.HCE2608
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs border-t border-white/10 pt-3">
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="font-mono text-yellow-300 font-bold text-sm">150</div>
                  <div className="text-[10px] text-blue-200">Chủ đề chuẩn</div>
                </div>
                <div className="bg-white/5 p-2 rounded-xl border border-white/10">
                  <div className="font-mono text-emerald-300 font-bold text-sm">100%</div>
                  <div className="text-[10px] text-blue-200">Giáo trình Nguồn A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">11</div>
            <div className="text-xs font-medium text-slate-500">Chương Học Nguồn A</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalTopics || 150}</div>
            <div className="text-xs font-medium text-slate-500">Chủ Đề Triết Học</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">550</div>
            <div className="text-xs font-medium text-slate-500">Trang Giáo Trình (7-556)</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">96.5%</div>
            <div className="text-xs font-medium text-slate-500">Độ Chính Xác Nguồn A</div>
          </div>
        </div>
      </div>

      {/* 3. 11 Chapter Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">11 Chương Học Giáo Trình Triết Học</h2>
            <p className="text-xs text-slate-500">Toàn bộ 11 chương và 150 chủ đề từ cơ sở dữ liệu Supabase live</p>
          </div>

          <button
            onClick={() => setActiveTab('chapters')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Xem danh sách đầy đủ →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <ChapterCard
              key={chapter.id}
              chapter={chapter}
              onSelectTopic={onSelectTopic}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
