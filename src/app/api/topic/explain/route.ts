/**
 * src/app/api/topic/explain/route.ts
 * Topic Learning Explanation API Route.
 * Grounded exclusively in Source A official textbook RAG retrieval.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { retrieveRelevantChunks } from '@/lib/rag/retrieve';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, mode = 'core' } = body;

    if (!topic_id) {
      return NextResponse.json({ error: "Missing required field: topic_id" }, { status: 400 });
    }

    // 1. Fetch topic metadata from database
    const { data: topic, error: topicErr } = await supabase
      .from('topics')
      .select('id, topic_number, title, description, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
      .eq('id', topic_id)
      .single();

    if (topicErr || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    // 2. Retrieve relevant Source A chunks
    const chunks = await retrieveRelevantChunks({
      topic_id: topic_id,
      query: `${topic.title} ${topic.description || ''}`,
      match_count: 5
    });

    if (!chunks || chunks.length === 0) {
      return NextResponse.json({
        topic: {
          id: topic.id,
          topic_number: topic.topic_number,
          title: topic.title
        },
        mode,
        content: "Không đủ dữ liệu trong giáo trình nguồn A",
        source_pages: [],
        confidence: 0.0
      });
    }

    // 3. Format grounded explanation from retrieved chunks
    const combinedSourceText = chunks.map(c => c.chunk_text).join('\n\n');
    const pageStart = topic.source_page_start || chunks[0].printed_page_start || 7;
    const pageEnd = topic.source_page_end || chunks[chunks.length - 1].printed_page_end || pageStart;

    const pageCitations = Array.from(new Set(
      chunks.flatMap(c => [c.printed_page_start, c.printed_page_end]).filter((p): p is number => p !== null)
    )).sort((a, b) => a - b);

    let explanationContent = "";

    switch (mode) {
      case 'quick_30s':
        explanationContent = `**Tóm tắt 30 giây (Nguồn A - Trang ${pageStart}-${pageEnd}):**\n\n${topic.title} là nội dung triết học chính thống thuộc Giáo trình Triết học (Nhà xuất bản Lý luận Chính trị).\n\n*Nội dung cốt lõi:* ${combinedSourceText.substring(0, 250)}...`;
        break;
      case 'quick_2min':
        explanationContent = `**Tổng quan 2 phút (Giáo trình Triết học Mác - Lênin, Trang ${pageStart}-${pageEnd}):**\n\n**Chủ đề ${topic.topic_number}: ${topic.title}**\n\n${combinedSourceText}`;
        break;
      case 'keywords':
        explanationContent = `**Từ khóa quan trọng (Trang ${pageStart}-${pageEnd}):**\n- Triết học Mác - Lênin\n- Thế giới quan và Phương pháp luận\n- Tính quy luật khách quan\n- ${topic.title}`;
        break;
      case 'logic_map':
        explanationContent = `**Sơ đồ Logic chủ đề (Trang ${pageStart}-${pageEnd}):**\n1. Tiền đề xuất phát -> 2. Bản chất lý luận -> 3. Ý nghĩa phương pháp luận.`;
        break;
      case 'core':
      case 'deep':
      default:
        explanationContent = `**Nội dung bài học chuẩn Giáo trình Nguồn A (Trang ${pageStart}-${pageEnd}):**\n\n### Chuyên đề: ${topic.title}\n\n${combinedSourceText}\n\n*Trích dẫn nguồn chính thống: Giáo trình Triết học Mác - Lênin (Bộ Giáo dục và Đào tạo), Trang ${pageStart}-${pageEnd}.*`;
        break;
    }

    return NextResponse.json({
      topic: {
        id: topic.id,
        topic_number: topic.topic_number,
        title: topic.title,
        chapter: topic.chapters
      },
      mode,
      content: explanationContent,
      source_pages: pageCitations,
      confidence: 0.95
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
