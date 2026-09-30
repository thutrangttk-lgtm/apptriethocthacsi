-- ==============================================================================
-- REVISED SUPABASE DATABASE SCHEMA FOR PHILOSOPHY LEARNING APP (PHASE 1)
-- App: Triết Học Thạc Sĩ
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TRIGGER FUNCTION FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- TABLE 1: COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 2: SOURCE_TYPES (Phân cấp nguồn A, B, C, D)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.source_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) UNIQUE NOT NULL, -- 'A', 'B', 'C', 'D'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    priority_level INT NOT NULL, -- 1 (Highest/A) to 4 (Lowest/D)
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

DROP TRIGGER IF EXISTS update_source_types_updated_at ON public.source_types;
CREATE TRIGGER update_source_types_updated_at
BEFORE UPDATE ON public.source_types
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 3: CHAPTERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    chapter_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    source_page_start INT,
    source_page_end INT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_course_chapter UNIQUE (course_id, chapter_number),
    CONSTRAINT check_chapters_page_range CHECK (
        source_page_start IS NULL
        OR source_page_end IS NULL
        OR source_page_end >= source_page_start
    )
);

CREATE INDEX IF NOT EXISTS idx_chapters_course_id ON public.chapters(course_id);

DROP TRIGGER IF EXISTS update_chapters_updated_at ON public.chapters;
CREATE TRIGGER update_chapters_updated_at
BEFORE UPDATE ON public.chapters
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 4: TOPICS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chapter_id UUID NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE,
    topic_number INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    section_path TEXT,
    source_page_start INT,
    source_page_end INT,
    source_type_id UUID REFERENCES public.source_types(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_chapter_topic UNIQUE (chapter_id, topic_number),
    CONSTRAINT check_topics_page_range CHECK (
        source_page_start IS NULL
        OR source_page_end IS NULL
        OR source_page_end >= source_page_start
    )
);

CREATE INDEX IF NOT EXISTS idx_topics_chapter_id ON public.topics(chapter_id);
CREATE INDEX IF NOT EXISTS idx_topics_source_type_id ON public.topics(source_type_id);

DROP TRIGGER IF EXISTS update_topics_updated_at ON public.topics;
CREATE TRIGGER update_topics_updated_at
BEFORE UPDATE ON public.topics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 5: CONCEPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.concepts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    definition TEXT NOT NULL,
    key_points JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_concepts_topic_id ON public.concepts(topic_id);

