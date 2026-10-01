"use client";

import React from 'react';
import { X, BookOpen, Sparkles, Lightbulb } from 'lucide-react';

export interface TermDefinition {
  term: string;
  simple_definition: string;
  example: string;
  textbook_definition: string;
}

interface TermGlossModalProps {
  term: TermDefinition | null;
  onClose: () => void;
}

export const TermGlossModal: React.FC<TermGlossModalProps> = ({ term, onClose }) => {
  if (!term) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
      <div className="card-3d bg-white max-w-lg w-full p-6 space-y-5 rounded-3xl border-2 border-blue-300 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#4285F4] text-white flex items-center justify-center font-black text-lg shadow-md">
            💡
          </div>
          <div>
            <span className="text-[10px] font-black text-[#4285F4] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
              Giải nghĩa thuật ngữ dễ hiểu
            </span>
            <h3 className="text-xl font-black text-[#172554] mt-0.5">{term.term}</h3>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          {/* 1. Simple Everyday Explanation */}
          <div className="p-4 bg-pastel-blue rounded-2xl border border-blue-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#172554] uppercase tracking-wide">
              <Lightbulb className="w-4 h-4 text-[#FBBC04]" />
              <span>Giải thích đơn giản (Ngôn ngữ bình dân)</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              {term.simple_definition}
            </p>
          </div>

          {/* 2. Real Life / Teaching Example */}
          <div className="p-4 bg-pastel-cream rounded-2xl border border-amber-200/80 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-black text-[#B45309] uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#FBBC04]" />
              <span>Ví dụ minh họa thực tế (Lớp học Tiếng Anh)</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              {term.example}
            </p>
          </div>

          {/* 3. Official Textbook Definition */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center space-x-1.5 text-xs font-black text-slate-700 uppercase tracking-wide">
              <BookOpen className="w-4 h-4 text-[#4285F4]" />
              <span>Định nghĩa chuẩn Giáo trình (Nguồn A, Trang 13-16)</span>
            </div>
            <p className="text-slate-700 text-xs italic leading-relaxed font-normal">
              "{term.textbook_definition}"
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-md transition-all"
          >
            Đã hiểu thuật ngữ này!
          </button>
        </div>
      </div>
    </div>
  );
};
