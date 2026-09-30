-- Migration: Add Textbook RAG Schema (Document Pages, Chunks, Vector Search, and RLS)
-- Target Tables: public.document_pages, public.document_chunks
-- Target Extension: vector (pgvector)
-- Target Function: public.match_document_chunks

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create public.document_pages table
CREATE TABLE IF NOT EXISTS public.document_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents_metadata(id) ON DELETE CASCADE,
    pdf_page_index INT NOT NULL,
    printed_page_number INT,
    raw_text TEXT,
    cleaned_text TEXT,
    ocr_status VARCHAR(30) DEFAULT 'pending',
    ocr_confidence NUMERIC(5, 2),
    checksum TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_doc_pdf_page UNIQUE (document_id, pdf_page_index),
    CONSTRAINT check_ocr_confidence CHECK (
        ocr_confidence IS NULL
        OR (ocr_confidence >= 0 AND ocr_confidence <= 100)
    )
);

-- Trigger for document_pages updated_at
DROP TRIGGER IF EXISTS update_document_pages_updated_at ON public.document_pages;
CREATE TRIGGER update_document_pages_updated_at
BEFORE UPDATE ON public.document_pages
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 3. Create public.document_chunks table
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES public.documents_metadata(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.document_pages(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    printed_page_start INT,
    printed_page_end INT,
    token_count INT,
    embedding VECTOR(1536),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_doc_page_chunk UNIQUE (document_id, page_id, chunk_index),
    CONSTRAINT check_chunks_page_range CHECK (
        printed_page_start IS NULL
        OR printed_page_end IS NULL
        OR printed_page_end >= printed_page_start
    )
);

-- Trigger for document_chunks updated_at
DROP TRIGGER IF EXISTS update_document_chunks_updated_at ON public.document_chunks;
CREATE TRIGGER update_document_chunks_updated_at
BEFORE UPDATE ON public.document_chunks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. Create Indexes
CREATE INDEX IF NOT EXISTS idx_document_pages_document_id ON public.document_pages(document_id);
CREATE INDEX IF NOT EXISTS idx_document_pages_printed_page ON public.document_pages(printed_page_number);

CREATE INDEX IF NOT EXISTS idx_document_chunks_document_id ON public.document_chunks(document_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_topic_id ON public.document_chunks(topic_id);
CREATE INDEX IF NOT EXISTS idx_document_chunks_printed_pages ON public.document_chunks(printed_page_start, printed_page_end);

-- HNSW Vector Index for Cosine Distance (<=>)
CREATE INDEX IF NOT EXISTS idx_document_chunks_embedding
ON public.document_chunks
USING hnsw (embedding vector_cosine_ops);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

-- Allow public read access for retrieval, disallow public write access
DROP POLICY IF EXISTS "Allow public read access to document_pages" ON public.document_pages;
CREATE POLICY "Allow public read access to document_pages" ON public.document_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to document_chunks" ON public.document_chunks;
CREATE POLICY "Allow public read access to document_chunks" ON public.document_chunks FOR SELECT USING (true);

-- 6. Retrieval Function for Cosine Similarity Search
CREATE OR REPLACE FUNCTION public.match_document_chunks(
    query_embedding VECTOR(1536),
    match_count INT DEFAULT 10,
    filter_topic_id UUID DEFAULT NULL,
    filter_printed_page_start INT DEFAULT NULL,
    filter_printed_page_end INT DEFAULT NULL
)
RETURNS TABLE (
    chunk_id UUID,
    chunk_text TEXT,
    topic_id UUID,
    printed_page_start INT,
    printed_page_end INT,
    similarity FLOAT
)
LANGUAGE plpgsql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
    v_match_count INT;
BEGIN
    -- Validate and clamp match_count between 1 and 50
    v_match_count := LEAST(GREATEST(COALESCE(match_count, 10), 1), 50);

    RETURN QUERY
    SELECT
        dc.id AS chunk_id,
        dc.chunk_text,
        dc.topic_id,
        dc.printed_page_start,
        dc.printed_page_end,
        (1 - (dc.embedding <=> query_embedding))::FLOAT AS similarity
    FROM public.document_chunks dc
    WHERE dc.embedding IS NOT NULL
      AND (filter_topic_id IS NULL OR dc.topic_id = filter_topic_id)
      AND (filter_printed_page_start IS NULL OR dc.printed_page_start >= filter_printed_page_start)
      AND (filter_printed_page_end IS NULL OR dc.printed_page_end <= filter_printed_page_end)
    ORDER BY dc.embedding <=> query_embedding
    LIMIT v_match_count;
END;
$$;
