/**
 * src/app/api/search/route.ts
 * Global Keyword & Natural Language Search API Endpoint for Official Philosophy App.
 * Supports Vietnamese diacritics / non-diacritics, case-insensitivity, synonym mapping,
 * topic filtering, and term glossing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Vietnamese diacritics remover helper
function removeVietnameseDiacritics(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

// Everyday Natural Language & Synonym Dictionary
const SYNONYM_DICTIONARY: Record<string, string[]> = {
  'cach nhin the gioi': ['thế giới quan', 'duy vật', 'duy tâm'],
  'cach nghi': ['thế giới quan', 'tư duy lý luận'],
  'cach lam': ['phương pháp luận', 'thực tiễn'],
  'viet luan': ['lập dàn ý', 'luận văn', 'tự luận'],
  'day tieng anh': ['vận dụng', 'thực tiễn', 'sư phạm'],
  'nghien cuu': ['phương pháp luận', 'khung lý thuyết'],
  'vat chat': ['chủ nghĩa duy vật', 'thực tại khách quan'],
  'y thuc': ['tinh thần', 'tư duy', 'nhận thức'],
  'mau thuan': ['phép biện chứng', 'quy luật mâu thuẫn'],
  'thuc tien': ['nguyên tắc thực tiễn', 'lý luận và thực tiễn']
};

// Philosophy Terms Dictionary
const DICTIONARY_TERMS = [
  { term: 'Thế giới quan', norm: 'the gioi quan', def: 'Toàn bộ quan niệm, niềm tin của con người về bản chất thế giới xung quanh.', pages: 'Trang 13-16' },
  { term: 'Phương pháp luận', norm: 'phuong phap luan', def: 'Hệ thống các nguyên tắc xuất phát có tính chất chỉ đạo hoạt động nhận thức và thực tiễn.', pages: 'Trang 13-16' },
  { term: 'Duy vật biện chứng', norm: 'duy vat bien chung', def: 'Sự thống nhất giữa chủ nghĩa duy vật và phép biện chứng, coi thế giới vật chất luôn vận động theo quy luật khách quan.', pages: 'Trang 273-309' },
  { term: 'Duy tâm', norm: 'duy tam', def: 'Hệ thống triết học cho rằng ý thức, tinh thần là cái có trước và quyết định thế giới vật chất.', pages: 'Trang 280-287' },
  { term: 'Siêu hình', norm: 'sieu hinh', def: 'Phương pháp tư duy xem xét sự vật trong trạng thái tĩnh tại, cự tuyệt sự phát triển nội tại.', pages: 'Trang 310-312' },
  { term: 'Biện chứng', norm: 'bien chung', def: 'Phương pháp tư duy xem xét sự vật trong sự liên hệ phổ biến, vận động và phát triển không ngừng.', pages: 'Trang 310-355' },
  { term: 'Thực tiễn', norm: 'thuc tien', def: 'Toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội nhằm cải tạo thế giới khách quan.', pages: 'Trang 356-361' },
  { term: 'Hình thái kinh tế - xã hội', norm: 'hinh thai kinh te xa hoi', def: 'Hạng mục lý luận chỉ xã hội ở từng giai đoạn lịch sử nhất định với lực lượng sản xuất và kiến trúc thượng tầng tương ứng.', pages: 'Trang 381-390' },
  { term: 'Giai cấp', norm: 'giai cap', def: 'Tập đoàn người to lớn có khác nhau về địa vị trong một hệ thống sản xuất xã hội nhất định.', pages: 'Trang 434-439' },
  { term: 'Nhà nước', norm: 'nha nuoc', def: 'Tổ chức quyền lực chính trị đặc biệt của giai cấp thống trị xã hội.', pages: 'Trang 480-484' }
];

export async function POST(req: NextRequest) {
  try {
    const { query, filter = 'all' } = await req.json();

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [], terms: [], suggestions: [] });
    }

    const rawQuery = query.trim();
    const normQuery = removeVietnameseDiacritics(rawQuery);

    // Expand natural language synonyms
    let expandedKeywords = [normQuery];
    Object.keys(SYNONYM_DICTIONARY).forEach(synKey => {
      if (normQuery.includes(synKey) || synKey.includes(normQuery)) {
        SYNONYM_DICTIONARY[synKey].forEach(k => {
          expandedKeywords.push(removeVietnameseDiacritics(k));
        });
      }
    });

    // 1. Fetch Topics & Chapters from Supabase
    const { data: topics, error: topErr } = await supabase
      .from('topics')
      .select('id, topic_number, title, section_path, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
      .order('source_page_start', { ascending: true });

    if (topErr || !topics) {
      return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }

    // 2. Fetch Document Chunks for snippet matching
    const { data: chunks } = await supabase
      .from('document_chunks')
      .select('topic_id, chunk_text, printed_page_start, printed_page_end');

    const topicChunkMap = new Map();
    if (chunks) {
      chunks.forEach(c => {
        if (c.topic_id && c.chunk_text) {
          topicChunkMap.set(c.topic_id, c.chunk_text);
        }
      });
    }

    // Match Topics
    const matchedTopics: any[] = [];
    topics.forEach(t => {
      const normTitle = removeVietnameseDiacritics(t.title);
      const normChapTitle = t.chapters ? removeVietnameseDiacritics((t.chapters as any).title) : '';
      const normSection = t.section_path ? removeVietnameseDiacritics(t.section_path) : '';
      const chunkText = topicChunkMap.get(t.id) || '';
      const normChunk = removeVietnameseDiacritics(chunkText);

      // Relevance Score calculation
      let score = 0;
      let snippet = chunkText.substring(0, 180) + '...';

      expandedKeywords.forEach(kw => {
        if (normTitle.includes(kw)) score += 10;
        if (normChapTitle.includes(kw)) score += 5;
        if (normSection.includes(kw)) score += 4;
        if (normChunk.includes(kw)) score += 2;
      });

      if (score > 0) {
        matchedTopics.push({
          type: 'topic',
          topic_id: t.id,
          topic_number: t.topic_number,
          title: t.title,
          chapter_number: t.chapters ? (t.chapters as any).chapter_number : 1,
          chapter_title: t.chapters ? (t.chapters as any).title : '',
          source_page_start: t.source_page_start,
          source_page_end: t.source_page_end,
          snippet: snippet,
          score: score
        });
      }
    });

    // Sort matching topics by score
    matchedTopics.sort((a, b) => b.score - a.score);

    // Match Terms
    const matchedTerms: any[] = [];
    DICTIONARY_TERMS.forEach(t => {
      let isMatch = false;
      expandedKeywords.forEach(kw => {
        if (t.norm.includes(kw) || kw.includes(t.norm)) isMatch = true;
      });
      if (isMatch) {
        matchedTerms.push({
          type: 'term',
          term: t.term,
          definition: t.def,
          pages: t.pages
        });
      }
    });

    // Real Suggestions if 0 results
    let suggestions: string[] = [];
    if (matchedTopics.length === 0 && matchedTerms.length === 0) {
      suggestions = [
        'Thế giới quan và phương pháp luận',
        'Khái niệm triết học',
        'Duy vật biện chứng',
        'Thực tiễn và lý luận',
        'Phép biện chứng duy vật',
        'Hình thái kinh tế - xã hội'
      ];
    }

    // Filter results by tab
    let finalResults = matchedTopics;
    if (filter === 'terms') {
      finalResults = [];
    } else if (filter === 'lessons') {
      finalResults = matchedTopics;
    }

    return NextResponse.json({
      query: rawQuery,
      filter,
      total: matchedTopics.length + matchedTerms.length,
      topics: finalResults,
      terms: matchedTerms,
      suggestions
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal search error" }, { status: 500 });
  }
}
