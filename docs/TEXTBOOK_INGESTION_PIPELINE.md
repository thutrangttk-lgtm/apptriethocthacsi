# Official Textbook Ingestion & RAG Pipeline Specification

## Overview
This document specifies the end-to-end ingestion, optical character recognition (OCR), page mapping, chunking, embedding, and retrieval pipeline for the official philosophy textbook (**Giáo trình Triết học**, publication year 2007) stored in Supabase Storage (`apptriethocthacsi/official-textbooks/giaotrinhtriethoc.pdf`).

---

## Pipeline Architecture & Steps

### A. PDF Download from Supabase Storage
1. **Source Location:** Bucket `apptriethocthacsi`, path `official-textbooks/giaotrinhtriethoc.pdf`.
2. **Execution Context:** Server-side ingestion script (Node.js / Python runner utilizing Supabase Service Role Key).
3. **Security:** Storage operations use service role authentication. Service role keys are kept strictly server-side and never exposed to client browsers.

### B. Page Rendering
1. **Resolution & Format:** Convert each PDF page to high-DPI raster images (300 DPI PNG) using `pdf2image` or `pdfjs-dist`.
2. **Page Indexing:** Assign zero-indexed `pdf_page_index` (0, 1, 2, ...) corresponding to physical PDF pages.

### C. OCR Processing
1. **Engine & Language:** Utilize high-accuracy Vietnamese OCR (Tesseract / Google Vision OCR / PaddleOCR).
2. **Extracted Attributes:**
   - `raw_text`: Direct unedited OCR output text.
   - `ocr_confidence`: Confidence score normalized to a scale of `0.00` to `100.00`.
   - `ocr_status`: Status lifecycle (`pending` -> `processing` -> `completed` / `failed`).
3. **Checksum:** Generate SHA-256 hash of `raw_text` stored in `document_pages.checksum` for change detection.

### D. Text Cleaning & Normalization
1. **Header/Footer Suppression:** Strip running headers, footers, publisher marks, and page numbers from body text to avoid chunk contamination.
2. **Vietnamese Diacritic Normalization:** Standardize Unicode characters to NFC form.
3. **Whitespace Standardization:** Replace redundant line breaks and extra spaces with normalized paragraph breaks while maintaining structural boundaries.

### E. Printed-Page-Number Mapping
1. **Printed vs. Viewer Index:** PDF viewer index (0-based) differs from printed book page numbers due to cover and front matter.
2. **Academic Scope:** Academic content spans printed book pages **7 through 556**.
3. **Front Matter Handling:** Pages prior to printed page 7 (cover, title page, table of contents, preface) are recorded with `printed_page_number = NULL` in `public.document_pages`.
4. **Traceability:** Every physical page record explicitly correlates `pdf_page_index` with its detected `printed_page_number`.

### F. Semantic Chunking
1. **Strategy:** Overlapping sliding window based on logical paragraphs and section breaks.
2. **Chunk Size:** Target chunk size of ~500–800 tokens with a 10% overlap (~50–80 tokens).
3. **Page Boundaries:** Chunks preserve page provenance (`printed_page_start`, `printed_page_end`).
4. **Unique Identity:** Identified by `(document_id, page_id, chunk_index)`.

### G. Topic Linking via Page Ranges
1. **Curriculum Correlation:** Link chunks to `public.topics` by matching chunk `printed_page_start` and `printed_page_end` against `topics.source_page_start` and `topics.source_page_end`.
2. **Foreign Key Attachment:** Set `document_chunks.topic_id` to the corresponding topic UUID ON DELETE SET NULL.

### H. Embeddings Generation
1. **Vector Dimension:** 1536 dimensions (compatible with OpenAI `text-embedding-3-small` / `text-embedding-ada-002`).
2. **Storage:** Saved in `document_chunks.embedding` (`VECTOR(1536)`).
3. **Index:** Indexed using HNSW (`idx_document_chunks_embedding`) with `vector_cosine_ops` for fast cosine distance similarity queries (`<=>`).

### I. Idempotent Insert/Update Strategy
1. **Page Level:** UPSERT into `public.document_pages` ON CONFLICT `(document_id, pdf_page_index)`. If `checksum` is unchanged, skip re-OCR.
2. **Chunk Level:** UPSERT into `public.document_chunks` ON CONFLICT `(document_id, page_id, chunk_index)`. Re-chunking updates text and re-computes embeddings cleanly without orphan records.

### J. Retrieval Flow
1. **User Query Embedding:** Convert user search or prompt into a 1536-dimensional query vector.
2. **RPC Invocation:** Call `public.match_document_chunks(query_embedding, match_count, filter_topic_id, filter_printed_page_start, filter_printed_page_end)`.
3. **Similarity Calculation:** Computes `1 - (embedding <=> query_embedding)`.
4. **Page-Level Traceability:** Returned contexts include `printed_page_start`, `printed_page_end`, and `topic_id` for accurate textbook citations.

### K. Audit & Logging Strategy
1. **Status Monitoring:** Track page-level processing via `ocr_status` (`pending`, `processing`, `completed`, `failed`).
2. **Quality Audit:** Query pages with `ocr_confidence < 85.00` for manual review or re-OCR.
3. **Pipeline Metrics:** Log total pages processed, successful chunks created, and total tokens embedded.

### L. Failure & Retry Strategy
1. **API Exponential Backoff:** Transient failures during OCR or embedding API requests trigger automatic retries (up to 3 attempts with exponential delay).
2. **Page Isolation:** Failed pages are updated to `ocr_status = 'failed'` without halting processing of remaining pages.
3. **Targeted Re-runs:** Re-executing the ingestion pipeline targets only pages with `ocr_status = 'failed'` or `checksum` mismatches.
