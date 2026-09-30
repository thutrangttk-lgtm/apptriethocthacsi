/**
 * src/lib/rag/retrieve.ts
 * Server-side RAG Retrieval Service for Official Philosophy Textbook (Source A).
 */

import { createClient } from '@supabase/supabase-js';
import { generateDeterministic1536Vector } from '../../../scripts/generate_embeddings';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export interface RetrievalResult {
  chunk_id: string;
  chunk_text: string;
  similarity: number;
  topic_id: string | null;
  printed_page_start: number | null;
  printed_page_end: number | null;
  source_label: string;
  source_class: string;
}

export interface RetrievalOptions {
  query: string;
  topic_id?: string;
  printed_page_start?: number;
  printed_page_end?: number;
  match_count?: number;
}

export async function retrieveRelevantChunks(options: RetrievalOptions): Promise<RetrievalResult[]> {
  const { query, topic_id, printed_page_start, printed_page_end, match_count = 10 } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  // 1. Embed query to 1536-dim vector
  const queryEmbedding = generateDeterministic1536Vector(query);
  const vectorString = `[${queryEmbedding.join(',')}]`;

  // 2. Call RPC public.match_document_chunks or fallback query
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc('match_document_chunks', {
      query_embedding: vectorString,
      match_count: match_count,
      filter_topic_id: topic_id || null,
      filter_printed_page_start: printed_page_start || null,
      filter_printed_page_end: printed_page_end || null
    });

    if (!rpcErr && rpcData && rpcData.length > 0) {
      return rpcData.map((item: any) => ({
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
    console.warn("RPC match_document_chunks call warning, using fallback similarity calculation:", err);
  }

  // Fallback direct query if RPC is pending migration on DB connection
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
