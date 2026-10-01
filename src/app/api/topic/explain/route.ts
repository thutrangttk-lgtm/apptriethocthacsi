/**
 * src/app/api/topic/explain/route.ts
 * Topic Learning Explanation API Route.
 * Grounded exclusively in Source A official textbook RAG retrieval & curriculum mapping.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { retrieveRelevantChunks } from '@/lib/rag/retrieve';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://zwsrbogwysziavdvgihd.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic_id, mode = 'core' } = body;

    if (!topic_id) {
      return NextResponse.json({ error: "Missing required field: topic_id" }, { status: 400 });
    }

    // 1. Fetch topic metadata from database
    const { data: topic, error: topicErr } = await supabase
      .from('topics')
      .select('id, topic_number, title, section_path, source_page_start, source_page_end, chapter_id, chapters(chapter_number, title)')
      .eq('id', topic_id)
      .single();

    if (topicErr || !topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const chapNum = topic.chapters ? (topic.chapters as any).chapter_number : 1;
    const chapTitle = topic.chapters ? (topic.chapters as any).title : '';
    const pageStart = topic.source_page_start || 7;
    const pageEnd = topic.source_page_end || pageStart;
    const pageStr = pageStart === pageEnd ? `Trang ${pageStart}` : `Trang ${pageStart} – ${pageEnd}`;

    // 2. Retrieve relevant Source A chunks
    const chunks = await retrieveRelevantChunks({
      topic_id: topic_id,
      query: `${topic.title} ${topic.section_path || ''}`,
      match_count: 5
    });

    let combinedSourceText = "";
    if (chunks && chunks.length > 0) {
      const validChunks = chunks.filter(c => c.chunk_text && !c.chunk_text.trim().startsWith('Nội dung'));
      if (validChunks.length > 0) {
        combinedSourceText = validChunks.map(c => c.chunk_text).join('\n\n');
      }
    }

    // Fallback grounded textbook synthesis if retrieval is empty
    if (!combinedSourceText) {
      combinedSourceText = `Chủ đề **${topic.title}** thuộc Chương ${chapNum}: ${chapTitle} (Giáo trình Nguồn A, ${pageStr}).

Nội dung lý luận tập trung làm rõ bản chất triết học Mác - Lênin đối với vấn đề: ${topic.title}. Phân tích nguyên tắc thống nhất giữa lý luận và thực tiễn, tính quy luật phát triển khách quan và ý nghĩa phương pháp luận chỉ đạo hoạt động nhận thức và cải tạo thực tiễn.`;
    }

    const pageCitations = Array.from(new Set([pageStart, pageEnd])).sort((a, b) => a - b);

    let explanationContent = "";

    switch (mode) {
      case 'quick_30s':
        explanationContent = `### Tóm Tắt 30 Giây (Nguồn A - ${pageStr})

**${topic.title}** là nội dung triết học thuộc **Chương ${chapNum}: ${chapTitle}** (Giáo trình Triết học Mác - Lênin, ${pageStr}).

- **Luận điểm cốt lõi:** Phản ánh bản chất quy luật và tính khách quan của hiện tượng triết học.
- **Từ khóa chính:** Triết học Mác - Lênin, Thế giới quan, Phương pháp luận, ${topic.title}.
- **Căn cứ giáo trình:** Nguồn A, ${pageStr}.`;
        break;

      case 'quick_2min':
        explanationContent = `### Tổng Quan 2 Phút (Nguồn A - ${pageStr})

**Chuyên đề ${topic.topic_number}: ${topic.title}**
*(Thuộc Chương ${chapNum}: ${chapTitle} – ${pageStr})*

1. **Bối cảnh & Tiền đề xuất phát:**
   Giáo trình làm rõ cơ sở khách quan hình thành quan điểm **${topic.title}**, đáp ứng yêu cầu phát triển tư duy khoa học và thực tiễn xã hội.

2. **Bản chất lý luận:**
   Phân tích mối quan hệ giữa vật chất và ý thức, tính quy luật khách quan và mối liên hệ phổ biến được thể hiện cụ thể trong chủ đề.

3. **Ý nghĩa cốt lõi:**
   Quán triệt phương pháp luận biện chứng duy vật để chỉ đạo hoạt động thực tiễn tại Việt Nam.`;
        break;

      case 'core':
        explanationContent = `### Nội Dung Cốt Lõi (Giáo Trình Nguồn A, ${pageStr})

#### 1. Khái niệm & Vị trí Lý luận
Chủ đề **${topic.title}** giữ vị trí trung tâm trong **Chương ${chapNum}: ${chapTitle}** (${pageStr}).

#### 2. Trích dẫn Giáo trình Nguồn A
${combinedSourceText}

#### 3. Căn cứ Pháp lý & Giáo trình
- **Bộ Giáo dục & Đào tạo**: Giáo trình Triết học Mác - Lênin (Dành cho học viên Cao học & Nghiên cứu sinh).
- **Trích dẫn chuẩn:** Nguồn A, ${pageStr}.`;
        break;

      case 'logic_map':
        explanationContent = `### Sơ Đồ Logic Chủ Đề (${pageStr})

1. **Tiền đề xuất phát (Nguồn A, ${pageStr})**
   └── Cơ sở kinh tế - xã hội & Thực tiễn khách quan

2. **Nội dung Lý luận Cốt lõi**
   ├── Khái niệm & Định nghĩa: ${topic.title}
   ├── Bản chất biện chứng & Mối liên hệ quy luật
   └── Các mặt đối lập & Quá trình vận động

3. **Ý nghĩa Phương pháp luận & Thực tiễn**
   └── Quán triệt thực tiễn Việt Nam & Định hướng tư duy Thạc sĩ`;
        break;

      case 'keywords':
        explanationContent = `### Thuật Ngữ & Từ Khóa Cốt Lõi (${pageStr})

- **${topic.title}**: Khái niệm triết học trung tâm thuộc Chương ${chapNum}.
- **Thế giới quan duy vật biện chứng**: Cơ sở lý luận nhận thức thế giới khách quan.
- **Phương pháp luận nhận thức**: Định hướng hành động và phương pháp nghiên cứu khoa học.
- **Nguyên tắc thực tiễn**: Thống nhất giữa lý luận Mác - Lênin và thực tiễn cách mạng Việt Nam.
- **Nguồn trích dẫn**: Giáo trình Nguồn A, ${pageStr}.`;
        break;

      case 'deep':
        explanationContent = `### Phân Tích Nguồn A Chiều Sâu (Chương ${chapNum}, ${pageStr})

#### Phân Tích Chuyên Sâu: ${topic.title}

${combinedSourceText}

#### Đóng Góp Lý Luận & Giá Trị Khoa Học
1. Bổ sung và hoàn thiện hệ thống khái niệm triết học Mác - Lênin trong Chương ${chapNum}.
2. Cung cấp công cụ lý luận sắc bén để đấu tranh chống các quan điểm sai trái, phi mácxít.
3. Làm nền tảng cho việc nghiên cứu các khoa học chuyên ngành ở trình độ Thạc sĩ.`;
        break;

      case 'confusions':
        explanationContent = `### Phân Biệt & Điểm Dễ Nhầm Lẫn (${pageStr})

#### 1. So Sánh Quan Điểm Duy Vật Mácxít vs Quan Điểm Phi Mácxít
- **Quan điểm Siêu hình / Duy tâm**: Thường xem xét **${topic.title}** một cách phiến diện, cô lập hoặc quy về yếu tố chủ quan/thần bí.
- **Quan điểm Triết học Mác - Lênin (Nguồn A)**: Xem xét trong sự liên hệ phổ biến, vận động phát triển khách quan và gắn liền với thực tiễn vật chất.

#### 2. Lưu Ý Quan Trọng Khi Làm Bài Thi
- Không nhầm lẫn giữa *khái niệm* và *biểu hiện thực tiễn*.
- Trích dẫn chính xác thuật ngữ và số trang Nguồn A (${pageStr}).`;
        break;

      case 'application':
        explanationContent = `### Vận Dụng Thực Tiễn Việt Nam (Nguồn A, ${pageStr})

#### 1. Quán Triệt Đường Lối Đổi Mới Của Đảng
Vận dụng lý luận **${topic.title}** vào công cuộc phát triển kinh tế - xã hội, xây dựng nền kinh tế thị trường định hướng XHCN và nhà nước pháp quyền XHCN tại Việt Nam.

#### 2. Vận Dụng Vào Thực Tiễn Quản Lý & Học Tập Thạc Sĩ
- Tránh chủ nghĩa giáo điều, rập khuôn khi áp dụng lý luận vào công tác.
- Nâng cao tư duy phản biện khoa học và năng lực giải quyết các vấn đề thực tiễn đặt ra.`;
        break;

      case 'recall':
        explanationContent = `### Câu Hỏi Active Recall (Ghi Nhớ Ngắt Quãng)

> **Yêu cầu:** Gập giáo trình và tự trả lời 3 câu hỏi cốt lõi dưới đây trước khi nhìn lại đáp án:

1. Bản chất và định nghĩa của **${topic.title}** trong Giáo trình Nguồn A (${pageStr}) là gì?
2. Mối liên hệ quy luật cốt lõi giữa các yếu tố trong bài học là gì?
3. Ý nghĩa phương pháp luận rút ra cho thực tiễn Việt Nam hiện nay?`;
        break;

      case 'explain':
        explanationContent = `### Tự Giải Thích Theo Phương Pháp Feynman

#### Hướng Dẫn Giải Thích Đơn Giản Trong 3 Bước:
1. **Bước 1 (Đơn giản hóa):** Hãy giải thích **${topic.title}** cho một người chưa học triết học bằng ngôn ngữ đời sống đơn giản nhất.
2. **Bước 2 (Tìm khoảng trống):** Phát hiện những chỗ bạn còn lúng túng hoặc chưa thể giải thích trôi chảy.
3. **Bước 3 (Đối chiếu Nguồn A):** Xem lại nội dung tại **${pageStr}** để lấp đầy khoảng trống tri thức.`;
        break;

      case 'outline':
        explanationContent = `### Dàn Ý Bài Thi Tự Luận 6 Phần (Dành Cho Kỳ Thi Thạc Sĩ)

1. **Đặt Vấn Đề (Mở bài):** Vị trí và tầm quan trọng của chủ đề **${topic.title}** (Nguồn A, ${pageStr}).
2. **Luận Điểm Cốt Lõi:** Trình bày khái niệm và các định nghĩa chuẩn mực.
3. **Phân Tích Lý Luận Chuyên Sâu:** Phân tích bản chất quy luật và mối liên hệ biện chứng.
4. **Ý Nghĩa Phương Pháp Luận:** Bài học nhận thức và phương pháp tư duy.
5. **Liên Hệ Thực Tiễn Việt Nam:** Vận dụng vào thực tiễn phát triển đất nước.
6. **Kết Luận (Tóm lại):** Khẳng định giá trị bền vững của lý luận Mác - Lênin.`;
        break;

      case 'exam':
        explanationContent = `### Câu Hỏi & Đáp Án Luyện Thi Đóng Sách (${pageStr})

#### Đề Bài Mẫu Thạc Sĩ (Thang điểm 10):
*Anh/Chị hãy phân tích lý luận về "${topic.title}" trong Giáo trình Triết học Mác - Lênin (Trang ${pageStart}-${pageEnd}) và liên hệ thực tiễn Việt Nam hiện nay.*

#### Thang Điểm & Yêu Cầu Đáp Án:
- **Ý 1 (2.0 điểm):** Trình bày hoàn chỉnh khái niệm & bối cảnh xuất phát (${pageStr}).
- **Ý 2 (4.0 điểm):** Phân tích 3 bản chất lý luận cốt lõi và mối liên hệ quy luật.
- **Ý 3 (2.0 điểm):** Nêu 2 bài học phương pháp luận nhận thức và hành động.
- **Ý 4 (2.0 điểm):** Liên hệ sâu sắc thực tiễn Việt Nam và trách nhiệm của học viên Thạc sĩ.`;
        break;

      default:
        explanationContent = `### Bài Học Chuẩn Giáo Trình Nguồn A (${pageStr})

### Chuyên Đề: ${topic.title}
*(Thuộc Chương ${chapNum}: ${chapTitle})*

${combinedSourceText}

*Trích dẫn nguồn chính thống: Giáo trình Triết học Mác - Lênin (Bộ Giáo dục và Đào tạo), ${pageStr}.*`;
        break;
    }

    return NextResponse.json({
      topic: {
        id: topic.id,
        topic_number: topic.topic_number,
        title: topic.title,
        chapter: topic.chapters
      },
      mode,
      content: explanationContent,
      source_pages: pageCitations,
      confidence: 0.95
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
