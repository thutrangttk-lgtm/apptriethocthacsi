export interface Course {
  id: string;
  code: string;
  title: string;
  description: string;
}

export interface Chapter {
  id: string;
  course_id: string;
  chapter_number: number;
  title: string;
  description: string;
}

export interface Topic {
  id: string;
  chapter_id: string;
  topic_number: number;
  title: string;
  description: string;
}

export interface Concept {
  id: string;
  topic_id: string;
  name: string;
  definition: string;
  key_points: string[];
}

export const mockCourses: Course[] = [
  {
    id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    code: "TRIETHOC-CH",
    title: "Triết học - Cao học",
    description: "Chương trình lý luận Triết học nâng cao dành cho học viên cao học không chuyên ngành Triết học. Tập trung vào thế giới quan khoa học, phương pháp luận duy vật biện chứng và vận dụng thực tiễn."
  }
];

export const mockChapters: Chapter[] = [
  {
    id: "c1111111-1111-1111-1111-111111111111",
    course_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    chapter_number: 1,
    title: "Triết học và vai trò của triết học trong đời sống xã hội",
    description: "Nghiên cứu khái lược về nguồn gốc, bản chất triết học, vấn đề cơ bản của triết học và sự ra đời của Triết học Mác - Lênin."
  },
  {
    id: "c2222222-2222-2222-2222-222222222222",
    course_id: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    chapter_number: 2,
    title: "Chủ nghĩa duy vật biện chứng - Hạt nhân lý luận của thế giới quan khoa học",
    description: "Nghiên cứu nguyên lý vật chất và ý thức, hai nguyên lý cơ bản và các quy luật của phép biện chứng duy vật."
  }
];

export const mockTopics: Topic[] = [
  {
    id: "t1111111-1111-1111-1111-111111111111",
    chapter_id: "c1111111-1111-1111-1111-111111111111",
    topic_number: 1,
    title: "Khái lược về triết học và vấn đề cơ bản của triết học",
    description: "Tìm hiểu định nghĩa triết học, đối tượng nghiên cứu và hai mặt của vấn đề cơ bản của triết học."
  },
  {
    id: "t1122222-1111-1111-1111-111111111111",
    chapter_id: "c1111111-1111-1111-1111-111111111111",
    topic_number: 2,
    title: "Triết học Mác - Lênin và vai trò của nó trong đời sống xã hội",
    description: "Phân tích điều kiện kinh tế - xã hội, tiền đề lý luận và chức năng thế giới quan, phương pháp luận."
  },
  {
    id: "t2211111-2222-2222-2222-222222222222",
    chapter_id: "c2222222-2222-2222-2222-222222222222",
    topic_number: 1,
    title: "Vật chất và ý thức",
    description: "Định nghĩa vật chất của Lênin, nguồn gốc, bản chất của ý thức và mối quan hệ biện chứng."
  },
  {
    id: "t2222222-2222-2222-2222-222222222222",
    chapter_id: "c2222222-2222-2222-2222-222222222222",
    topic_number: 2,
    title: "Phép biện chứng duy vật",
    description: "Hai nguyên lý cơ bản cùng các quy luật mấu chốt của phép biện chứng."
  }
];

export const mockConcepts: Concept[] = [
  {
    id: "k1111111-1111-1111-1111-111111111111",
    topic_id: "t1111111-1111-1111-1111-111111111111",
    name: "Khái niệm Triết học",
    definition: "Triết học là hệ thống quan điểm lý luận chung nhất về thế giới và vị trí con người trong thế giới đó.",
    key_points: ["Hình thái ý thức xã hội", "Hệ thống phạm trù và quy luật"]
  },
  {
    id: "k1122222-1111-1111-1111-111111111111",
    topic_id: "t1111111-1111-1111-1111-111111111111",
    name: "Vấn đề cơ bản của triết học",
    definition: "Là vấn đề quan hệ giữa tư duy và tồn tại (giữa ý thức và vật chất).",
    key_points: ["Mặt bản thể luận", "Mặt nhận thức luận"]
  },
  {
    id: "k2211111-2222-2222-2222-222222222222",
    topic_id: "t2211111-2222-2222-2222-222222222222",
    name: "Định nghĩa Vật chất của Lênin",
    definition: "Vật chất là phạm trù triết học chỉ thực tại khách quan được đem lại cho con người trong cảm giác.",
    key_points: ["Thực tại khách quan", "Tồn tại độc lập với ý thức"]
  }
];
