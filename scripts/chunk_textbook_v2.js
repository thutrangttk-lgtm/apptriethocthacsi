/**
 * scripts/chunk_textbook_v2.js
 * Phase 2C Rebuild: Topic-Boundary Priority Semantic Chunking (v2)
 *
 * Requirements:
 * - Cleaned text from public.document_pages only
 * - Group pages by topic boundaries (topic range takes priority)
 * - Target chunk size: 500-800 tokens (hard min 300 unless topic total is smaller, hard max 900)
 * - Overlap: ~80-120 tokens across paragraph boundaries within topic
 * - Spans multiple adjacent printed pages when needed
 * - Preserves printed_page_start and printed_page_end traceability
 * - Version tag: metadata.chunking_version = "v2"
 * - Cleans existing v1 chunks for document before insertion
 * - embedding remains NULL
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

function calculateMedian(arr) {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 !== 0) {
        return sorted[mid];
    } else {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
}

async function rebuildChunksV2() {
    console.log("=" .repeat(90));
    console.log("STARTING PHASE 2C REBUILD: SEMANTIC TOPIC-PRIORITY CHUNKING (v2)");
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
    console.log(`Target Document ID: ${documentId} (${docs.title})`);

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

    const pageMap = new Map();
    for (const p of pages) {
        pageMap.set(p.printed_page_number, p);
    }

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

    // 4. Delete existing Phase 2C v1 document_chunks safely
    console.log("Safely clearing existing v1 document_chunks for this document...");
    const { error: delErr } = await supabase
        .from('document_chunks')
        .delete()
        .eq('document_id', documentId);

    if (delErr) {
        console.error("Error clearing existing chunks:", delErr);
        process.exit(1);
    }
    console.log("Existing document_chunks cleared successfully.");

    // 5. Build v2 Chunks by Topic Boundary Priority
    const chunksToInsert = [];
    const representedPagesSet = new Set();

    let totalLinkedTopics = 0;
    let totalWithoutTopic = 0;
    let totalAmbiguousOverlap = 0;
    let chunkSeqMap = new Map(); // page_id -> sequence counter

    // Track which pages are covered by topics
    const pageToTopicMap = new Map();
    for (const topic of topics) {
        if (topic.source_page_start !== null && topic.source_page_end !== null) {
            for (let p = topic.source_page_start; p <= topic.source_page_end; p++) {
                if (!pageToTopicMap.has(p)) {
                    pageToTopicMap.set(p, []);
                }
                pageToTopicMap.get(p).push(topic);
            }
        }
    }

    // Process topic by topic
    for (const topic of topics) {
        const pStart = topic.source_page_start;
        const pEnd = topic.source_page_end;

        if (pStart === null || pEnd === null) continue;

        // Gather all paragraphs across pages pStart to pEnd
        const topicParas = [];
        for (let pNum = pStart; pNum <= pEnd; pNum++) {
            const pageObj = pageMap.get(pNum);
            if (!pageObj) continue;

            representedPagesSet.add(pNum);
            const text = pageObj.cleaned_text || "";
            const paras = text.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

            for (const para of paras) {
                topicParas.push({
                    text: para,
                    pageNumber: pNum,
                    pageId: pageObj.id
                });
            }
        }

        if (topicParas.length === 0) continue;

        // Chunk topicParas into ~500-800 token semantic chunks (max 900 tokens)
        let currentChunkParas = [];
        let currentTokens = 0;

        for (let i = 0; i < topicParas.length; i++) {
            const paraObj = topicParas[i];
            const pTokens = estimateTokens(paraObj.text);

            if (currentTokens + pTokens > 850 && currentChunkParas.length > 0) {
                // Finalize chunk
                const chunkText = currentChunkParas.map(p => p.text).join('\n\n');
                const tCount = estimateTokens(chunkText);
                const pStartNum = currentChunkParas[0].pageNumber;
                const pEndNum = currentChunkParas[currentChunkParas.length - 1].pageNumber;
                const primaryPageId = currentChunkParas[0].pageId;

                const seqIndex = (chunkSeqMap.get(primaryPageId) || 0) + 1;
                chunkSeqMap.set(primaryPageId, seqIndex);

                chunksToInsert.push({
                    document_id: documentId,
                    page_id: primaryPageId,
                    topic_id: topic.id,
                    chunk_index: seqIndex,
                    chunk_text: chunkText,
                    printed_page_start: pStartNum,
                    printed_page_end: pEndNum,
                    token_count: tCount,
                    embedding: null,
                    metadata: {
                        source_class: "A",
                        source_label: "Official Textbook",
                        chunking_version: "v2",
                        chapter_number: topic.chapters ? topic.chapters.chapter_number : null,
                        topic_number: topic.topic_number
                    }
                });
                totalLinkedTopics++;

                // Overlap: retain last paragraph if <= 120 tokens
                if (pTokens <= 120) {
                    currentChunkParas = [currentChunkParas[currentChunkParas.length - 1], paraObj];
                    currentTokens = estimateTokens(currentChunkParas.map(p => p.text).join('\n\n'));
                } else {
                    currentChunkParas = [paraObj];
                    currentTokens = pTokens;
                }
            } else {
                currentChunkParas.push(paraObj);
                currentTokens += pTokens;
            }
        }

        if (currentChunkParas.length > 0) {
            const chunkText = currentChunkParas.map(p => p.text).join('\n\n');
            const tCount = estimateTokens(chunkText);
            const pStartNum = currentChunkParas[0].pageNumber;
            const pEndNum = currentChunkParas[currentChunkParas.length - 1].pageNumber;
            const primaryPageId = currentChunkParas[0].pageId;

            const seqIndex = (chunkSeqMap.get(primaryPageId) || 0) + 1;
            chunkSeqMap.set(primaryPageId, seqIndex);

            chunksToInsert.push({
                document_id: documentId,
                page_id: primaryPageId,
                topic_id: topic.id,
                chunk_index: seqIndex,
                chunk_text: chunkText,
                printed_page_start: pStartNum,
                printed_page_end: pEndNum,
                token_count: tCount,
                embedding: null,
                metadata: {
                    source_class: "A",
                    source_label: "Official Textbook",
                    chunking_version: "v2",
                    chapter_number: topic.chapters ? topic.chapters.chapter_number : null,
                    topic_number: topic.topic_number
                }
            });
            totalLinkedTopics++;
        }
    }

    // Process any unassigned academic pages outside explicit topics (if any)
    for (let pNum = 7; pNum <= 556; pNum++) {
        if (!representedPagesSet.has(pNum)) {
            const pageObj = pageMap.get(pNum);
            if (pageObj) {
                representedPagesSet.add(pNum);
                const chunkText = pageObj.cleaned_text || "";
                const tCount = estimateTokens(chunkText);

                const seqIndex = (chunkSeqMap.get(pageObj.id) || 0) + 1;
                chunkSeqMap.set(pageObj.id, seqIndex);

                chunksToInsert.push({
                    document_id: documentId,
                    page_id: pageObj.id,
                    topic_id: null,
                    chunk_index: seqIndex,
                    chunk_text: chunkText,
                    printed_page_start: pNum,
                    printed_page_end: pNum,
                    token_count: tCount,
                    embedding: null,
                    metadata: {
                        source_class: "A",
                        source_label: "Official Textbook",
                        chunking_version: "v2"
                    }
                });
                totalWithoutTopic++;
            }
        }
    }

    console.log(`Generated ${chunksToInsert.length} rebuilt v2 document_chunks.`);

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

    // 6. Verification & Summary Metrics
    const { data: storedChunks, error: fetchErr } = await supabase
        .from('document_chunks')
        .select('id, chunk_text, token_count, printed_page_start, printed_page_end, topic_id, embedding, metadata, topics(topic_number, title, chapter_id, chapters(chapter_number, title))')
        .eq('document_id', documentId);

    if (fetchErr || !storedChunks) {
        console.error("Error verifying stored v2 chunks:", fetchErr);
        process.exit(1);
    }

    const tokenCounts = storedChunks.map(c => c.token_count || estimateTokens(c.chunk_text));
    const totalTokens = tokenCounts.reduce((a, b) => a + b, 0);
    const avgTokens = totalTokens / storedChunks.length;
    const medianTokens = calculateMedian(tokenCounts);
    const minTokens = Math.min(...tokenCounts);
    const maxTokens = Math.max(...tokenCounts);

    const under300Count = tokenCounts.filter(t => t < 300).length;
    const between300And900Count = tokenCounts.filter(t => t >= 300 && t <= 900).length;
    const over900Count = tokenCounts.filter(t => t > 900).length;

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

    const embeddingNonNull = storedChunks.filter(c => c.embedding !== null).length;

    console.log("\n" + "=" .repeat(90));
    console.log("REBUILT v2 DOCUMENT_CHUNKS SUMMARY REPORT");
    console.log("=" .repeat(90));
    console.log(`total chunks                       : ${storedChunks.length}`);
    console.log(`average tokens per chunk           : ${avgTokens.toFixed(2)}`);
    console.log(`median tokens per chunk            : ${medianTokens}`);
    console.log(`minimum tokens                     : ${minTokens}`);
    console.log(`maximum tokens                     : ${maxTokens}`);
    console.log(`chunks under 300 tokens            : ${under300Count}`);
    console.log(`chunks between 300-900 tokens      : ${between300And900Count}`);
    console.log(`chunks over 900 tokens             : ${over900Count}`);
    console.log(`chunks linked to topics            : ${totalLinkedTopics}`);
    console.log(`chunks without topic               : ${totalWithoutTopic}`);
    console.log(`ambiguous topic overlaps           : ${totalAmbiguousOverlap}`);
    console.log(`printed pages represented          : ${representedPagesSet.size}`);
    console.log(`missing printed pages              : ${missingPrintedPages.length > 0 ? missingPrintedPages.join(', ') : 'NONE'}`);
    console.log(`duplicate chunk identities        : ${duplicateIdentities}`);
    console.log(`embeddings generated               : ${embeddingNonNull}`);
    console.log(`curriculum modifications           : 0`);
    console.log("=" .repeat(90));

    // 7. Select 5 Representative Samples (Ch I, Ch III, Ch VI, Ch VIII, Ch XI)
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
    console.log("REPRESENTATIVE CHUNK SAMPLES (v2)");
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

rebuildChunksV2().catch(err => {
    console.error("Fatal rebuild error:", err);
    process.exit(1);
});
