const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwsrbogwysziavdvgihd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function auditTopics() {
  console.log("=== AUDITING ALL 150 TOPICS & CHUNKS ===");

  const { data: topics, error: topErr } = await supabase
    .from('topics')
    .select('id, topic_number, title, section_path, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
    .order('source_page_start', { ascending: true });

  if (topErr) {
    console.error("Topics fetch error:", topErr);
    return;
  }

  console.log(`Total topics fetched: ${topics.length}`);

  const { data: chunks, error: chunkErr } = await supabase
    .from('document_chunks')
    .select('id, topic_id, printed_page_start, printed_page_end, chunk_text');

  if (chunkErr) {
    console.error("Chunks fetch error:", chunkErr);
    return;
  }

  const topicChunkMap = new Map();
  chunks.forEach(c => {
    if (c.topic_id) {
      if (!topicChunkMap.has(c.topic_id)) topicChunkMap.set(c.topic_id, []);
      topicChunkMap.get(c.topic_id).push(c);
    }
  });

  let topicsWithValidChunks = 0;
  let topicsWithPlaceholderChunks = 0;
  let topicsWithoutChunks = 0;

  const validTopicDetails = [];
  const placeholderTopicDetails = [];

  topics.forEach(t => {
    const tChunks = topicChunkMap.get(t.id) || [];
    if (tChunks.length === 0) {
      topicsWithoutChunks++;
    } else {
      const hasValidText = tChunks.some(c => c.chunk_text && !c.chunk_text.trim().startsWith('Nội dung') && c.chunk_text.trim().length > 50);
      if (hasValidText) {
        topicsWithValidChunks++;
        validTopicDetails.push(t);
      } else {
        topicsWithPlaceholderChunks++;
        placeholderTopicDetails.push(t);
      }
    }
  });

  console.log(`\nAudit Summary:`);
  console.log(`- Topics with valid chunk text: ${topicsWithValidChunks}`);
  console.log(`- Topics with placeholder 'Nội dung' chunks: ${topicsWithPlaceholderChunks}`);
  console.log(`- Topics without chunks: ${topicsWithoutChunks}`);

  console.log(`\nSample topics with placeholder 'Nội dung':`);
  placeholderTopicDetails.slice(0, 10).forEach(t => {
    console.log(`  Ch${t.chapters?.chapter_number} - Top ${t.topic_number}: "${t.title}" (Pages ${t.source_page_start}-${t.source_page_end})`);
    console.log(`    Path: ${t.section_path}`);
  });
}

auditTopics();
