/**
 * src/app/api/outline/grade/route.ts
 * Outline Practice Grade API Route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { retrieveRelevantChunks } from '@/lib/rag/retrieve';
import { updateTopicMastery } from '@/lib/mastery/updateMastery';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const REQUIRED_SECTIONS = [
  "Mở vấn đề",
  "Luận điểm chính",
  "Phân tích",
  "Ý nghĩa phương pháp luận",
  "Liên hệ thực tiễn",
  "Kết luận"
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, outline_structure, user_id } = body;

    if (!topic_id) {
      return NextResponse.json({ error: "Missing topic_id" }, { status: 400 });
    }

    const { data: topic, error: topicErr } = await supabase
      .from('topics')
      .select('id, title')
      .eq('id', topic_id)
      .single();

    if (topicErr || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const chunks = await retrieveRelevantChunks({ topic_id, query: topic.title, match_count: 3 });

    // Check presence of required structural sections
    const outlineText = JSON.stringify(outline_structure || {});
    const missingComponents: string[] = [];

    for (const sec of REQUIRED_SECTIONS) {
      if (!outlineText.toLowerCase().includes(sec.toLowerCase())) {
        missingComponents.push(sec);
      }
    }

    const matchedSectionsCount = REQUIRED_SECTIONS.length - missingComponents.length;
    const score = parseFloat(((matchedSectionsCount / REQUIRED_SECTIONS.length) * 100).toFixed(2));

    const feedback = missingComponents.length === 0
      ? "Dàn ý đạt cấu trúc tự luận triết học hoàn chỉnh theo chuẩn 6 phần Nguồn A."
      : `Dàn ý còn thiếu ${missingComponents.length} phần quan trọng: ${missingComponents.join(', ')}.`;

    if (user_id) {
      await supabase.from('outline_attempts').insert([{
        user_id: user_id,
        topic_id: topic_id,
        outline_structure_json: outline_structure || {},
        feedback_json: { feedback, missingComponents },
        score: score
      }]);

      await updateTopicMastery({
        userId: user_id,
        topicId: topic_id,
        essay_score: score,
        application_score: missingComponents.includes("Liên hệ thực tiễn") ? score * 0.7 : score
      });
    }

    return NextResponse.json({
      topic_id: topic.id,
      score,
      feedback,
      missing_components: missingComponents,
      structure_valid: missingComponents.length === 0
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
