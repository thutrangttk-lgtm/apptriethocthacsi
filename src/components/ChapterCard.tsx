"use client";

import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronUp, Layers, Sparkles } from 'lucide-react';

export interface TopicItem {
  id: string;
  topic_number: number;
  title: string;
  source_page_start: number | null;
  source_page_end: number | null;
}

export interface ChapterItem {
  id: string;
  chapter_number: number;
  title: string;
  source_page_start: number | null;
  source_page_end: number | null;
  topics: TopicItem[];
  status?: 'Chưa học' | 'Đang học' | 'Cần ôn' | 'Đã nắm';
}

interface ChapterCardProps {
  chapter: ChapterItem;
  onSelectTopic: (topicId: string) => void;
}

const CHAPTER_ICONS: Record<number, string> = {
  1: '💡', // Triết học & Vai trò
  2: '🗿', // Lịch sử triết học
  3: '⚖️', // Triết học Mác - Lênin
  4: '🧠', // Duy vật biện chứng
  5: '🧩', // Phép biện chứng
  6: '🏛️', // Lý luận nhận thức
  7: '📚', // Chủ nghĩa duy vật lịch sử
  8: '🌍', // Hình thái KT-XH
  9: '🔗', // Giai cấp & Dân tộc
  10: '🎓', // Nhà nước & Pháp quyền
  11: '✍️'  // Ý thức xã hội & Con người
};

const PASTEL_CARD_BG = [
  'bg-gradient-to-br from-[#EAF4FF]/60 via-white to-white border-blue-200/90',
  'bg-gradient-to-br from-[#FFF0F6]/60 via-white to-white border-pink-200/90',
  'bg-gradient-to-br from-[#F3EEFF]/60 via-white to-white border-purple-200/90',
  'bg-gradient-to-br from-[#FFF9E8]/60 via-white to-white border-amber-200/90',
  'bg-gradient-to-br from-[#E6F7F0]/60 via-white to-white border-emerald-200/90'
];

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onSelectTopic }) => {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    'Đã nắm': {
      bg: 'bg-[#34A853]/15 text-[#34A853] border-[#34A853]/40',
      bar: 'bg-[#34A853]',
      percent: 100
    },
    'Đang học': {
      bg: 'bg-[#4285F4]/15 text-[#2563EB] border-[#4285F4]/40',
      bar: 'bg-[#4285F4]',
      percent: 65
    },
    'Cần ôn': {
      bg: 'bg-[#FBBC04]/20 text-amber-950 border-[#FBBC04]/50',
      bar: 'bg-[#FBBC04]',
      percent: 40
    },
    'Chưa học': {
      bg: 'bg-slate-100 text-slate-700 border-slate-300',
      bar: 'bg-slate-300',
      percent: 0
    }
  };

  const status = chapter.status || (chapter.chapter_number <= 3 ? 'Đã nắm' : chapter.chapter_number <= 6 ? 'Đang học' : 'Chưa học');
  const config = statusConfig[status];
  const icon = CHAPTER_ICONS[chapter.chapter_number] || '📚';
  const pastelBg = PASTEL_CARD_BG[(chapter.chapter_number - 1) % PASTEL_CARD_BG.length];

  return (
    <div className={`card-3d p-6 relative overflow-hidden group border-2 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all rounded-3xl flex flex-col justify-between ${pastelBg}`}>
      {/* Background Accent Subtle Glow */}
      <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#4285F4]/5 rounded-full blur-xl group-hover:bg-[#4285F4]/10 transition-all pointer-events-none" />

      <div>
        {/* Chapter Header Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-white/90 border border-slate-200/80 flex items-center justify-center text-2xl shadow-2xs shrink-0 group-hover:scale-110 transition-transform">
              <span>{icon}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black text-[#172554] uppercase tracking-wider">
                  Chương {chapter.chapter_number}
                </span>
                <span className="text-[11px] font-bold bg-white/90 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                  Trang {chapter.source_page_start || 7}–{chapter.source_page_end || 556}
                </span>
              </div>
            </div>
          </div>

          <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-2xs shrink-0 ${config.bg}`}>
            {status}
          </span>
        </div>

        {/* Chapter Title */}
        <h3 className="text-base font-black text-slate-900 mb-3 leading-snug">
          {chapter.title}
        </h3>
      </div>

      <div>
        {/* Progress Bar & Meta */}
        <div className="space-y-2 mb-4 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
            <span className="flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#4285F4]" />
              <span>{chapter.topics.length} Chủ đề chuẩn</span>
            </span>
            <span className="font-mono text-slate-900 font-black">{config.percent}%</span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/60">
            <div className={`h-full transition-all duration-500 ${config.bar}`} style={{ width: `${config.percent}%` }} />
          </div>
        </div>

        {/* Expand / Collapse Topics Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#4285F4] rounded-2xl font-black text-xs transition-colors flex items-center justify-center space-x-2 border border-slate-200"
        >
          <span>{expanded ? 'Ẩn danh sách chủ đề' : `Xem ${chapter.topics.length} chủ đề`}</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {/* Topic List Drawer */}
        {expanded && (
          <div className="mt-4 pt-3 border-t border-slate-200 space-y-2 max-h-72 overflow-y-auto pr-1">
            {chapter.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => onSelectTopic(topic.id)}
                className="p-3 bg-white hover:bg-blue-50/90 rounded-xl border border-slate-200 hover:border-[#4285F4]/40 cursor-pointer transition-all flex items-center justify-between group/item shadow-2xs"
              >
                <div className="flex items-start space-x-2.5">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 text-[#4285F4] flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                    {topic.topic_number}
                  </span>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 group-hover/item:text-[#4285F4] transition-colors leading-snug">
                      {topic.title}
                    </h4>
                    <span className="text-[10px] text-slate-600 font-bold">
                      Nguồn A (Trang {topic.source_page_start || '–'} - {topic.source_page_end || '–'})
                    </span>
                  </div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-[#4285F4] transition-colors shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
