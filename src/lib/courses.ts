import { supabase } from './supabase'

export interface Course {
  course_id: number
  title: string
  description: string | null
  created_by: number | null
  created_at: string
}

export interface Lesson {
  lesson_id: number
  course_id: number
  title: string
  content: string | null
  order_number: number | null
}

export interface Progress {
  progress_id: number
  user_id: number
  lesson_id: number
  status: 'Not Started' | 'In Progress' | 'Completed'
  score: number | null
  updated_at: string
}

export class CourseService {
  // Get all courses
  static async getAllCourses(): Promise<Course[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('courses')
        .select('*')
        .order('title')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get courses error:', error)
      return []
    }
  }

  // Get lessons for a course
  static async getLessonsForCourse(courseId: number): Promise<Lesson[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order_number')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get lessons error:', error)
      return []
    }
  }

  // Get user progress for all lessons
  static async getUserProgress(userId: number): Promise<Progress[]> {
    try {
      const { data, error } = await (supabase as any)
        .from('progress')
        .select('*')
        .eq('user_id', userId)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Get user progress error:', error)
      return []
    }
  }

  // Update lesson progress
  static async updateLessonProgress(userId: number, lessonId: number, status: string, score?: number) {
    try {
      const { data, error } = await (supabase as any)
        .from('progress')
        .upsert({
          user_id: userId,
          lesson_id: lessonId,
          status: status,
          score: score || null,
          updated_at: new Date().toISOString(),
        })
        .select()

      if (error) throw error
      return { success: true, data }
    } catch (error: any) {
      console.error('Update progress error:', error)
      return { success: false, error: error.message || 'Update failed' }
    }
  }

  // Create a new course
  static async createCourse(title: string, description: string, createdBy: number) {
    try {
      const { data, error } = await (supabase as any)
        .from('courses')
        .insert({
          title,
          description,
          created_by: createdBy
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, course: data }
    } catch (error: any) {
      console.error('Create course error:', error)
      return { success: false, error: error.message || 'Course creation failed' }
    }
  }
}