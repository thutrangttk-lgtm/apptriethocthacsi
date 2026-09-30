/**
 * scripts/link_topics.js
 * Matches page numbers to authoritative curriculum topics.
 */

const SAMPLE_TOPICS = [
    { chapter_number: 1, topic_number: 1, title: "Khái niệm triết học", source_page_start: 7, source_page_end: 8 },
    { chapter_number: 1, topic_number: 2, title: "Đối tượng của triết học qua các thời kỳ", source_page_start: 8, source_page_end: 10 },
    { chapter_number: 1, topic_number: 3, title: "Tính quy luật của sự hình thành và phát triển triết học", source_page_start: 11, source_page_end: 13 },
    { chapter_number: 1, topic_number: 4, title: "Thế giới quan và phương pháp luận", source_page_start: 13, source_page_end: 16 },
    { chapter_number: 1, topic_number: 5, title: "Triết học với khoa học cụ thể và tư duy lý luận", source_page_start: 16, source_page_end: 18 },
    { chapter_number: 2, topic_number: 1, title: "Điều kiện ra đời của triết học Ấn Độ cổ, trung đại", source_page_start: 19, source_page_end: 20 },
    { chapter_number: 3, topic_number: 1, title: "Điều kiện kinh tế - xã hội của triết học Hy Lạp cổ đại", source_page_start: 81, source_page_end: 82 },
    { chapter_number: 4, topic_number: 1, title: "Điều kiện kinh tế - xã hội cho sự ra đời triết học Mác", source_page_start: 157, source_page_end: 160 },
    { chapter_number: 5, topic_number: 1, title: "Khái niệm thế giới quan", source_page_start: 273, source_page_end: 275 },
    { chapter_number: 6, topic_number: 1, title: "Siêu hình và biện chứng", source_page_start: 310, source_page_end: 312 },
    { chapter_number: 7, topic_number: 1, title: "Khái niệm, đặc trưng và các hình thức của thực tiễn", source_page_start: 356, source_page_end: 361 },
    { chapter_number: 8, topic_number: 1, title: "Tiền đề xuất phát của lý luận hình thái kinh tế - xã hội", source_page_start: 381, source_page_end: 390 },
    { chapter_number: 9, topic_number: 1, title: "Các quan điểm ngoài mácxít về giai cấp", source_page_start: 426, source_page_end: 432 },
    { chapter_number: 10, topic_number: 1, title: "Nguồn gốc nhà nước", source_page_start: 480, source_page_end: 484 },
    { chapter_number: 11, topic_number: 1, title: "Con người trong triết học Phật giáo và Nho gia", source_page_start: 511, source_page_end: 514 },
    { chapter_number: 11, topic_number: 16, title: "Xây dựng con người Việt Nam đáp ứng yêu cầu giai đoạn hiện nay", source_page_start: 551, source_page_end: 556 }
];

function findMatchingTopicsForPage(printedPageNumber, topicsList = SAMPLE_TOPICS) {
    if (printedPageNumber === null || printedPageNumber === undefined) return [];
    return topicsList.filter(t => t.source_page_start <= printedPageNumber && printedPageNumber <= t.source_page_end);
}

module.exports = {
    SAMPLE_TOPICS,
    findMatchingTopicsForPage
};
