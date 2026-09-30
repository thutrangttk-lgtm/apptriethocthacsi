-- Migration: Add Textbook Traceability to Chapters and Topics
-- Target Tables: public.chapters, public.topics
-- Description:
-- 1. Adds source_page_start (INT) and source_page_end (INT) to public.chapters.
-- 2. Adds source_page_start (INT), source_page_end (INT), section_path (TEXT), and source_type_id (UUID FK) to public.topics.
-- 3. Adds page range CHECK validation (source_page_end >= source_page_start) to both tables.
-- 4. Creates index idx_topics_source_type_id on public.topics(source_type_id).
-- Note: Page numbers represent PRINTED BOOK PAGE NUMBERS (not PDF viewer page indexes).
-- Official textbook maps to Source A (Official Sources / source_types).

-- 1. Add page range columns to public.chapters
ALTER TABLE public.chapters
  ADD COLUMN IF NOT EXISTS source_page_start INT,
  ADD COLUMN IF NOT EXISTS source_page_end INT;

-- 2. Add page range, section path, and source_type_id columns to public.topics
ALTER TABLE public.topics
  ADD COLUMN IF NOT EXISTS source_page_start INT,
  ADD COLUMN IF NOT EXISTS source_page_end INT,
  ADD COLUMN IF NOT EXISTS section_path TEXT,
  ADD COLUMN IF NOT EXISTS source_type_id UUID REFERENCES public.source_types(id) ON DELETE SET NULL;

-- 3. Add page range CHECK validation constraint to public.chapters
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_chapters_page_range'
    ) THEN
        ALTER TABLE public.chapters
        ADD CONSTRAINT check_chapters_page_range
        CHECK (
            source_page_start IS NULL
            OR source_page_end IS NULL
            OR source_page_end >= source_page_start
        );
    END IF;
END $$;

-- 4. Add page range CHECK validation constraint to public.topics
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'check_topics_page_range'
    ) THEN
        ALTER TABLE public.topics
        ADD CONSTRAINT check_topics_page_range
        CHECK (
            source_page_start IS NULL
            OR source_page_end IS NULL
            OR source_page_end >= source_page_start
        );
    END IF;
END $$;

-- 5. Add index for topics.source_type_id
CREATE INDEX IF NOT EXISTS idx_topics_source_type_id
ON public.topics(source_type_id);
