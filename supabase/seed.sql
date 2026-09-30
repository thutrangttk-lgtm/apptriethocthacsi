-- ==============================================================================
-- SEED DATA FOR PHILOSOPHY LEARNING APP (PHASE 1 CORE ONLY)
-- App: Triết Học Thạc Sĩ
-- ==============================================================================

-- 1. SEED SOURCE CLASSIFICATIONS (Phân cấp nguồn A, B, C, D)
INSERT INTO public.source_types (id, code, name, description, priority_level)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'A', 'Official Sources', 'Official textbook and official course materials', 1),
  ('22222222-2222-2222-2222-222222222222', 'B', 'Lecturer Sources', 'Lecturer slides, lectures, notes and lecturer-provided materials', 2),
  ('33333333-3333-3333-3333-333333333333', 'C', 'Verified Notes', 'Content verified against Official or Lecturer sources', 3),
  ('44444444-4444-4444-4444-444444444444', 'D', 'Student Reference', 'Previous students'' answers and shared materials. UNVERIFIED by default and must never override A or B.', 4)
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, priority_level = EXCLUDED.priority_level;

-- 2. SEED COURSE: "Triết học - Cao học"
INSERT INTO public.courses (id, code, title, description)
VALUES (
  'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  'PHIL-MASTER',
  'Triết học - Cao học',
  'Chương trình lý luận Triết học - Cao học'
) ON CONFLICT (code) DO UPDATE
SET title = EXCLUDED.title, description = EXCLUDED.description;
