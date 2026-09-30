/**
 * scripts/chunk_textbook.js
 * Phase 2C Textbook Chunking and Topic Linking Script
 *
 * Requirements:
 * - Source text: ONLY cleaned_text from public.document_pages (printed pages 7-556)
 * - Target chunk size: ~500-800 tokens per chunk (~400-650 words)
 * - Overlap: ~80-120 tokens (~65-100 words) when needed
 * - Topic linking: Using topics.source_page_start and topics.source_page_end
 * - Ambiguous overlap: Flagged with topic_id = null and metadata ambiguity flag
 * - Store in public.document_chunks with embedding = null
 * - Idempotent upsert by (document_id, page_id, chunk_index)
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadEnvLocal() {
    const envPath = path.join(__dirname, '..', '.env.local');
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function estimateTokens(text) {
    if (!text) return 0;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.ceil(wordCount * 1.25);
}

function linkTopicForChunk(pStart, pEnd, topics) {
    // Find all topics where page range overlaps
    const matchingTopics = topics.filter(t => {
        if (t.source_page_start === null || t.source_page_end === null) return false;
        // Overlap condition: MAX(start1, start2) <= MIN(end1, end2)
        return Math.max(pStart, t.source_page_start) <= Math.min(pEnd, t.source_page_end);
    });

    if (matchingTopics.length === 1) {
        return { topic: matchingTopics[0], isAmbiguous: false };
    } else if (matchingTopics.length > 1) {
        // Check if chunk is completely inside one primary topic
        const strictMatch = matchingTopics.filter(t => pStart >= t.source_page_start && pEnd <= t.source_page_end);
        if (strictMatch.length === 1) {
            return { topic: strictMatch[0], isAmbiguous: false };
        }
        return { topic: null, isAmbiguous: true, matchingTopics };
    } else {
        return { topic: null, isAmbiguous: false };
    }
}

async function runChunking() {
    console.log("=" .repeat(90));
    console.log("STARTING PHASE 2C: TEXTBOOK CHUNKING AND TOPIC LINKING");
    console.log("=" .repeat(90));

    // 1. Fetch document metadata
    const { data: docs, error: docErr } = await supabase
        .from('documents_metadata')
        .select('id, title, file_path')
        .eq('file_path', 'official-textbooks/giaotrinhtriethoc.pdf')
        .single();

    if (docErr || !docs) {
        console.error("Error fetching document_metadata:", docErr);
        process.exit(1);
    }
    const documentId = docs.id;
    console.log(`Document ID: ${documentId}`);

    // 2. Fetch all academic document_pages (printed pages 7-556)
    const { data: pages, error: pageErr } = await supabase
        .from('document_pages')
        .select('id, pdf_page_index, printed_page_number, cleaned_text')
        .eq('document_id', documentId)
        .gte('printed_page_number', 7)
        .lte('printed_page_number', 556)
        .order('printed_page_number', { ascending: true });

    if (pageErr || !pages) {
        console.error("Error fetching document_pages:", pageErr);
        process.exit(1);
    }
    console.log(`Loaded ${pages.length} academic document_pages from database.`);

    // 3. Fetch all 150 curriculum topics
    const { data: topics, error: topicErr } = await supabase
        .from('topics')
        .select('id, topic_number, title, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
        .order('source_page_start', { ascending: true });

    if (topicErr || !topics) {
        console.error("Error fetching topics:", topicErr);
        process.exit(1);
    }
    console.log(`Loaded ${topics.length} curriculum topics from database.`);

    // 4. Create chunks page by page (or group contiguous pages)
    const chunksToInsert = [];
    const representedPagesSet = new Set();

    let totalLinkedTopics = 0;
    let totalWithoutTopic = 0;
    let totalAmbiguousOverlap = 0;

    let globalChunkIndex = 0;

    for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const pNum = page.printed_page_number;
        const text = page.cleaned_text || "";

        representedPagesSet.add(pNum);

        const paragraphs = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
        let currentChunkParas = [];
        let currentTokens = 0;

        let pageChunkIndex = 0;

        for (let pIdx = 0; pIdx < paragraphs.length; pIdx++) {
            const para = paragraphs[pIdx];
            const paraTokens = estimateTokens(para);

            if (currentTokens + paraTokens > 750 && currentChunkParas.length > 0) {
                // Finalize chunk
                globalChunkIndex++;
                pageChunkIndex++;
                const chunkText = currentChunkParas.join('\n\n');
                const tCount = estimateTokens(chunkText);

                const { topic, isAmbiguous } = linkTopicForChunk(pNum, pNum, topics);
                if (topic) totalLinkedTopics++;
                else if (isAmbiguous) totalAmbiguousOverlap++;
                else totalWithoutTopic++;

                chunksToInsert.push({
                    document_id: documentId,
                    page_id: page.id,
                    topic_id: topic ? topic.id : null,
                    chunk_index: pageChunkIndex,
                    chunk_text: chunkText,
                    printed_page_start: pNum,
                    printed_page_end: pNum,
                    token_count: tCount,
                    embedding: null,
                    metadata: {
                        source_class: "A",
                        source_label: "Official Textbook",
                        chunking_version: "v1",
                        ambiguous_topic: isAmbiguous,
                        chapter_number: topic && topic.chapters ? topic.chapters.chapter_number : null,
                        topic_number: topic ? topic.topic_number : null
                    }
                });

                // Overlap: keep last paragraph if small enough
                if (paraTokens <= 150) {
                    currentChunkParas = [currentChunkParas[currentChunkParas.length - 1], para];
                    currentTokens = estimateTokens(currentChunkParas.join('\n\n'));
                } else {
                    currentChunkParas = [para];
                    currentTokens = paraTokens;
                }
            } else {
                currentChunkParas.push(para);
                currentTokens += paraTokens;
            }
        }

        if (currentChunkParas.length > 0) {
            globalChunkIndex++;
            pageChunkIndex++;
            const chunkText = currentChunkParas.join('\n\n');
            const tCount = estimateTokens(chunkText);

            const { topic, isAmbiguous } = linkTopicForChunk(pNum, pNum, topics);
            if (topic) totalLinkedTopics++;
            else if (isAmbiguous) totalAmbiguousOverlap++;
            else totalWithoutTopic++;

            chunksToInsert.push({
                document_id: documentId,
                page_id: page.id,
                topic_id: topic ? topic.id : null,
                chunk_index: pageChunkIndex,
                chunk_text: chunkText,
                printed_page_start: pNum,
                printed_page_end: pNum,
                token_count: tCount,
                embedding: null,
                metadata: {
                    source_class: "A",
                    source_label: "Official Textbook",
                    chunking_version: "v1",
                    ambiguous_topic: isAmbiguous,
                    chapter_number: topic && topic.chapters ? topic.chapters.chapter_number : null,
                    topic_number: topic ? topic.topic_number : null
                }
            });
        }
    }

    console.log(`Generated ${chunksToInsert.length} total document_chunks.`);

    // Batch upsert into public.document_chunks
    const BATCH_SIZE = 50;
    for (let i = 0; i < chunksToInsert.length; i += BATCH_SIZE) {
        const batch = chunksToInsert.slice(i, i + BATCH_SIZE);
        const { error: upsertErr } = await supabase
            .from('document_chunks')
            .upsert(batch, { onConflict: 'document_id,page_id,chunk_index' });

        if (upsertErr) {
            console.error(`Batch upsert error at index ${i}:`, upsertErr);
            process.exit(1);
        }
    }

    // 5. Verification & Summary Metrics
    const { data: storedChunks, error: fetchErr } = await supabase
        .from('document_chunks')
        .select('id, chunk_text, token_count, printed_page_start, printed_page_end, topic_id, embedding, topics(topic_number, title, chapter_id, chapters(chapter_number, title))')
        .eq('document_id', documentId);

    if (fetchErr || !storedChunks) {
        console.error("Error verifying stored chunks:", fetchErr);
        process.exit(1);
    }

    const tokenCounts = storedChunks.map(c => c.token_count || estimateTokens(c.chunk_text));
    const totalTokens = tokenCounts.reduce((a, b) => a + b, 0);
    const avgTokens = totalTokens / storedChunks.length;
    const minTokens = Math.min(...tokenCounts);
    const maxTokens = Math.max(...tokenCounts);

    const missingPrintedPages = [];
    for (let p = 7; p <= 556; p++) {
        if (!representedPagesSet.has(p)) {
            missingPrintedPages.push(p);
        }
    }

    // Check duplicate chunk identities (document_id, page_id, chunk_index)
    const seenIdentities = new Set();
    let duplicateIdentities = 0;
    for (const c of chunksToInsert) {
        const key = `${c.document_id}_${c.page_id}_${c.chunk_index}`;
        if (seenIdentities.has(key)) {
            duplicateIdentities++;
        }
        seenIdentities.add(key);
    }

    console.log("\n" + "=" .repeat(90));
    console.log("PHASE 2C TEXTBOOK CHUNKING AND TOPIC LINKING SUMMARY REPORT");
    console.log("=" .repeat(90));
    console.log(`total chunks created               : ${storedChunks.length}`);
    console.log(`average tokens per chunk           : ${avgTokens.toFixed(2)}`);
    console.log(`minimum tokens                     : ${minTokens}`);
    console.log(`maximum tokens                     : ${maxTokens}`);
    console.log(`chunks linked to topics            : ${totalLinkedTopics}`);
    console.log(`chunks without topic               : ${totalWithoutTopic}`);
    console.log(`chunks with ambiguous topic overlap: ${totalAmbiguousOverlap}`);
    console.log(`printed pages represented          : ${representedPagesSet.size}`);
    console.log(`missing printed pages              : ${missingPrintedPages.length > 0 ? missingPrintedPages.join(', ') : 'NONE'}`);
    console.log(`duplicate chunk identities        : ${duplicateIdentities}`);
    console.log(`embeddings generated               : 0`);
    console.log(`curriculum modifications           : 0`);
    console.log("=" .repeat(90));

    // 6. Select 5 Representative Samples (Ch I, Ch III, Ch VI, Ch VIII, Ch XI)
    const targetChapters = [1, 3, 6, 8, 11];
    const samples = [];

    for (const chNum of targetChapters) {
        const sample = storedChunks.find(c => c.topics && c.topics.chapters && c.topics.chapters.chapter_number === chNum);
        if (sample) {
            samples.push({
                chapter: `Chapter ${sample.topics.chapters.chapter_number}: ${sample.topics.chapters.title}`,
                topic: `Topic ${sample.topics.topic_number}: ${sample.topics.title}`,
                printedPages: `Page ${sample.printed_page_start}${sample.printed_page_end !== sample.printed_page_start ? ` - ${sample.printed_page_end}` : ''}`,
                tokenCount: sample.token_count || estimateTokens(sample.chunk_text),
                preview: sample.chunk_text.replace(/\n/g, ' ').substring(0, 300)
            });
        }
    }

    console.log("\n" + "=" .repeat(90));
    console.log("REPRESENTATIVE CHUNK SAMPLES (5 Chapters)");
    console.log("=" .repeat(90));
    for (const s of samples) {
        console.log(`\nChapter       : ${s.chapter}`);
        console.log(`Topic         : ${s.topic}`);
        console.log(`Printed Pages : ${s.printedPages}`);
        console.log(`Token Count   : ${s.tokenCount} tokens`);
        console.log(`Text Preview  : "${s.preview}..."`);
    }
    console.log("=" .repeat(90));
}

runChunking().catch(err => {
    console.error("Fatal chunking error:", err);
    process.exit(1);
});
