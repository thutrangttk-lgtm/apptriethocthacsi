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

async function checkTopic4() {
  console.log("=== CHECKING TOPIC 4: THẾ GIỚI QUAN VÀ PHƯƠNG PHÁP LUẬN ===");

  const { data: topic, error: topErr } = await supabase
    .from('topics')
    .select('*, chapters(*)')
    .eq('title', 'Thế giới quan và phương pháp luận')
    .single();

  if (topErr || !topic) {
    console.error("Topic not found by title, searching by chapter 1 topic 4...");
    const { data: t4 } = await supabase
      .from('topics')
      .select('*, chapters(*)')
      .eq('topic_number', 4)
      .limit(1);
    console.log("Found:", t4);
    return;
  }

  console.log("Topic metadata:", {
    id: topic.id,
    topic_number: topic.topic_number,
    title: topic.title,
    section_path: topic.section_path,
    source_page_start: topic.source_page_start,
    source_page_end: topic.source_page_end,
    chapter_number: topic.chapters?.chapter_number,
    chapter_title: topic.chapters?.title
  });

  const { data: chunks, error: chunkErr } = await supabase
    .from('document_chunks')
    .select('*')
    .eq('topic_id', topic.id);

  console.log(`Found ${chunks ? chunks.length : 0} chunks for this topic:`);
  if (chunks) {
    chunks.forEach(c => {
      console.log(`Chunk ID: ${c.id}`);
      console.log(`Printed pages: ${c.printed_page_start} - ${c.printed_page_end}`);
      console.log(`Chunk text snippet:\n${c.chunk_text ? c.chunk_text.substring(0, 300) : 'NULL'}`);
    });
  }

  // Check document_pages for pages 13, 14, 15, 16
  const { data: pages } = await supabase
    .from('document_pages')
    .select('printed_page_number, raw_text, cleaned_text')
    .gte('printed_page_number', 13)
    .lte('printed_page_number', 16);

  console.log(`\nDocument pages 13-16 count: ${pages ? pages.length : 0}`);
  if (pages) {
    pages.forEach(p => {
      console.log(`Page ${p.printed_page_number}: raw length=${p.raw_text?.length || 0}, cleaned length=${p.cleaned_text?.length || 0}`);
    });
  }
}

checkTopic4();
