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

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, onSelectTopic }) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    'Đã nắm': 'bg-emerald-100 text-emerald-950 border-emerald-300 font-extrabold',
    'Đang học': 'bg-blue-100 text-blue-950 border-blue-300 font-extrabold',
    'Cần ôn': 'bg-amber-100 text-amber-950 border-amber-300 font-extrabold',
    'Chưa học': 'bg-slate-100 text-slate-800 border-slate-300 font-extrabold'
  };

  const status = chapter.status || (chapter.chapter_number <= 3 ? 'Đã nắm' : chapter.chapter_number <= 6 ? 'Đang học' : 'Chưa học');

  return (
    <div className="card-3d p-6 relative overflow-hidden group border border-slate-200 shadow-sm hover:shadow-md">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute -right-8 -top-8 w-28 h-28 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all" />

      {/* Chapter Badge Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-600 text-white flex items-center justify-center font-black text-lg shadow-md shadow-blue-500/20">
            {chapter.chapter_number}
          </div>
          <div>
            <span className="text-xs font-black text-blue-700 uppercase tracking-wider">
              Chương {chapter.chapter_number}
            </span>
            <span className="ml-2 text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-300">
              Trang {chapter.source_page_start || 7} – {chapter.source_page_end || 556}
            </span>
          </div>
        </div>

        <span className={`text-xs px-3 py-1 rounded-full border shadow-2xs ${statusColors[status]}`}>
          {status}
        </span>
      </div>

      {/* Chapter Title */}
      <h3 className="text-base font-black text-blue-950 mb-3 leading-snug">
        {chapter.title}
      </h3>

      {/* Meta Bar */}
      <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-200/80 mb-4">
        <div className="flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-blue-700" />
          <span className="font-extrabold text-slate-800">{chapter.topics.length} Chủ đề chuẩn</span>
        </div>
        <div className="flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <span className="font-bold text-slate-700">Giáo trình Nguồn A</span>
        </div>
      </div>

      {/* Expand / Collapse Topics Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2.5 px-4 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 rounded-xl font-bold text-xs transition-colors flex items-center justify-center space-x-2 border border-slate-300/80"
      >
        <span>{expanded ? 'Ẩn danh sách chủ đề' : `Xem ${chapter.topics.length} chủ đề`}</span>
        {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Topic List */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2 max-h-72 overflow-y-auto pr-1">
          {chapter.topics.map((topic) => (
            <div
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className="p-3 bg-white hover:bg-blue-50/90 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-all flex items-center justify-between group/item shadow-2xs"
            >
              <div className="flex items-start space-x-2.5">
                <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-[11px] shrink-0 mt-0.5">
                  {topic.topic_number}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover/item:text-blue-900 transition-colors leading-snug">
                    {topic.title}
                  </h4>
                  <span className="text-[10px] text-slate-600 font-bold">
                    Nguồn A (Trang {topic.source_page_start || '–'} - {topic.source_page_end || '–'})
                  </span>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-blue-600 transition-colors shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
