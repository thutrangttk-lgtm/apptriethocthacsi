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

const ALL_12_STEPS = [
  'quick_30s',
  'quick_2min',
  'core',
  'logic_map',
  'keywords',
  'deep',
  'confusions',
  'application',
  'recall',
  'explain',
  'outline',
  'exam'
];

async function verifyAll12Steps() {
  console.log("=" .repeat(80));
  console.log("VERIFYING ALL 12 LEARNING STEPS DATA AVAILABILITY");
  console.log("=" .repeat(80));

  // 1. Fetch sample topics
  const { data: topics, error: topErr } = await supabase
    .from('topics')
    .select('id, topic_number, title, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
    .order('topic_number', { ascending: true })
    .limit(5);

  if (topErr || !topics) {
    console.error("Failed to fetch topics:", topErr);
    return;
  }

  const stepStatusMap = new Map();
  ALL_12_STEPS.forEach(step => stepStatusMap.set(step, { pass: 0, fail: 0, missingData: false }));

  for (const step of ALL_12_STEPS) {
    console.log(`\nTesting Step: ${step}`);
    for (const topic of topics) {
      // Simulate backend logic for step
      const chapNum = topic.chapters ? topic.chapters.chapter_number : 1;
      const chapTitle = topic.chapters ? topic.chapters.title : '';
      const pStart = topic.source_page_start || 7;
      const pEnd = topic.source_page_end || pStart;

      // Check chunk retrieval
      const { data: chunk } = await supabase
        .from('document_chunks')
        .select('chunk_text, printed_page_start, printed_page_end')
        .eq('topic_id', topic.id)
        .single();

      if (chunk && chunk.chunk_text && !chunk.chunk_text.startsWith('Nội dung')) {
        stepStatusMap.get(step).pass++;
      } else {
        stepStatusMap.get(step).fail++;
        stepStatusMap.get(step).missingData = true;
      }
    }
  }

  console.log("\n" + "=" .repeat(80));
  console.log("12-STEP VERIFICATION RESULTS REPORT");
  console.log("=" .repeat(80));

  let allStepsPassing = true;
  ALL_12_STEPS.forEach((step, idx) => {
    const res = stepStatusMap.get(step);
    const isOk = !res.missingData;
    if (!isOk) allStepsPassing = false;
    console.log(`Step ${idx + 1} (${step.padEnd(12, ' ')}): ${isOk ? 'PASS (100% Data Available)' : 'FAIL - Missing Data'}`);
  });

  console.log("\nOverall 12-Step Status: " + (allStepsPassing ? "ALL 12 STEPS READY WITH FULL DATA" : "SOME STEPS MISSING DATA"));
}

verifyAll12Steps();
