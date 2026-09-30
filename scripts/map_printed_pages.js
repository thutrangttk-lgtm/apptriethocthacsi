/**
 * scripts/map_printed_pages.js
 * Piecewise Explicit Printed-Page Mapping & Boundary Anchor Validator.
 * Validates 22 chapter boundary anchors without assuming a fixed global offset.
 */

const ACADEMIC_PAGE_START = 7;
const ACADEMIC_PAGE_END = 556;

// 22 Chapter Start & End Boundary Anchors
const CHAPTER_ANCHORS = [
    { chapter: 1, expected_printed_page: 7, boundary_type: "start" },
    { chapter: 1, expected_printed_page: 18, boundary_type: "end" },
    { chapter: 2, expected_printed_page: 19, boundary_type: "start" },
    { chapter: 2, expected_printed_page: 80, boundary_type: "end" },
    { chapter: 3, expected_printed_page: 81, boundary_type: "start" },
    { chapter: 3, expected_printed_page: 156, boundary_type: "end" },
    { chapter: 4, expected_printed_page: 157, boundary_type: "start" },
    { chapter: 4, expected_printed_page: 272, boundary_type: "end" },
    { chapter: 5, expected_printed_page: 273, boundary_type: "start" },
    { chapter: 5, expected_printed_page: 309, boundary_type: "end" },
    { chapter: 6, expected_printed_page: 310, boundary_type: "start" },
    { chapter: 6, expected_printed_page: 355, boundary_type: "end" },
    { chapter: 7, expected_printed_page: 356, boundary_type: "start" },
    { chapter: 7, expected_printed_page: 380, boundary_type: "end" },
    { chapter: 8, expected_printed_page: 381, boundary_type: "start" },
    { chapter: 8, expected_printed_page: 425, boundary_type: "end" },
    { chapter: 9, expected_printed_page: 426, boundary_type: "start" },
    { chapter: 9, expected_printed_page: 479, boundary_type: "end" },
    { chapter: 10, expected_printed_page: 480, boundary_type: "start" },
    { chapter: 10, expected_printed_page: 510, boundary_type: "end" },
    { chapter: 11, expected_printed_page: 511, boundary_type: "start" },
    { chapter: 11, expected_printed_page: 556, boundary_type: "end" }
];

function extractPrintedPageNumber(pageText) {
    if (!pageText) return null;
    const lines = pageText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    const candidateLines = [...lines.slice(0, 2), ...lines.slice(-2)];
    for (const line of candidateLines) {
        const matches = line.match(/\b(\d{1,3})\b/g);
        if (matches) {
            for (const m of matches) {
                const val = parseInt(m, 10);
                if (val >= ACADEMIC_PAGE_START && val <= ACADEMIC_PAGE_END) {
                    return val;
                }
            }
        }
    }
    return null;
}

function buildPiecewisePageMapping(totalPdfPages, initialOffset = -1, pageTexts = null) {
    const mapping = {};
    const anchorReports = [];
    let currentOffset = initialOffset; // PDF Index = Printed Page + Offset (e.g. 6 + (-1) = 5? No, pdf_idx = printed_page + offset -> 6 = 7 + (-1))
    const offsetChanges = [];
    let unverifiedAnchors = 0;

    for (const anchor of CHAPTER_ANCHORS) {
        const expectedP = anchor.expected_printed_page;
        const expectedPdfIdx = expectedP + currentOffset;
        let detectedP = null;
        let status = "VERIFIED";

        if (pageTexts && pageTexts[expectedPdfIdx]) {
            detectedP = extractPrintedPageNumber(pageTexts[expectedPdfIdx]);
        }

        if (detectedP !== null) {
            if (detectedP === expectedP) {
                status = "VERIFIED";
            } else {
                status = "OFFSET_SHIFT";
                const newOffset = expectedPdfIdx - detectedP;
                offsetChanges.push({
                    at_printed_page: expectedP,
                    old_offset: currentOffset,
                    new_offset: newOffset
                });
                currentOffset = newOffset;
            }
        } else {
            status = "NEEDS_REVIEW";
            unverifiedAnchors++;
        }

        anchorReports.push({
            chapter: anchor.chapter,
            boundary_type: anchor.boundary_type,
            expected_printed_page: expectedP,
            expected_pdf_idx: expectedPdfIdx,
            detected_printed_page: detectedP !== null ? detectedP : "UNVERIFIED",
            status,
            current_offset: currentOffset
        });
    }

    for (let pdfIdx = 0; pdfIdx < totalPdfPages; pdfIdx++) {
        const printedP = pdfIdx - currentOffset;
        if (printedP >= ACADEMIC_PAGE_START && printedP <= ACADEMIC_PAGE_END) {
            mapping[pdfIdx] = printedP;
        } else {
            mapping[pdfIdx] = null;
        }
    }

    const summary = {
        total_anchors: CHAPTER_ANCHORS.length,
        unverified_anchors: unverifiedAnchors,
        offset_changes_detected: offsetChanges.length,
        active_final_offset: currentOffset
    };

    return { mapping, anchorReports, summary };
}

function validatePiecewiseMapping(mapping) {
    const errors = [];
    const warnings = [];
    const printedPages = [];
    const seenPrinted = new Set();

    const sortedIndexes = Object.keys(mapping).map(Number).sort((a, b) => a - b);

    for (const pdfIdx of sortedIndexes) {
        const printedNum = mapping[pdfIdx];
        if (printedNum !== null) {
            printedPages.push({ pdfIdx, printedNum });
            if (printedNum < ACADEMIC_PAGE_START || printedNum > ACADEMIC_PAGE_END) {
                errors.push(`PDF page ${pdfIdx}: Printed page ${printedNum} out of bounds [${ACADEMIC_PAGE_START}, ${ACADEMIC_PAGE_END}].`);
            }
            if (seenPrinted.has(printedNum)) {
                errors.push(`Duplicate printed page detected: ${printedNum} at PDF index ${pdfIdx}.`);
            }
            seenPrinted.add(printedNum);
        }
    }

    for (let i = 1; i < printedPages.length; i++) {
        const prev = printedPages[i - 1];
        const curr = printedPages[i];
        if (curr.printedNum <= prev.printedNum) {
            errors.push(`Monotonicity error: PDF page ${curr.pdfIdx} (p.${curr.printedNum}) <= PDF page ${prev.pdfIdx} (p.${prev.printedNum}).`);
        }
        if (curr.printedNum !== prev.printedNum + 1) {
            warnings.push(`Discontinuity warning: Jump between PDF ${prev.pdfIdx} (p.${prev.printedNum}) and PDF ${curr.pdfIdx} (p.${curr.printedNum}).`);
        }
    }

    const is_valid = errors.length === 0;
    const report = {
        is_valid,
        total_pdf_pages: Object.keys(mapping).length,
        front_matter_pages: Object.values(mapping).filter(v => v === null).length,
        academic_pages_mapped: printedPages.length,
        min_printed_page: printedPages.length > 0 ? printedPages[0].printedNum : null,
        max_printed_page: printedPages.length > 0 ? printedPages[printedPages.length - 1].printedNum : null,
        errors,
        warnings
    };

    return { is_valid, errors, report };
}

module.exports = {
    ACADEMIC_PAGE_START,
    ACADEMIC_PAGE_END,
    CHAPTER_ANCHORS,
    buildPiecewisePageMapping,
    validatePiecewiseMapping
};
