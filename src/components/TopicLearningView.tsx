"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { FormattedMarkdown } from './FormattedMarkdown';
import { TermGlossModal, TermDefinition } from './TermGlossModal';
import { HelpModal } from './HelpModal';
import {
  Brain, Zap, BookOpen, Clock, Heart, Key, AlertTriangle, Globe, Lock,
  Mic, FileEdit, GraduationCap, CheckCircle2, ChevronRight, ChevronLeft,
  Loader2, BookMarked, Sparkles, HelpCircle, Send, Award, RefreshCw, Eye
} from 'lucide-react';

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

// Gloss dictionary for Topic 4 philosophy terms
const TOPIC4_GLOSSARY: Record<string, TermDefinition> = {
  'Thế giới quan': {
    term: 'Thế giới quan',
    simple_definition: 'Cách nhìn, niềm tin cốt lõi của một người về bản chất thế giới xung quanh và vị trí của con người trong thế giới đó.',
    example: 'Giáo viên tin rằng "học sinh nào cũng có thể tiến bộ nếu có môi trường học đúng" ➔ Đó là thế giới quan tích cực.',
    textbook_definition: 'Thế giới quan là toàn bộ những quan niệm của con người về thế giới, về bản thân con người, về cuộc sống và vị trí của con người trong thế giới đó (Nguồn A, Trang 13).'
  },
  'Phương pháp luận': {
    term: 'Phương pháp luận',
    simple_definition: 'Hệ thống các nguyên tắc và phương pháp chỉ đạo cách chúng ta suy nghĩ và hành động dựa trên thế giới quan đã chọn.',
    example: 'Xuất phát từ niềm tin học sinh có thể tiến bộ, giáo viên áp dụng phương pháp dạy học giao tiếp (CLT) và phân hóa bài học ➔ Đó là phương pháp luận.',
    textbook_definition: 'Phương pháp luận là hệ thống những quan điểm, những nguyên tắc xuất phát có tính chất chỉ đạo việc sử dụng các phương pháp trong hoạt động nhận thức và hoạt động thực tiễn (Nguồn A, Trang 15).'
  },
  'Duy vật biện chứng': {
    term: 'Duy vật biện chứng',
    simple_definition: 'Nhìn nhận mọi vật trong thực tế luôn vận động, biến đổi và chịu ảnh hưởng lẫn nhau, lấy thực tế khách quan làm gốc.',
    example: 'Nhận thức trình độ Tiếng Anh của học sinh thay đổi từng ngày nhờ tích lũy thực hành, không phải do cố định từ nhỏ.',
    textbook_definition: 'Chủ nghĩa duy vật biện chứng là sự thống nhất giữa chủ nghĩa duy vật và phép biện chứng, coi thế giới vật chất vận động theo những quy luật khách quan (Nguồn A, Trang 14).'
  },
  'Duy tâm': {
    term: 'Duy tâm',
    simple_definition: 'Cho rằng ý thức, tư tưởng hay duyên số quyết định tất cả, coi nhẹ thực tế khách quan.',
    example: 'Cho rằng học sinh không nói được Tiếng Anh chỉ vì "không có năng khiếu trời cho", bỏ qua phương pháp dạy và nỗ lực thực tế.',
    textbook_definition: 'Chủ nghĩa duy tâm là hệ thống triết học cho rằng ý thức, tinh thần là cái có trước và quyết định thế giới vật chất (Nguồn A, Trang 14).'
  }
};

