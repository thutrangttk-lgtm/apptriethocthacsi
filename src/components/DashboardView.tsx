"use client";

import React, { useState } from 'react';
import { ChapterCard, ChapterItem } from './ChapterCard';
import { GlobalSearch } from './GlobalSearch';
import { Brain, GraduationCap, Award, BookOpen, Clock, ShieldCheck, Sparkles, Target, Zap, ArrowRight, Flame, CheckCircle, RefreshCw } from 'lucide-react';

interface DashboardViewProps {
  chapters: ChapterItem[];
  onSelectTopic: (topicId: string) => void;
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ chapters, onSelectTopic, setActiveTab }) => {
  const [imgError, setImgError] = useState(false);
  const totalTopics = chapters.reduce((acc, c) => acc + c.topics.length, 0);

  // Find primary recommended topic for Today's Learning
  const primaryChapter = chapters[0];
  const primaryTopic = primaryChapter?.topics[0] || {
    id: 'topic-1',
    topic_number: 1,
    title: 'Tính quy luật của sự hình thành và phát triển của triết học',
    source_page_start: 11,
    source_page_end: 13
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 relative">
      {/* Ambient Pastel Background Glow Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-[#EAF4FF]/80 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-60 right-10 w-96 h-96 bg-[#FFF0F6]/80 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* 🔍 GLOBAL KEYWORD & NATURAL LANGUAGE SEARCH BAR */}
      <GlobalSearch onSelectTopic={(topicId) => {
        onSelectTopic(topicId);
        setActiveTab('topic');
      }} />

      {/* 1. PERSONALIZED LEARNER HERO SECTION */}
      <div className="card-3d p-6 sm:p-8 bg-gradient-to-br from-[#EAF4FF] via-[#F3EEFF] to-[#FFF0F6] text-[#172554] border-2 border-blue-200/80 relative overflow-hidden shadow-xl rounded-3xl">
        {/* Subtle Decorative Pastel Ambient Blobs */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center space-x-2 bg-white/90 border border-pink-200 text-[#172554] text-xs font-black px-3.5 py-1 rounded-full shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#EA4335]" />
              <span>CHƯƠNG TRÌNH THẠC SĨ TIẾNG ANH • CHTA.HCE2608</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-[#172554] tracking-tight leading-tight">
              Chào Thu Trang 👋
            </h2>
            <p className="text-[#334155] text-base sm:text-lg leading-relaxed font-semibold">
              Triết học khó thật, nhưng hôm nay mình chỉ cần hiểu thêm một chút. Toàn bộ kiến thức chuẩn hóa theo <span className="bg-white/90 text-[#2563EB] font-black px-2.5 py-0.5 rounded-lg border border-blue-200 shadow-2xs">Giáo trình Nguồn A (Trang 7–556)</span>.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onSelectTopic(primaryTopic.id);
                  setActiveTab('topic');
                }}
                className="bg-[#4285F4] hover:bg-blue-600 text-white font-black text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-blue-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 border border-blue-400/30"
              >
                <Zap className="w-5 h-5 fill-yellow-300 text-yellow-300" />
                <span>HỌC BÀI HÔM NAY</span>
              </button>

              <button
                onClick={() => setActiveTab('exam')}
                className="bg-white hover:bg-slate-50 text-[#172554] font-extrabold text-sm px-5 py-3.5 rounded-2xl border-2 border-pink-200 shadow-md hover:scale-[1.02] transition-all flex items-center space-x-2"
              >
                <ShieldCheck className="w-5 h-5 text-[#34A853]" />
                <span>Thi Đóng Sách</span>
              </button>
            </div>
          </div>

          {/* Learner Identity Profile Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white/95 backdrop-blur-md p-6 rounded-3xl border-2 border-pink-200/90 space-y-4 shadow-md hover:shadow-lg transition-all">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#4285F4] via-[#F3EEFF] to-[#FFF0F6] p-0.5 shadow-md shrink-0 ring-4 ring-[#FFF0F6] shadow-[0_0_20px_rgba(244,114,182,0.3)]">
                  <div className="w-full h-full bg-white rounded-[14px] overflow-hidden flex items-center justify-center font-black text-xl text-slate-900">
                    {!imgError ? (
                      <img
                        src="/images/thu-trang-profile.jpg"
                        alt="Trần Thị Thu Trang"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span>TT</span>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-[#172554] tracking-wide">
                    TRẦN THỊ THU TRANG
                  </h3>
                  <p className="text-xs text-[#475569] font-bold">
                    Học viên Thạc sĩ • CHTA.HCE2608
                  </p>
                </div>
              </div>

              {/* Learner Stats Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="bg-[#FFF0F6] p-2.5 rounded-2xl border border-pink-200 text-center">
                  <div className="flex items-center justify-center space-x-1 text-pink-900 font-black text-xs">
                    <Flame className="w-3.5 h-3.5 text-[#EA4335] fill-[#EA4335]" />
                    <span>5 Ngày</span>
                  </div>
                  <div className="text-[10px] text-[#475569] font-bold mt-0.5">Chuỗi học liên tiếp</div>
                </div>

                <div className="bg-[#EAF4FF] p-2.5 rounded-2xl border border-blue-200 text-center">
                  <div className="font-mono text-[#2563EB] font-black text-sm">18 / 150</div>
                  <div className="text-[10px] text-[#475569] font-bold mt-0.5">Chủ đề đã nắm</div>
                </div>

                <div className="bg-[#E6F7F0] p-2.5 rounded-2xl border border-emerald-200 text-center">
                  <div className="text-xs font-black text-[#34A853]">1 bài/ngày</div>
                  <div className="text-[10px] text-[#475569] font-bold mt-0.5">Mục tiêu hôm nay</div>
                </div>

                <div className="bg-[#F3EEFF] p-2.5 rounded-2xl border border-purple-200 text-center">
                  <div className="font-mono text-purple-800 font-black text-sm">82%</div>
                  <div className="text-[10px] text-[#475569] font-bold mt-0.5">Sẵn sàng thi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TODAY'S LEARNING ("HÔM NAY HỌC GÌ?") SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💡</span>
            <h2 className="text-2xl font-black text-[#172554] tracking-tight">HÔM NAY HỌC GÌ?</h2>
          </div>
          <span className="text-xs font-bold text-[#475569]">Gợi ý học thông minh dựa trên tiến độ</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Recommended Topic Card - Soft Pastel Blue Section Background */}
          <div className="lg:col-span-2 card-3d p-6 bg-gradient-to-r from-[#EAF4FF] via-[#DDEEFF] to-[#F3EEFF] text-[#172554] rounded-3xl shadow-md border-2 border-blue-200 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="bg-[#34A853] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xs tracking-wide">
                  ✨ BÀI HỌC HÔM NAY
                </span>
                <span className="text-xs text-[#172554] font-mono font-bold">
                  ⏱ Khoảng 20 phút
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#172554] leading-snug">
                {primaryTopic.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#475569] font-bold">
                {primaryChapter?.title} • Nguồn A (Trang {primaryTopic.source_page_start || 11}–{primaryTopic.source_page_end || 13})
              </p>
            </div>

            <div className="pt-6 mt-4 border-t border-blue-200/80 flex items-center justify-between">
              <div className="text-xs text-[#172554] font-black">
                🎯 Mục tiêu: Nắm vững bản chất & quy luật hình thành
              </div>

              <button
                onClick={() => {
                  onSelectTopic(primaryTopic.id);
                  setActiveTab('topic');
                }}
                className="bg-[#FBBC04] hover:bg-yellow-400 text-slate-950 font-black text-xs px-5.5 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 border border-yellow-500/30"
              >
                <span>Bắt đầu học ngay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ÔN LẠI HÔM NAY Sidebar - Soft Pastel Pink Section Background */}
          <div className="card-3d p-5 space-y-4 border-2 border-pink-200 rounded-3xl bg-gradient-to-br from-[#FFF0F6] to-[#FFE5F0] text-[#172554]">
            <div className="flex items-center space-x-2 border-b border-pink-200 pb-3">
              <RefreshCw className="w-4 h-4 text-[#EA4335]" />
              <h3 className="text-sm font-black text-[#172554]">ÔN LẠI HÔM NAY</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-white/90 border border-pink-200 rounded-2xl space-y-2 shadow-2xs">
                <span className="text-[10px] font-black text-pink-950 uppercase bg-[#FFE5F0] px-2.5 py-0.5 rounded-full border border-pink-300">
                  Cần ôn lại (3 ngày)
                </span>
                <h4 className="text-xs font-black text-[#172554] leading-snug">
                  Chương VI - Siêu hình và biện chứng (Trang 310-312)
                </h4>
                <button
                  onClick={() => setActiveTab('recall')}
                  className="w-full py-2 bg-[#FBBC04] hover:bg-yellow-400 text-slate-950 font-black text-[11px] rounded-xl transition-all shadow-xs border border-yellow-500/30"
                >
                  Ôn Lại Ngay
                </button>
              </div>

              <div className="p-3.5 bg-white/90 border border-pink-200 rounded-2xl space-y-2 shadow-2xs">
                <span className="text-[10px] font-black text-slate-800 uppercase bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Lên lịch ngày mai
                </span>
                <h4 className="text-xs font-black text-[#172554] leading-snug">
                  Chương VIII - Hình thái KT-XH (Trang 381-390)
                </h4>
                <button
                  onClick={() => setActiveTab('topic')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-[11px] rounded-xl transition-all border border-slate-300"
                >
                  Xem Trước
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 11 CHAPTER CARDS GRID */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📚 11 Chương Học Giáo Trình Triết Học</span>
            </h2>
            <p className="text-xs text-slate-600 font-bold">Toàn bộ 11 chương và 150 chủ đề từ Giáo trình Nguồn A (Trang 7–556)</p>
          </div>

          <button
            onClick={() => setActiveTab('chapters')}
            className="text-xs font-black text-[#4285F4] hover:text-blue-700 transition-colors"
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
