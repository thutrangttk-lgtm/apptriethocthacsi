"use client";

import React from 'react';
import { Award, Brain, Calendar, CheckCircle2, Clock, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export const MasteryDashboardView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="card-3d p-6 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-md">
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-black">Bảng Tiến Độ & Năng Lực Mastery Triết Học</h2>
            <p className="text-xs text-blue-200">
              Đánh giá đa chiều 5 chỉ số năng lực & Lịch ôn tập ngắt quãng (Spaced Repetition)
            </p>
          </div>
        </div>
      </div>

      {/* 5-Dimensional Mastery Radar Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="card-3d p-5 text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">HIỂU BẢN CHẤT</div>
          <div className="text-3xl font-black text-blue-600 font-mono">92%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-[92%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">TỰ NHỚ (RECALL)</div>
          <div className="text-3xl font-black text-amber-600 font-mono">85%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full w-[85%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">VẬN DỤNG THỰC TIỄN</div>
          <div className="text-3xl font-black text-emerald-600 font-mono">78%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[78%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">DÀN Ý TỰ LUẬN</div>
          <div className="text-3xl font-black text-indigo-600 font-mono">88%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full w-[88%]" />
          </div>
        </div>

        <div className="card-3d p-5 text-center space-y-2">
          <div className="text-xs font-bold text-slate-500">THI ĐÓNG SÁCH</div>
          <div className="text-3xl font-black text-purple-600 font-mono">82%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-purple-600 h-full w-[82%]" />
          </div>
        </div>
      </div>

      {/* Spaced Repetition Due Widget */}
      <div className="card-3d p-6 space-y-4">
        <div className="flex items-center space-x-2 text-slate-900 font-bold text-base border-b border-slate-100 pb-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Lịch Ôn Tập Ngắt Quãng Cần Thực Hiện Hôm Nay</span>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-amber-900 uppercase bg-amber-200 px-2 py-0.5 rounded-full">
                Hạn ôn: Hôm nay
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Chương VI - Topic 1: Siêu hình và biện chứng (Trang 310-312)
              </h4>
              <p className="text-xs text-slate-600">Đã 3 ngày chưa ôn lại • Điểm thi lần trước: 75%</p>
            </div>

            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-amber-950 font-bold text-xs rounded-xl shadow-md">
              Ôn Lại Ngay
            </button>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-700 uppercase bg-slate-200 px-2 py-0.5 rounded-full">
                Hạn ôn: Ngày mai
              </span>
              <h4 className="text-sm font-bold text-slate-900">
                Chương VIII - Topic 1: Tiền đề xuất phát của lý luận hình thái kinh tế - xã hội (Trang 381-390)
              </h4>
              <p className="text-xs text-slate-600">Điểm thi lần trước: 88%</p>
            </div>

            <button className="px-4 py-2 bg-slate-200 text-slate-700 font-bold text-xs rounded-xl">
              Đã Lên Lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
