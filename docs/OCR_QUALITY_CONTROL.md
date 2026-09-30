# OCR Quality Control & Verification Protocol

## Overview
This document defines the quality control, validation, error isolation, and retry protocols for the optical character recognition (OCR) and text extraction pipeline processing the official philosophy textbook (**Giáo trình Triết học**).

---

## 1. OCR Quality Measurement & Metrics

### A. Confidence Score Metric
- Every processed page receives an `ocr_confidence` score normalized to a scale of `0.00` to `100.00%`.
- High Quality: `ocr_confidence >= 85.00%`
- Low Quality / Flagged: `ocr_confidence < 85.00%`

### B. Character & Layout Integrity Checks
- **Non-Printable Character Ratio:** Flag text containing > 2% non-ASCII/non-Vietnamese control characters.
- **Garbage Word Heuristic:** Detect sequences of random punctuation or isolated consonants resulting from scan artifacts.

---

## 2. Vietnamese Diacritic & Formatting Validation

1. **Unicode NFC Normalization:** All text passes through `unicodedata.normalize("NFC")` to unify composed and decomposed diacritic marks.
2. **Vietnamese Tone Placement:** Verify valid placement of Vietnamese vowels and tone marks (á, à, ả, ã, ạ, ă, ắ, ằ, ẳ, ẵ, ặ, â, ấ, ầ, ẩ, ẫ, ậ, đ, é, è, ẻ, ẽ, ẹ, ê, ế, ề, ể, ễ, ệ, í, ì, ỉ, ĩ, ị, ó, ò, ỏ, õ, ọ, ô, ố, ồ, ổ, ỗ, ộ, ơ, ớ, ờ, ở, ỡ, ợ, ú, ù, ủ, ũ, ụ, ư, ứng, ừ, ử, ữ, ự, ý, ỳ, ỷ, ỹ, ỵ).
3. **No Paraphrasing Rule:** OCR and cleaning routines must preserve verbatim philosophy wording. Summarization or AI rewriting is strictly prohibited during text extraction.

---

## 3. Printed-Page Number Validation

Page mapping is validated against five strict structural rules:
1. **Monotonicity:** Printed page numbers must strictly increase (`page[i+1] > page[i]`).
2. **Academic Scope Bounds:** Printed page numbers must fall strictly between **7 and 556**.
3. **Front-Matter Explicit Nulls:** Physical PDF pages preceding printed page 7 (cover, copyright, preface, table of contents) are explicitly assigned `printed_page_number = NULL`.
4. **Uniqueness:** No two physical PDF pages may map to the same printed page number.
5. **Continuity Check:** Any sequence gap (e.g. page 45 followed by page 47) triggers a `Discontinuity Warning` for manual audit.

---

## 4. Flagging & Manual Review Workflow

1. **Automatic Status Assignment:**
   - `completed`: `ocr_confidence >= 85.00%` and page mapping valid.
   - `needs_review`: `ocr_confidence < 85.00%` or layout ambiguity detected.
   - `failed`: Extraction exception or unreadable scan.

2. **Manual Review Queue Query:**
   ```sql
   SELECT pdf_page_index, printed_page_number, ocr_confidence, cleaned_text
   FROM public.document_pages
   WHERE ocr_status IN ('needs_review', 'failed')
   ORDER BY pdf_page_index;
   ```

3. **Correction Procedure:**
   - Operators inspect original PDF page image against extracted text.
   - Corrected text is updated in `cleaned_text` and status marked as `completed`.

---

## 5. Failure Isolation & Retry Strategy

1. **Isolation:** A failure on page `N` does NOT interrupt processing of remaining pages.
2. **State Persistence:** Processing state and SHA-256 `checksum` are persisted in `public.document_pages`.
3. **Targeted Retries:** Retry commands select only pages with `ocr_status = 'failed'` or `ocr_status = 'pending'`, avoiding redundant processing of completed pages.
