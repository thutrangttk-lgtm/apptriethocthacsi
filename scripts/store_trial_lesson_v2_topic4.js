/**
 * scripts/store_trial_lesson_v2_topic4.js
 * Comprehensive Micro-Learning Refinement for Topic 4 ("Thế giới quan và phương pháp luận")
 * Grounded in Official Textbook Source A, Pages 13-16.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zwsrbogwysziavdvgihd.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const TRIAL_LESSON_V2_PAYLOAD = {
  topic_id: 'fda45154-8298-4f21-88f8-3020f2900f48',
  title: 'Thế giới quan và phương pháp luận',
  source_page_start: 13,
  source_page_end: 16,
  source_citation: 'Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo), Chương 1, Mục III.1, Trang 13–16',
  learner_target: 'Trần Thị Thu Trang - Lớp Thạc sĩ Tiếng Anh (CHTA.HCE2608)',

  // 1. Initial Anchor Scenario
  anchor_scenario: {
    title: 'Tình huống mở đầu: Lớp học Tiếng Anh của cô Thu Trang',
    text: 'Học sinh Nam học tiếng Anh nhiều tháng nhưng chưa tiến bộ ở kỹ năng nói.\n- Giáo viên A nghĩ: "Em này không có năng khiếu ngoại ngữ, bẩm sinh đã không giỏi ăn nói."\n- Giáo viên B tìm hiểu: Khảo sát cách học của Nam, thời gian tự luyện tập ở nhà, vốn từ vựng tích lũy và môi trường thực hành giao tiếp.',
    disclaimer: '⚠️ Lưu ý quan trọng: Đây là ví dụ minh họa thực tế nhằm giúp người học hình dung khái niệm dễ dàng hơn, KHÔNG PHẢI định nghĩa đầy đủ trong giáo trình và KHÔNG DÙNG để đánh giá hay dán nhãn một con người ngoài đời thực.'
  },

  // 2. Micro-Lesson Chunks
  micro_chunks: [
    {
      step_index: 1,
      title: 'Phần 1: Khái niệm "Thế giới quan"',
      concept_name: 'Thế giới quan',
      plain_text: 'Thế giới quan là "mắt kính nhìn đời" – toàn bộ những niềm tin và cách bạn nhìn nhận về bản chất của thế giới xung quanh cũng như vị trí của con người trong thế giới đó.',
      scenario_detail: 'Trong ví dụ trên:\n- Giáo viên A nhìn nhận thế giới học tập theo góc nhìn "năng khiếu bẩm sinh cố định".\n- Giáo viên B nhìn nhận theo góc nhìn "năng lực biến đổi theo quá trình tích lũy thực tế" ➔ Đây chính là Thế giới quan của mỗi người.',
      textbook_definition: 'Thế giới quan là toàn bộ những quan niệm của con người về thế giới, về bản thân con người, về cuộc sống và vị trí của con người trong thế giới đó (Nguồn A, Trang 13).',
      common_misconception: 'Dễ nhầm: Cho rằng thế giới quan chỉ là lý thuyết suông trên sách vở.\nVì sao sai: Thế giới quan thực chất chi phối trực tiếp mọi thái độ, suy nghĩ và hành động của bạn trong đời sống hằng ngày.',
      micro_quiz: {
        question: 'Chi tiết nào thể hiện THẾ GIỚI QUAN của Giáo viên B?',
        options: [
          { text: 'A. Niềm tin rằng khả năng nói tiếng Anh của Nam phát triển phụ thuộc vào thời gian tích lũy và môi trường thực hành.', correct: true, exp: 'Chính xác! Niềm tin về bản chất của sự phát triển năng lực chính là Thế giới quan.' },
          { text: 'B. Việc thiết kế bài tập nhóm Pair-work cho Nam.', correct: false, exp: 'Chưa đúng. Việc thiết kế bài tập là phương pháp hành động (Phương pháp luận), chưa phải là niềm tin định hướng.' }
        ],
        simpler_retry_example: 'Gợi ý dễ hơn: "Thế giới quan" là NGHĨ VỀ BẢN CHẤT (Kính bạn đeo), còn "Phương pháp luận" là HÀNH ĐỘNG CỤ THỂ (Việc bạn làm).'
      }
    },
    {
      step_index: 2,
      title: 'Phần 2: Khái niệm "Phương pháp luận"',
      concept_name: 'Phương pháp luận',
      plain_text: 'Phương pháp luận là "hệ thống nguyên tắc hành động" – xuất phát từ thế giới quan đã chọn để chỉ đạo cách chúng ta suy nghĩ và làm việc.',
      scenario_detail: 'Trong ví dụ trên:\n- Giáo viên A (cho rằng Nam thiếu năng khiếu) ➔ Chọn nguyên tắc: Cho Nam chép phạt từ vựng, không cho nói nhiều vì sợ mất thời gian lớp.\n- Giáo viên B (cho rằng Nam cần tích lũy thực tế) ➔ Chọn hệ thống nguyên tắc: Tạo môi trường giao tiếp an toàn, gợi ý từ vựng (Scaffolding), chia nhỏ nhiệm vụ nói. Đây chính là Phương pháp luận.',
      textbook_definition: 'Phương pháp luận là hệ thống những quan điểm, những nguyên tắc xuất phát có tính chất chỉ đạo việc sử dụng các phương pháp trong hoạt động nhận thức và hoạt động thực tiễn (Nguồn A, Trang 15).',
      common_misconception: 'Dễ nhầm: Coi phương pháp luận chỉ là một mẹo vặt (tip/trick) hoặc phương pháp riêng lẻ.\nVì sao sai: Phương pháp luận là HỆ THỐNG CÁC NGUYÊN TẮC CHỈ ĐẠO bao trùm, quyết định việc bạn chọn áp dụng mẹo vặt nào cho đúng.',
      micro_quiz: {
        question: 'Vì sao phương pháp dạy học CLT (Communicative Language Teaching) của Giáo viên B được gọi là thuộc về Phương pháp luận?',
        options: [
          { text: 'A. Vì đó là hệ thống nguyên tắc chỉ đạo hành động dạy học xuất phát từ thế giới quan khoa học.', correct: true, exp: 'Chính xác! Hệ thống nguyên tắc chỉ đạo hành động giảng dạy chính là Phương pháp luận.' },
          { text: 'B. Vì đó chỉ là một mẹo nhỏ để quản lý lớp học.', correct: false, exp: 'Chưa đúng. Phương pháp luận không phải là mẹo nhỏ đơn lẻ, mà là hệ thống nguyên tắc chỉ đạo.' }
        ],
        simpler_retry_example: 'Gợi ý dễ hơn: Mẹo là "viên gạch", Phương pháp luận là "bản thiết kế ngôi nhà" chỉ đạo cách xây.'
      }
    }
  ],

  // 3. Comprehensive Comparison Table
  comparison_table: {
    title: 'Bảng So Sánh Chi Tiết: Thế Giới Quan vs. Phương Pháp Luận',
    headers: ['Tiêu chí', 'Thế Giới Quan', 'Phương Pháp Luận'],
    rows: [
      {
        criterion: 'Bản chất / Ý nghĩa',
        tgq: 'Toàn bộ quan niệm, niềm tin về bản chất thế giới và con người.',
        ppl: 'Hệ thống các nguyên tắc chỉ đạo hoạt động nhận thức và thực tiễn.'
      },
      {
        criterion: 'Câu hỏi trả lời',
        tgq: 'Thế giới này là gì? Bản chất sự vật vận hành ra sao?',
        ppl: 'Ta phải suy nghĩ và hành động như thế nào cho đúng quy luật?'
      },
      {
        criterion: 'Ví dụ dạy Tiếng Anh',
        tgq: 'Tin rằng năng lực Tiếng Anh phát triển qua tích lũy thực hành.',
        ppl: 'Xây dựng hệ thống dạy học giao tiếp CLT, Scaffolding bài học.'
      },
      {
        criterion: 'Mối quan hệ cốt lõi',
        tgq: 'Thế giới quan giữ vai trò quyết định, chỉ đạo phương pháp luận.',
        ppl: 'Phương pháp luận là sự thể hiện và thực hiện thế giới quan trong thực tế.'
      }
    ]
  },

  // 4. "Nói lại bằng lời của bạn" Activity (Self-Rubric)
  feynman_activity: {
    title: 'Hoạt động: Nói lại bằng lời của bạn (Phương pháp Feynman)',
    prompt: 'Hãy thử giải thích lại mối quan hệ giữa Thế giới quan và Phương pháp luận cho một đồng nghiệp hoặc học sinh theo cách đơn giản nhất.',
    hints: [
      'Gợi ý 1: Dùng hình ảnh ẩn dụ (Chiếc kính mắt & Đôi chân đi đường).',
      'Gợi ý 2: Nêu ngắn gọn cái nào có trước, cái nào chỉ đạo cái nào.'
    ],
    sample_response: 'Tham khảo: Thế giới quan giống như chiếc kính bạn đeo. Nếu đeo kính màu xanh, bạn thấy thế giới màu xanh (Thế giới quan). Từ đó bạn quyết định chọn trang phục phù hợp với màu xanh đó (Phương pháp luận). Nhìn thế giới ra sao sẽ chỉ đạo cách ta hành động như thế ấy.',
    self_rubric: [
      '✓ Đã nêu được Thế giới quan là cách nhìn / niềm tin về bản chất sự vật chưa?',
      '✓ Đã nêu được Phương pháp luận là hệ thống nguyên tắc hành động chưa?',
      '✓ Đã thể hiện được Thế giới quan quyết định/chỉ đạo Phương pháp luận chưa?',
      '✓ Cách giải thích có dễ hiểu, không bị lặp lại từ ngữ rắc rối không?'
    ]
  },

  // 5. Sentence-by-Sentence Essay Guidance
  essay_guidance: {
    title: 'Hướng Dẫn Tập Viết Luận Vận Dụng 6 Cấu Trúc Cụ Thể',
    prompt: 'Viết một đoạn văn (100–150 từ) vận dụng Thế giới quan và Phương pháp luận vào thực tiễn giảng dạy Tiếng Anh hoặc nghiên cứu Thạc sĩ.',
    structure_steps: [
      { step: 'Câu 1 (Nêu ý chính)', desc: 'Tuyên bố trực tiếp luận điểm vận dụng thế giới quan duy vật vào phương pháp giảng dạy.' },
      { step: 'Câu 2 (Giải thích lý luận)', desc: 'Trích dẫn định nghĩa thế giới quan duy vật biện chứng (Nguồn A, Trang 13-16).' },
      { step: 'Câu 3 (Ví dụ minh họa)', desc: 'Nêu ví dụ lớp học thực tế (dạy giao tiếp CLT, scaffolding).' },
      { step: 'Câu 4 (Bằng chứng nghiên cứu / Phân biệt)', desc: 'Phân biệt ví dụ minh họa lớp học với bằng chứng dữ liệu nghiên cứu Thạc sĩ.' },
      { step: 'Câu 5 (Liên hệ & Kết luận)', desc: 'Khẳng định vai trò chỉ đạo của thế giới quan đối với phương pháp luận.' }
    ],
    sample_paragraph: 'Trong thực tiễn giảng dạy Tiếng Anh, thế giới quan duy vật biện chứng đóng vai trò chỉ đạo trực tiếp đối với phương pháp luận sư phạm của tôi. Tôi nhận thức rằng năng lực ngôn ngữ của học sinh không phải thuộc tính bẩm sinh cố định, mà là kết quả của quá trình tích lũy về lượng dẫn đến sự thay đổi về chất trong môi trường thực tiễn (Nguồn A, Trang 13-16). Ví dụ minh họa thực tế là việc tôi thiết kế các bài tập giao tiếp theo cặp (CLT) và cung cấp gợi ý từ vựng (Scaffolding) giúp học sinh bớt sợ sai. Cần lưu ý phân biệt: ví dụ lớp học này giúp hình dung phương pháp, còn luận văn thạc sĩ đòi hỏi bằng chứng nghiên cứu qua dữ liệu khảo sát thực nghiệm. Như vậy, thế giới quan khoa học là kim chỉ nam giúp tôi lựa chọn phương pháp luận giảng dạy và nghiên cứu hiệu quả.',
    evidence_distinction: '💡 Phân biệt quan trọng: Ví dụ minh họa (Illustrative Example) dùng để làm rõ khái niệm; Bằng chứng nghiên cứu (Empirical Evidence) trong luận văn thạc sĩ đòi hỏi dữ liệu khảo sát, thực nghiệm có số liệu đo lường cụ thể.'
  }
};

async function storeTrialLessonV2() {
  console.log("=" .repeat(80));
  console.log("STORING REFINED TRIAL LESSON V2payload IN SUPABASE");
  console.log("=" .repeat(80));

  const { data: existingChunk } = await supabase
    .from('document_chunks')
    .select('id')
    .eq('topic_id', TRIAL_LESSON_V2_PAYLOAD.topic_id)
    .maybeSingle();

  const payload = {
    topic_id: TRIAL_LESSON_V2_PAYLOAD.topic_id,
    chunk_index: 1,
    printed_page_start: 13,
    printed_page_end: 16,
    chunk_text: `Chương 1: TRIẾT HỌC VÀ VAI TRÒ CỦA TRIẾT HỌC TRONG ĐỜI SỐNG XÃ HỘI\nPhần: III. Vai trò của triết học trong đời sống xã hội > 1. Vai trò thế giới quan và phương pháp luận của triết học\nNguồn: Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo), Trang 13 – 16.\n\n### Tình Huống Mở Đầu\n${TRIAL_LESSON_V2_PAYLOAD.anchor_scenario.text}\n\n${TRIAL_LESSON_V2_PAYLOAD.anchor_scenario.disclaimer}`,
    token_count: 950,
    metadata: {
      source_class: "A",
      source_label: "Official Textbook",
      chunking_version: "v3_micro_learning",
      chapter_number: 1,
      topic_number: 4,
      source_page_start: 13,
      source_page_end: 16,
      trial_lesson_v2: TRIAL_LESSON_V2_PAYLOAD
    }
  };

  if (existingChunk) {
    const { error: upErr } = await supabase
      .from('document_chunks')
      .update(payload)
      .eq('id', existingChunk.id);

    if (upErr) console.error("Update error:", upErr);
    else console.log("Successfully updated trial lesson V2 payload in public.document_chunks.");
  } else {
    const { error: insErr } = await supabase
      .from('document_chunks')
      .insert(payload);

    if (insErr) console.error("Insert error:", insErr);
    else console.log("Successfully inserted trial lesson V2 payload in public.document_chunks.");
  }
}

storeTrialLessonV2();
