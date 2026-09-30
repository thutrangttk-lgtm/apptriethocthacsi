export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      courses: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          course_id: string
          chapter_number: number
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          course_id: string
          chapter_number: number
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          chapter_number?: number
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      topics: {
        Row: {
          id: string
          chapter_id: string
          topic_number: number
          title: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chapter_id: string
          topic_number: number
          title: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          chapter_id?: string
          topic_number?: number
          title?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      concepts: {
        Row: {
          id: string
          topic_id: string
          name: string
          definition: string
          key_points: Json
          created_at: string
          updated_at: string
        }
      }
      source_types: {
        Row: {
          id: string
          code: string
          name: string
          description: string | null
          priority_level: number
          created_at: string
          updated_at: string
        }
      }
      documents_metadata: {
        Row: {
          id: string
          course_id: string | null
          source_type_id: string | null
          title: string
          author: string | null
          publication_year: number | null
          file_path: string | null
          file_size_bytes: number | null
          mime_type: string | null
          metadata: Json
          created_at: string
          updated_at: string
        }
      }
      questions: {
        Row: {
          id: string
          topic_id: string | null
          question_type: string
          question_text: string
          options_json: Json
          correct_answer: string | null
          rubric_json: Json
          difficulty_level: string | null
          created_at: string
          updated_at: string
        }
      }
      user_topic_mastery: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          mastery_score: number
          review_count: number
          last_reviewed_at: string | null
          next_review_due: string | null
          created_at: string
          updated_at: string
        }
      }
      recall_attempts: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          prompt_text: string
          user_response: string
          feedback: string | null
          score: number | null
          created_at: string
        }
      }
      outline_attempts: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          outline_structure_json: Json
          feedback_json: Json
          score: number | null
          created_at: string
        }
      }
      exam_attempts: {
        Row: {
          id: string
          user_id: string
          course_id: string
          exam_type: string
          status: string
          answers_json: Json
          feedback_json: Json
          score: number | null
          started_at: string
          completed_at: string | null
          created_at: string
        }
      }
    }
  }
}
