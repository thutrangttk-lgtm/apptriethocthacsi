-- ==============================================================================
-- REGISTER OFFICIAL TEXTBOOK DOCUMENT METADATA
-- App: Triết Học Thạc Sĩ
-- Target Course: PHIL-MASTER ("Triết học - Cao học")
-- Source Type: Source A ("Official Sources")
-- Storage Bucket: apptriethocthacsi
-- File Path: official-textbooks/giaotrinhtriethoc.pdf
-- ==============================================================================

DO $$
DECLARE
    v_course_id UUID;
    v_source_a_id UUID;
    v_doc_id UUID;
BEGIN
    -- 1. Dynamic resolution of Course ID (PHIL-MASTER)
    SELECT id INTO v_course_id
    FROM public.courses
    WHERE code = 'PHIL-MASTER';

    IF v_course_id IS NULL THEN
        RAISE EXCEPTION 'Course with code ''PHIL-MASTER'' not found in public.courses. Ensure seed.sql has been executed.';
    END IF;

    -- 2. Dynamic resolution of Source A ID (Official Sources)
    SELECT id INTO v_source_a_id
    FROM public.source_types
    WHERE code = 'A';

    IF v_source_a_id IS NULL THEN
        RAISE EXCEPTION 'Source type with code ''A'' not found in public.source_types. Ensure seed.sql has been executed.';
    END IF;

    -- 3. Idempotent search for existing document metadata by (course_id, file_path)
    SELECT id INTO v_doc_id
    FROM public.documents_metadata
    WHERE course_id = v_course_id 
      AND file_path = 'official-textbooks/giaotrinhtriethoc.pdf';

    IF v_doc_id IS NULL THEN
        -- Insert new official textbook metadata record
        INSERT INTO public.documents_metadata (
            course_id,
            source_type_id,
            title,
            author,
            publication_year,
            file_path,
            mime_type,
            metadata
        ) VALUES (
            v_course_id,
            v_source_a_id,
            'Giáo trình Triết học',
            'Bộ Giáo dục và Đào tạo',
            2007,
            'official-textbooks/giaotrinhtriethoc.pdf',
            'application/pdf',
            jsonb_build_object(
                'bucket', 'apptriethocthacsi',
                'source_class', 'A',
                'source_label', 'Official Textbook',
                'publisher', 'Nhà xuất bản Lý luận Chính trị',
                'printed_page_start', 7,
                'printed_page_end', 556
            )
        );
        RAISE NOTICE 'Registered official textbook document in public.documents_metadata.';
    ELSE
        -- Update existing record to maintain idempotency
        UPDATE public.documents_metadata
        SET
            source_type_id = v_source_a_id,
            title = 'Giáo trình Triết học',
            author = 'Bộ Giáo dục và Đào tạo',
            publication_year = 2007,
            mime_type = 'application/pdf',
            metadata = jsonb_build_object(
                'bucket', 'apptriethocthacsi',
                'source_class', 'A',
                'source_label', 'Official Textbook',
                'publisher', 'Nhà xuất bản Lý luận Chính trị',
                'printed_page_start', 7,
                'printed_page_end', 556
            ),
            updated_at = NOW()
        WHERE id = v_doc_id;
        RAISE NOTICE 'Updated existing official textbook document metadata (ID: %).', v_doc_id;
    END IF;
END $$;
