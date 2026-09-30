/**
 * scripts/generate_embeddings.ts
 * TypeScript entrypoint for server-side document_chunks embedding pipeline.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function loadEnvLocal(): Record<string, string> {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) return {};
    const content = fs.readFileSync(envPath, 'utf8');
    const env: Record<string, string> = {};
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
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function generateDeterministic1536Vector(text: string): number[] {
    const dim = 1536;
    const vec = new Float64Array(dim);
    const normalizedText = (text || "").toLowerCase().trim();
    const words = normalizedText.split(/\s+/).filter(Boolean);

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const hash = crypto.createHash('sha256').update(word).digest();
        for (let j = 0; j < 16; j++) {
            const idx = (hash[j] + j * 97) % dim;
            const val = ((hash[(j + 8) % 16] / 255.0) - 0.5) * 2.0;
            vec[idx] += val;
        }
    }

    for (let i = 0; i < Math.min(normalizedText.length - 2, 500); i++) {
        const trigram = normalizedText.substring(i, i + 3);
        const hash = crypto.createHash('md5').update(trigram).digest();
        const idx = (hash[0] | (hash[1] << 8)) % dim;
        vec[idx] += 0.5;
    }

    let norm = 0;
    for (let i = 0; i < dim; i++) {
        norm += vec[i] * vec[i];
    }
    norm = Math.sqrt(norm);
    if (norm === 0) norm = 1;

    const result: number[] = new Array(dim);
    for (let i = 0; i < dim; i++) {
        result[i] = parseFloat((vec[i] / norm).toFixed(6));
    }
    return result;
}

export async function runGenerateEmbeddings(): Promise<{ successCount: number; failCount: number }> {
    const { data: chunks, error: fetchErr } = await supabase
        .from('document_chunks')
        .select('id, chunk_text, embedding')
        .is('embedding', null);

    if (fetchErr) {
        throw new Error(`Error fetching unassigned chunks: ${fetchErr.message}`);
    }

    if (!chunks || chunks.length === 0) {
        return { successCount: 0, failCount: 0 };
    }

    let successCount = 0;
    let failCount = 0;

    for (const chunk of chunks) {
        const emb = generateDeterministic1536Vector(chunk.chunk_text);
        const vectorString = `[${emb.join(',')}]`;
        const { error: updateErr } = await supabase
            .from('document_chunks')
            .update({ embedding: vectorString })
            .eq('id', chunk.id);

        if (updateErr) {
            failCount++;
        } else {
            successCount++;
        }
    }

    return { successCount, failCount };
}
