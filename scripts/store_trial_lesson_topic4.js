/**
 * scripts/store_trial_lesson_topic4.js
 * Stores the completed, structured trial lesson for Topic 4 ("Thế giới quan và phương pháp luận")
 * into Supabase, distinguishing between:
 * - Textbook Official Definition (Source A, Pages 13-16)
 * - Simplified Explanation (For ELT Master's Learner)
 * - Practical Examples (English Teaching & Academic Research)
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

const TRIAL_LESSON_TOPIC4_DATA = {
  topic_id: 'fda45154-8298-4f21-88f8-3020f2900f48', // Topic 4
  title: 'Thế giới quan và phương pháp luận',
  source_page_start: 13,
  source_page_end: 16,
  source_citation: 'Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo), Chương 1, Mục III.1, Trang 13–16',
  learner_target: 'Trần Thị Thu Trang - Lớp Thạc sĩ Tiếng Anh (CHTA.HCE2608)',
  
  // Structured Content Sections
  content_structure: {
    why_learn: {
      title: '1. Học Để Làm Gì?',
      life: 'Trong cuộc sống: Giúp bạn hiểu vì sao người khác có suy nghĩ và hành động khác mình, từ đó bớt phán xét và giao tiếp tích cực hơn.',
      teaching: 'Trong dạy Tiếng Anh: Giúp bạn định hình cách nhìn về người học. Nếu nhìn học sinh là "chủ thể chủ động tiếp thu ngôn ngữ" (Thế giới quan), bạn sẽ chọn phương pháp dạy học giao tiếp CLT (Phương pháp luận) thay vì bắt học sinh học thuộc lòng ngữ pháp.',
      research: 'Trong nghiên cứu Thạc sĩ: Giúp bạn xây dựng Khung lý thuyết (Theoretical Framework) và Lựa chọn Phương pháp nghiên cứu (Research Methodology) mạch lạc cho luận văn.'
    },

    quick_30s: {
      title: '2. Hiểu Trong 30 Giây',
      summary_vi: 'Thế giới quan là "mắt kính nhìn đời" – toàn bộ quan niệm của bạn về bản chất thế giới xung quanh. Phương pháp luận là "bản đồ hành động" – cách bạn dựa vào cái kính đó để chọn phương pháp làm việc. Nhìn thế giới thế nào (Thế giới quan), bạn sẽ hành động như thế ấy (Phương pháp luận).'
    },

    terms_glossary: [
      {
        term: 'Thế giới quan',
        simple_definition: 'Cách nhìn, niềm tin cốt lõi của một người về bản chất của thế giới xung quanh và vị trí của con người trong thế giới đó.',
        example: 'Một giáo viên tin rằng "ai cũng có thể giỏi tiếng Anh nếu có phương pháp đúng" ➔ Đó là thế giới quan tích cực và khoa học.',
        textbook_definition: 'Thế giới quan là toàn bộ những quan niệm của con người về thế giới, về bản thân con người, về cuộc sống và vị trí của con người trong thế giới đó (Nguồn A, Trang 13).'
      },
      {
        term: 'Phương pháp luận',
        simple_definition: 'Hệ thống các nguyên tắc và phương pháp chỉ đạo cách chúng ta suy nghĩ và hành động dựa trên thế giới quan đã chọn.',
        example: 'Từ niềm tin học sinh nào cũng giỏi được, giáo viên thiết kế bài giảng phân hóa (differentiated instruction) để hỗ trợ từng em ➔ Đó là phương pháp luận.',
        textbook_definition: 'Phương pháp luận là hệ thống những quan điểm, những nguyên tắc xuất phát có tính chất chỉ đạo việc sử dụng các phương pháp trong hoạt động nhận thức và hoạt động thực tiễn (Nguồn A, Trang 15).'
      },
      {
        term: 'Duy vật biện chứng',
        simple_definition: 'Nhìn nhận mọi vật trong thực tế luôn vận động, biến đổi và chịu ảnh hưởng lẫn nhau, lấy thực tế khách quan làm gốc.',
        example: 'Hiểu rằng trình độ tiếng Anh của học sinh thay đổi từng ngày nhờ luyện tập đúng cách, không có ai sinh ra đã tự nhiên dốt mãi.',
        textbook_definition: 'Chủ nghĩa duy vật biện chứng là sự thống nhất giữa chủ nghĩa duy vật và phép biện chứng, coi thế giới vật chất vận động theo những quy luật khách quan (Nguồn A, Trang 14).'
      },
      {
        term: 'Duy tâm',
        simple_definition: 'Cho rằng ý thức, tư tưởng hay duyên số quyết định tất cả, coi nhẹ thực tế khách quan.',
        example: 'Cho rằng học sinh không giỏi tiếng Anh chỉ vì "không có năng khiếu khiếu trời cho", mặc kệ nỗ lực và phương pháp.',
        textbook_definition: 'Chủ nghĩa duy tâm là hệ thống triết học cho rằng ý thức, tinh thần là cái có trước và quyết định thế giới vật chất (Nguồn A, Trang 14).'
      }
    ],

    quick_2min: {
      title: '4. Hiểu Trong 2 Phút',
      scenario_title: 'Tình huống thực tế trong lớp học Tiếng Anh:',
      scenario_text: 'Hãy hình dung lớp học Tiếng Anh của cô Thu Trang có một học sinh tên Nam rất ngại nói.',
      step_1: 'Bước 1 (Thế giới quan): Cô Trang tự hỏi "Tại sao Nam ngại nói?". Nếu coi Nam "lười", cô sẽ bực bội. Nhưng nếu nhìn theo duy vật biện chứng: Nam ngại nói vì thiếu vốn từ vựng và sợ bị bạn cười (nguyên nhân thực tế khách quan).',
      step_2: 'Bước 2 (Phương pháp luận): Xuất phát từ góc nhìn đó, cô Trang áp dụng phương pháp: Cho Nam làm việc theo cặp (Pair work), chuẩn bị trước từ vựng gợi ý (Scaffolding), và tạo không khí lớp học thân thiện.',
      step_3: 'Kết luận: Thế giới quan đúng (thấu hiểu nguyên nhân thực tế) ➔ Phương pháp luận đúng (áp dụng kỹ thuật dạy học hiệu quả).'
    },

    confusions: {
      title: '5. Dễ Nhầm Lẫn',
      items: [
        {
          misconception: 'Nhầm lẫn 1: "Thế giới quan chỉ là lý thuyết suông, không liên quan đến hành động."',
          correct_view: 'Đúng là: Thế giới quan chi phối 100% cách bạn lựa chọn hành động. Kính màu xanh bạn nhìn ra thế giới màu xanh; kính duy vật giúp bạn tìm giải pháp thực tế.'
        },
        {
          misconception: 'Nhầm lẫn 2: "Phương pháp luận chỉ là các mẹo (tips & tricks) nhỏ."',
          correct_view: 'Đúng là: Mẹo chỉ là công cụ đơn lẻ (technique). Phương pháp luận là HỆ THỐNG các nguyên tắc chỉ đạo việc chọn mẹo nào cho đúng.'
        },
        {
          misconception: 'Nhầm lẫn 3: "Duy vật nghĩa là coi trọng tiền bạc, Duy tâm là sống tình cảm."',
          correct_view: 'Đúng là: Trong Triết học, Duy vật nghĩa là tôn trọng thực tế khách quan; Duy tâm là coi ý thức/tư tưởng quyết định tất cả.'
        }
      ]
    },

    quiz_3_questions: [
      {
        id: 'q1',
        question: 'Một giáo viên dạy Tiếng Anh tin rằng: "Mọi học sinh đều có thể tiến bộ nếu được tạo môi trường giao tiếp phù hợp và cung cấp từ vựng chuẩn". Quan điểm này thuộc về khái niệm nào?',
        options: [
          { text: 'A. Thế giới quan duy vật biện chứng', correct: true, explanation: 'Chính xác! Niềm tin lấy thực tế khách quan (môi trường, từ vựng) và khả năng biến đổi tiến bộ của học sinh làm gốc là Thế giới quan duy vật biện chứng.' },
          { text: 'B. Thế giới quan duy tâm thần bí', correct: false, explanation: 'Chưa đúng. Duy tâm thần bí sẽ tin rằng năng khiếu là do trời cho hoặc số phận quy định, không thay đổi được.' },
          { text: 'C. Phương pháp luận giảng dạy đơn lẻ', correct: false, explanation: 'Chưa đúng. Đây là niềm tin định hướng (thế giới quan), chưa phải là phương pháp cụ thể.' }
        ]
      },
      {
        id: 'q2',
        question: 'Mối quan hệ giữa Thế giới quan và Phương pháp luận được mô tả chính xác nhất như thế nào?',
        options: [
          { text: 'A. Thế giới quan quyết định phương pháp luận; phương pháp luận là sự thể hiện của thế giới quan.', correct: true, explanation: 'Chính xác! Bạn tin vào cái gì (Thế giới quan) sẽ chỉ đạo cách bạn làm cái đó (Phương pháp luận).' },
          { text: 'B. Phương pháp luận độc lập hoàn toàn, không liên quan đến thế giới quan.', correct: false, explanation: 'Chưa đúng. Không ai chọn phương pháp hành động mà không dựa trên niềm tin hay góc nhìn của mình.' },
          { text: 'C. Hai khái niệm này là một, không có điểm phân biệt.', correct: false, explanation: 'Chưa đúng. Thế giới quan là góc nhìn/quan niệm; Phương pháp luận là hệ thống nguyên tắc hành động.' }
        ]
      },
      {
        id: 'q3',
        question: 'Trong nghiên cứu Thạc sĩ, việc bạn xác định cách nhìn nhận đối tượng nghiên cứu trước khi chọn công cụ thu thập dữ liệu thể hiện điều gì?',
        options: [
          { text: 'A. Vai trò chỉ đạo của thế giới quan đối với phương pháp luận nghiên cứu', correct: true, explanation: 'Chính xác! Khung lý thuyết (Thế giới quan) phải được xác định trước để chỉ đạo việc chọn công cụ nghiên cứu (Phương pháp luận).' },
          { text: 'B. Việc chọn ngẫu nhiên không theo quy luật', correct: false, explanation: 'Chưa đúng. Nghiên cứu khoa học thạc sĩ đòi hỏi sự mạch lạc giữa thế giới quan và phương pháp luận.' }
        ]
      }
    ],

    essay_practice: {
      title: '7. Tập Viết Luận Vận Dụng (100–150 từ)',
      prompt: 'Hãy viết một đoạn văn ngắn (100–150 từ) vận dụng mối quan hệ giữa Thế giới quan và Phương pháp luận vào thực tiễn giảng dạy Tiếng Anh hoặc nghiên cứu Thạc sĩ của bạn.',
      sample_essay: 'Trong thực tiễn giảng dạy Tiếng Anh, thế giới quan duy vật biện chứng đóng vai trò chỉ đạo trực tiếp đối với phương pháp luận sư phạm của tôi. Tôi nhận thức rằng năng lực ngôn ngữ của học sinh không phải là một thuộc tính cố định hay phụ thuộc vào bẩm sinh, mà là kết quả của quá trình tích lũy về lượng dẫn đến sự thay đổi về chất trong môi trường thực tiễn giao tiếp (Nguồn A, Trang 13-16). Từ thế giới quan đó, về phương pháp luận, tôi áp dụng hệ thống giảng dạy giao tiếp (CLT) kết hợp với các nhiệm vụ học tập phân hóa (Scaffolding). Thay vì chỉ trích khi học sinh mắc lỗi, tôi tạo môi trường an toàn để các em thực hành và tích lũy phản xạ. Như vậy, thế giới quan khoa học là kim chỉ nam giúp tôi lựa chọn phương pháp sư phạm hiệu quả, nâng cao chất lượng dạy học Tiếng Anh.',
      argumentation_breakdown: [
        'Câu 1 (Mở đoạn): Nêu trực tiếp luận điểm vận dụng thế giới quan duy vật biện chứng vào phương pháp luận giảng dạy.',
        'Câu 2 (Cơ sở lý luận): Dẫn chiếu định nghĩa thế giới quan duy vật (sự tích lũy về lượng đổi thành chất) trích dẫn Giáo trình Nguồn A (Trang 13-16).',
        'Câu 3-4 (Phương pháp luận & Thực tiễn): Trình bày hành động phương pháp luận cụ thể (dạy giao tiếp CLT, scaffolding, tạo môi trường an toàn).',
        'Câu 5 (Kết luận): Khẳng định lại mối quan hệ chỉ đạo giữa thế giới quan và phương pháp luận.'
      ]
    },

    help_options: {
      simpler: {
        title: 'Giải thích đơn giản hơn nữa:',
        text: 'Hãy tưởng tượng bạn đi đeo kính râm màu đen (Thế giới quan). Bạn sẽ thấy trời âm u và quyết định mang theo ô (Phương pháp luận). Nếu bạn đeo kính râm hồng, bạn thấy mọi thứ vui tươi và quyết định đi dạo. Kính bạn đeo quyết định việc bạn làm!'
      },
      another_example: {
        title: 'Ví dụ khác trong dạy Tiếng Anh:',
        text: 'Thế giới quan: Bạn tin "Kỹ năng nói Tiếng Anh phát triển qua việc mắc lỗi và sửa lỗi trong thực tế".\nPhương pháp luận: Bạn không chấm điểm trừ cho từng lỗi nói nhỏ của học sinh trên lớp, mà ghi nốt lại để chữa chung ở cuối giờ, giúp học sinh tự tin nói nhiều hơn.'
      },
      hard_terms: {
        title: 'Giải nghĩa từ khó siêu ngắn gọn:',
        terms: [
          'Thế giới quan = Kính nhìn đời (Bạn tin thế giới vận hành thế nào)',
          'Phương pháp luận = Bản đồ hành động (Cách bạn chọn làm việc dựa vào niềm tin đó)',
          'Biện chứng = Nhìn sự vật luôn thay đổi, phát triển, có liên quan đến nhau',
          'Siêu hình = Nhìn sự vật đứng yên, cứng nhắc, tách rời'
        ]
      }
    }
  }
};

async function storeTrialLessonInSupabase() {
  console.log("=" .repeat(80));
  console.log("STORING STRUCTURED TRIAL LESSON (TOPIC 4) IN SUPABASE");
  console.log("=" .repeat(80));

  // Update topic metadata with learner target & notes
  const { error: topErr } = await supabase
    .from('topics')
    .update({
      description: 'Bài học thử nghiệm thiết kế dành riêng cho Học viên Thạc sĩ Tiếng Anh (Trần Thị Thu Trang - CHTA.HCE2608). Căn cứ Nguồn A, Trang 13-16.'
    })
    .eq('id', TRIAL_LESSON_TOPIC4_DATA.topic_id);

  if (topErr) {
    console.error("Topic update error:", topErr);
  } else {
    console.log("Updated topic metadata in public.topics.");
  }

  // Update or insert structured document_chunk with trial lesson payload
  const { data: existingChunk } = await supabase
    .from('document_chunks')
    .select('id')
    .eq('topic_id', TRIAL_LESSON_TOPIC4_DATA.topic_id)
    .maybeSingle();

  const chunkPayload = {
    topic_id: TRIAL_LESSON_TOPIC4_DATA.topic_id,
    chunk_index: 1,
    printed_page_start: 13,
    printed_page_end: 16,
    chunk_text: `Chương 1: TRIẾT HỌC VÀ VAI TRÒ CỦA TRIẾT HỌC TRONG ĐỜI SỐNG XÃ HỘI\nPhần: III. Vai trò của triết học trong đời sống xã hội > 1. Vai trò thế giới quan và phương pháp luận của triết học\nNguồn: Giáo trình Triết học Mác - Lênin (Bộ Giáo dục & Đào tạo), Trang 13 – 16.\n\n### Định Nghĩa Chuẩn Giáo Trình (Nguồn A, Trang 13-16)\n${TRIAL_LESSON_TOPIC4_DATA.content_structure.terms_glossary[0].textbook_definition}\n${TRIAL_LESSON_TOPIC4_DATA.content_structure.terms_glossary[1].textbook_definition}\n\n### Diễn Giải Dễ Hiểu (Dành Cho Học Viên Thạc Sĩ Tiếng Anh)\n${TRIAL_LESSON_TOPIC4_DATA.content_structure.quick_30s.summary_vi}\n\n### Ví Dụ Thực Tế Giảng Dạy Tiếng Anh\n${TRIAL_LESSON_TOPIC4_DATA.content_structure.why_learn.teaching}`,
    token_count: 850,
    metadata: {
      source_class: "A",
      source_label: "Official Textbook",
      chunking_version: "v2_trial_lesson",
      chapter_number: 1,
      topic_number: 4,
      source_page_start: 13,
      source_page_end: 16,
      trial_lesson_payload: TRIAL_LESSON_TOPIC4_DATA
    }
  };

  if (existingChunk) {
    const { error: upErr } = await supabase
      .from('document_chunks')
      .update(chunkPayload)
      .eq('id', existingChunk.id);

    if (upErr) console.error("Chunk update error:", upErr);
    else console.log(`Updated trial lesson chunk in public.document_chunks (ID: ${existingChunk.id}).`);
  } else {
    const { error: insErr } = await supabase
      .from('document_chunks')
      .insert(chunkPayload);

    if (insErr) console.error("Chunk insert error:", insErr);
    else console.log("Inserted trial lesson chunk in public.document_chunks.");
  }
}

storeTrialLessonInSupabase();
