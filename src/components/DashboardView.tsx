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
      <div className="card-3d p-6 sm:p-8 bg-gradient-to-br from-blue-50/95 via-amber-50/40 to-indigo-50/50 text-slate-900 border-2 border-blue-200/80 relative overflow-hidden shadow-xl rounded-3xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-amber-100 border border-amber-300 text-amber-950 text-xs font-black px-3 py-1 rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Lớp Thạc sĩ Tiếng Anh (CHTA.HCE2608)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight">
              Xin chào, Thu Trang 👋
            </h2>
            <p className="text-blue-950 text-sm sm:text-base leading-relaxed font-semibold">
              Hôm nay mình học Triết học Thạc sĩ một cách dễ hiểu và trực quan nhé! Toàn bộ nội dung chuẩn hóa theo <span className="bg-amber-200/80 text-amber-950 font-black px-2 py-0.5 rounded-lg border border-amber-300">Giáo trình Nguồn A (Trang 7–556)</span>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('topic')}
                className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-5 py-3 rounded-xl shadow-md shadow-amber-500/20 hover:scale-105 transition-all flex items-center space-x-2 border border-amber-500/30"
              >
                <Zap className="w-4 h-4 fill-amber-950" />
                <span>Học Chủ Đề Ngay</span>
              </button>

              <button
                onClick={() => setActiveTab('exam')}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-5 py-3 rounded-xl border border-blue-800 shadow-md hover:scale-105 transition-all flex items-center space-x-2"
              >
                <ShieldCheck className="w-4 h-4 text-amber-300" />
                <span>Luyện Thi Đóng Sách</span>
              </button>
            </div>
          </div>

          {/* Learner Identity Card */}
          <div className="w-full lg:w-auto shrink-0">
            <div className="bg-white p-5 rounded-2xl border-2 border-blue-200/90 space-y-3 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md">
                  TT
                </div>
                <div>
                  <h3 className="text-base font-black text-blue-950 tracking-wide">
                    TRẦN THỊ THU TRANG
                  </h3>
                  <p className="text-xs text-slate-600 font-bold">
                    Học viên Thạc sĩ • CHTA.HCE2608
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs border-t border-slate-200/80 pt-3">
                <div className="bg-blue-50/80 p-2.5 rounded-xl border border-blue-200">
                  <div className="font-mono text-blue-800 font-black text-base">150</div>
                  <div className="text-[11px] text-slate-700 font-bold">Chủ đề chuẩn</div>
                </div>
                <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                  <div className="font-mono text-emerald-800 font-black text-base">100%</div>
                  <div className="text-[11px] text-slate-700 font-bold">Giáo trình Nguồn A</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-bold">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-950">11</div>
            <div className="text-xs font-bold text-slate-600">Chương Học Nguồn A</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-950">{totalTopics || 150}</div>
            <div className="text-xs font-bold text-slate-600">Chủ Đề Triết Học</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-950">550</div>
            <div className="text-xs font-bold text-slate-600">Trang Giáo Trình (7-556)</div>
          </div>
        </div>

        <div className="card-3d p-5 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-blue-950">96.5%</div>
            <div className="text-xs font-bold text-slate-600">Độ Chính Xác Nguồn A</div>
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
