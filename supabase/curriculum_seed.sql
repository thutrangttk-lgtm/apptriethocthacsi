-- ==============================================================================
-- CURRICULUM SEED: OFFICIAL PHILOSOPHY TEXTBOOK IMPORT
-- Authoritative Source: Official Philosophy Textbook (Source A)
-- Target Course: PHIL-MASTER ("Triết học - Cao học")
-- Total Chapters: 11 | Total Topics: 150
-- Note: Page numbers represent PRINTED BOOK PAGE NUMBERS.
-- ==============================================================================

DO $$
DECLARE
    v_course_id UUID;
    v_source_a_id UUID;
    v_chap_id UUID;
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

    -- --------------------------------------------------------------------------
    -- 3. IMPORT CHAPTERS (11 Chapters)
    -- --------------------------------------------------------------------------
    INSERT INTO public.chapters (
        course_id,
        chapter_number,
        title,
        source_page_start,
        source_page_end
    ) VALUES
        (v_course_id, 1, 'Triết học và vai trò của triết học trong đời sống xã hội', 7, 18),
        (v_course_id, 2, 'Khái lược lịch sử triết học phương Đông', 19, 80),
        (v_course_id, 3, 'Khái lược lịch sử triết học phương Tây', 81, 156),
        (v_course_id, 4, 'Khái lược lịch sử triết học Mác - Lênin', 157, 272),
        (v_course_id, 5, 'Chủ nghĩa duy vật biện chứng - cơ sở lý luận của thế giới quan khoa học', 273, 309),
        (v_course_id, 6, 'Phép biện chứng duy vật - phương pháp luận nhận thức khoa học và thực tiễn', 310, 355),
        (v_course_id, 7, 'Nguyên tắc thống nhất giữa lý luận và thực tiễn của triết học Mác - Lênin', 356, 380),
        (v_course_id, 8, 'Lý luận hình thái kinh tế - xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam', 381, 425),
        (v_course_id, 9, 'Giai cấp, dân tộc, nhân loại trong thời đại hiện nay và vận dụng vào sự nghiệp xây dựng chủ nghĩa xã hội ở Việt Nam', 426, 479),
        (v_course_id, 10, 'Lý luận về nhà nước và nhà nước pháp quyền xã hội chủ nghĩa Việt Nam', 480, 510),
        (v_course_id, 11, 'Quan điểm của triết học Mác - Lênin về con người và vấn đề xây dựng con người Việt Nam hiện nay', 511, 554)
    ON CONFLICT (course_id, chapter_number) DO UPDATE SET
        title = EXCLUDED.title,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        updated_at = NOW();

    -- --------------------------------------------------------------------------
    -- 4. IMPORT TOPICS BY CHAPTER (150 Topics Total)
    -- --------------------------------------------------------------------------
    -- --- CHAPTER 1 TOPICS (5 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 1;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Khái niệm triết học', 'I. Khái niệm triết học và đối tượng nghiên cứu của triết học > 1. Khái niệm triết học', 7, 8, v_source_a_id),
        (v_chap_id, 2, 'Đối tượng của triết học qua các thời kỳ', 'I. Khái niệm triết học và đối tượng nghiên cứu của triết học > 2. Đối tượng của triết học', 8, 10, v_source_a_id),
        (v_chap_id, 3, 'Tính quy luật của sự hình thành và phát triển triết học', 'II. Tính quy luật về sự hình thành, phát triển của triết học', 11, 13, v_source_a_id),
        (v_chap_id, 4, 'Thế giới quan và phương pháp luận', 'III. Vai trò của triết học trong đời sống xã hội > 1. Vai trò thế giới quan và phương pháp luận của triết học', 13, 16, v_source_a_id),
        (v_chap_id, 5, 'Triết học với khoa học cụ thể và tư duy lý luận', 'III. Vai trò của triết học trong đời sống xã hội > 2. Vai trò của triết học đối với các khoa học cụ thể và đối với tư duy lý luận', 16, 18, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 2 TOPICS (22 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 2;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Điều kiện ra đời của triết học Ấn Độ cổ, trung đại', 'I. Triết học Ấn Độ cổ, trung đại > 1.a Điều kiện ra đời', 19, 20, v_source_a_id),
        (v_chap_id, 2, 'Ba thời kỳ phát triển của triết học Ấn Độ cổ, trung đại', 'I. Triết học Ấn Độ cổ, trung đại > 1.b Quá trình hình thành và phát triển', 20, 22, v_source_a_id),
        (v_chap_id, 3, 'Bản thể luận thần thoại - tôn giáo', 'I. Triết học Ấn Độ cổ, trung đại > 2.a Tư tưởng bản thể luận', 23, 25, v_source_a_id),
        (v_chap_id, 4, 'Upanisad: Brahman - Atman và tư duy bản thể luận', 'I. Triết học Ấn Độ cổ, trung đại > 2.a Tư tưởng bản thể luận', 25, 26, v_source_a_id),
        (v_chap_id, 5, 'Tư tưởng giải thoát và các con đường giải thoát', 'I. Triết học Ấn Độ cổ, trung đại > 2.b Tư tưởng giải thoát', 27, 29, v_source_a_id),
        (v_chap_id, 6, 'Điều kiện tự nhiên, kinh tế - xã hội của triết học Trung Quốc cổ, trung đại', 'II. Triết học Trung Quốc cổ, trung đại > 1.a Điều kiện ra đời', 30, 31, v_source_a_id),
        (v_chap_id, 7, 'Quá trình hình thành và phát triển triết học Trung Quốc cổ, trung đại', 'II. Triết học Trung Quốc cổ, trung đại > 1.b Quá trình hình thành và phát triển', 31, 32, v_source_a_id),
        (v_chap_id, 8, 'Bản thể luận: Nho gia, Đạo gia, Âm dương - Ngũ hành', 'II. Triết học Trung Quốc cổ, trung đại > 2.a Tư tưởng bản thể luận', 32, 34, v_source_a_id),
        (v_chap_id, 9, 'Vật chất và ý thức: thần - hình, tâm - vật, lý - khí', 'II. Triết học Trung Quốc cổ, trung đại > 2.b Tư tưởng về mối quan hệ giữa vật chất với ý thức', 34, 36, v_source_a_id),
        (v_chap_id, 10, 'Tư tưởng biện chứng trong triết học Trung Quốc cổ, trung đại', 'II. Triết học Trung Quốc cổ, trung đại > 2.c Tư tưởng biện chứng', 36, 38, v_source_a_id),
        (v_chap_id, 11, 'Nhận thức luận: Nho gia, Mặc gia, Danh gia, Đạo gia và Phật giáo', 'II. Triết học Trung Quốc cổ, trung đại > 2.d Tư tưởng về nhận thức', 38, 44, v_source_a_id),
        (v_chap_id, 12, 'Quan niệm về con người', 'II. Triết học Trung Quốc cổ, trung đại > 2.đ Tư tưởng về con người và xây dựng con người', 44, 47, v_source_a_id),
        (v_chap_id, 13, 'Mục tiêu và phương pháp xây dựng con người', 'II. Triết học Trung Quốc cổ, trung đại > 2.đ Tư tưởng về con người và xây dựng con người', 47, 53, v_source_a_id),
        (v_chap_id, 14, 'Xã hội lý tưởng và con đường trị quốc', 'II. Triết học Trung Quốc cổ, trung đại > 2.e Tư tưởng về xã hội lý tưởng và con đường trị quốc', 53, 55, v_source_a_id),
        (v_chap_id, 15, 'Điều kiện hình thành và phát triển tư tưởng triết học Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 1.a Điều kiện hình thành và phát triển', 55, 59, v_source_a_id),
        (v_chap_id, 16, 'Đặc điểm của lịch sử tư tưởng triết học Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 1.b Những đặc điểm chủ yếu', 59, 61, v_source_a_id),
        (v_chap_id, 17, 'Tư tưởng yêu nước', 'III. Lịch sử tư tưởng triết học Việt Nam > 2.a Tư tưởng triết học chính trị, đạo đức và nhân văn', 62, 66, v_source_a_id),
        (v_chap_id, 18, 'Quan niệm về đạo làm người', 'III. Lịch sử tư tưởng triết học Việt Nam > 2.a Tư tưởng triết học chính trị, đạo đức và nhân văn', 66, 67, v_source_a_id),
        (v_chap_id, 19, 'Tư tưởng triết học Phật giáo trong lịch sử tư tưởng Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 2.b Một số tư tưởng triết học Phật giáo', 67, 69, v_source_a_id),
        (v_chap_id, 20, 'Tư tưởng triết học Nho giáo trong lịch sử tư tưởng Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 2.c Một số tư tưởng triết học Nho giáo', 69, 70, v_source_a_id),
        (v_chap_id, 21, 'Duy vật - duy tâm, triết học - tôn giáo trong lịch sử tư tưởng Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 2.d Sự đối lập giữa thế giới quan duy vật và duy tâm, triết học và tôn giáo', 70, 74, v_source_a_id),
        (v_chap_id, 22, 'Vai trò của Hồ Chí Minh đối với tư tưởng triết học Việt Nam', 'III. Lịch sử tư tưởng triết học Việt Nam > 3. Vai trò của Hồ Chí Minh đối với sự phát triển của tư tưởng triết học Việt Nam', 74, 80, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 3 TOPICS (30 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 3;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Điều kiện kinh tế - xã hội của triết học Hy Lạp cổ đại', 'I. Triết học Hy Lạp cổ đại > 1.a Điều kiện kinh tế - xã hội', 81, 82, v_source_a_id),
        (v_chap_id, 2, 'Từ thần thoại đến triết học', 'I. Triết học Hy Lạp cổ đại > 1.b Sự phân rã của thần thoại và sự xuất hiện triết học', 82, 85, v_source_a_id),
        (v_chap_id, 3, 'Ảnh hưởng và kế thừa văn hóa Cận Đông', 'I. Triết học Hy Lạp cổ đại > 1.c Sự kế thừa và phát triển văn hóa Cận Đông', 85, 87, v_source_a_id),
        (v_chap_id, 4, 'Các thời kỳ phát triển của triết học Hy Lạp cổ đại', 'I. Triết học Hy Lạp cổ đại > 1.d Quá trình hình thành và phát triển', 87, 88, v_source_a_id),
        (v_chap_id, 5, 'Bản nguyên thế giới trong triết học Hy Lạp cổ đại', 'I. Triết học Hy Lạp cổ đại > 2.a Tư tưởng về bản nguyên thế giới', 88, 90, v_source_a_id),
        (v_chap_id, 6, 'Tư tưởng biện chứng từ Hêraclit đến Xôcrát, Platôn', 'I. Triết học Hy Lạp cổ đại > 2.b Tư tưởng biện chứng', 90, 95, v_source_a_id),
        (v_chap_id, 7, 'Tư tưởng về nhận thức', 'I. Triết học Hy Lạp cổ đại > 2.c Tư tưởng về nhận thức', 95, 99, v_source_a_id),
        (v_chap_id, 8, 'Đạo đức và chính trị', 'I. Triết học Hy Lạp cổ đại > 2.d Vấn đề đạo đức và chính trị', 99, 103, v_source_a_id),
        (v_chap_id, 9, 'Điều kiện ra đời và nét đặc thù', 'II. Triết học Tây Âu thời trung cổ > 1.a Điều kiện kinh tế - xã hội và văn hóa', 104, 105, v_source_a_id),
        (v_chap_id, 10, 'Các giai đoạn của triết học Tây Âu trung cổ', 'II. Triết học Tây Âu thời trung cổ > 1.b Quá trình hình thành và phát triển', 105, 106, v_source_a_id),
        (v_chap_id, 11, 'Tri thức và niềm tin tôn giáo', 'II. Triết học Tây Âu thời trung cổ > 2.a Mối quan hệ giữa tri thức và niềm tin tôn giáo', 106, 109, v_source_a_id),
        (v_chap_id, 12, 'Xã hội và đạo đức thời trung cổ', 'II. Triết học Tây Âu thời trung cổ > 2.b Vấn đề xã hội và đạo đức', 109, 111, v_source_a_id),
        (v_chap_id, 13, 'Điều kiện ra đời của triết học Phục hưng', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 1.a Điều kiện ra đời của triết học Tây Âu thời Phục hưng', 112, 112, v_source_a_id),
        (v_chap_id, 14, 'Tư tưởng về tự nhiên thời Phục hưng', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 1.b Tư tưởng triết học về tự nhiên', 112, 115, v_source_a_id),
        (v_chap_id, 15, 'Tư tưởng về con người thời Phục hưng', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 1.b Tư tưởng triết học về con người', 115, 116, v_source_a_id),
        (v_chap_id, 16, 'Tư tưởng chính trị - xã hội thời Phục hưng', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 1.b Tư tưởng triết học về chính trị và xã hội', 116, 117, v_source_a_id),
        (v_chap_id, 17, 'Điều kiện ra đời triết học Tây Âu cận đại', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 2.a Điều kiện ra đời triết học Tây Âu thời cận đại', 117, 118, v_source_a_id),
        (v_chap_id, 18, 'Bản thể và bản tính thế giới', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 2.b Tư tưởng về bản thể và bản tính thế giới', 118, 120, v_source_a_id),
        (v_chap_id, 19, 'Chủ nghĩa kinh nghiệm và chủ nghĩa duy lý', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 2.b Lý luận nhận thức', 120, 123, v_source_a_id),
        (v_chap_id, 20, 'Con người và bản tính con người', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 2.b Tư tưởng về con người và bản tính con người', 123, 126, v_source_a_id),
        (v_chap_id, 21, 'Đạo đức học cận đại', 'III. Triết học Tây Âu thời Phục hưng và cận đại > 2.b Tư tưởng về đạo đức', 126, 128, v_source_a_id),
        (v_chap_id, 22, 'Điều kiện và nét đặc thù của triết học cổ điển Đức', 'IV. Triết học cổ điển Đức > 1. Điều kiện ra đời, phát triển và nét đặc thù', 129, 130, v_source_a_id),
        (v_chap_id, 23, 'Nguồn gốc thế giới: Kant, Hegel, Feuerbach', 'IV. Triết học cổ điển Đức > 2.a Tư tưởng về nguồn gốc thế giới', 130, 131, v_source_a_id),
        (v_chap_id, 24, 'Biện chứng của Kant và Hegel', 'IV. Triết học cổ điển Đức > 2.b Tư tưởng biện chứng', 131, 136, v_source_a_id),
        (v_chap_id, 25, 'Quan niệm về con người', 'IV. Triết học cổ điển Đức > 2.c Tư tưởng về con người', 136, 140, v_source_a_id),
        (v_chap_id, 26, 'Đạo đức học Kant, Hegel, Feuerbach', 'IV. Triết học cổ điển Đức > 2.d Tư tưởng về đạo đức', 140, 143, v_source_a_id),
        (v_chap_id, 27, 'Điều kiện và nét đặc thù của triết học phương Tây hiện đại', 'V. Một số trào lưu triết học phương Tây hiện đại > 1. Điều kiện ra đời, phát triển và nét đặc thù', 143, 144, v_source_a_id),
        (v_chap_id, 28, 'Chủ nghĩa thực chứng và chủ nghĩa thực chứng mới', 'V. Một số trào lưu triết học phương Tây hiện đại > 2.a Triết học duy khoa học', 144, 148, v_source_a_id),
        (v_chap_id, 29, 'Triết học cuộc sống, triết học hiện sinh và phân tâm học', 'V. Một số trào lưu triết học phương Tây hiện đại > 2.b Triết học nhân bản phi duy lý', 148, 153, v_source_a_id),
        (v_chap_id, 30, 'Một số khuynh hướng triết học tôn giáo hiện đại', 'V. Một số trào lưu triết học phương Tây hiện đại > 2.c Triết học tôn giáo', 153, 156, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 4 TOPICS (15 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 4;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Điều kiện kinh tế - xã hội cho sự ra đời triết học Mác', 'I. Điều kiện ra đời của triết học Mác > 1. Điều kiện kinh tế - xã hội', 157, 160, v_source_a_id),
        (v_chap_id, 2, 'Tiền đề lý luận: triết học cổ điển Đức, kinh tế chính trị học Anh, chủ nghĩa xã hội không tưởng Pháp', 'I. Điều kiện ra đời của triết học Mác > 2. Tiền đề lý luận', 160, 162, v_source_a_id),
        (v_chap_id, 3, 'Tiền đề khoa học tự nhiên', 'I. Điều kiện ra đời của triết học Mác > 3. Tiền đề khoa học tự nhiên', 162, 164, v_source_a_id),
        (v_chap_id, 4, 'Từ duy tâm và dân chủ cách mạng đến duy vật và cộng sản', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 1.a Quá trình chuyển biến tư tưởng của C.Mác và Ph.Ăngghen', 165, 171, v_source_a_id),
        (v_chap_id, 5, 'Hình thành các nguyên lý duy vật biện chứng và duy vật lịch sử', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 1.b Thời kỳ C.Mác và Ph.Ăngghen đề xuất những nguyên lý triết học duy vật biện chứng và duy vật lịch sử', 171, 181, v_source_a_id),
        (v_chap_id, 6, 'Phát triển và hoàn thiện triết học Mác trong các tác phẩm kinh điển', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 1. Giai đoạn Mác - Ăngghen', 181, 226, v_source_a_id),
        (v_chap_id, 7, 'Sự thống nhất giữa chủ nghĩa duy vật và phép biện chứng', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 2. Thực chất của cuộc cách mạng trong triết học do C.Mác và Ph.Ăngghen thực hiện', 227, 228, v_source_a_id),
        (v_chap_id, 8, 'Sáng tạo chủ nghĩa duy vật lịch sử', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 2. Thực chất của cuộc cách mạng trong triết học do C.Mác và Ph.Ăngghen thực hiện', 228, 229, v_source_a_id),
        (v_chap_id, 9, 'Thống nhất lý luận với thực tiễn; tính khoa học với tính cách mạng', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 2. Thực chất của cuộc cách mạng trong triết học do C.Mác và Ph.Ăngghen thực hiện', 229, 232, v_source_a_id),
        (v_chap_id, 10, 'Hoàn cảnh lịch sử V.I.Lênin phát triển triết học Mác', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 3.a V.I.Lênin phát triển triết học Mác - Hoàn cảnh lịch sử', 233, 235, v_source_a_id),
        (v_chap_id, 11, 'Giai đoạn 1893-1907', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 3.b Nội dung cơ bản của quá trình V.I.Lênin phát triển triết học Mác', 235, 239, v_source_a_id),
        (v_chap_id, 12, 'Giai đoạn 1907 đến Cách mạng Tháng Mười Nga 1917', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 3.b Nội dung cơ bản của quá trình V.I.Lênin phát triển triết học Mác', 239, 260, v_source_a_id),
        (v_chap_id, 13, 'Giai đoạn sau Cách mạng xã hội chủ nghĩa Tháng Mười', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 3.b Nội dung cơ bản của quá trình V.I.Lênin phát triển triết học Mác', 260, 265, v_source_a_id),
        (v_chap_id, 14, 'Những biến đổi của thời đại', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 4.a Triết học Mác - Lênin trong thời đại ngày nay', 266, 269, v_source_a_id),
        (v_chap_id, 15, 'Vai trò thế giới quan và phương pháp luận của triết học Mác - Lênin', 'II. Những giai đoạn chủ yếu trong sự hình thành và phát triển của triết học Mác - Lênin > 4.b Triết học Mác - Lênin trong thời đại ngày nay', 269, 272, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 5 TOPICS (9 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 5;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Khái niệm thế giới quan', 'I. Thế giới quan và thế giới quan khoa học > 1.a Khái niệm thế giới quan', 273, 275, v_source_a_id),
        (v_chap_id, 2, 'Thế giới quan huyền thoại, tôn giáo và triết học', 'I. Thế giới quan và thế giới quan khoa học > 1.b Những hình thức cơ bản của thế giới quan', 275, 280, v_source_a_id),
        (v_chap_id, 3, 'Duy tâm và duy vật; các hình thức của thế giới quan duy vật', 'I. Thế giới quan và thế giới quan khoa học > 2. Thế giới quan duy vật và lịch sử phát triển', 280, 287, v_source_a_id),
        (v_chap_id, 4, 'Quan điểm duy vật về thế giới', 'II. Nội dung, bản chất của chủ nghĩa duy vật biện chứng với tư cách hạt nhân của thế giới quan khoa học > 1.a Quan điểm duy vật về thế giới', 288, 291, v_source_a_id),
        (v_chap_id, 5, 'Quan điểm duy vật về xã hội', 'II. Nội dung, bản chất của chủ nghĩa duy vật biện chứng với tư cách hạt nhân của thế giới quan khoa học > 1.b Quan điểm duy vật về xã hội', 291, 295, v_source_a_id),
        (v_chap_id, 6, 'Giải quyết vấn đề cơ bản của triết học và thống nhất thế giới quan duy vật với phép biện chứng', 'II. Nội dung, bản chất của chủ nghĩa duy vật biện chứng với tư cách hạt nhân của thế giới quan khoa học > 2.a-b Bản chất của chủ nghĩa duy vật biện chứng', 295, 298, v_source_a_id),
        (v_chap_id, 7, 'Tính triệt để và tính thực tiễn - cách mạng', 'II. Nội dung, bản chất của chủ nghĩa duy vật biện chứng với tư cách hạt nhân của thế giới quan khoa học > 2.c-d Bản chất của chủ nghĩa duy vật biện chứng', 298, 302, v_source_a_id),
        (v_chap_id, 8, 'Nguyên tắc tôn trọng khách quan', 'III. Những nguyên tắc phương pháp luận của chủ nghĩa duy vật biện chứng và vận dụng ở Việt Nam > 1. Tôn trọng khách quan', 303, 306, v_source_a_id),
        (v_chap_id, 9, 'Phát huy tính năng động chủ quan', 'III. Những nguyên tắc phương pháp luận của chủ nghĩa duy vật biện chứng và vận dụng ở Việt Nam > 2. Phát huy tính năng động chủ quan', 306, 309, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 6 TOPICS (15 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 6;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Siêu hình và biện chứng', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 1.a Siêu hình và biện chứng', 310, 312, v_source_a_id),
        (v_chap_id, 2, 'Phép biện chứng cổ đại, duy tâm Đức và duy vật', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 1.b Khái quát lịch sử phát triển của phép biện chứng', 312, 321, v_source_a_id),
        (v_chap_id, 3, 'Nguyên lý về mối liên hệ phổ biến', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.a Hai nguyên lý của phép biện chứng duy vật', 322, 323, v_source_a_id),
        (v_chap_id, 4, 'Nguyên lý về sự phát triển', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.a Hai nguyên lý của phép biện chứng duy vật', 323, 324, v_source_a_id),
        (v_chap_id, 5, 'Cái riêng - cái chung - cái đơn nhất', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.b Các cặp phạm trù cơ bản', 324, 325, v_source_a_id),
        (v_chap_id, 6, 'Nguyên nhân - kết quả', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.b Các cặp phạm trù cơ bản', 325, 326, v_source_a_id),
        (v_chap_id, 7, 'Tất nhiên - ngẫu nhiên', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.b Các cặp phạm trù cơ bản', 326, 327, v_source_a_id),
        (v_chap_id, 8, 'Nội dung - hình thức; bản chất - hiện tượng; khả năng - hiện thực', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.b Các cặp phạm trù cơ bản', 327, 329, v_source_a_id),
        (v_chap_id, 9, 'Quy luật chuyển hóa từ thay đổi về lượng thành thay đổi về chất và ngược lại', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.c Một số quy luật cơ bản', 329, 331, v_source_a_id),
        (v_chap_id, 10, 'Quy luật thống nhất và đấu tranh của các mặt đối lập', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.c Một số quy luật cơ bản', 331, 331, v_source_a_id),
        (v_chap_id, 11, 'Quy luật phủ định của phủ định', 'I. Khái quát lịch sử phát triển của phép biện chứng và nội dung cơ bản của phép biện chứng duy vật > 2.c Một số quy luật cơ bản', 331, 332, v_source_a_id),
        (v_chap_id, 12, 'Phương pháp và các cấp độ phương pháp', 'II. Phương pháp và phương pháp luận; một số nguyên tắc phương pháp luận cơ bản của phép biện chứng duy vật > 1.a Khái niệm phương pháp và các cấp độ phương pháp', 332, 336, v_source_a_id),
        (v_chap_id, 13, 'Phương pháp luận và các cấp độ phương pháp luận', 'II. Phương pháp và phương pháp luận; một số nguyên tắc phương pháp luận cơ bản của phép biện chứng duy vật > 1.b Khái niệm phương pháp luận và các cấp độ', 336, 339, v_source_a_id),
        (v_chap_id, 14, 'Nguyên tắc toàn diện trong nhận thức và thực tiễn', 'II. Phương pháp và phương pháp luận; một số nguyên tắc phương pháp luận cơ bản của phép biện chứng duy vật > 2.a Nguyên tắc toàn diện', 339, 345, v_source_a_id),
        (v_chap_id, 15, 'Nguyên tắc phát triển trong nhận thức và thực tiễn', 'II. Phương pháp và phương pháp luận; một số nguyên tắc phương pháp luận cơ bản của phép biện chứng duy vật > 2.b Nguyên tắc phát triển', 345, 355, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 7 TOPICS (7 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 7;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Khái niệm, đặc trưng và các hình thức của thực tiễn', 'I. Phạm trù thực tiễn và phạm trù lý luận > 1. Phạm trù thực tiễn', 356, 361, v_source_a_id),
        (v_chap_id, 2, 'Khái niệm và đặc trưng của lý luận', 'I. Phạm trù thực tiễn và phạm trù lý luận > 2. Phạm trù lý luận', 361, 363, v_source_a_id),
        (v_chap_id, 3, 'Thực tiễn là cơ sở, động lực, mục đích và tiêu chuẩn của lý luận', 'II. Những yêu cầu cơ bản của nguyên tắc thống nhất giữa lý luận và thực tiễn', 363, 368, v_source_a_id),
        (v_chap_id, 4, 'Thực tiễn phải được chỉ đạo bởi lý luận; lý luận phải vận dụng vào thực tiễn', 'II. Những yêu cầu cơ bản của nguyên tắc thống nhất giữa lý luận và thực tiễn', 368, 371, v_source_a_id),
        (v_chap_id, 5, 'Lý luận phải bám sát, tổng kết và phát triển từ thực tiễn', 'III. Ý nghĩa phương pháp luận của nguyên tắc thống nhất giữa lý luận và thực tiễn > 1. Lý luận phải luôn bám sát thực tiễn', 371, 373, v_source_a_id),
        (v_chap_id, 6, 'Thực tiễn phải được soi đường bởi lý luận khoa học', 'III. Ý nghĩa phương pháp luận của nguyên tắc thống nhất giữa lý luận và thực tiễn > 2. Hoạt động thực tiễn phải lấy lý luận chỉ đạo', 373, 376, v_source_a_id),
        (v_chap_id, 7, 'Bệnh kinh nghiệm và bệnh giáo điều', 'III. Ý nghĩa phương pháp luận của nguyên tắc thống nhất giữa lý luận và thực tiễn > 3. Khắc phục bệnh kinh nghiệm và bệnh giáo điều', 376, 380, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 8 TOPICS (10 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 8;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Tiền đề xuất phát của lý luận hình thái kinh tế - xã hội', 'I. Lý luận hình thái kinh tế - xã hội và vai trò phương pháp luận > 1. Những tiền đề xuất phát để xây dựng lý luận', 381, 390, v_source_a_id),
        (v_chap_id, 2, 'Biện chứng lực lượng sản xuất - quan hệ sản xuất', 'I. Lý luận hình thái kinh tế - xã hội và vai trò phương pháp luận > 2. Phép biện chứng trong sự vận động, phát triển của hình thái kinh tế - xã hội', 390, 397, v_source_a_id),
        (v_chap_id, 3, 'Biện chứng cơ sở hạ tầng - kiến trúc thượng tầng', 'I. Lý luận hình thái kinh tế - xã hội và vai trò phương pháp luận > 2. Phép biện chứng trong sự vận động, phát triển của hình thái kinh tế - xã hội', 397, 403, v_source_a_id),
        (v_chap_id, 4, 'Giá trị khoa học và phương pháp luận của lý luận hình thái kinh tế - xã hội', 'I. Lý luận hình thái kinh tế - xã hội và vai trò phương pháp luận > 3. Tính khoa học và vai trò phương pháp luận', 403, 408, v_source_a_id),
        (v_chap_id, 5, 'Dự báo của C.Mác, Ph.Ăngghen và V.I.Lênin', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 1. Dự báo của C.Mác và V.I.Lênin về chủ nghĩa xã hội', 409, 414, v_source_a_id),
        (v_chap_id, 6, 'Mô hình kế hoạch hóa và những vấn đề đặt ra', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 2. Chủ nghĩa xã hội theo mô hình kế hoạch hóa', 414, 416, v_source_a_id),
        (v_chap_id, 7, 'Những biến đổi của thời đại và vấn đề quá độ lên chủ nghĩa xã hội', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 3. Những biến đổi của thời đại và vấn đề quá độ', 416, 419, v_source_a_id),
        (v_chap_id, 8, 'Định hướng và đặc trưng của con đường đi lên chủ nghĩa xã hội ở Việt Nam', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 4.a Con đường đi lên chủ nghĩa xã hội ở Việt Nam', 419, 421, v_source_a_id),
        (v_chap_id, 9, 'Công nghiệp hóa, hiện đại hóa', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 4.b Công nghiệp hóa, hiện đại hóa', 421, 424, v_source_a_id),
        (v_chap_id, 10, 'Kết hợp kinh tế với chính trị và các mặt của đời sống xã hội', 'II. Nhận thức về chủ nghĩa xã hội và con đường đi lên chủ nghĩa xã hội ở Việt Nam > 4.c-d Các quan hệ lớn trong quá trình xây dựng chủ nghĩa xã hội', 424, 425, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 9 TOPICS (12 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 9;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Các quan điểm ngoài mácxít về giai cấp', 'I. Giai cấp và đấu tranh giai cấp > 1.a Khái quát các quan điểm ngoài mácxít về giai cấp', 426, 432, v_source_a_id),
        (v_chap_id, 2, 'Quan điểm tư sản hiện đại về giai cấp', 'I. Giai cấp và đấu tranh giai cấp > 1.b Quan điểm của các nhà tư tưởng tư sản hiện đại', 432, 434, v_source_a_id),
        (v_chap_id, 3, 'Khái niệm giai cấp và nguồn gốc giai cấp', 'I. Giai cấp và đấu tranh giai cấp > 2.a Quan niệm khoa học về giai cấp, nguồn gốc giai cấp', 434, 439, v_source_a_id),
        (v_chap_id, 4, 'Đấu tranh giai cấp và vai trò của đấu tranh giai cấp', 'I. Giai cấp và đấu tranh giai cấp > 2.b Quan niệm về đấu tranh giai cấp và vai trò của đấu tranh giai cấp', 439, 448, v_source_a_id),
        (v_chap_id, 5, 'Đặc điểm giai cấp và quan hệ giai cấp trong thời đại hiện nay', 'I. Giai cấp và đấu tranh giai cấp > 3.a Đặc điểm giai cấp và quan hệ giai cấp trong thời đại hiện nay', 448, 451, v_source_a_id),
        (v_chap_id, 6, 'Nội dung và hình thức đấu tranh giai cấp hiện nay', 'I. Giai cấp và đấu tranh giai cấp > 3.b Nội dung và hình thức đấu tranh giai cấp', 451, 452, v_source_a_id),
        (v_chap_id, 7, 'Khái niệm dân tộc và sự hình thành dân tộc', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 1.a Dân tộc và quan hệ giai cấp với dân tộc', 453, 458, v_source_a_id),
        (v_chap_id, 8, 'Quan hệ giữa giai cấp và dân tộc', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 1.b Quan hệ giữa giai cấp và dân tộc', 458, 461, v_source_a_id),
        (v_chap_id, 9, 'Vấn đề dân tộc trong thời đại hiện nay', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 1.c Vấn đề dân tộc và quan hệ giai cấp với dân tộc', 461, 464, v_source_a_id),
        (v_chap_id, 10, 'Nhân loại và quan hệ giai cấp với nhân loại', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 2. Nhân loại và quan hệ giai cấp với nhân loại', 464, 468, v_source_a_id),
        (v_chap_id, 11, 'Tư tưởng Hồ Chí Minh về quan hệ giai cấp - dân tộc - nhân loại', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 3. Tư tưởng Hồ Chí Minh về quan hệ giai cấp, dân tộc, nhân loại', 468, 474, v_source_a_id),
        (v_chap_id, 12, 'Vận dụng quan hệ giai cấp - dân tộc - nhân loại ở Việt Nam', 'II. Quan hệ giai cấp với dân tộc và nhân loại trong thời đại ngày nay > 4. Quan hệ giai cấp, dân tộc, nhân loại trong sự nghiệp xây dựng chủ nghĩa xã hội ở Việt Nam', 474, 479, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 10 TOPICS (9 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 10;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Nguồn gốc nhà nước', 'I. Những nội dung cơ bản của lý luận về nhà nước > 1.a Nguồn gốc của nhà nước', 480, 484, v_source_a_id),
        (v_chap_id, 2, 'Bản chất nhà nước', 'I. Những nội dung cơ bản của lý luận về nhà nước > 1.b Bản chất của nhà nước', 484, 487, v_source_a_id),
        (v_chap_id, 3, 'Chức năng chính trị và chức năng xã hội', 'I. Những nội dung cơ bản của lý luận về nhà nước > 2.a Chức năng cơ bản của nhà nước', 487, 489, v_source_a_id),
        (v_chap_id, 4, 'Vai trò kinh tế của nhà nước', 'I. Những nội dung cơ bản của lý luận về nhà nước > 2.b Vai trò kinh tế của nhà nước', 489, 492, v_source_a_id),
        (v_chap_id, 5, 'Các kiểu và hình thức nhà nước trong lịch sử', 'I. Những nội dung cơ bản của lý luận về nhà nước > 3.a Các kiểu và hình thức nhà nước dựa trên sự đối kháng giai cấp', 492, 495, v_source_a_id),
        (v_chap_id, 6, 'Nhà nước chuyên chính vô sản', 'I. Những nội dung cơ bản của lý luận về nhà nước > 3.b Kiểu nhà nước chuyên chính vô sản', 495, 497, v_source_a_id),
        (v_chap_id, 7, 'Khái niệm, đặc trưng và lịch sử tư tưởng nhà nước pháp quyền', 'II. Nhà nước pháp quyền và nhà nước pháp quyền xã hội chủ nghĩa Việt Nam > 1. Khái niệm nhà nước pháp quyền và lịch sử tư tưởng', 497, 505, v_source_a_id),
        (v_chap_id, 8, 'Bản chất nhà nước pháp quyền xã hội chủ nghĩa Việt Nam', 'II. Nhà nước pháp quyền và nhà nước pháp quyền xã hội chủ nghĩa Việt Nam > 2.a Bản chất nhà nước pháp quyền xã hội chủ nghĩa Việt Nam', 505, 506, v_source_a_id),
        (v_chap_id, 9, 'Xây dựng và hoàn thiện nhà nước pháp quyền xã hội chủ nghĩa Việt Nam', 'II. Nhà nước pháp quyền và nhà nước pháp quyền xã hội chủ nghĩa Việt Nam > 2.b Xây dựng và hoàn thiện nhà nước pháp quyền xã hội chủ nghĩa Việt Nam', 506, 510, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    -- --- CHAPTER 11 TOPICS (16 topics) ---
    SELECT id INTO v_chap_id FROM public.chapters WHERE course_id = v_course_id AND chapter_number = 11;
    INSERT INTO public.topics (
        chapter_id,
        topic_number,
        title,
        section_path,
        source_page_start,
        source_page_end,
        source_type_id
    ) VALUES
        (v_chap_id, 1, 'Con người trong triết học Phật giáo và Nho gia', 'I. Một số quan điểm triết học phi mácxít về con người > 1. Quan điểm về con người trong triết học phương Đông', 511, 514, v_source_a_id),
        (v_chap_id, 2, 'Con người trong triết học phương Tây cổ đại', 'I. Một số quan điểm triết học phi mácxít về con người > 2. Quan điểm về con người trong triết học phương Tây', 514, 516, v_source_a_id),
        (v_chap_id, 3, 'Con người thời trung cổ', 'I. Một số quan điểm triết học phi mácxít về con người > 2. Quan điểm về con người trong triết học phương Tây', 516, 517, v_source_a_id),
        (v_chap_id, 4, 'Con người thời Phục hưng và cận đại', 'I. Một số quan điểm triết học phi mácxít về con người > 2. Quan điểm về con người trong triết học phương Tây', 517, 519, v_source_a_id),
        (v_chap_id, 5, 'Con người trong triết học phương Tây hiện đại', 'I. Một số quan điểm triết học phi mácxít về con người > 2. Quan điểm về con người trong triết học phương Tây', 519, 520, v_source_a_id),
        (v_chap_id, 6, 'Con người là thực thể sinh vật - xã hội', 'II. Quan điểm của triết học Mác - Lênin về con người > 1.a Con người là thực thể sinh vật - xã hội', 520, 521, v_source_a_id),
        (v_chap_id, 7, 'Con người là chủ thể và sản phẩm của lịch sử', 'II. Quan điểm của triết học Mác - Lênin về con người > 1.b Con người là chủ thể của lịch sử', 521, 525, v_source_a_id),
        (v_chap_id, 8, 'Tha hóa lao động và giải phóng con người', 'II. Quan điểm của triết học Mác - Lênin về con người > 2. Quan điểm về giải phóng con người', 525, 532, v_source_a_id),
        (v_chap_id, 9, 'Cơ sở lịch sử - xã hội, truyền thống Việt Nam và tinh hoa nhân loại', 'III. Tư tưởng Hồ Chí Minh về con người trong sự nghiệp cách mạng > 1. Cơ sở hình thành tư tưởng Hồ Chí Minh về con người', 532, 536, v_source_a_id),
        (v_chap_id, 10, 'Tư tưởng Hồ Chí Minh về giải phóng con người', 'III. Tư tưởng Hồ Chí Minh về con người trong sự nghiệp cách mạng > 2.a Giải phóng dân tộc, giải phóng giai cấp, giải phóng nhân dân lao động', 536, 538, v_source_a_id),
        (v_chap_id, 11, 'Con người vừa là mục tiêu vừa là động lực của cách mạng', 'III. Tư tưởng Hồ Chí Minh về con người trong sự nghiệp cách mạng > 2.b Con người vừa là mục tiêu vừa là động lực của cách mạng', 538, 541, v_source_a_id),
        (v_chap_id, 12, 'Tư tưởng Hồ Chí Minh về phát triển con người toàn diện', 'III. Tư tưởng Hồ Chí Minh về con người trong sự nghiệp cách mạng > 2.c Phát triển con người toàn diện', 541, 544, v_source_a_id),
        (v_chap_id, 13, 'Môi trường địa lý, kinh tế, lịch sử giữ nước và văn hóa', 'IV. Vấn đề xây dựng con người Việt Nam giai đoạn hiện nay > 1.a Điều kiện lịch sử hình thành con người Việt Nam', 544, 547, v_source_a_id),
        (v_chap_id, 14, 'Mặt tích cực, hạn chế và tính hai mặt của truyền thống', 'IV. Vấn đề xây dựng con người Việt Nam giai đoạn hiện nay > 1.b Mặt tích cực và hạn chế của người Việt Nam trong lịch sử', 547, 549, v_source_a_id),
        (v_chap_id, 15, 'Những yêu cầu mới đối với con người Việt Nam', 'IV. Vấn đề xây dựng con người Việt Nam giai đoạn hiện nay > 2.a Con người Việt Nam trong giai đoạn hiện nay', 549, 551, v_source_a_id),
        (v_chap_id, 16, 'Xây dựng con người Việt Nam trên các lĩnh vực kinh tế, chính trị, xã hội, giáo dục và văn hóa', 'IV. Vấn đề xây dựng con người Việt Nam giai đoạn hiện nay > 2.b Xây dựng con người Việt Nam đáp ứng yêu cầu giai đoạn hiện nay', 551, 554, v_source_a_id)
    ON CONFLICT (chapter_id, topic_number) DO UPDATE SET
        title = EXCLUDED.title,
        section_path = EXCLUDED.section_path,
        source_page_start = EXCLUDED.source_page_start,
        source_page_end = EXCLUDED.source_page_end,
        source_type_id = EXCLUDED.source_type_id,
        updated_at = NOW();

    RAISE NOTICE 'Curriculum seed completed successfully: 11 chapters and 150 topics imported.';
END $$;