/**
 * src/lib/mastery/updateMastery.ts
 * Spaced Repetition & Mastery Engine Helper.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface MasteryUpdateParams {
  userId: string;
  topicId: string;
  understanding_score?: number;
  recall_score?: number;
  application_score?: number;
  essay_score?: number;
  closed_book_score?: number;
}

export async function updateTopicMastery(params: MasteryUpdateParams) {
  const {
    userId,
    topicId,
    understanding_score,
    recall_score,
    application_score,
    essay_score,
    closed_book_score
  } = params;

  if (!userId || !topicId) {
    throw new Error("Missing userId or topicId for mastery update");
  }

  // 1. Fetch existing mastery record
  const { data: existing, error: fetchErr } = await supabase
    .from('user_topic_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  const now = new Date();
  const reviewCount = existing ? (existing.review_count || 0) + 1 : 1;

  // Spaced repetition interval calculation
  const latestScore = recall_score ?? essay_score ?? closed_book_score ?? understanding_score ?? application_score ?? 70;
  let intervalDays = 1;
  if (latestScore >= 85) {
    intervalDays = Math.min(30, Math.pow(2, reviewCount));
  } else if (latestScore >= 70) {
    intervalDays = Math.min(14, reviewCount * 2);
  } else {
    intervalDays = 1; // Weak score -> review sooner
  }

  const nextReviewDue = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  const payload: any = {
    user_id: userId,
    topic_id: topicId,
    review_count: reviewCount,
    last_reviewed_at: now.toISOString(),
    next_review_due: nextReviewDue.toISOString(),
    updated_at: now.toISOString()
  };

  if (understanding_score !== undefined) payload.understanding_score = understanding_score;
  if (recall_score !== undefined) payload.recall_score = recall_score;
  if (application_score !== undefined) payload.application_score = application_score;
  if (essay_score !== undefined) payload.essay_score = essay_score;
  if (closed_book_score !== undefined) payload.closed_book_score = closed_book_score;

  // Calculate overall mastery_level (0-100)
  const u = payload.understanding_score ?? existing?.understanding_score ?? 0;
  const r = payload.recall_score ?? existing?.recall_score ?? 0;
  const a = payload.application_score ?? existing?.application_score ?? 0;
  const e = payload.essay_score ?? existing?.essay_score ?? 0;
  const c = payload.closed_book_score ?? existing?.closed_book_score ?? 0;

  const activeScores = [u, r, a, e, c].filter(s => s > 0);
  const avgMastery = activeScores.length > 0 ? activeScores.reduce((sum, s) => sum + s, 0) / activeScores.length : 0;
  payload.mastery_level = parseFloat(avgMastery.toFixed(2));

  const { data: updated, error: upsertErr } = await supabase
    .from('user_topic_mastery')
    .upsert(payload, { onConflict: 'user_id,topic_id' })
    .select()
    .single();

  if (upsertErr) {
    console.warn("User topic mastery upsert warning (may be RLS or unauthenticated dummy user):", upsertErr.message);
  }

  return updated || payload;
}
