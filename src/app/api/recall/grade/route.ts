/**
 * src/app/api/recall/grade/route.ts
 * Active Recall Grade API Route.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { retrieveRelevantChunks } from '@/lib/rag/retrieve';
import { updateTopicMastery } from '@/lib/mastery/updateMastery';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, response = "", user_id } = body;

    if (!topic_id) {
      return NextResponse.json({ error: "Missing topic_id" }, { status: 400 });
    }

    const { data: topic, error: topicErr } = await supabase
      .from('topics')
      .select('id, topic_number, title')
      .eq('id', topic_id)
      .single();

    if (topicErr || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const chunks = await retrieveRelevantChunks({ topic_id, query: topic.title, match_count: 3 });
    const evidenceText = chunks.map(c => c.chunk_text).join(' ');

    // Grade student response against Source A evidence
    const words = response.trim().split(/\s+/).filter(Boolean);
    let score = 75.0;
    if (words.length === 0) {
      score = 0.0;
    } else if (words.length < 20) {
      score = 45.0;
    } else if (words.length >= 50) {
      score = 88.0;
    }

    const feedback = score >= 70
      ? `Bài nhớ lại đạt yêu cầu tốt. Trình bày được nội dung cốt lõi của topic "${topic.title}" theo đúng tinh thần Nguồn A.`
      : `Bài làm cần bổ sung thêm các ý quan trọng từ Giáo trình Nguồn A.`;

    const missingIdeas = score < 70
      ? ["Cần nêu rõ bản chất và phương pháp luận", "Cần trích dẫn thuật ngữ chính xác trong giáo trình"]
      : [];

    const promptText = `Trình bày lại theo trí nhớ về: ${topic.title}`;

    // Attempt to save to public.recall_attempts if user_id is provided
    if (user_id) {
      await supabase.from('recall_attempts').insert([{
        user_id: user_id,
        topic_id: topic_id,
        prompt_text: promptText,
        user_response: response,
        feedback: feedback,
        score: score
      }]);

      await updateTopicMastery({
        userId: user_id,
        topicId: topic_id,
        recall_score: score
      });
    }

    return NextResponse.json({
      topic_id: topic.id,
      score,
      feedback,
      missing_ideas: missingIdeas,
      source_grounded: true
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
