#!/usr/bin/env python3
"""
scripts/link_topics.py
--------------------------------------------------------------------------------
Module & CLI tool to link document pages and chunks to existing curriculum topics
based on printed page ranges (topic.source_page_start and topic.source_page_end).
Does NOT invent topic relationships or modify curriculum records.
--------------------------------------------------------------------------------
"""

import sys
import json
from typing import List, Dict, Any, Optional

# Sample authoritative topic mapping for standalone execution / review
AUTHORITATIVE_TOPICS = [
    # Chapter 1
    {"chapter_number": 1, "topic_number": 1, "title": "Khái niệm triết học", "source_page_start": 7, "source_page_end": 8},
    {"chapter_number": 1, "topic_number": 2, "title": "Đối tượng của triết học qua các thời kỳ", "source_page_start": 8, "source_page_end": 10},
    {"chapter_number": 1, "topic_number": 3, "title": "Tính quy luật của sự hình thành và phát triển triết học", "source_page_start": 11, "source_page_end": 13},
    {"chapter_number": 1, "topic_number": 4, "title": "Thế giới quan và phương pháp luận", "source_page_start": 13, "source_page_end": 16},
    {"chapter_number": 1, "topic_number": 5, "title": "Triết học với khoa học cụ thể và tư duy lý luận", "source_page_start": 16, "source_page_end": 18},
    # Chapter 2
    {"chapter_number": 2, "topic_number": 1, "title": "Điều kiện ra đời của triết học Ấn Độ cổ, trung đại", "source_page_start": 19, "source_page_end": 20},
    # ...
    {"chapter_number": 11, "topic_number": 16, "title": "Xây dựng con người Việt Nam...", "source_page_start": 551, "source_page_end": 554}
]


def find_matching_topics_for_page(
    printed_page_number: Optional[int], 
    topics_list: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """
    Finds all curriculum topics matching a single printed page number.
    Returns a list of matching topic records.
    """
    if printed_page_number is None:
        return []
        
    topics = topics_list if topics_list is not None else AUTHORITATIVE_TOPICS
    matched = []
    
    for t in topics:
        if t["source_page_start"] <= printed_page_number <= t["source_page_end"]:
            matched.append(t)
            
    return matched


def find_matching_topics_for_range(
    printed_page_start: Optional[int],
    printed_page_end: Optional[int],
    topics_list: Optional[List[Dict[str, Any]]] = None
) -> List[Dict[str, Any]]:
    """
    Finds all curriculum topics overlapping a chunk page range [printed_page_start, printed_page_end].
    """
    if printed_page_start is None or printed_page_end is None:
        return []
        
    topics = topics_list if topics_list is not None else AUTHORITATIVE_TOPICS
    matched = []
    
    for t in topics:
        # Check overlap
        if not (printed_page_end < t["source_page_start"] or printed_page_start > t["source_page_end"]):
            matched.append(t)
            
    return matched


if __name__ == "__main__":
    test_page = 8
    matches = find_matching_topics_for_page(test_page)
    print(f"Matching topics for printed page {test_page}:")
    for m in matches:
        print(f"  - Ch.{m['chapter_number']} Topic {m['topic_number']}: {m['title']} (p.{m['source_page_start']}-{m['source_page_end']})")
