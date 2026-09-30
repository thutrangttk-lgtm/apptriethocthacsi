"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { Lock, Clock, CheckCircle2, RefreshCw, Send, Loader2, Award, Sparkles } from 'lucide-react';

interface ActiveRecallViewProps {
  topics: TopicItem[];
}

export const ActiveRecallView: React.FC<ActiveRecallViewProps> = ({ topics }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [promptData, setPromptData] = useState<any>(null);
  const [userResponse, setUserResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [grading, setGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  useEffect(() => {
    if (selectedTopicId) {
      fetchRecallPrompt(selectedTopicId);
    }
  }, [selectedTopicId]);

  const fetchRecallPrompt = async (topicId: string) => {
    setLoading(true);
    setGradeResult(null);
    setUserResponse('');
    try {
      const res = await fetch('/api/recall/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topicId })
      });
      if (res.ok) {
        const data = await res.json();
        setPromptData(data);
      }
    } catch (err) {
      console.error("Error starting active recall:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!userResponse.trim()) return;
    setGrading(true);
    try {
      const res = await fetch('/api/recall/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          response: userResponse,
          user_id: '00000000-0000-0000-0000-000000000000'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGradeResult(data);
      }
    } catch (err) {
      console.error("Error grading recall response:", err);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="card-3d p-6 bg-pastel-pink border-2 border-pink-200/80 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EA4335] text-white flex items-center justify-center font-black text-xl shadow-md">
            🙈
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#172554]">Active Recall (Đóng Sách Tự Nhớ)</h2>
            <p className="text-xs text-[#475569] font-bold">
              Phương pháp ghi nhớ ngắt quãng cốt lõi: Tự tái hiện tri thức mà không nhìn giáo trình.
            </p>
          </div>
        </div>
      </div>

      {/* Topic Selector */}
      <div className="card-3d p-4 border border-slate-200">
        <label className="block text-xs font-black text-slate-800 uppercase mb-2">
          Chọn chủ đề ôn tập
        </label>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full bg-white text-slate-900 text-xs font-bold p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          {topics.map(t => (
            <option key={t.id} value={t.id}>
              Topic {t.topic_number}: {t.title} (Trang {t.source_page_start}-{t.source_page_end})
            </option>
          ))}
        </select>
      </div>

      {/* Prompt & Practice Card */}
      <div className="card-3d p-6 space-y-4 border border-slate-200 shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-slate-600 flex flex-col items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
            <p className="text-xs font-bold">Đang khởi tạo câu hỏi tự nhớ...</p>
          </div>
        ) : promptData ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-100/90 border-2 border-amber-300 rounded-2xl">
              <h3 className="text-xs font-black text-amber-950 uppercase tracking-wider mb-1">
                Yêu cầu tự nhớ
              </h3>
              <p className="text-sm font-black text-blue-950 leading-snug">
                {promptData.prompt}
              </p>
            </div>

            {/* Answer Workspace */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                Câu trả lời của bạn (Viết tự do theo trí nhớ)
              </label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Nhập nội dung khái niệm, bản chất và ý nghĩa mà bạn nhớ được..."
                rows={6}
                className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => fetchRecallPrompt(selectedTopicId)}
                className="px-4 py-2 bg-slate-100 text-slate-800 hover:bg-slate-200 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5"
              >
                <RefreshCw className="w-4 h-4 text-slate-700" />
                <span>Đổi câu khác</span>
              </button>

              <button
                onClick={handleGrade}
                disabled={grading || !userResponse.trim()}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs rounded-xl shadow-md border border-amber-500/30 transition-all flex items-center space-x-2 disabled:opacity-50"
              >
                {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                <span>Nộp Bài & Chấm Điểm</span>
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {/* Grading Result Feedback */}
      {gradeResult && (
        <div className="card-3d p-6 bg-gradient-to-br from-emerald-50 to-blue-50 border-2 border-emerald-300 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-emerald-300 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-emerald-700" />
              <h3 className="text-base font-black text-emerald-950">Kết Quả Chấm Tự Nhớ</h3>
            </div>
            <div className="text-2xl font-black text-emerald-800 font-mono">
              {gradeResult.score} / 100
            </div>
          </div>

          <p className="text-sm text-slate-900 leading-relaxed font-bold">
            {gradeResult.feedback}
          </p>

          {gradeResult.missing_ideas && gradeResult.missing_ideas.length > 0 && (
            <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1">
              <span className="font-black">Các ý cần bổ sung:</span>
              <ul className="list-disc list-inside font-bold">
                {gradeResult.missing_ideas.map((idea: string, idx: number) => (
                  <li key={idx}>{idea}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
