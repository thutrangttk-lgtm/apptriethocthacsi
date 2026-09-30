"use client";

import React from 'react';
import { Award, Brain, Calendar, CheckCircle2, Clock, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const MasteryDashboardView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="card-3d p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg border border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-md border border-amber-500/30">
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Bảng Tiến Độ & Năng Lực Mastery Triết Học</h2>
            <p className="text-xs text-blue-100 font-semibold">
              Đánh giá đa chiều 5 chỉ số năng lực & Lịch ôn tập ngắt quãng (Spaced Repetition)
            </p>
          </div>
        </div>
      </div>

      {/* 5-Dimensional Mastery Radar Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-3d p-5 text-center space-y-2 border border-slate-200 shadow-2xs">
          <div className="text-xs font-black text-slate-800">HIỂU BẢN CHẤT</div>
          <div className="text-3xl font-black text-blue-700 font-mono">92%</div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-blue-700 h-full w-[92%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2 border border-slate-200 shadow-2xs">
          <div className="text-xs font-black text-slate-800">TỰ NHỚ (RECALL)</div>
          <div className="text-3xl font-black text-amber-800 font-mono">85%</div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[85%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2 border border-slate-200 shadow-2xs">
          <div className="text-xs font-black text-slate-800">VẬN DỤNG THỰC TIỄN</div>
          <div className="text-3xl font-black text-emerald-800 font-mono">78%</div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full w-[78%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2 border border-slate-200 shadow-2xs">
          <div className="text-xs font-black text-slate-800">DÀN Ý TỰ LUẬN</div>
          <div className="text-3xl font-black text-indigo-800 font-mono">88%</div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-indigo-700 h-full w-[88%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2 border border-slate-200 shadow-2xs">
          <div className="text-xs font-black text-slate-800">THI ĐÓNG SÁCH</div>
          <div className="text-3xl font-black text-purple-800 font-mono">82%</div>
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div className="bg-purple-700 h-full w-[82%]" />
          </div>
        </div>
      </div>

      {/* Spaced Repetition Due Widget */}
      <div className="card-3d p-6 space-y-4 border border-slate-200 shadow-sm">
        <div className="flex items-center space-x-2 text-blue-950 font-black text-base border-b border-slate-200 pb-3">
          <Calendar className="w-5 h-5 text-blue-700" />
          <span>Lịch Ôn Tập Ngắt Quãng Cần Thực Hiện Hôm Nay</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-amber-100/90 border-2 border-amber-300 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-950 uppercase bg-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400">
                Hạn ôn: Hôm nay
              </span>
              <h4 className="text-sm font-black text-blue-950 mt-1">
                Chương VI - Topic 1: Siêu hình và biện chứng (Trang 310-312)
              </h4>
              <p className="text-xs text-slate-800 font-bold">Đã 3 ngày chưa ôn lại • Điểm thi lần trước: 75%</p>
            </div>

            <button className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md border border-amber-500/30">
              Ôn Lại Ngay
            </button>
          </div>

          <div className="p-4 bg-white border border-slate-300 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-900 uppercase bg-slate-200 px-2.5 py-0.5 rounded-full border border-slate-300">
                Hạn ôn: Ngày mai
              </span>
              <h4 className="text-sm font-black text-blue-950 mt-1">
                Chương VIII - Topic 1: Tiền đề xuất phát của lý luận hình thái kinh tế - xã hội (Trang 381-390)
              </h4>
              <p className="text-xs text-slate-700 font-bold">Điểm thi lần trước: 88%</p>
            </div>

            <button className="px-4 py-2 bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300">
              Đã Lên Lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
