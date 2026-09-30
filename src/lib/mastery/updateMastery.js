/**
 * src/lib/mastery/updateMastery.js
 * CommonJS export for Spaced Repetition & Mastery Engine Helper.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvLocal() {
    const envPath = path.join(__dirname, '..', '..', '..', '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env = {};
    for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
            const idx = trimmed.indexOf('=');
            const key = trimmed.substring(0, idx).trim();
            const val = trimmed.substring(idx + 1).trim();
            env[key] = val;
        }
    }
    return env;
}

const env = loadEnvLocal();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function updateTopicMastery(params) {
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

  const { data: existing } = await supabase
    .from('user_topic_mastery')
    .select('*')
    .eq('user_id', userId)
    .eq('topic_id', topicId)
    .single();

  const now = new Date();
  const reviewCount = existing ? (existing.review_count || 0) + 1 : 1;

  const latestScore = recall_score ?? essay_score ?? closed_book_score ?? understanding_score ?? application_score ?? 70;
  let intervalDays = 1;
  if (latestScore >= 85) {
    intervalDays = Math.min(30, Math.pow(2, reviewCount));
  } else if (latestScore >= 70) {
    intervalDays = Math.min(14, reviewCount * 2);
  } else {
    intervalDays = 1;
  }

  const nextReviewDue = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);

  const payload = {
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

  const u = payload.understanding_score ?? existing?.understanding_score ?? 0;
  const r = payload.recall_score ?? existing?.recall_score ?? 0;
  const a = payload.application_score ?? existing?.application_score ?? 0;
  const e = payload.essay_score ?? existing?.essay_score ?? 0;
  const c = payload.closed_book_score ?? existing?.closed_book_score ?? 0;

  const activeScores = [u, r, a, e, c].filter(s => s > 0);
  const avgMastery = activeScores.length > 0 ? activeScores.reduce((sum, s) => sum + s, 0) / activeScores.length : 0;
  payload.mastery_level = parseFloat(avgMastery.toFixed(2));

  const { data: updated } = await supabase
    .from('user_topic_mastery')
    .upsert(payload, { onConflict: 'user_id,topic_id' })
    .select()
    .single();

  return updated || payload;
}

module.exports = {
  updateTopicMastery
};
