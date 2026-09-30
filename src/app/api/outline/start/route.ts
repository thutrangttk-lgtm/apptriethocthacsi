/**
 * src/app/api/outline/start/route.ts
 * Outline Practice Start API Route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    return NextResponse.json({
      topic_id: topic.id,
      prompt: `Lập dàn ý phân tích chuyên đề: "${topic.title}" (Giáo trình Nguồn A, Trang ${topic.source_page_start}-${topic.source_page_end})`,
      expected_structure: [
        "Mở vấn đề",
        "Luận điểm chính",
        "Phân tích",
        "Ý nghĩa phương pháp luận",
        "Liên hệ thực tiễn",
        "Kết luận"
      ]
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
