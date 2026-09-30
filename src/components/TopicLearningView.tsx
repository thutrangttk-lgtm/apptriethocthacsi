"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { Brain, Zap, BookOpen, Clock, Heart, Key, AlertTriangle, Globe, Lock, Mic, FileEdit, GraduationCap, CheckCircle2, ChevronRight, Loader2, BookMarked } from 'lucide-react';

interface TopicLearningViewProps {
  topics: TopicItem[];
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  setActiveTab: (tab: string) => void;
}

const LEARNING_MODES = [
  { id: 'quick_30s', label: '30 giây', icon: Zap, desc: 'Hiểu nhanh cốt lõi' },
  { id: 'quick_2min', label: '2 phút', icon: Clock, desc: 'Tổng quan bài học' },
  { id: 'core', label: 'Bản chất', icon: Heart, desc: 'Bản chất triết học' },
  { id: 'logic_map', label: 'Sơ đồ logic', icon: Brain, desc: 'Mối liên hệ logic' },
  { id: 'keywords', label: 'Từ khóa', icon: Key, desc: 'Từ khóa phải nhớ' },
  { id: 'deep', label: 'Hiểu sâu', icon: BookOpen, desc: 'Phân tích Nguồn A' },
  { id: 'confusions', label: 'Dễ nhầm', icon: AlertTriangle, desc: 'Phân biệt khái niệm' },
  { id: 'application', label: 'Vận dụng', icon: Globe, desc: 'Thực tiễn Việt Nam' },
  { id: 'recall', label: 'Đóng sách tự nhớ', icon: Lock, desc: 'Active Recall' },
  { id: 'explain', label: 'Tự giải thích', icon: Mic, desc: 'Phương pháp Feynman' },
  { id: 'outline', label: 'Lập dàn ý', icon: FileEdit, desc: 'Dàn ý 6 phần' },
  { id: 'exam', label: 'Luyện thi', icon: GraduationCap, desc: 'Thi đóng sách' }
];

export const TopicLearningView: React.FC<TopicLearningViewProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  setActiveTab
}) => {
  const currentTopicId = selectedTopicId || (topics.length > 0 ? topics[0].id : null);
  const currentTopic = topics.find(t => t.id === currentTopicId) || topics[0];

  const [activeMode, setActiveMode] = useState<string>('quick_30s');
  const [explanationData, setExplanationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentTopicId) {
      fetchExplanation(currentTopicId, activeMode);
    }
  }, [currentTopicId, activeMode]);

  const fetchExplanation = async (topicId: string, mode: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/topic/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topicId, mode })
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationData(data);
      }
    } catch (err) {
      console.error("Error fetching explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentTopic) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
        Đang tải dữ liệu chủ đề từ Supabase...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Top Topic Selector Dropdown / Search */}
      <div className="card-3d p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg border border-blue-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-black text-amber-950 uppercase tracking-wider bg-amber-400 px-3 py-1 rounded-full border border-amber-300 shadow-xs">
              TRẢI NGHIỆM HỌC TIẾN TRÌNH (12 LỚP HỌC TẬP)
            </span>
            <h2 className="text-2xl font-black mt-2.5 leading-tight text-white">
              Chủ đề {currentTopic.topic_number}: {currentTopic.title}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-blue-100 font-bold mt-1.5">
              <BookMarked className="w-4 h-4 text-amber-300" />
              <span>Căn cứ Giáo trình Nguồn A (Trang {currentTopic.source_page_start || 7} – {currentTopic.source_page_end || 8})</span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-80">
            <label className="block text-[11px] font-black text-blue-100 uppercase mb-1">
              Chọn chủ đề khác ({topics.length} chủ đề)
            </label>
            <select
              value={currentTopic.id}
              onChange={(e) => onSelectTopic(e.target.value)}
              className="w-full bg-slate-950 text-white text-xs font-bold p-3 rounded-xl border-2 border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              {topics.map(t => (
                <option key={t.id} value={t.id} className="text-slate-900 font-bold bg-white">
                  Topic {t.topic_number}: {t.title} (Trang {t.source_page_start}-{t.source_page_end})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Progressive 12 Learning Modes Tabs */}
      <div className="card-3d p-3 overflow-x-auto scrollbar-none border border-slate-200">
        <div className="flex items-center space-x-2 min-w-max">
          {LEARNING_MODES.map((m) => {
            const IconComp = m.icon;
            const isActive = activeMode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  if (m.id === 'recall') {
                    setActiveTab('recall');
                  } else if (m.id === 'outline') {
                    setActiveTab('outline');
                  } else if (m.id === 'exam') {
                    setActiveTab('exam');
                  } else {
                    setActiveMode(m.id);
                  }
                }}
                className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                    : 'bg-slate-100 text-slate-800 hover:bg-blue-50 hover:text-blue-900 border border-slate-300/80'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-700'}`} />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Card Displaying RAG Content */}
      <div className="card-3d p-8 relative min-h-[400px] border border-slate-200 shadow-sm">
        {loading ? (
          <div className="py-20 text-center text-slate-600 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-blue-700" />
            <p className="text-sm font-bold text-slate-800">Đang truy xuất kiến thức chuẩn Nguồn A cho chủ đề này...</p>
          </div>
        ) : explanationData ? (
          <div className="space-y-6">
            {/* Source Page Citation Banner */}
            <div className="flex items-center justify-between p-4 bg-amber-100/80 border-2 border-amber-300 rounded-2xl">
              <div className="flex items-center space-x-2 text-xs font-extrabold text-amber-950">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-700" />
                <span>Trích xuất từ Nguồn A – Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo)</span>
              </div>

              {explanationData.source_pages && explanationData.source_pages.length > 0 && (
                <span className="text-xs font-mono font-black bg-amber-200 text-amber-950 px-3 py-1 rounded-full border border-amber-400">
                  Trang {explanationData.source_pages.join(', ')}
                </span>
              )}
            </div>

            {/* Explanation Body */}
            <div className="prose prose-slate max-w-none text-slate-900 font-normal text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {explanationData.content}
            </div>

            {/* Action Footer */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-700 font-bold">
                Đã hiểu phần này? Chuyển sang bước tự nhớ hoặc luyện dàn ý.
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setActiveTab('recall')}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md border border-amber-500/30 transition-colors"
                >
                  🙈 Thử Đóng Sách Tự Nhớ
                </button>
                <button
                  onClick={() => setActiveTab('outline')}
                  className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                >
                  ✍️ Lập Dàn Ý Tự Luận
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-400">Không có dữ liệu bài giảng.</div>
        )}
      </div>
    </div>
  );
};
