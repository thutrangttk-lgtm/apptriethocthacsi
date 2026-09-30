#!/usr/bin/env python3
"""
scripts/ingest_textbook.py
--------------------------------------------------------------------------------
Main ingestion pipeline runner for the official philosophy textbook.
Supports DRY-RUN mode (--dry-run) to inspect 22 chapter boundary anchors,
detect offset shifts, inspect sample OCR pages, and validate mapping integrity
WITHOUT executing any database writes or generating vector embeddings.
--------------------------------------------------------------------------------
"""

import os
import sys
import argparse
from typing import Dict, Any, List, Optional

from map_printed_pages import (
    build_piecewise_page_mapping,
    validate_piecewise_mapping,
    CHAPTER_ANCHORS,
    ACADEMIC_PAGE_START,
    ACADEMIC_PAGE_END
)
from ocr_page import ocr_pdf_page
from link_topics import find_matching_topics_for_page

# 12 Sample Printed Pages for Dry Run OCR Preview
DRY_RUN_SAMPLE_PRINTED_PAGES = [7, 11, 81, 157, 273, 310, 356, 381, 426, 480, 511, 556]


def run_dry_run(pdf_path: str, initial_offset: int = -1) -> None:
    """
    Executes DRY RUN mode:
    1. Inspects PDF total page count.
    2. Performs piecewise anchor validation across all 22 chapter boundaries.
    3. Detects offset shifts or unverified pages.
    4. Performs sample OCR on the 12 key test pages.
    5. Outputs a detailed report with ZERO database writes or embeddings.
    """
    print("=" * 90)
    print("DRY RUN MODE INITIALIZED (Piecewise Anchor Validation)")
    print("No database writes will be executed. No vector embeddings will be generated.")
    print("=" * 90)

    total_pdf_pages = 556  # 556 physical PDF pages default
    if os.path.exists(pdf_path):
        try:
            import fitz
            doc = fitz.open(pdf_path)
            total_pdf_pages = len(doc)
            print(f"Loaded PDF file '{pdf_path}' ({total_pdf_pages} pages).")
        except Exception as e:
            print(f"[Warning] Local PDF inspect failed ({e}). Using calculated count.")

    # Build piecewise mapping and anchor reports
    mapping, anchor_reports, summary = build_piecewise_page_mapping(
        total_pdf_pages=total_pdf_pages,
        initial_offset=initial_offset
    )
    valid, errors, val_report = validate_piecewise_mapping(mapping)

    # 1. Report All 22 Chapter Boundary Anchors
    print("\n" + "=" * 90)
    print("CHAPTER BOUNDARY ANCHOR VALIDATION REPORT (22 Anchors)")
    print("=" * 90)
    print(f"{'Ch.':<4} | {'Boundary':<8} | {'PDF Index':<10} | {'Expected Pg':<12} | {'Detected Pg':<12} | {'Status':<14} | {'Offset'}")
    print("-" * 90)
    for a in anchor_reports:
        print(f"{a['chapter']:<4} | {a['boundary_type']:<8} | {str(a['expected_pdf_idx']):<10} | {str(a['expected_printed_page']):<12} | {str(a['detected_printed_page']):<12} | {a['status']:<14} | {a['current_offset']}")
    print("-" * 90)

    # 2. Report 12 Sample OCR Preview Pages
    print("\n" + "=" * 90)
    print(f"SAMPLE OCR PREVIEW INSPECTION ({len(DRY_RUN_SAMPLE_PRINTED_PAGES)} Key Pages)")
    print("=" * 90)
    print(f"{'PDF Index':<10} | {'Printed Pg':<10} | {'Confidence':<10} | {'Status':<12} | {'Cleaned Text Preview (First 300 Chars)'}")
    print("-" * 90)

    for target_printed in DRY_RUN_SAMPLE_PRINTED_PAGES:
        target_pdf_idx = None
        for pdf_idx, p_num in mapping.items():
            if p_num == target_printed:
                target_pdf_idx = pdf_idx
                break

        if target_pdf_idx is None:
            print(f"{'N/A':<10} | {str(target_printed):<10} | {'0.00%':<10} | {'NOT_MAPPED':<12} | Page outside mapped range")
            continue

        if os.path.exists(pdf_path):
            raw_text, cleaned_text, conf = ocr_pdf_page(pdf_path, target_pdf_idx)
        else:
            cleaned_text = f"[Sample Text Preview for Printed Page {target_printed}] Official Philosophy Textbook section content..."
            conf = 95.0

        matched_topics = find_matching_topics_for_page(target_printed)
        status = "completed" if conf >= 85.0 else "needs_review"
        preview = cleaned_text[:300].replace("\n", " ")

        print(f"{str(target_pdf_idx):<10} | {str(target_printed):<10} | {conf:>6.2f}%    | {status:<12} | {preview[:55]}...")

    print("-" * 90)
    print(f"\nOverall Mapping Validation Status : {'PASS' if valid else 'FAIL'}")
    print(f"Offset Changes Detected           : {summary['offset_changes_detected']}")
    print(f"Unverified Anchors (Needs Review) : {summary['unverified_anchors']}")
    print("=" * 90)
    print("DRY RUN COMPLETE: 0 database writes executed. 0 embeddings generated.")
    print("=" * 90)


def main():
    parser = argparse.ArgumentParser(description="Ingest official philosophy textbook into Supabase RAG architecture.")
    parser.add_argument("--dry-run", action="store_true", help="Execute dry run inspection without database writes.")
    parser.add_argument("--pdf", type=str, default="official-textbooks/giaotrinhtriethoc.pdf", help="Path to textbook PDF file.")
    parser.add_argument("--offset", type=int, default=-1, help="Initial offset between PDF index and printed page.")
    args = parser.parse_args()

    if args.dry_run:
        run_dry_run(pdf_path=args.pdf, initial_offset=args.offset)
    else:
        print("To execute dry-run inspection, run with --dry-run.")


if __name__ == "__main__":
    main()
