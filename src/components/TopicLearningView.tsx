"use client";

import React, { useState, useEffect } from 'react';
import { TopicItem } from './ChapterCard';
import { FormattedMarkdown } from './FormattedMarkdown';
import { TermGlossModal, TermDefinition } from './TermGlossModal';
import { HelpModal } from './HelpModal';
import { GlobalSearch } from './GlobalSearch';
import {
  Brain, Zap, BookOpen, Clock, Heart, Key, AlertTriangle, Globe, Lock,
  Mic, FileEdit, GraduationCap, CheckCircle2, ChevronRight, ChevronLeft,
  Loader2, BookMarked, Sparkles, HelpCircle, Send, Award, RefreshCw, Eye, ArrowRight, ArrowLeft, Compass
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

const TOPIC4_GLOSSARY: Record<string, TermDefinition> = {
  'Thế giới quan': {
    term: 'Thế giới quan',
    simple_definition: 'Cách nhìn, niềm tin cốt lõi của một người về bản chất thế giới xung quanh và vị trí của con người trong thế giới đó.',
    example: 'Giáo viên tin rằng "năng lực nói tiếng Anh của học sinh biến đổi và tiến bộ theo quá trình tích lũy thực tế" ➔ Đó là thế giới quan tích cực.',
    textbook_definition: 'Thế giới quan là toàn bộ những quan niệm của con người về thế giới, về bản thân con người, về cuộc sống và vị trí của con người trong thế giới đó (Nguồn A, Trang 13).'
  },
  'Phương pháp luận': {
    term: 'Phương pháp luận',
    simple_definition: 'Hệ thống các nguyên tắc và phương pháp chỉ đạo cách chúng ta suy nghĩ và hành động dựa trên thế giới quan đã chọn.',
    example: 'Xuất phát từ niềm tin học sinh có thể tiến bộ, giáo viên áp dụng hệ thống dạy học giao tiếp CLT và phân hóa bài học ➔ Đó là phương pháp luận.',
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]); // Strict Rule 6: No auto completion on open!
  const [explanationData, setExplanationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Micro-learning sub-step state inside topic learning (Sub-steps 1 to 6)
  const [microSubStep, setMicroSubStep] = useState<number>(1);

  // Interactive Gloss & Help Modal states
  const [activeTermGloss, setActiveTermGloss] = useState<TermDefinition | null>(null);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);

  // Quiz state for sub-steps & step 9
  const [quiz1Answer, setQuiz1Answer] = useState<number | null>(null);
  const [quiz2Answer, setQuiz2Answer] = useState<number | null>(null);

  // Self-explanation Feynman Activity state
  const [feynmanText, setFeynmanText] = useState<string>('');
  const [feynmanSelfChecked, setFeynmanSelfChecked] = useState<Record<number, boolean>>({});

  // Essay practice state
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
      }
    } catch (err) {
      console.error("Error fetching explanation:", err);
    } finally {
      setLoading(false);
    }
  };

  const openGloss = (termName: string) => {
    const termObj = TOPIC4_GLOSSARY[termName] || {
      term: termName,
      simple_definition: `Khái niệm triết học liên quan đến chủ đề ${currentTopic?.title}.`,
      example: 'Vận dụng trong thực tiễn dạy học và nghiên cứu Thạc sĩ.',
      textbook_definition: `Giáo trình Triết học Mác - Lênin (Trang ${currentTopic?.source_page_start || 13}-${currentTopic?.source_page_end || 16}).`
    };
    setActiveTermGloss(termObj);
  };

  const handleManualStepComplete = (stepNum: number) => {
    setCompletedSteps(prev => Array.from(new Set([...prev, stepNum])));
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
      {/* 🔍 GLOBAL KEYWORD & NATURAL LANGUAGE SEARCH BAR */}
      <GlobalSearch onSelectTopic={onSelectTopic} onOpenTermGloss={openGloss} />

      {/* Top Banner with Learner Identity & Clear Topic Information */}
      <div className="card-3d p-6 bg-pastel-blue rounded-3xl border-2 border-blue-200/80 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#34A853] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xs">
                BÀI HỌC VI MÔ TỪNG BƯỚC (MICRO-LEARNING)
              </span>
              <span className="bg-[#FBBC04] text-slate-950 text-[11px] font-black px-3 py-1 rounded-full">
                {completedSteps.length} / 12 bước hoàn thành (Chỉ ghi nhận khi thực hiện hoạt động kiểm tra)
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

      {/* Main Learning Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Stepper Column */}
        <div className="lg:col-span-1 space-y-2 bg-white p-4 rounded-3xl border-2 border-slate-200 shadow-xs max-h-[650px] overflow-y-auto">
          <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200 mb-2">
            <span className="text-xs font-black text-slate-900">12 BƯỚC HỌC VI MÔ</span>
            <span className="text-[11px] font-bold text-[#4285F4]">{activeStepIdx + 1}/12</span>
          </div>

          {LEARNING_JOURNEY_STEPS.map((s, idx) => {
            const isSelected = activeStepIdx === idx;
            const isDone = completedSteps.includes(s.num);
            return (
              <div
                key={s.id}
                onClick={() => setActiveStepIdx(idx)}
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

        {/* Right Content Workspace */}
        <div className="lg:col-span-3 card-3d p-6 sm:p-8 relative min-h-[550px] border-2 border-slate-200 shadow-md rounded-3xl bg-white flex flex-col justify-between">
          {loading ? (
            <div className="py-24 text-center text-slate-600 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-10 h-10 animate-spin text-[#4285F4]" />
              <p className="text-sm font-black text-slate-900">Đang nạp tri thức Nguồn A cho bước {currentStep.label}...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Top Action Header Bar */}
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

                  <span className="text-xs font-mono font-black bg-amber-200 text-amber-950 px-3 py-1 rounded-full border border-amber-400 shrink-0">
                    Nguồn A (Trang 13–16)
                  </span>
                </div>
              </div>

              {/* MICRO-SUB-STEPPING NAVIGATION FOR TRIAL LESSON */}
              <div className="flex items-center justify-between bg-blue-50/70 p-2.5 rounded-2xl border border-blue-200 text-xs font-black">
                <span className="text-[#172554]">MỤC CON: Phần {microSubStep}/6</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setMicroSubStep(prev => Math.max(1, prev - 1))}
                    disabled={microSubStep === 1}
                    className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-lg border border-slate-300 disabled:opacity-40 flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Xem lại</span>
                  </button>
                  <button
                    onClick={() => setMicroSubStep(prev => Math.min(6, prev + 1))}
                    disabled={microSubStep === 6}
                    className="px-3 py-1 bg-[#4285F4] hover:bg-blue-600 text-white rounded-lg shadow-xs disabled:opacity-40 flex items-center space-x-1"
                  >
                    <span>Tiếp tục</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* SUB-STEP 1: Anchor Scenario */}
              {microSubStep === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-hero rounded-2xl border-2 border-blue-200 space-y-3 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#172554]">
                      <Sparkles className="w-5 h-5 text-[#FBBC04]" />
                      <span>1. TÌNH HUỐNG MỞ ĐẦU (Lớp học Tiếng Anh)</span>
                    </div>

                    <p className="text-sm text-slate-800 font-medium leading-relaxed">
                      Hãy bắt đầu bằng một tình huống thực tế quen thuộc trong giảng dạy:
                    </p>

                    <div className="p-4 bg-white/90 rounded-2xl border border-blue-300 space-y-2 text-xs text-slate-900 leading-relaxed font-medium">
                      <p className="font-bold text-[#172554]">Học sinh Nam học tiếng Anh nhiều tháng nhưng chưa tiến bộ ở kỹ năng nói:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-800">
                        <li><strong className="text-[#EA4335]">Giáo viên A nghĩ:</strong> "Em này bẩm sinh không có năng khiếu ngoại ngữ, không giỏi ăn nói."</li>
                        <li><strong className="text-[#34A853]">Giáo viên B tìm hiểu:</strong> Khảo sát thực tế cách học của Nam, thời gian tự luyện tập ở nhà, vốn từ vựng tích lũy và môi trường thực hành giao tiếp.</li>
                      </ul>
                    </div>

                    {/* Requirement 2 Disclaimer */}
                    <div className="p-3 bg-amber-100/90 border border-amber-300 rounded-xl text-xs text-amber-950 font-bold space-y-1">
                      <span>⚠️ Lưu ý quan trọng:</span>
                      <p className="font-normal text-slate-800">
                        Đây là ví dụ minh họa thực tế giúp người học dễ hình dung khái niệm, <strong>KHÔNG PHẢI định nghĩa đầy đủ trong giáo trình</strong> và <strong>KHÔNG DÙNG để đánh giá hay dán nhãn một con người ngoài đời thực</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 2: Concept 1 - Thế Giới Quan */}
              {microSubStep === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-blue rounded-2xl border-2 border-blue-300 space-y-4 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#172554]">
                      <Brain className="w-5 h-5 text-[#4285F4]" />
                      <span>KHÁI NIỆM 1: THẾ GIỚI QUAN</span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="p-3 bg-white rounded-xl border border-blue-200">
                        <strong className="text-[#172554]">1. Nói dễ hiểu:</strong> Thế giới quan là "mắt kính nhìn đời" – toàn bộ những niềm tin và quan niệm của bạn về bản chất thế giới xung quanh.
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-blue-200">
                        <strong className="text-[#172554]">2. Ví dụ cụ thể (Chỉ rõ chi tiết trong tình huống):</strong> 
                        <span className="text-slate-800 font-medium"> Chi tiết Giáo viên B tin rằng "năng lực tiếng Anh của Nam phát triển phụ thuộc vào thời gian tích lũy thực tế và môi trường giao tiếp" chính là thể hiện Thế giới quan duy vật khoa học.</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs italic text-slate-700">
                        <strong className="text-slate-900 not-italic">3. Định nghĩa chuẩn Giáo trình:</strong> "Thế giới quan là toàn bộ những quan niệm của con người về thế giới, về bản thân con người, về cuộc sống và vị trí của con người trong thế giới đó" (Nguồn A, Trang 13).
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium">
                        <strong className="text-rose-900">4. Dễ nhầm:</strong> Cho rằng Thế giới quan chỉ là lý thuyết suông. <em>Lý do sai:</em> Thế giới quan chi phối 100% suy nghĩ và thái độ ứng xử thực tế của bạn.
                      </div>
                    </div>

                    {/* Micro-Quiz 1 */}
                    <div className="pt-2 p-4 bg-white rounded-2xl border border-blue-200 space-y-2">
                      <div className="text-xs font-black text-[#172554]">❓ Câu hỏi ngắn: Chi tiết nào dưới đây thể hiện Thế giới quan của Giáo viên B?</div>
                      <div className="space-y-2">
                        {[
                          { text: 'A. Niềm tin rằng năng lực nói tiếng Anh của Nam biến đổi phụ thuộc vào lượng từ vựng và môi trường thực hành.', correct: true, exp: 'Chính xác! Niềm tin về bản chất sự vận động năng lực là Thế giới quan.' },
                          { text: 'B. Việc chia nhóm Pair-work cho học sinh luyện nói.', correct: false, exp: 'Chưa đúng. Chia nhóm là phương pháp hành động (Phương pháp luận), chưa phải niềm tin định hướng.' }
                        ].map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setQuiz1Answer(oIdx)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                              quiz1Answer === oIdx
                                ? opt.correct
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                                  : 'bg-rose-100 text-rose-950 border-rose-400 font-black'
                                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {opt.text}
                            {quiz1Answer === oIdx && (
                              <div className="mt-1.5 text-[11px] font-normal border-t border-slate-200 pt-1 text-slate-800">
                                <strong>Giải thích:</strong> {opt.exp}
                                {!opt.correct && (
                                  <div className="mt-1 text-blue-900 font-bold bg-blue-50 p-2 rounded-lg">
                                    💡 Gợi ý dễ hơn để thử lại: Thế giới quan là NGHĨ VỀ BẢN CHẤT (Kính bạn đeo), còn Phương pháp luận là HÀNH ĐỘNG CỤ THỂ.
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 3: Concept 2 - Phương Pháp Luận */}
              {microSubStep === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-cream rounded-2xl border-2 border-amber-300 space-y-4 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#B45309]">
                      <Compass className="w-5 h-5 text-[#FBBC04]" />
                      <span>KHÁI NIỆM 2: PHƯƠNG PHÁP LUẬN</span>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm">
                      <div className="p-3 bg-white rounded-xl border border-amber-200">
                        <strong className="text-[#B45309]">1. Nói dễ hiểu:</strong> Phương pháp luận là "bản đồ chỉ đạo hành động" – hệ thống các nguyên tắc xuất phát từ thế giới quan để chỉ đạo cách ta làm việc.
                      </div>

                      <div className="p-3 bg-white rounded-xl border border-amber-200">
                        <strong className="text-[#B45309]">2. Ví dụ cụ thể (Chỉ rõ chi tiết trong tình huống):</strong> 
                        <span className="text-slate-800 font-medium"> Chi tiết Giáo viên B chọn hệ thống nguyên tắc dạy học giao tiếp CLT (Scaffolding bài học, tạo môi trường an toàn) xuất phát từ niềm tin Nam cần môi trường tích lũy thực tế chính là Phương pháp luận.</span>
                      </div>

                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-300 text-xs italic text-slate-700">
                        <strong className="text-slate-900 not-italic">3. Định nghĩa chuẩn Giáo trình:</strong> "Phương pháp luận là hệ thống những quan điểm, những nguyên tắc xuất phát có tính chất chỉ đạo việc sử dụng các phương pháp trong hoạt động nhận thức và hoạt động thực tiễn" (Nguồn A, Trang 15).
                      </div>

                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-950 font-medium">
                        <strong className="text-rose-900">4. Dễ nhầm:</strong> Đơn giản hóa phương pháp luận thành một mẹo vặt (tip/trick) riêng lẻ. <em>Lý do sai:</em> Phương pháp luận là HỆ THỐNG CÁC NGUYÊN TẮC CHỈ ĐẠO bao trùm, quyết định việc bạn chọn mẹo vặt nào cho đúng.
                      </div>
                    </div>

                    {/* Micro-Quiz 2 */}
                    <div className="pt-2 p-4 bg-white rounded-2xl border border-amber-200 space-y-2">
                      <div className="text-xs font-black text-[#B45309]">❓ Câu hỏi ngắn: Vì sao phương pháp sư phạm CLT của Giáo viên B thuộc về Phương pháp luận?</div>
                      <div className="space-y-2">
                        {[
                          { text: 'A. Vì đó là hệ thống nguyên tắc chỉ đạo hành động dạy học xuất phát từ thế giới quan khoa học.', correct: true, exp: 'Chính xác! Hệ thống nguyên tắc chỉ đạo hành động giảng dạy chính là Phương pháp luận.' },
                          { text: 'B. Vì đó chỉ là một mẹo nhỏ để quản lý lớp học.', correct: false, exp: 'Chưa đúng. Phương pháp luận không phải mẹo nhỏ đơn lẻ, mà là hệ thống nguyên tắc chỉ đạo.' }
                        ].map((opt, oIdx) => (
                          <button
                            key={oIdx}
                            onClick={() => setQuiz2Answer(oIdx)}
                            className={`w-full p-2.5 rounded-xl text-left text-xs font-bold transition-all border ${
                              quiz2Answer === oIdx
                                ? opt.correct
                                  ? 'bg-emerald-100 text-emerald-950 border-emerald-400 font-black'
                                  : 'bg-rose-100 text-rose-950 border-rose-400 font-black'
                                : 'bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {opt.text}
                            {quiz2Answer === oIdx && (
                              <div className="mt-1.5 text-[11px] font-normal border-t border-slate-200 pt-1 text-slate-800">
                                <strong>Giải thích:</strong> {opt.exp}
                                {!opt.correct && (
                                  <div className="mt-1 text-amber-900 font-bold bg-amber-50 p-2 rounded-lg">
                                    💡 Gợi ý dễ hơn: Mẹo là "viên gạch", Phương pháp luận là "bản thiết kế ngôi nhà" chỉ đạo cách xây.
                                  </div>
                                )}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 4: Detailed Comparison Table */}
              {microSubStep === 4 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-lavender rounded-2xl border-2 border-purple-300 space-y-4 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#6366F1]">
                      <BookOpen className="w-5 h-5 text-[#6366F1]" />
                      <span>BẢNG SO SÁNH CHI TIẾT: THẾ GIỚI QUAN vs. PHƯƠNG PHÁP LUẬN</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left border-collapse bg-white rounded-xl overflow-hidden shadow-2xs border border-purple-200">
                        <thead>
                          <tr className="bg-purple-100 text-[#172554] font-black border-b border-purple-200">
                            <th className="p-3">Tiêu chí</th>
                            <th className="p-3 text-[#4285F4]">Thế Giới Quan</th>
                            <th className="p-3 text-[#B45309]">Phương Pháp Luận</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-purple-100 text-slate-800 font-medium">
                          <tr>
                            <td className="p-3 font-bold bg-purple-50/50">Bản chất / Ý nghĩa</td>
                            <td className="p-3">Toàn bộ quan niệm, niềm tin về bản chất thế giới và con người.</td>
                            <td className="p-3">Hệ thống các nguyên tắc chỉ đạo hoạt động nhận thức và thực tiễn.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold bg-purple-50/50">Câu hỏi trả lời</td>
                            <td className="p-3">Thế giới này là gì? Sự vật vận hành theo bản chất nào?</td>
                            <td className="p-3">Ta phải suy nghĩ và hành động như thế nào cho đúng quy luật?</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold bg-purple-50/50">Ví dụ dạy Tiếng Anh</td>
                            <td className="p-3">Tin rằng năng lực nói tiếng Anh của học sinh phát triển nhờ tích lũy thực tế.</td>
                            <td className="p-3">Xây dựng hệ thống dạy học giao tiếp CLT & bài tập phân hóa Scaffolding.</td>
                          </tr>
                          <tr>
                            <td className="p-3 font-bold bg-purple-50/50">Mối quan hệ cốt lõi</td>
                            <td className="p-3 font-bold text-[#4285F4]">Giữ vai trò quyết định, chỉ đạo phương pháp luận.</td>
                            <td className="p-3 font-bold text-[#B45309]">Là sự thể hiện và thực hiện thế giới quan trong thực tế.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 5: Feynman Self-Explanation Activity (Requirement 6 Self-Rubric) */}
              {microSubStep === 5 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-mint rounded-2xl border-2 border-emerald-300 space-y-4 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#34A853]">
                      <Mic className="w-5 h-5 text-[#34A853]" />
                      <span>HOẠT ĐỘNG: NÓI LẠI BẰNG LỜI CỦA BẠN (PHƯƠNG PHÁP FEYNMAN)</span>
                    </div>

                    <p className="text-xs text-slate-800 font-bold">
                      Hãy thử tự giải thích mối quan hệ giữa Thế giới quan và Phương pháp luận bằng ngôn ngữ đơn giản nhất:
                    </p>

                    <textarea
                      value={feynmanText}
                      onChange={(e) => setFeynmanText(e.target.value)}
                      placeholder="Nhập lời tự giải thích của bạn tại đây..."
                      rows={4}
                      className="w-full p-4 bg-white border border-emerald-300 rounded-2xl text-slate-900 font-medium text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#34A853]"
                    />

                    {/* Self-Rubric Checklist (Requirement 6: Clear Self-Evaluation, No AI Pretending!) */}
                    <div className="p-4 bg-white/90 rounded-2xl border border-emerald-200 space-y-2">
                      <div className="text-xs font-black text-[#34A853] flex items-center justify-between">
                        <span>📋 Tiêu Chí Tự Đối Chiếu (Tự đánh giá bài của bạn):</span>
                        <span className="text-[10px] text-slate-500 font-bold">(Tích vào tiêu chí bạn đã làm tốt)</span>
                      </div>

                      {[
                        '1. Đã nêu được Thế giới quan là cách nhìn / niềm tin về bản chất sự vật chưa?',
                        '2. Đã nêu được Phương pháp luận là hệ thống nguyên tắc chỉ đạo hành động chưa?',
                        '3. Đã thể hiện được Thế giới quan quyết định / chỉ đạo Phương pháp luận chưa?',
                        '4. Cách giải thích có dễ hiểu, không bị lặp lại từ ngữ rắc rối không?'
                      ].map((criterion, cIdx) => (
                        <label key={cIdx} className="flex items-center space-x-2 text-xs text-slate-800 cursor-pointer font-medium">
                          <input
                            type="checkbox"
                            checked={!!feynmanSelfChecked[cIdx]}
                            onChange={(e) => setFeynmanSelfChecked(prev => ({ ...prev, [cIdx]: e.target.checked }))}
                            className="w-4 h-4 text-[#34A853] rounded border-slate-300 focus:ring-[#34A853]"
                          />
                          <span>{criterion}</span>
                        </label>
                      ))}
                    </div>

                    {/* Sample Reference Response */}
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                      <span className="font-black">Câu trả lời tham khảo:</span>
                      <p className="font-medium italic">
                        "Thế giới quan giống như chiếc kính bạn đeo. Nếu đeo kính râm màu đen, bạn nhìn thấy thế giới âm u và quyết định mang theo ô (Phương pháp luận). Nhìn thế giới ra sao (Thế giới quan) sẽ chỉ đạo cách ta hành động như thế ấy (Phương pháp luận)."
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUB-STEP 6: Sentence-by-Sentence Essay Guidance & Evidence Distinction */}
              {microSubStep === 6 && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="p-5 bg-pastel-pink rounded-2xl border-2 border-pink-300 space-y-4 shadow-2xs">
                    <div className="flex items-center space-x-2 text-sm font-black text-[#EA4335]">
                      <FileEdit className="w-5 h-5 text-[#EA4335]" />
                      <span>HƯỚNG DẪN TẬP VIẾT LUẬN TỪNG CÂU VẬN DỤNG</span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-800 font-medium">
                      <div className="font-black text-[#172554]">Cấu trúc 5 câu hướng dẫn cụ thể:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                        <div className="p-2 bg-white rounded-lg border border-pink-200"><strong>Câu 1:</strong> Nêu ý chính vận dụng</div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200"><strong>Câu 2:</strong> Giải thích lý luận (Nguồn A)</div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200"><strong>Câu 3:</strong> Ví dụ minh họa lớp học</div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200"><strong>Câu 4:</strong> Bằng chứng nghiên cứu thạc sĩ</div>
                        <div className="p-2 bg-white rounded-lg border border-pink-200"><strong>Câu 5:</strong> Liên hệ & Kết luận</div>
                      </div>
                    </div>

                    {/* Model Essay Paragraph with Sentence Breakdown */}
                    <div className="p-4 bg-white rounded-2xl border border-pink-200 space-y-3">
                      <div className="text-xs font-black text-[#EA4335]">Đoạn văn mẫu Thạc sĩ (Phân tích chi tiết từng câu):</div>
                      <p className="text-xs text-slate-900 leading-relaxed font-medium">
                        <span className="bg-yellow-100 text-yellow-950 font-bold px-1 rounded">[Câu 1 - Nêu ý]:</span> Trong thực tiễn giảng dạy Tiếng Anh, thế giới quan duy vật biện chứng đóng vai trò chỉ đạo trực tiếp đối với phương pháp luận sư phạm của tôi. 
                        <span className="bg-blue-100 text-blue-950 font-bold px-1 rounded ml-1">[Câu 2 - Lý luận Nguồn A]:</span> Tôi nhận thức rằng năng lực ngôn ngữ của học sinh không phải thuộc tính bẩm sinh cố định, mà là kết quả của quá trình tích lũy về lượng dẫn đến sự thay đổi về chất trong môi trường thực tiễn (Nguồn A, Trang 13-16). 
                        <span className="bg-emerald-100 text-emerald-950 font-bold px-1 rounded ml-1">[Câu 3 - Ví dụ minh họa]:</span> Ví dụ minh họa thực tế là việc tôi thiết kế các bài tập giao tiếp theo cặp (CLT) và cung cấp gợi ý từ vựng (Scaffolding) giúp học sinh bớt sợ sai. 
                        <span className="bg-purple-100 text-purple-950 font-bold px-1 rounded ml-1">[Câu 4 - Phân biệt bằng chứng]:</span> Cần lưu ý phân biệt: ví dụ minh họa lớp học giúp hình dung phương pháp, còn luận văn thạc sĩ đòi hỏi bằng chứng nghiên cứu qua dữ liệu khảo sát thực nghiệm. 
                        <span className="bg-pink-100 text-pink-950 font-bold px-1 rounded ml-1">[Câu 5 - Kết luận]:</span> Như vậy, thế giới quan khoa học là kim chỉ nam giúp tôi lựa chọn phương pháp luận giảng dạy và nghiên cứu hiệu quả.
                      </p>
                    </div>

                    {/* Requirement 7 Evidence Distinction Box */}
                    <div className="p-3.5 bg-amber-100 border border-amber-300 rounded-xl text-xs text-amber-950 space-y-1 font-bold">
                      <span>💡 Phân biệt quan trọng giữa Ví dụ minh họa và Bằng chứng nghiên cứu:</span>
                      <p className="font-normal text-slate-900 leading-relaxed">
                        - <strong>Ví dụ minh họa (Illustrative Example):</strong> Dùng tình huống giảng dạy lớp học để người đọc dễ hình dung khái niệm.<br />
                        - <strong>Bằng chứng nghiên cứu (Empirical Evidence):</strong> Trong luận văn Thạc sĩ, bằng chứng phải dựa trên dữ liệu khảo sát, số liệu đo lường thực nghiệm khoa học.
                      </p>
                    </div>

                    {/* Final Complete Action */}
                    <button
                      onClick={() => handleManualStepComplete(11)}
                      className="w-full py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Hoàn Thành Bài Thử "Thế Giới Quan & Phương Pháp Luận"</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper Bottom Actions */}
          <div className="pt-6 mt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              onClick={() => activeStepIdx > 0 && setActiveStepIdx(prev => prev - 1)}
              disabled={activeStepIdx === 0}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl border border-slate-300 transition-colors flex items-center space-x-1.5 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Bước trước</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleManualStepComplete(currentStep.num)}
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
              onClick={() => activeStepIdx < LEARNING_JOURNEY_STEPS.length - 1 && setActiveStepIdx(prev => prev + 1)}
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
