"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { FormattedMarkdown } from './FormattedMarkdown';
import { Brain, Zap, BookOpen, Clock, Heart, Key, AlertTriangle, Globe, Lock, Mic, FileEdit, GraduationCap, CheckCircle2, ChevronRight, ChevronLeft, Loader2, BookMarked, Sparkles } from 'lucide-react';

interface TopicLearningViewProps {
  topics: TopicItem[];
  selectedTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  setActiveTab: (tab: string) => void;
}

const LEARNING_JOURNEY_STEPS = [
  { id: 'quick_30s', num: 1, emoji: '⚡', label: '1. Hiểu trong 30 giây', desc: 'Tóm tắt cốt lõi nhanh' },
  { id: 'quick_2min', num: 2, emoji: '💡', label: '2. Hiểu trong 2 phút', desc: 'Bức tranh toàn cảnh' },
  { id: 'core', num: 3, emoji: '❤️', label: '3. Bản chất', desc: 'Bản chất triết học Mác' },
  { id: 'logic_map', num: 4, emoji: '🧠', label: '4. Sơ đồ logic', desc: 'Mối liên hệ quy luật' },
  { id: 'keywords', num: 5, emoji: '🔑', label: '5. Từ khóa', desc: 'Thuật ngữ cốt lõi' },
  { id: 'deep', num: 6, emoji: '📖', label: '6. Hiểu sâu', desc: 'Phân tích Nguồn A' },
  { id: 'confusions', num: 7, emoji: '⚠️', label: '7. Dễ nhầm', desc: 'Phân biệt điểm tranh cãi' },
  { id: 'application', num: 8, emoji: '🌎', label: '8. Vận dụng', desc: 'Thực tiễn Việt Nam' },
  { id: 'recall', num: 9, emoji: '🙈', label: '9. Đóng sách – Tự nhớ', desc: 'Active Recall' },
  { id: 'explain', num: 10, emoji: '🎤', label: '10. Tự giải thích', desc: 'Phương pháp Feynman' },
  { id: 'outline', num: 11, emoji: '✍️', label: '11. Lập dàn ý', desc: 'Dàn ý tự luận 6 phần' },
  { id: 'exam', num: 12, emoji: '🎓', label: '12. Luyện thi', desc: 'Thi tự luận đóng sách' }
];

export const TopicLearningView: React.FC<TopicLearningViewProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  setActiveTab
}) => {
  const currentTopicId = selectedTopicId || (topics.length > 0 ? topics[0].id : null);
  const currentTopic = topics.find(t => t.id === currentTopicId) || topics[0];

  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]);
  const [explanationData, setExplanationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const currentStep = LEARNING_JOURNEY_STEPS[activeStepIdx] || LEARNING_JOURNEY_STEPS[0];

  useEffect(() => {
    if (currentTopicId) {
      fetchExplanation(currentTopicId, currentStep.id);
    }
  }, [currentTopicId, activeStepIdx]);

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
        if (!completedSteps.includes(currentStep.num)) {
          setCompletedSteps(prev => [...prev, currentStep.num]);
        }
      }
    } catch (err) {
      console.error("Error fetching explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStepSelect = (idx: number) => {
    setActiveStepIdx(idx);
  };

  if (!currentTopic) {
    return (
      <div className="p-12 text-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#4285F4]" />
        Đang tải dữ liệu chủ đề...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      {/* Top Topic Selector Banner */}
      <div className="card-3d p-6 bg-pastel-blue rounded-3xl border-2 border-blue-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-[#34A853] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xs">
                HÀNH TRÌNH HỌC TẬP TỪNG BƯỚC
              </span>
              <span className="bg-[#FBBC04] text-slate-950 text-[11px] font-black px-3 py-1 rounded-full">
                {completedSteps.length} / 12 bước hoàn thành
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172554] leading-tight">
              Topic {currentTopic.topic_number}: {currentTopic.title}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-[#475569] font-bold">
              <BookMarked className="w-4 h-4 text-[#4285F4]" />
              <span>Căn cứ Giáo trình Nguồn A (Trang {currentTopic.source_page_start || 7} – {currentTopic.source_page_end || 8})</span>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-80">
            <label className="block text-[11px] font-black text-[#172554] uppercase mb-1">
              Chuyển chủ đề khác ({topics.length} chủ đề)
            </label>
            <select
              value={currentTopic.id}
              onChange={(e) => onSelectTopic(e.target.value)}
              className="w-full bg-white text-[#172554] text-xs font-bold p-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
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

      {/* Guided 12-Step Progressive Learning Path Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Progressive Step Timeline Stepper */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs max-h-[620px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200 mb-2">
            <span className="text-xs font-black text-slate-900">BƯỚC HỌC CHUYÊN SÂU</span>
            <span className="text-[11px] font-bold text-[#4285F4]">{activeStepIdx + 1}/12</span>
          </div>

          {LEARNING_JOURNEY_STEPS.map((s, idx) => {
            const isSelected = activeStepIdx === idx;
            const isDone = completedSteps.includes(s.num);
            return (
              <div
                key={s.id}
                onClick={() => handleStepSelect(idx)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#4285F4] text-white border-[#4285F4] shadow-md'
                    : isDone
                    ? 'bg-emerald-50/80 hover:bg-emerald-100 text-slate-900 border-emerald-200'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className="text-base">{s.emoji}</span>
                  <div>
                    <div className="text-xs font-black leading-snug">{s.label}</div>
                    <div className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'} font-bold`}>{s.desc}</div>
                  </div>
                </div>

                {isDone && !isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Right Column: Step Content Card Display */}
        <div className="lg:col-span-3 card-3d p-8 relative min-h-[500px] border-2 border-slate-200 shadow-md rounded-3xl bg-white flex flex-col justify-between">
          {loading ? (
            <div className="py-24 text-center text-slate-600 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#4285F4]" />
              <p className="text-sm font-black text-slate-900">Đang tổng hợp tri thức Nguồn A cho bước {currentStep.label}...</p>
            </div>
          ) : explanationData ? (
            <div className="space-y-6">
              {/* Step Title Header Banner */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-2xl">
                <div className="flex items-center space-x-2 text-xs font-black text-amber-950">
                  <span className="text-xl">{currentStep.emoji}</span>
                  <span>{currentStep.label} – {currentStep.desc}</span>
                </div>

                {explanationData.source_pages && explanationData.source_pages.length > 0 && (
                  <span className="text-xs font-mono font-black bg-amber-200 text-amber-950 px-3 py-1 rounded-full border border-amber-400">
                    Nguồn A (Trang {explanationData.source_pages.join(', ')})
                  </span>
                )}
              </div>

              {/* Step Explanation Body with Formatted Markdown Rendering */}
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                <FormattedMarkdown content={explanationData.content} />
              </div>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-400">Không có dữ liệu bài giảng.</div>
          )}

          {/* Stepper Navigation Actions */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => activeStepIdx > 0 && handleStepSelect(activeStepIdx - 1)}
              disabled={activeStepIdx === 0}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bước trước</span>
            </button>

            <div className="text-xs font-bold text-slate-600 hidden sm:block">
              Bước {activeStepIdx + 1} / 12
            </div>

            <button
              onClick={() => activeStepIdx < LEARNING_JOURNEY_STEPS.length - 1 && handleStepSelect(activeStepIdx + 1)}
              disabled={activeStepIdx === LEARNING_JOURNEY_STEPS.length - 1}
              className="px-5 py-2.5 bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 disabled:opacity-40"
            >
              <span>Bước tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
