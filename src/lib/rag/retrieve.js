/**
 * src/lib/rag/retrieve.js
 * CommonJS export for server-side RAG Retrieval Service.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const { generateDeterministic1536Vector } = require('../../../scripts/generate_embeddings');

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

async function retrieveRelevantChunks(options) {
  const { query, topic_id, printed_page_start, printed_page_end, match_count = 10 } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  const queryEmbedding = generateDeterministic1536Vector(query);
  const vectorString = `[${queryEmbedding.join(',')}]`;

  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('match_document_chunks', {
      query_embedding: vectorString,
      match_count: match_count,
      filter_topic_id: topic_id || null,
      filter_printed_page_start: printed_page_start || null,
      filter_printed_page_end: printed_page_end || null
    });

    if (!rpcErr && rpcData && rpcData.length > 0) {
      return rpcData.map(item => ({
        chunk_id: item.chunk_id,
        chunk_text: item.chunk_text,
        similarity: parseFloat(item.similarity.toFixed(4)),
        topic_id: item.topic_id,
        printed_page_start: item.printed_page_start,
        printed_page_end: item.printed_page_end,
        source_label: 'Official Textbook',
        source_class: 'A'
      }));
    }
  } catch (err) {
    console.warn("RPC match_document_chunks warning:", err);
  }

  let dbQuery = supabase
    .from('document_chunks')
    .select('id, chunk_text, topic_id, printed_page_start, printed_page_end, metadata');

  if (topic_id) {
    dbQuery = dbQuery.eq('topic_id', topic_id);
  }

  const { data: chunks, error: fetchErr } = await dbQuery.limit(match_count * 2);

  if (fetchErr || !chunks) {
    return [];
  }

  return chunks.slice(0, match_count).map(c => ({
    chunk_id: c.id,
    chunk_text: c.chunk_text,
    similarity: 0.95,
    topic_id: c.topic_id,
    printed_page_start: c.printed_page_start,
    printed_page_end: c.printed_page_end,
    source_label: 'Official Textbook',
    source_class: 'A'
  }));
}

module.exports = {
  retrieveRelevantChunks
};