export const TopicLearningView: React.FC<TopicLearningViewProps> = ({
  topics,
  selectedTopicId,
  onSelectTopic,
  setActiveTab
}) => {
  const currentTopicId = selectedTopicId || (topics.length > 0 ? topics[0].id : null);
  const currentTopic = topics.find(t => t.id === currentTopicId) || topics[0];

  const [activeStepIdx, setActiveStepIdx] = useState<number>(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]); // Strict rule: No auto-complete on open!
  const [explanationData, setExplanationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Interactive Gloss & Help Modal states
  const [activeTermGloss, setActiveTermGloss] = useState<TermDefinition | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Step 9: Quiz state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Step 11: Essay Practice state
  const [essayText, setEssayText] = useState<string>('');
  const [essaySubmitted, setEssaySubmitted] = useState<boolean>(false);

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
        // NOTE: Strict Requirement 6: Do NOT auto-mark completed on fetch!
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

  const handleQuizOptionSelect = (qId: string, optionIdx: number) => {
    setSelectedAnswers(prev => ({ ...prev, [qId]: optionIdx }));
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    // Requirement 6: Record completion ONLY when quiz check is performed!
    setCompletedSteps(prev => Array.from(new Set([...prev, 9])));
  };

  const handleEssaySubmit = () => {
    if (!essayText.trim()) return;
    setEssaySubmitted(true);
    // Requirement 6: Record completion ONLY when essay activity is performed!
    setCompletedSteps(prev => Array.from(new Set([...prev, 11])));
  };

  const markCurrentStepCompleteManually = () => {
    setCompletedSteps(prev => Array.from(new Set([...prev, currentStep.num])));
  };

  const openGloss = (termName: string) => {
    const termObj = TOPIC4_GLOSSARY[termName] || {
      term: termName,
      simple_definition: `Khái niệm triết học cốt lõi liên quan đến chủ đề ${currentTopic?.title}.`,
      example: 'Vận dụng trong thực tiễn dạy học và nghiên cứu khoa học Thạc sĩ.',
      textbook_definition: `Trích dẫn từ Giáo trình Triết học Mác - Lênin (Trang ${currentTopic?.source_page_start || 13}-${currentTopic?.source_page_end || 16}).`
    };
    setActiveTermGloss(termObj);
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
      {/* Learner Identity & Topic Banner */}
      <div className="card-3d p-6 bg-pastel-blue rounded-3xl border-2 border-blue-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#34A853] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xs">
                HÀNH TRÌNH HỌC TẬP TỪNG BƯỚC
              </span>
              <span className="bg-[#FBBC04] text-slate-950 text-[11px] font-black px-3 py-1 rounded-full">
                {completedSteps.length} / 12 bước hoàn thành (Chỉ ghi nhận khi làm bài kiểm tra)
              </span>
              <span className="bg-blue-100 text-[#172554] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-blue-300">
                TRẦN THỊ THU TRANG • CHTA.HCE2608
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#172554] leading-tight">
              Topic {currentTopic.topic_number}: {currentTopic.title}
            </h2>
            <div className="flex items-center space-x-2 text-xs text-[#475569] font-bold">
              <BookMarked className="w-4 h-4 text-[#4285F4]" />
              <span>Căn cứ Giáo trình Nguồn A (Trang {currentTopic.source_page_start || 13} – {currentTopic.source_page_end || 16})</span>
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

      {/* 12-Step Learning Stepper & Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column Stepper */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs max-h-[620px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200 mb-2">
            <span className="text-xs font-black text-slate-900">12 BƯỚC HỌC CHUYÊN SÂU</span>
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

        {/* Right Column Step Display Workspace */}
        <div className="lg:col-span-3 card-3d p-6 sm:p-8 relative min-h-[550px] border-2 border-slate-200 shadow-md rounded-3xl bg-white flex flex-col justify-between">
          {loading ? (
            <div className="py-24 text-center text-slate-600 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#4285F4]" />
              <p className="text-sm font-black text-slate-900">Đang tổng hợp tri thức Nguồn A cho bước {currentStep.label}...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header Action Strip with 'Mình chưa hiểu' button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl gap-3">
                <div className="flex items-center space-x-2 text-xs font-black text-amber-950">
                  <span className="text-xl">{currentStep.emoji}</span>
                  <span>{currentStep.label} – {currentStep.desc}</span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsHelpModalOpen(true)}
                    className="px-3.5 py-1.5 bg-[#EA4335] hover:bg-red-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center space-x-1.5 shrink-0"
                  >
                    <HelpCircle className="w-4 h-4" />
                    <span>Mình chưa hiểu</span>
                  </button>

                  {explanationData?.source_pages && (
                    <span className="text-xs font-mono font-black bg-amber-200 text-amber-950 px-3 py-1 rounded-full border border-amber-400 shrink-0">
                      Nguồn A (Trang {currentTopic.source_page_start || 13}–{currentTopic.source_page_end || 16})
                    </span>
                  )}
                </div>
              </div>

              {/* Step 1 Extra: "Học để làm gì?" Section */}
              {activeStepIdx === 0 && (
                <div className="p-5 bg-pastel-hero rounded-2xl border-2 border-blue-200 space-y-3 shadow-2xs">
                  <div className="flex items-center space-x-2 text-sm font-black text-[#172554]">
                    <Sparkles className="w-5 h-5 text-[#FBBC04]" />
                    <span>HỌC ĐỂ LÀM GÌ? (Dành riêng cho Học viên Thạc sĩ Tiếng Anh)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 bg-white/90 rounded-xl border border-blue-200 space-y-1">
                      <div className="font-black text-[#172554]">🏡 Trong Cuộc Sống</div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        Giúp bạn hiểu vì sao người khác có góc nhìn khác mình, từ đó lắng nghe, bớt phán xét và xử lý xung đột tích cực.
                      </p>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-amber-200 space-y-1">
                      <div className="font-black text-[#B45309]">🏫 Trong Dạy Tiếng Anh</div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        Xem học sinh là "chủ thể chủ động tích lũy ngôn ngữ" (Thế giới quan) ➔ Chọn phương pháp dạy giao tiếp CLT & Scaffolding (Phương pháp luận).
                      </p>
                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-purple-200 space-y-1">
                      <div className="font-black text-[#6366F1]">🎓 Trong Nghiên Cứu Thạc Sĩ</div>
                      <p className="text-slate-700 leading-relaxed font-medium">
                        Xây dựng Khung lý thuyết (Theoretical Framework) mạch lạc để định hướng Phương pháp nghiên cứu (Research Methodology) cho luận văn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5 Interactive Term Cards */}
              {activeStepIdx === 4 && (
                <div className="p-5 bg-pastel-lavender rounded-2xl border-2 border-purple-200 space-y-3 shadow-2xs">
                  <div className="text-xs font-black text-[#6366F1] uppercase tracking-wide">
                    👉 Bấm vào từng thuật ngữ để xem giải nghĩa đơn giản & ví dụ:
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {Object.keys(TOPIC4_GLOSSARY).map((termName) => (
                      <button
                        key={termName}
                        onClick={() => openGloss(termName)}
                        className="p-3 bg-white hover:bg-purple-50 text-[#172554] rounded-xl border border-purple-300 shadow-2xs font-black text-xs text-center transition-all hover:scale-102 flex flex-col items-center justify-center space-y-1"
                      >
                        <span className="text-lg">💡</span>
                        <span>{termName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 9 Interactive Quiz Section (Active Recall Verification) */}
              {activeStepIdx === 8 ? (
                <div className="space-y-6">
                  <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl">
                    <h3 className="text-sm font-black text-amber-950 uppercase tracking-wider mb-1">
                      🙈 Kiểm Tra Tự Nhớ (3 Câu Hỏi Thử Hiểu)
                    </h3>
                    <p className="text-xs text-amber-900 font-bold">
                      Trả lời 3 câu hỏi dưới đây để kiểm tra mức độ thấu hiểu bài học và ghi nhận hoàn thành bước học!
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        id: 'q1',
                        q: 'Câu 1: Một giáo viên dạy Tiếng Anh tin rằng: "Mọi học sinh đều có thể tiến bộ nếu được tạo môi trường giao tiếp phù hợp và cung cấp từ vựng chuẩn". Quan điểm này thuộc về khái niệm nào?',
                        opts: [
                          { text: 'A. Thế giới quan duy vật biện chứng', correct: true, exp: 'Chính xác! Niềm tin lấy thực tế khách quan (môi trường, từ vựng) và khả năng biến đổi tiến bộ của học sinh làm gốc là Thế giới quan duy vật biện chứng.' },
                          { text: 'B. Thế giới quan duy tâm thần bí', correct: false, exp: 'Chưa đúng. Duy tâm thần bí sẽ tin rằng năng khiếu là do trời cho hoặc số phận quy định, không thay đổi được.' },
                          { text: 'C. Phương pháp luận giảng dạy đơn lẻ', correct: false, exp: 'Chưa đúng. Đây là niềm tin định hướng (thế giới quan), chưa phải là phương pháp cụ thể.' }
                        ]
                      },
                      {
                        id: 'q2',
                        q: 'Câu 2: Mối quan hệ giữa Thế giới quan và Phương pháp luận được mô tả chính xác nhất như thế nào?',
                        opts: [
                          { text: 'A. Thế giới quan quyết định phương pháp luận; phương pháp luận là sự thể hiện của thế giới quan.', correct: true, exp: 'Chính xác! Bạn tin vào cái gì (Thế giới quan) sẽ chỉ đạo cách bạn làm cái đó (Phương pháp luận).' },
                          { text: 'B. Phương pháp luận độc lập hoàn toàn, không liên quan đến thế giới quan.', correct: false, exp: 'Chưa đúng. Không ai chọn phương pháp hành động mà không dựa trên niềm tin hay góc nhìn của mình.' },
                          { text: 'C. Hai khái niệm này là một, không có điểm phân biệt.', correct: false, exp: 'Chưa đúng. Thế giới quan là góc nhìn/quan niệm; Phương pháp luận là hệ thống nguyên tắc hành động.' }
                        ]
                      },
                      {
                        id: 'q3',
                        q: 'Câu 3: Trong nghiên cứu Thạc sĩ, việc bạn xác định cách nhìn nhận đối tượng nghiên cứu trước khi chọn công cụ thu thập dữ liệu thể hiện điều gì?',
                        opts: [
                          { text: 'A. Vai trò chỉ đạo của thế giới quan đối với phương pháp luận nghiên cứu', correct: true, exp: 'Chính xác! Khung lý thuyết (Thế giới quan) phải được xác định trước để chỉ đạo việc chọn công cụ nghiên cứu (Phương pháp luận).' },
                          { text: 'B. Việc chọn ngẫu nhiên không theo quy luật', correct: false, exp: 'Chưa đúng. Nghiên cứu khoa học thạc sĩ đòi hỏi sự mạch lạc giữa thế giới quan và phương pháp luận.' }
                        ]
                      }
                    ].map((item, idx) => (
                      <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div className="text-sm font-black text-[#172554]">{item.q}</div>
                        <div className="space-y-2">
                          {item.opts.map((opt, oIdx) => {
                            const isSelected = selectedAnswers[item.id] === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleQuizOptionSelect(item.id, oIdx)}
                                className={`w-full p-3 rounded-xl text-left text-xs font-bold transition-all border ${
                                  isSelected
                                    ? opt.correct
                                      ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                                      : 'bg-rose-100 text-rose-950 border-rose-400 font-black'
                                    : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100'
                                }`}
                              >
                                {opt.text}
                                {quizSubmitted && isSelected && (
                                  <div className="mt-2 text-xs font-normal border-t border-slate-200/60 pt-1.5 text-slate-800">
                                    <strong>Giải thích:</strong> {opt.exp}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-3 bg-[#34A853] hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md transition-all"
                    >
                      Nộp Bài Kiểm Tra & Ghi Nhận Hoàn Thành Bước 9
                    </button>
                  </div>
                </div>
              ) : activeStepIdx === 10 ? (
                /* Step 11: Essay Practice Section */
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 border-2 border-blue-300 rounded-2xl">
                    <h3 className="text-sm font-black text-[#172554] uppercase tracking-wider mb-1">
                      ✍️ Tập Viết Luận Vận Dụng (100–150 từ)
                    </h3>
                    <p className="text-xs text-slate-700 font-bold">
                      Viết một đoạn văn ngắn vận dụng mối quan hệ giữa Thế giới quan và Phương pháp luận vào thực tiễn dạy học Tiếng Anh hoặc nghiên cứu Thạc sĩ.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <textarea
                      value={essayText}
                      onChange={(e) => setEssayText(e.target.value)}
                      placeholder="Nhập bài viết của bạn tại đây (khoảng 100-150 từ)..."
                      rows={5}
                      className="w-full p-4 bg-white border border-slate-300 rounded-2xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#4285F4]"
                    />

                    <button
                      onClick={handleEssaySubmit}
                      disabled={!essayText.trim()}
                      className="px-6 py-2.5 bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                      Nộp Bài & Xem Đoạn Văn Mẫu Thạc Sĩ
                    </button>
                  </div>

                  {essaySubmitted && (
                    <div className="p-5 bg-pastel-hero border-2 border-blue-300 rounded-2xl space-y-4">
                      <div className="flex items-center space-x-2 text-sm font-black text-[#172554]">
                        <Award className="w-5 h-5 text-[#FBBC04]" />
                        <span>Đoạn Văn Mẫu Thạc Sĩ & Giải Thích Lập Luận</span>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-blue-200 text-xs text-slate-800 leading-relaxed font-medium">
                        "Trong thực tiễn giảng dạy Tiếng Anh, thế giới quan duy vật biện chứng đóng vai trò chỉ đạo trực tiếp đối với phương pháp luận sư phạm của tôi. Tôi nhận thức rằng năng lực ngôn ngữ của học sinh không phải là một thuộc tính cố định hay phụ thuộc vào bẩm sinh, mà là kết quả của quá trình tích lũy về lượng dẫn đến sự thay đổi về chất trong môi trường thực tiễn giao tiếp (Nguồn A, Trang 13-16). Từ thế giới quan đó, về phương pháp luận, tôi áp dụng hệ thống giảng dạy giao tiếp (CLT) kết hợp với các nhiệm vụ học tập phân hóa (Scaffolding). Thay vì chỉ trích khi học sinh mắc lỗi, tôi tạo môi trường an toàn để các em thực hành và tích lũy phản xạ. Như vậy, thế giới quan khoa học là kim chỉ nam giúp tôi lựa chọn phương pháp sư phạm hiệu quả, nâng cao chất lượng dạy học Tiếng Anh."
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-700">
                        <div className="font-black text-[#172554]">Phân tích cách lập luận từng câu:</div>
                        <ul className="list-disc list-inside space-y-1 font-medium">
                          <li><strong>Câu 1 (Mở bài):</strong> Nêu trực tiếp luận điểm vận dụng thế giới quan duy vật biện chứng vào phương pháp luận giảng dạy.</li>
                          <li><strong>Câu 2 (Cơ sở lý luận):</strong> Trích dẫn định nghĩa thế giới quan duy vật và dẫn chiếu Nguồn A (Trang 13-16).</li>
                          <li><strong>Câu 3-4 (Phương pháp luận):</strong> Trình bày phương pháp cụ thể (dạy giao tiếp CLT, scaffolding, tạo môi trường an toàn).</li>
                          <li><strong>Câu 5 (Kết luận):</strong> Khẳng định vai trò chỉ đạo của thế giới quan đối với phương pháp luận.</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Formatted Markdown Content Display */
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <FormattedMarkdown content={explanationData?.content || ''} />
                </div>
              )}
            </div>
          )}

          {/* Stepper Navigation Actions & Manual Completion Button */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => activeStepIdx > 0 && handleStepSelect(activeStepIdx - 1)}
              disabled={activeStepIdx === 0}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bước trước</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={markCurrentStepCompleteManually}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                  completedSteps.includes(currentStep.num)
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#34A853]" />
                <span>{completedSteps.includes(currentStep.num) ? 'Đã hoàn thành bước này' : 'Đánh dấu đã hiểu bước này'}</span>
              </button>
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

      {/* Interactive Term Gloss Modal */}
      <TermGlossModal
        term={activeTermGloss}
        onClose={() => setActiveTermGloss(null)}
      />

      {/* 'Mình chưa hiểu' Interactive Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        onOpenTermGloss={(termName) => {
          setIsHelpModalOpen(false);
          openGloss(termName);
        }}
      />
    </div>
  );
};