DROP TRIGGER IF EXISTS update_concepts_updated_at ON public.concepts;
CREATE TRIGGER update_concepts_updated_at
BEFORE UPDATE ON public.concepts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 6: DOCUMENTS_METADATA
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents_metadata (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    source_type_id UUID REFERENCES public.source_types(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publication_year INT,
    file_path VARCHAR(512),
    file_size_bytes BIGINT,
    mime_type VARCHAR(100) DEFAULT 'application/pdf',
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_course_id ON public.documents_metadata(course_id);
CREATE INDEX IF NOT EXISTS idx_documents_source_type_id ON public.documents_metadata(source_type_id);

DROP TRIGGER IF EXISTS update_documents_metadata_updated_at ON public.documents_metadata;
CREATE TRIGGER update_documents_metadata_updated_at
BEFORE UPDATE ON public.documents_metadata
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 7: QUESTIONS (Unrestricted Content Only)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    source_type_id UUID REFERENCES public.source_types(id) ON DELETE SET NULL,
    question_type VARCHAR(50) NOT NULL, -- 'multiple_choice', 'essay', 'active_recall'
    question_text TEXT NOT NULL,
    options_json JSONB DEFAULT '[]'::jsonb, -- Options for MCQs
    difficulty_level VARCHAR(20) DEFAULT 'medium', -- 'easy', 'medium', 'hard', 'advanced'
    verified_status VARCHAR(20) DEFAULT 'unverified', -- 'official', 'lecturer', 'verified_notes', 'student_reference', 'ai_generated', 'unverified'
    duration_minutes INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_topic_id ON public.questions(topic_id);
CREATE INDEX IF NOT EXISTS idx_questions_source_type_id ON public.questions(source_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_type ON public.questions(question_type);
CREATE INDEX IF NOT EXISTS idx_questions_verified_status ON public.questions(verified_status);

DROP TRIGGER IF EXISTS update_questions_updated_at ON public.questions;
CREATE TRIGGER update_questions_updated_at
BEFORE UPDATE ON public.questions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 7B: QUESTION_ANSWER_KEYS (Protected Evaluation Data - No Public Access)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.question_answer_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID UNIQUE NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    correct_answer TEXT,
    rubric_json JSONB DEFAULT '{}'::jsonb,
    expected_structure_json JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_answer_keys_question_id ON public.question_answer_keys(question_id);

DROP TRIGGER IF EXISTS update_question_answer_keys_updated_at ON public.question_answer_keys;
CREATE TRIGGER update_question_answer_keys_updated_at
BEFORE UPDATE ON public.question_answer_keys
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 8: USER_TOPIC_MASTERY (Multidimensional Mastery Model)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_topic_mastery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    understanding_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL CHECK (understanding_score >= 0 AND understanding_score <= 100),
    recall_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL CHECK (recall_score >= 0 AND recall_score <= 100),
    application_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL CHECK (application_score >= 0 AND application_score <= 100),
    essay_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL CHECK (essay_score >= 0 AND essay_score <= 100),
    closed_book_score NUMERIC(5, 2) DEFAULT 0.00 NOT NULL CHECK (closed_book_score >= 0 AND closed_book_score <= 100),
    review_count INT DEFAULT 0 NOT NULL,
    last_reviewed_at TIMESTAMPTZ,
    next_review_due TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_topic_mastery UNIQUE (user_id, topic_id)
);

CREATE INDEX IF NOT EXISTS idx_mastery_user_topic ON public.user_topic_mastery(user_id, topic_id);

DROP TRIGGER IF EXISTS update_user_topic_mastery_updated_at ON public.user_topic_mastery;
CREATE TRIGGER update_user_topic_mastery_updated_at
BEFORE UPDATE ON public.user_topic_mastery
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- TABLE 9: RECALL_ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recall_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    prompt_text TEXT NOT NULL,
    user_response TEXT NOT NULL,
    feedback TEXT,
    score NUMERIC(5, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recall_user_topic ON public.recall_attempts(user_id, topic_id);

-- ------------------------------------------------------------------------------
-- TABLE 10: OUTLINE_ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.outline_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    outline_structure_json JSONB NOT NULL,
    feedback_json JSONB DEFAULT '{}'::jsonb,
    score NUMERIC(5, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_outline_user_topic ON public.outline_attempts(user_id, topic_id);

-- ------------------------------------------------------------------------------
-- TABLE 11: EXAM_ATTEMPTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.exam_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) DEFAULT 'closed_book' NOT NULL, -- 'closed_book', 'open_book'
    status VARCHAR(50) DEFAULT 'in_progress' NOT NULL, -- 'in_progress', 'submitted', 'graded'
    answers_json JSONB DEFAULT '[]'::jsonb,
    feedback_json JSONB DEFAULT '{}'::jsonb,
    score NUMERIC(5, 2) CHECK (score IS NULL OR (score >= 0 AND score <= 100)),
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_exam_user_course ON public.exam_attempts(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_exam_status ON public.exam_attempts(status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.source_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_answer_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recall_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outline_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PUBLIC CURRICULUM DATA READ POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access to courses" ON public.courses;
CREATE POLICY "Allow public read access to courses" ON public.courses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to chapters" ON public.chapters;
CREATE POLICY "Allow public read access to chapters" ON public.chapters FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to topics" ON public.topics;
CREATE POLICY "Allow public read access to topics" ON public.topics FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to concepts" ON public.concepts;
CREATE POLICY "Allow public read access to concepts" ON public.concepts FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to source_types" ON public.source_types;
CREATE POLICY "Allow public read access to source_types" ON public.source_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to documents_metadata" ON public.documents_metadata;
CREATE POLICY "Allow public read access to documents_metadata" ON public.documents_metadata FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to questions" ON public.questions;
CREATE POLICY "Allow public read access to questions" ON public.questions FOR SELECT USING (true);

-- NOTE: question_answer_keys HAS NO SELECT POLICY FOR PUBLIC OR ANON.
-- It is only accessible via Service Role key in backend server environment during grading.

-- ------------------------------------------------------------------------------
-- STRICT AUTHENTICATED USER PERSONAL DATA POLICIES (NO ANON ACCESS)
-- ------------------------------------------------------------------------------

-- 1. USER_TOPIC_MASTERY
DROP POLICY IF EXISTS "Users can read own mastery" ON public.user_topic_mastery;
CREATE POLICY "Users can read own mastery" ON public.user_topic_mastery 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own mastery" ON public.user_topic_mastery;
CREATE POLICY "Users can insert own mastery" ON public.user_topic_mastery 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own mastery" ON public.user_topic_mastery;
CREATE POLICY "Users can update own mastery" ON public.user_topic_mastery 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own mastery" ON public.user_topic_mastery;
CREATE POLICY "Users can delete own mastery" ON public.user_topic_mastery 
    FOR DELETE USING (auth.uid() = user_id);

-- 2. RECALL_ATTEMPTS
DROP POLICY IF EXISTS "Users can read own recall attempts" ON public.recall_attempts;
CREATE POLICY "Users can read own recall attempts" ON public.recall_attempts 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own recall attempts" ON public.recall_attempts;
CREATE POLICY "Users can insert own recall attempts" ON public.recall_attempts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own recall attempts" ON public.recall_attempts;
CREATE POLICY "Users can update own recall attempts" ON public.recall_attempts 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own recall attempts" ON public.recall_attempts;
CREATE POLICY "Users can delete own recall attempts" ON public.recall_attempts 
    FOR DELETE USING (auth.uid() = user_id);

-- 3. OUTLINE_ATTEMPTS
DROP POLICY IF EXISTS "Users can read own outline attempts" ON public.outline_attempts;
CREATE POLICY "Users can read own outline attempts" ON public.outline_attempts 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own outline attempts" ON public.outline_attempts;
CREATE POLICY "Users can insert own outline attempts" ON public.outline_attempts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own outline attempts" ON public.outline_attempts;
CREATE POLICY "Users can update own outline attempts" ON public.outline_attempts 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own outline attempts" ON public.outline_attempts;
CREATE POLICY "Users can delete own outline attempts" ON public.outline_attempts 
    FOR DELETE USING (auth.uid() = user_id);

-- 4. EXAM_ATTEMPTS
DROP POLICY IF EXISTS "Users can read own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can read own exam attempts" ON public.exam_attempts 
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can insert own exam attempts" ON public.exam_attempts 
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can update own exam attempts" ON public.exam_attempts 
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own exam attempts" ON public.exam_attempts;
CREATE POLICY "Users can delete own exam attempts" ON public.exam_attempts 
    FOR DELETE USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- DOCUMENT PAGES & CHUNKS (RAG Architecture)
-- ------------------------------------------------------------------------------
ALTER TABLE public.document_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_chunks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to document_pages" ON public.document_pages;
CREATE POLICY "Allow public read access to document_pages" ON public.document_pages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read access to document_chunks" ON public.document_chunks;
CREATE POLICY "Allow public read access to document_chunks" ON public.document_chunks FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- RETRIEVAL FUNCTION FOR COSINE SIMILARITY SEARCH
-- ------------------------------------------------------------------------------
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
