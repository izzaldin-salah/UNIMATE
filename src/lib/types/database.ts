export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          user_id: number
          name: string
          email: string
          password: string
          role: 'student' | 'teacher' | 'admin'
          created_at: string
          year: number
          department: string
        }
        Insert: {
          user_id?: number
          name: string
          email: string
          password: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          year?: number
          department?: string
        }
        Update: {
          user_id?: number
          name?: string
          email?: string
          password?: string
          role?: 'student' | 'teacher' | 'admin'
          created_at?: string
          year?: number
          department?: string
        }
      }
      courses: {
        Row: {
          course_id: number
          title: string
          description: string | null
          created_by: number | null
          created_at: string
        }
        Insert: {
          course_id?: number
          title: string
          description?: string | null
          created_by?: number | null
          created_at?: string
        }
        Update: {
          course_id?: number
          title?: string
          description?: string | null
          created_by?: number | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          lesson_id: number
          course_id: number
          title: string
          content: string | null
          order_number: number | null
        }
        Insert: {
          lesson_id?: number
          course_id: number
          title: string
          content?: string | null
          order_number?: number | null
        }
        Update: {
          lesson_id?: number
          course_id?: number
          title?: string
          content?: string | null
          order_number?: number | null
        }
      }
      progress: {
        Row: {
          progress_id: number
          user_id: number
          lesson_id: number
          status: 'Not Started' | 'In Progress' | 'Completed'
          score: number | null
          updated_at: string
        }
        Insert: {
          progress_id?: number
          user_id: number
          lesson_id: number
          status?: 'Not Started' | 'In Progress' | 'Completed'
          score?: number | null
          updated_at?: string
        }
        Update: {
          progress_id?: number
          user_id?: number
          lesson_id?: number
          status?: 'Not Started' | 'In Progress' | 'Completed'
          score?: number | null
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}