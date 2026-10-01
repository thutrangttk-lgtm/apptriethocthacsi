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

async function auditChapters() {
  console.log("=== AUDITING ALL 11 CHAPTERS & 150 TOPICS ===");

  const { data: chapters, error: chErr } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, source_page_start, source_page_end')
    .order('chapter_number', { ascending: true });

  if (chErr) {
    console.error("Chapters error:", chErr);
    return;
  }

  const { data: topics, error: topErr } = await supabase
    .from('topics')
    .select('id, chapter_id, topic_number, title, section_path, source_page_start, source_page_end')
    .order('source_page_start', { ascending: true });

  if (topErr) {
    console.error("Topics error:", topErr);
    return;
  }

  console.log(`Loaded ${chapters.length} chapters and ${topics.length} topics.`);

  chapters.forEach(ch => {
    const chTopics = topics.filter(t => t.chapter_id === ch.id);
    console.log(`\nChương ${ch.chapter_number}: ${ch.title} (Trang ${ch.source_page_start}-${ch.source_page_end}) - ${chTopics.length} topics`);
    chTopics.slice(0, 3).forEach(t => {
      console.log(`   Top ${t.topic_number}: ${t.title} (Trang ${t.source_page_start}-${t.source_page_end})`);
    });
    if (chTopics.length > 3) {
      console.log(`   ... và ${chTopics.length - 3} topics khác.`);
    }
  });
}

auditChapters();
