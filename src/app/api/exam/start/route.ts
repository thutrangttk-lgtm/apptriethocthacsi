/**
 * src/app/api/exam/start/route.ts
 * Closed-Book Exam Start API Route.
 * Security: Answer keys are NEVER sent to the client.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode = '15min', user_id } = body;

    let questionLimit = 5;
    let durationMinutes = 15;

    if (mode === '30min') {
      questionLimit = 10;
      durationMinutes = 30;
    } else if (mode === 'component_40') {
      questionLimit = 15;
      durationMinutes = 40;
    }

    // Fetch PHIL-MASTER course ID
    const { data: course } = await supabase
      .from('courses')
      .select('id')
      .eq('code', 'PHIL-MASTER')
      .single();

    const courseId = course ? course.id : 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

    // Fetch questions without exposing question_answer_keys
    const { data: questionsData, error: qErr } = await supabase
      .from('questions')
      .select('id, topic_id, question_type, question_text, options_json, difficulty_level')
      .limit(questionLimit);

    const questions = questionsData || [
      {
        id: '11111111-1111-1111-1111-111111111111',
        question_text: 'Thuật ngữ "triết học" có nguồn gốc từ tiếng Hy Lạp cổ là gì?',
        options_json: ['Philosophia', 'Sophia', 'Logos', 'Episteme'],
        question_type: 'multiple_choice'
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        question_text: 'Vấn đề cơ bản của triết học gồm mấy mặt?',
        options_json: ['2 mặt', '3 mặt', '4 mặt', '1 mặt'],
        question_type: 'multiple_choice'
      }
    ];

    let examAttemptId = `exam-${Date.now()}`;

    if (user_id) {
      const { data: attempt } = await supabase
        .from('exam_attempts')
        .insert([{
          user_id: user_id,
          course_id: courseId,
          exam_type: 'closed_book',
          status: 'in_progress',
          answers_json: [],
          score: null
        }])
        .select()
        .single();

      if (attempt) examAttemptId = attempt.id;
    }

    return NextResponse.json({
      exam_attempt_id: examAttemptId,
      mode,
      duration_minutes: durationMinutes,
      questions: questions.map(q => ({
        id: q.id,
        question_text: q.question_text,
        options: q.options_json,
        question_type: q.question_type
      }))
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
