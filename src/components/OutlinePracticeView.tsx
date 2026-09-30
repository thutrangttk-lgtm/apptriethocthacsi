"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { FileText, Send, Loader2, CheckCircle2, Award, AlertCircle } from 'lucide-react';

interface OutlinePracticeViewProps {
  topics: TopicItem[];
}

export const OutlinePracticeView: React.FC<OutlinePracticeViewProps> = ({ topics }) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');
  const [startData, setStartData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [grading, setGrading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  // 6 Structural Parts Form
  const [outlineForm, setOutlineForm] = useState({
    moVanDe: '',
    luanDiemChinh: '',
    phanTich: '',
    yNghiaPhuongPhapLuan: '',
    lienHeThucTien: '',
    ketLuan: ''
  });

  useEffect(() => {
    if (selectedTopicId) {
      fetchOutlineStart(selectedTopicId);
    }
  }, [selectedTopicId]);

  const fetchOutlineStart = async (topicId: string) => {
    setLoading(true);
    setGradeResult(null);
    try {
      const res = await fetch('/api/outline/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: topicId })
      });
      if (res.ok) {
        const data = await res.json();
        setStartData(data);
      }
    } catch (err) {
      console.error("Error starting outline practice:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    setGrading(true);
    try {
      const res = await fetch('/api/outline/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic_id: selectedTopicId,
          outline_structure: outlineForm,
          user_id: '00000000-0000-0000-0000-000000000000'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGradeResult(data);
      }
    } catch (err) {
      console.error("Error grading outline:", err);
    } finally {
      setGrading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="card-3d p-6 bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 text-white shadow-lg border border-blue-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md">
            ✍️
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Lập Dàn Ý Tự Luận 6 Phần</h2>
            <p className="text-xs text-blue-100 font-semibold">
              Rèn luyện kỹ năng xây dựng đề cương tự luận triết học chuẩn mực Nguồn A cho kỳ thi Thạc sĩ.
            </p>
          </div>
        </div>
      </div>

      <div className="card-3d p-4 border border-slate-200">
        <label className="block text-xs font-black text-slate-800 uppercase mb-2">
          Chọn chủ đề lập dàn ý
        </label>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full bg-white text-slate-900 text-xs font-bold p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {topics.map(t => (
            <option key={t.id} value={t.id}>
              Topic {t.topic_number}: {t.title} (Trang {t.source_page_start}-{t.source_page_end})
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="card-3d p-12 text-center text-slate-600 flex flex-col items-center border border-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-blue-700 mb-2" />
          <p className="text-xs font-bold">Đang chuẩn bị đề cương chuyên đề...</p>
        </div>
      ) : startData ? (
        <div className="card-3d p-6 space-y-6 border border-slate-200 shadow-sm">
          <div className="p-4 bg-blue-100/80 border-2 border-blue-300 rounded-2xl">
            <h3 className="text-xs font-black text-blue-950 uppercase tracking-wider mb-1">
              Đề bài tự luận
            </h3>
            <p className="text-sm font-black text-blue-950">
              {startData.prompt}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">1. Mở vấn đề</label>
              <textarea
                value={outlineForm.moVanDe}
                onChange={e => setOutlineForm({ ...outlineForm, moVanDe: e.target.value })}
                placeholder="Đặt vấn đề, tính cấp thiết và giới hạn phạm vi bài làm..."
                rows={2}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">2. Luận điểm chính</label>
              <textarea
                value={outlineForm.luanDiemChinh}
                onChange={e => setOutlineForm({ ...outlineForm, luanDiemChinh: e.target.value })}
                placeholder="Khái quát các luận điểm triết học cơ bản..."
                rows={2}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">3. Phân tích</label>
              <textarea
                value={outlineForm.phanTich}
                onChange={e => setOutlineForm({ ...outlineForm, phanTich: e.target.value })}
                placeholder="Phân tích chi tiết luận chứng theo tinh thần Giáo trình Nguồn A..."
                rows={3}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">4. Ý nghĩa phương pháp luận</label>
              <textarea
                value={outlineForm.yNghiaPhuongPhapLuan}
                onChange={e => setOutlineForm({ ...outlineForm, yNghiaPhuongPhapLuan: e.target.value })}
                placeholder="Rút ra bài học phương pháp luận tư duy và chỉ đạo..."
                rows={2}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">5. Liên hệ thực tiễn</label>
              <textarea
                value={outlineForm.lienHeThucTien}
                onChange={e => setOutlineForm({ ...outlineForm, lienHeThucTien: e.target.value })}
                placeholder="Vận dụng vào thực tiễn Việt Nam hiện nay..."
                rows={2}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">6. Kết luận</label>
              <textarea
                value={outlineForm.ketLuan}
                onChange={e => setOutlineForm({ ...outlineForm, ketLuan: e.target.value })}
                placeholder="Tóm lược đánh giá toàn bộ chuyên đề..."
                rows={2}
                className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={handleGrade}
              disabled={grading}
              className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {grading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Đánh Giá Dàn Ý Cấu Trúc</span>
            </button>
          </div>
        </div>
      ) : null}

      {gradeResult && (
        <div className="card-3d p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 space-y-4 shadow-md">
          <div className="flex items-center justify-between border-b border-blue-300 pb-3">
            <div className="flex items-center space-x-2">
              <Award className="w-6 h-6 text-blue-700" />
              <h3 className="text-base font-black text-blue-950">Kết Quả Đánh Giá Dàn Ý</h3>
            </div>
            <div className="text-2xl font-black text-blue-800 font-mono">
              {gradeResult.score} / 100
            </div>
          </div>

          <p className="text-sm text-slate-900 font-bold">{gradeResult.feedback}</p>

          {gradeResult.missing_components && gradeResult.missing_components.length > 0 && (
            <div className="p-3 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1">
              <span className="font-black">Các phần cấu trúc cần hoàn thiện:</span>
              <ul className="list-disc list-inside font-bold">
                {gradeResult.missing_components.map((comp: string, idx: number) => (
                  <li key={idx}>{comp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
