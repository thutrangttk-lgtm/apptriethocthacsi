"use client";

import React, { useState, useEffect } from 'react';
import { Lock, Clock, ShieldCheck, AlertCircle, Award, CheckCircle2, Send, Loader2 } from 'lucide-react';

export const ClosedBookExamView: React.FC = () => {
  const [mode, setMode] = useState<'15min' | '30min' | 'component_40'>('15min');
  const [examState, setExamState] = useState<'intro' | 'active' | 'submitted'>('intro');
  const [examData, setExamData] = useState<any>(null);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<any>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (examState === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [examState, timeLeft]);

  const handleStartExam = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, user_id: '00000000-0000-0000-0000-000000000000' })
      });
      if (res.ok) {
        const data = await res.json();
        setExamData(data);
        setTimeLeft((data.duration_minutes || 15) * 60);
        setUserAnswers({});
        setExamState('active');
      }
    } catch (err) {
      console.error("Error starting exam:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitExam = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exam_attempt_id: examData?.exam_attempt_id || 'exam-demo',
          answers: userAnswers,
          user_id: '00000000-0000-0000-0000-000000000000'
        })
      });
      if (res.ok) {
        const data = await res.json();
        setGradeResult(data);
        setExamState('submitted');
      }
    } catch (err) {
      console.error("Error submitting exam:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 🔒 Closed-Book Visual Focus Mode Banner */}
      <div className="card-3d p-6 bg-pastel-lavender rounded-3xl border-2 border-purple-300 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FBBC04] text-slate-950 flex items-center justify-center font-black text-2xl shadow-md border border-amber-400">
            🔒
          </div>
          <div>
            <span className="text-[11px] font-black tracking-widest text-slate-950 uppercase bg-[#FBBC04] px-2.5 py-0.5 rounded-full shadow-xs">
              CHẾ ĐỘ TỰ LUẬN ĐÓNG SÁCH
            </span>
            <h2 className="text-xl font-black mt-1 text-[#172554]">ĐANG THI ĐÓNG SÁCH</h2>
          </div>
        </div>

        {examState === 'active' && (
          <div className="flex items-center space-x-2 bg-amber-400 text-amber-950 font-mono font-black text-lg px-4 py-2 rounded-2xl shadow-lg border border-amber-500/30 animate-pulse">
            <Clock className="w-5 h-5 text-amber-950" />
            <span>{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Intro Screen */}
      {examState === 'intro' && (
        <div className="card-3d p-8 space-y-6 border border-slate-200 shadow-md">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-blue-950">Chọn Chế Độ Luyện Thi Đóng Sách</h3>
            <p className="text-xs text-slate-700 font-bold leading-relaxed">
              Chế độ thi bảo mật: Đã ẩn toàn bộ giáo trình, ghi chú và trích dẫn Nguồn A. Chỉ sử dụng kiến thức bạn đã ghi nhớ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => setMode('15min')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === '15min' ? 'bg-blue-50 border-blue-700 ring-2 ring-blue-600 shadow-md' : 'bg-white border-slate-300 hover:border-blue-400'
              }`}
            >
              <div className="font-black text-sm text-blue-950">15 Phút</div>
              <div className="text-xs text-slate-700 font-bold mt-1">Khởi động nhanh (5 câu hỏi)</div>
            </div>

            <div
              onClick={() => setMode('30min')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === '30min' ? 'bg-blue-50 border-blue-700 ring-2 ring-blue-600 shadow-md' : 'bg-white border-slate-300 hover:border-blue-400'
              }`}
            >
              <div className="font-black text-sm text-blue-950">30 Phút</div>
              <div className="text-xs text-slate-700 font-bold mt-1">Ôn tập chuyên sâu (10 câu hỏi)</div>
            </div>

            <div
              onClick={() => setMode('component_40')}
              className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                mode === 'component_40' ? 'bg-blue-50 border-blue-700 ring-2 ring-blue-600 shadow-md' : 'bg-white border-slate-300 hover:border-blue-400'
              }`}
            >
              <div className="font-black text-sm text-blue-950">40 Phút (Bộ phần 40%)</div>
              <div className="text-xs text-slate-700 font-bold mt-1">Mô phỏng bài thi chính thức</div>
            </div>
          </div>

          <div className="pt-4">
            <button
              onClick={handleStartExam}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-sm rounded-xl shadow-lg shadow-blue-500/25 hover:scale-[1.01] transition-all flex items-center justify-center space-x-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5 text-amber-300" />}
              <span>BẮT ĐẦU BÀI THI ĐÓNG SÁCH</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Exam Questions Workspace */}
      {examState === 'active' && examData && (
        <div className="space-y-6">
          {examData.questions.map((q: any, idx: number) => (
            <div key={q.id} className="card-3d p-6 space-y-4 border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-700 text-white flex items-center justify-center font-black text-xs shrink-0">
                  {idx + 1}
                </span>
                <h4 className="text-sm font-black text-blue-950 leading-snug">
                  {q.question_text}
                </h4>
              </div>

              {q.options && q.options.length > 0 ? (
                <div className="space-y-2 pt-2">
                  {q.options.map((opt: string, oIdx: number) => (
                    <label
                      key={oIdx}
                      className={`p-3.5 rounded-xl border-2 flex items-center space-x-3 cursor-pointer transition-colors ${
                        userAnswers[q.id] === opt ? 'bg-blue-100/90 border-blue-600 font-black text-blue-950 shadow-2xs' : 'bg-slate-50 border-slate-300 hover:bg-blue-50/60 font-bold text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={userAnswers[q.id] === opt}
                        onChange={() => setUserAnswers({ ...userAnswers, [q.id]: opt })}
                        className="text-blue-700 focus:ring-blue-600 w-4 h-4"
                      />
                      <span className="text-xs leading-normal">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  value={userAnswers[q.id] || ''}
                  onChange={e => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                  placeholder="Nhập câu trả lời tự luận đóng sách..."
                  rows={4}
                  className="w-full p-3 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              )}
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmitExam}
              disabled={submitting}
              className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center space-x-2"
            >
              {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>NỘP BÀI THI CHÍNH THỨC</span>
            </button>
          </div>
        </div>
      )}

      {/* Submitted Result */}
      {examState === 'submitted' && gradeResult && (
        <div className="card-3d p-8 bg-gradient-to-br from-blue-900 to-indigo-950 text-white space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <h3 className="text-xl font-extrabold">Kết Quả Bài Thi Đóng Sách</h3>
                <p className="text-xs text-blue-200">Đánh giá tự động theo đáp án bảo mật Nguồn A</p>
              </div>
            </div>

            <div className="text-3xl font-black text-yellow-300 font-mono">
              {gradeResult.score} / 100
            </div>
          </div>

          <p className="text-sm text-blue-100 font-medium">{gradeResult.feedback}</p>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setExamState('intro')}
              className="px-6 py-2.5 bg-yellow-400 text-yellow-950 font-bold text-xs rounded-xl shadow-md"
            >
              Trở Về Màn Hình Thi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
