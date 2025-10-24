import { supabase } from './supabase'
import type { Database } from './types/database'

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export interface AuthUser {
  user_id: number
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  year: number
  department: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  year: string
  department: string
  indexNumber: string
}

export interface LoginData {
  email: string
  password: string
}

export class AuthService {
  // Sign up a new user (simple database insert)
  static async signUp(data: RegisterData) {
    try {
      const { data: userData, error } = await (supabase as any)
        .from('users')
        .insert({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          password: data.password, // In production, you should hash this!
          role: 'student',
          year: parseInt(data.year) || 1,
          department: data.department || 'IT'
        })
        .select()
        .single()

      if (error) throw error

      return { 
        success: true, 
        user: userData
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      return { success: false, error: error.message || 'Registration failed' }
    }
  }

  // Sign in existing user (simple password check)
  static async signIn(data: LoginData) {
    try {
      const { data: userData, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('email', data.email)
        .eq('password', data.password) // In production, you should hash and compare!
        .single()

      if (error || !userData) {
        throw new Error('Invalid email or password')
      }
      
      return { 
        success: true, 
        user: userData
      }
    } catch (error: any) {
      console.error('Login error:', error)
      return { success: false, error: error.message || 'Login failed' }
    }
  }

  // Get user by ID
  static async getUserById(userId: number): Promise<User | null> {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Get user error:', error)
      return null
    }
  }

  // Update user profile
  static async updateProfile(userId: number, updates: UserUpdate) {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error
      return { success: true, user: data }
    } catch (error: any) {
      console.error('Update profile error:', error)
      return { success: false, error: error.message || 'Update failed' }
    }
  }

  // Check if email exists (for validation)
  static async emailExists(email: string): Promise<boolean> {
    try {
      const { data, error } = await (supabase as any)
        .from('users')
        .select('user_id')
        .eq('email', email)
        .single()

      return !!data && !error
    } catch (error) {
      return false
    }
  }
}