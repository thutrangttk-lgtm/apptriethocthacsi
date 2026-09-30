#!/usr/bin/env python3
"""
scripts/ocr_page.py
--------------------------------------------------------------------------------
Module & CLI tool to perform OCR and text cleaning on a single PDF page or image.
Extracts raw_text, cleaned_text, and ocr_confidence without summarizing or
paraphrasing the underlying philosophy text.
--------------------------------------------------------------------------------
"""

import re
import sys
import unicodedata
from typing import Dict, Any, Tuple


def clean_vietnamese_text(text: str) -> str:
    """
    Cleans raw OCR text:
    1. Normalizes Unicode to NFC form.
    2. Strips running headers/footers/page numbers.
    3. Normalizes whitespace while preserving logical paragraph breaks.
    4. Does NOT alter, summarize, or rewrite philosophy content.
    """
    if not text:
        return ""
        
    # Unicode NFC normalization
    cleaned = unicodedata.normalize("NFC", text)
    
    # Strip common OCR noise and header/footer line patterns
    cleaned = re.sub(r"(?i)GIÁO TRÌNH TRIẾT HỌC.*", "", cleaned)
    cleaned = re.sub(r"(?i)BỘ GIÁO DỤC VÀ ĐÀO TẠO.*", "", cleaned)
    cleaned = re.sub(r"(?i)NHÀ XUẤT BẢN LÝ LUẬN CHÍNH TRỊ.*", "", cleaned)
    
    # Normalize multiple line breaks to paragraph breaks (\n\n)
    paragraphs = [p.strip() for p in cleaned.split("\n\n") if p.strip()]
    cleaned_paragraphs = []
    
    for p in paragraphs:
        # Replace single newlines within a paragraph with spaces
        lines = [line.strip() for line in p.split("\n") if line.strip()]
        p_clean = " ".join(lines)
        # Remove extra spaces
        p_clean = re.sub(r"\s+", " ", p_clean)
        if p_clean:
            cleaned_paragraphs.append(p_clean)
            
    return "\n\n".join(cleaned_paragraphs)


def ocr_pdf_page(pdf_path: str, pdf_page_index: int) -> Tuple[str, str, float]:
    """
    Renders a PDF page and performs OCR / text extraction.
    Returns: (raw_text, cleaned_text, ocr_confidence)
    """
    raw_text = ""
    confidence = 95.0  # Default confidence for vector-extracted text

    # Attempt PyMuPDF (fitz) text extraction first
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(pdf_path)
        if 0 <= pdf_page_index < len(doc):
            page = doc[pdf_page_index]
            raw_text = page.get_text("text")
            if raw_text.strip():
                cleaned_text = clean_vietnamese_text(raw_text)
                return raw_text, cleaned_text, confidence
    except ImportError:
        pass
    except Exception as e:
        print(f"[Warning] PyMuPDF extraction failed for page {pdf_page_index}: {e}", file=sys.stderr)

    # Attempt Tesseract / pdf2image OCR fallback if fitz yields no text or is absent
    try:
        from pdf2image import convert_from_path
        import pytesseract
        
        images = convert_from_path(pdf_path, first_page=pdf_page_index + 1, last_page=pdf_page_index + 1, dpi=300)
        if images:
            data = pytesseract.image_to_data(images[0], lang="vie", output_type=pytesseract.Output.DICT)
            words = [w for w in data["text"] if w.strip()]
            confidences = [float(c) for c in data["conf"] if float(c) >= 0]
            
            raw_text = " ".join(words)
            confidence = sum(confidences) / len(confidences) if confidences else 85.0
            cleaned_text = clean_vietnamese_text(raw_text)
            return raw_text, cleaned_text, confidence
    except Exception as e:
        print(f"[Warning] OCR fallback failed for page {pdf_page_index}: {e}", file=sys.stderr)

    # Clean fallback if no text could be extracted yet
    cleaned_text = clean_vietnamese_text(raw_text)
    return raw_text, cleaned_text, confidence


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python ocr_page.py <pdf_path> <pdf_page_index>")
        sys.exit(1)
        
    pdf_file = sys.argv[1]
    page_idx = int(sys.argv[2])
    raw, cleaned, conf = ocr_pdf_page(pdf_file, page_idx)
    
    print("=" * 70)
    print(f"OCR RESULT FOR PAGE INDEX {page_idx} (Confidence: {conf:.2f}%)")
    print("=" * 70)
    print("CLEANED TEXT (First 300 chars):")
    print(cleaned[:300])
    print("=" * 70)
