"use client";

import React, { useState } from 'react';
import { X, HelpCircle, Lightbulb, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTermGloss?: (termName: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onOpenTermGloss }) => {
  const [selectedOption, setSelectedOption] = useState<'simpler' | 'another_example' | 'hard_terms' | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="card-3d bg-white max-w-xl w-full p-6 space-y-5 rounded-3xl border-2 border-pink-300 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            setSelectedOption(null);
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-[#EA4335] text-white flex items-center justify-center font-black text-xl shadow-md">
            🤔
          </div>
          <div>
            <span className="text-[10px] font-black text-[#EA4335] uppercase tracking-wider bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-200">
              Trợ giúp học tập cá nhân hóa
            </span>
            <h3 className="text-xl font-black text-[#172554] mt-0.5">Mình chưa hiểu đoạn này?</h3>
          </div>
        </div>

        {/* Option Selector Buttons */}
        {!selectedOption ? (
          <div className="space-y-3 pt-2">
            <p className="text-xs text-slate-600 font-bold">
              Đừng lo lắng! Bạn muốn hệ thống hỗ trợ theo cách nào?
            </p>

            <button
              onClick={() => setSelectedOption('simpler')}
              className="w-full p-4 rounded-2xl border-2 border-blue-200 bg-pastel-blue hover:bg-blue-100/80 transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">💡</span>
                <div>
                  <div className="text-sm font-black text-[#172554]">1. Giải thích đơn giản hơn nữa</div>
                  <div className="text-xs text-slate-600 font-semibold">Dùng hình ảnh ẩn dụ đời sống quen thuộc (Chiếc kính & Đôi chân)</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#4285F4] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setSelectedOption('another_example')}
              className="w-full p-4 rounded-2xl border-2 border-amber-200 bg-pastel-cream hover:bg-amber-100/80 transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏫</span>
                <div>
                  <div className="text-sm font-black text-[#172554]">2. Cho ví dụ khác trong Tiếng Anh</div>
                  <div className="text-xs text-slate-600 font-semibold">Ví dụ thực tế trong giờ dạy nói & xử lý lỗi của học sinh</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#B45309] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setSelectedOption('hard_terms')}
              className="w-full p-4 rounded-2xl border-2 border-purple-200 bg-pastel-lavender hover:bg-purple-100/80 transition-all text-left flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📖</span>
                <div>
                  <div className="text-sm font-black text-[#172554]">3. Giải nghĩa các từ khó</div>
                  <div className="text-xs text-slate-600 font-semibold">Từ điển giải thích 4 thuật ngữ cốt lõi siêu ngắn gọn</div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-[#6366F1] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : (
          /* Option Content Display */
          <div className="space-y-4 pt-1">
            <button
              onClick={() => setSelectedOption(null)}
              className="text-xs font-bold text-[#4285F4] hover:underline flex items-center space-x-1"
            >
              <span>← Chọn cách trợ giúp khác</span>
            </button>

            {selectedOption === 'simpler' && (
              <div className="p-5 bg-pastel-blue rounded-2xl border-2 border-blue-300 space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-sm font-black text-[#172554]">
                  <Lightbulb className="w-5 h-5 text-[#FBBC04]" />
                  <span>Hình Ảnh Ẩn Dụ "Chiếc Kính Mắt & Đôi Chân"</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  Hãy tưởng tượng bạn đi ra đường và đeo một <strong>Chiếc kính râm màu đen</strong> (đó là <em>Thế giới quan</em>). 
                  Bạn nhìn thấy trời âm u và quyết định <strong>mang theo ô</strong> (đó là <em>Phương pháp luận</em>).
                </p>
                <p className="text-sm text-slate-800 leading-relaxed font-medium">
                  Nếu bạn đeo <strong>Kính màu hồng</strong>, bạn thấy cảnh vật tươi vui và quyết định <strong>đi dạo</strong>.
                </p>
                <div className="p-3 bg-white/90 rounded-xl border border-blue-200 text-xs font-black text-[#172554]">
                  👉 Tóm lại: Bạn đeo kính màu gì (Thế giới quan), bạn sẽ quyết định hành động như thế ấy (Phương pháp luận)!
                </div>
              </div>
            )}

            {selectedOption === 'another_example' && (
              <div className="p-5 bg-pastel-cream rounded-2xl border-2 border-amber-300 space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-sm font-black text-[#B45309]">
                  <Sparkles className="w-5 h-5 text-[#FBBC04]" />
                  <span>Ví Dụ Lớp Học Tiếng Anh: Sửa Lỗi Nói Cho Học Sinh</span>
                </div>
                <div className="space-y-2 text-sm text-slate-800 font-medium leading-relaxed">
                  <p>
                    <strong>1. Thế giới quan duy vật khoa học:</strong> Cô Trang tin rằng <em>"Mắc lỗi là bước tất yếu khi học ngôn ngữ mới, không phải học sinh dốt hay lười"</em>.
                  </p>
                  <p>
                    <strong>2. Phương pháp luận tương ứng:</strong> Trong giờ nói Tiếng Anh, cô Trang không ngắt lời trừ điểm lỗi sai ngay lập tức (khiến học sinh sợ). Thay vào đó, cô ghi nốt lỗi lại và tổ chức chữa lỗi chung cả lớp ở cuối giờ.
                  </p>
                  <div className="p-3 bg-white/90 rounded-xl border border-amber-200 text-xs font-black text-[#B45309]">
                    👉 Góc nhìn đúng ➔ Áp dụng phương pháp sư phạm nhân văn và hiệu quả!
                  </div>
                </div>
              </div>
            )}

            {selectedOption === 'hard_terms' && (
              <div className="p-5 bg-pastel-lavender rounded-2xl border-2 border-purple-300 space-y-3 shadow-sm">
                <div className="flex items-center space-x-2 text-sm font-black text-[#6366F1]">
                  <BookOpen className="w-5 h-5 text-[#6366F1]" />
                  <span>Giải Nghĩa 4 Thuật Ngữ Cốt Lõi (Click để xem chi tiết)</span>
                </div>

                <div className="space-y-2">
                  {[
                    { term: 'Thế giới quan', desc: 'Mắt kính nhìn đời – Niềm tin về bản chất thế giới' },
                    { term: 'Phương pháp luận', desc: 'Bản đồ hành động – Nguyên tắc chỉ đạo công việc' },
                    { term: 'Duy vật biện chứng', desc: 'Nhìn sự vật trong thực tế luôn vận động và biến đổi' },
                    { term: 'Duy tâm', desc: 'Coi ý thức/tinh thần hay duyên số quyết định tất cả' }
                  ].map((t, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        if (onOpenTermGloss) onOpenTermGloss(t.term);
                      }}
                      className="p-3 bg-white rounded-xl border border-purple-200 hover:border-purple-400 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <span className="text-xs font-black text-[#172554]">{t.term}: </span>
                        <span className="text-xs text-slate-700 font-medium">{t.desc}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-purple-600" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              setSelectedOption(null);
              onClose();
            }}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl transition-all"
          >
            Đóng bảng trợ giúp
          </button>
        </div>
      </div>
    </div>
  );
};
