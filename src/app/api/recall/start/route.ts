/**
 * src/app/api/recall/start/route.ts
 * Active Recall Start API Route.
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
    const { topic_id } = body;

    if (!topic_id) {
      return NextResponse.json({ error: "Missing topic_id" }, { status: 400 });
    }

    const { data: topic, error: topicErr } = await supabase
      .from('topics')
      .select('id, topic_number, title, source_page_start, source_page_end')
      .eq('id', topic_id)
      .single();

    if (topicErr || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const chunks = await retrieveRelevantChunks({ topic_id, query: topic.title, match_count: 3 });

    const promptText = `Hãy trình bày lại theo trí nhớ của bạn về: "${topic.title}" (Căn cứ Giáo trình Nguồn A, Trang ${topic.source_page_start}-${topic.source_page_end}). Nêu rõ khái niệm, bản chất và các luận điểm chính.`;

    return NextResponse.json({
      topic_id: topic.id,
      prompt: promptText,
      source_pages: [topic.source_page_start, topic.source_page_end].filter(Boolean),
      expected_concepts: [topic.title, "Triết học Mác - Lênin", "Tính quy luật khách quan"]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
