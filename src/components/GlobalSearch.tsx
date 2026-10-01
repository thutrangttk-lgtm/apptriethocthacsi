"use client";

import React, { useState, useEffect } from 'react';
import { Search, X, BookOpen, Sparkles, Filter, ChevronRight, Lightbulb, ArrowRight } from 'lucide-react';
import { TermGlossModal, TermDefinition } from './TermGlossModal';

interface GlobalSearchProps {
  onSelectTopic: (topicId: string) => void;
  onOpenTermGloss?: (termName: string) => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelectTopic, onOpenTermGloss }) => {
  const [query, setQuery] = useState<string>('');
  const [filter, setFilter] = useState<'all' | 'lessons' | 'terms'>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedTerm, setSelectedTerm] = useState<TermDefinition | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 0) {
        performSearch(query, filter);
      } else {
        setSearchResults(null);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, filter]);

  const performSearch = async (q: string, f: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, filter: f })
      });
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const highlightKeyword = (text: string, kw: string) => {
    if (!text || !kw) return text;
    const parts = text.split(new RegExp(`(${kw})`, 'gi'));
    return (
      <span>
        {parts.map((part, idx) =>
          part.toLowerCase() === kw.toLowerCase() ? (
            <mark key={idx} className="bg-amber-200 text-[#172554] font-black px-1 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Search Input Bar */}
      <div className="relative card-3d p-2 bg-white rounded-2xl border-2 border-blue-200/90 shadow-md">
        <div className="flex items-center space-x-3 px-3">
          <Search className="w-5 h-5 text-[#4285F4] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên bài, thuật ngữ (vật chất, ý thức...) hoặc câu hỏi bình thường (cách nhìn thế giới)..."
            className="w-full py-2.5 text-xs sm:text-sm font-bold text-[#172554] placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query.length > 0 && (
            <button
              onClick={() => {
                setQuery('');
                setSearchResults(null);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      {query.trim().length > 0 && (
        <div className="flex items-center space-x-2 text-xs font-black">
          <span className="text-slate-600 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-[#4285F4]" />
            <span>Lọc kết quả:</span>
          </span>

          {[
            { id: 'all', label: 'Tất cả' },
            { id: 'lessons', label: 'Bài học' },
            { id: 'terms', label: 'Thuật ngữ' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setFilter(t.id as any)}
              className={`px-3 py-1 rounded-xl transition-all ${
                filter === t.id
                  ? 'bg-[#4285F4] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Search Results Display Area */}
      {loading ? (
        <div className="p-6 text-center text-slate-500 text-xs font-bold flex items-center justify-center space-x-2">
          <div className="w-4 h-4 rounded-full border-2 border-[#4285F4] border-t-transparent animate-spin" />
          <span>Đang tìm kiếm tri thức Triết học Nguồn A...</span>
        </div>
      ) : searchResults ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Matched Terms */}
          {searchResults.terms && searchResults.terms.length > 0 && filter !== 'lessons' && (
            <div className="space-y-2">
              <div className="text-xs font-black text-[#6366F1] uppercase tracking-wide flex items-center space-x-1.5">
                <Lightbulb className="w-4 h-4 text-[#FBBC04]" />
                <span>Thuật ngữ Triết học tìm thấy ({searchResults.terms.length})</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {searchResults.terms.map((t: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const termObj: TermDefinition = {
                        term: t.term,
                        simple_definition: t.definition,
                        example: 'Vận dụng trong thực tiễn giảng dạy Tiếng Anh và nghiên cứu Thạc sĩ.',
                        textbook_definition: `Định nghĩa chuẩn Giáo trình (Nguồn A, ${t.pages}).`
                      };
                      setSelectedTerm(termObj);
                    }}
                    className="card-3d p-4 bg-pastel-lavender border border-purple-200 hover:border-purple-400 cursor-pointer transition-all space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#172554]">{t.term}</span>
                      <span className="text-[10px] font-mono bg-purple-100 text-purple-950 px-2 py-0.5 rounded-full font-bold">
                        {t.pages}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      {t.definition}
                    </p>
                    <div className="text-[11px] font-black text-[#6366F1] flex items-center space-x-1 pt-1">
                      <span>Bấm xem giải nghĩa chi tiết</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched Topics / Lessons */}
          {searchResults.topics && searchResults.topics.length > 0 && filter !== 'terms' && (
            <div className="space-y-3">
              <div className="text-xs font-black text-[#172554] uppercase tracking-wide flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-[#4285F4]" />
                <span>Bài học liên quan ({searchResults.topics.length})</span>
              </div>

              <div className="space-y-3">
                {searchResults.topics.map((t: any) => (
                  <div
                    key={t.topic_id}
                    className="card-3d p-5 bg-white border-2 border-slate-200 hover:border-blue-300 transition-all rounded-2xl space-y-2 shadow-2xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black text-[#4285F4] uppercase bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                          Chương {t.chapter_number}: {t.chapter_title}
                        </span>
                        <h4 className="text-base font-black text-[#172554] mt-1">
                          Topic {t.topic_number}: {highlightKeyword(t.title, searchResults.query)}
                        </h4>
                      </div>

                      <button
                        onClick={() => onSelectTopic(t.topic_id)}
                        className="px-4 py-2 bg-[#4285F4] hover:bg-blue-600 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center space-x-1.5 shrink-0 self-start sm:self-center"
                      >
                        <span>Mở bài học</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {highlightKeyword(t.snippet, searchResults.query)}
                    </p>

                    <div className="text-[11px] font-mono font-bold text-slate-500 pt-1">
                      Căn cứ Giáo trình Nguồn A (Trang {t.source_page_start}-{t.source_page_end})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Results Handling & Real Suggestions */}
          {searchResults.topics?.length === 0 && searchResults.terms?.length === 0 && (
            <div className="p-6 card-3d bg-slate-50 border border-slate-200 text-center space-y-3 rounded-2xl">
              <div className="text-2xl">🔍</div>
              <div className="text-sm font-black text-[#172554]">
                Không tìm thấy kết quả khớp cho từ khóa "{searchResults.query}"
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Gợi ý các từ khóa bài học có sẵn trong dữ liệu giáo trình:
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                {searchResults.suggestions.map((sug: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(sug)}
                    className="px-3 py-1.5 bg-white hover:bg-blue-50 text-[#4285F4] font-bold text-xs rounded-xl border border-blue-200 shadow-2xs transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Term Gloss Modal Popup from Search */}
      <TermGlossModal
        term={selectedTerm}
        onClose={() => setSelectedTerm(null)}
      />
    </div>
  );
};
