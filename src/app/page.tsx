"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DashboardView } from '@/components/DashboardView';
import { ChapterCard, ChapterItem, TopicItem } from '@/components/ChapterCard';
import { TopicLearningView } from '@/components/TopicLearningView';
import { KnowledgeMapView } from '@/components/KnowledgeMapView';
import { ActiveRecallView } from '@/components/ActiveRecallView';
import { OutlinePracticeView } from '@/components/OutlinePracticeView';
import { ClosedBookExamView } from '@/components/ClosedBookExamView';
import { MasteryDashboardView } from '@/components/MasteryDashboardView';
import { createClient } from '@supabase/supabase-js';
import { Loader2, Map, Layers } from 'lucide-react';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_kIMMGjU_t9bmIHrroddb0Q_49n-h3oM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [chaptersSubView, setChaptersSubView] = useState<'grid' | 'map'>('grid');
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [allTopics, setAllTopics] = useState<TopicItem[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchCurriculumData();
  }, []);

  const fetchCurriculumData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Chapters from Supabase
      const { data: chData, error: chErr } = await supabase
        .from('chapters')
        .select('id, chapter_number, title, source_page_start, source_page_end')
        .order('chapter_number', { ascending: true });

      // 2. Fetch Topics from Supabase
      const { data: topData, error: topErr } = await supabase
        .from('topics')
        .select('id, chapter_id, topic_number, title, source_page_start, source_page_end')
        .order('source_page_start', { ascending: true });

      if (!chErr && chData && !topErr && topData) {
        setAllTopics(topData as TopicItem[]);

        const chapterList: ChapterItem[] = chData.map((ch) => {
          const chTopics = topData.filter((t) => t.chapter_id === ch.id) as TopicItem[];
          return {
            id: ch.id,
            chapter_number: ch.chapter_number,
            title: ch.title,
            source_page_start: ch.source_page_start,
            source_page_end: ch.source_page_end,
            topics: chTopics
          };
        });

        setChapters(chapterList);
        if (topData.length > 0) {
          setSelectedTopicId(topData[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching curriculum data from Supabase:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicId(topicId);
    setActiveTab('topic');
  };

  return (
    <div className="min-h-screen bg-[#F3F8FF] bg-gradient-to-b from-[#F3F8FF] via-white to-[#FFF0F6] flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {loading ? (
          <div className="py-24 text-center text-slate-600 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#4285F4]" />
            <p className="text-sm font-black text-slate-900">Đang đồng bộ 11 Chương & 150 Chủ đề Triết học từ Supabase live...</p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView
                chapters={chapters}
                onSelectTopic={handleSelectTopic}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'chapters' && (
              <div className="max-w-7xl mx-auto space-y-6 pb-16">
                <div className="card-3d p-6 bg-pastel-blue rounded-3xl border-2 border-blue-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="bg-[#4285F4] text-white text-[11px] font-black px-3 py-1 rounded-full shadow-2xs">
                      GIÁO TRÌNH CHUẨN NGUỒN A
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-[#172554] mt-2">Danh Sách 11 Chương & 150 Chủ Đề</h2>
                    <p className="text-xs text-[#475569] font-bold mt-1">
                      Tra cứu toàn bộ chương mục Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo, Trang 7-556)
                    </p>
                  </div>

                  {/* Secondary Function Switcher inside Learn section */}
                  <div className="flex items-center space-x-2 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
                    <button
                      onClick={() => setChaptersSubView('grid')}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                        chaptersSubView === 'grid' ? 'bg-[#4285F4] text-white shadow-md' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Layers className="w-4 h-4" />
                      <span>11 Chương</span>
                    </button>
                    <button
                      onClick={() => setChaptersSubView('map')}
                      className={`px-3 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 ${
                        chaptersSubView === 'map' ? 'bg-[#4285F4] text-white shadow-md' : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      <Map className="w-4 h-4" />
                      <span>Sơ đồ Tri thức</span>
                    </button>
                  </div>
                </div>

                {chaptersSubView === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map((ch) => (
                      <ChapterCard
                        key={ch.id}
                        chapter={ch}
                        onSelectTopic={handleSelectTopic}
                      />
                    ))}
                  </div>
                ) : (
                  <KnowledgeMapView />
                )}
              </div>
            )}

            {activeTab === 'topic' && (
              <TopicLearningView
                topics={allTopics}
                selectedTopicId={selectedTopicId}
                onSelectTopic={setSelectedTopicId}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'map' && <KnowledgeMapView />}

            {activeTab === 'recall' && <ActiveRecallView topics={allTopics} />}

            {activeTab === 'outline' && <OutlinePracticeView topics={allTopics} />}

            {activeTab === 'exam' && <ClosedBookExamView />}

            {activeTab === 'mastery' && <MasteryDashboardView />}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-600 mb-12 md:mb-0">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-bold text-slate-800">
            <span className="text-base">🎓</span>
            <span>TRIẾT HỌC THẠC SĨ • Giáo trình Nguồn A (Trang 7–556)</span>
          </div>
          <div className="text-slate-900 font-extrabold bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200">
            Học viên: TRẦN THỊ THU TRANG — Lớp CHTA.HCE2608
          </div>
        </div>
      </footer>
    </div>
  );
}
