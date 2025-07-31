import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase: any

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured. Using demo mode.')
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Demo mode - authentication disabled' } }),
      signUp: () => Promise.resolve({ error: { message: 'Demo mode - registration disabled' } }),
      signOut: () => Promise.resolve({ error: null })
    },
    from: () => ({
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: null, error: { code: 'DEMO_MODE' } }) }) }),
      insert: () => Promise.resolve({ error: { message: 'Demo mode - database operations disabled' } })
    })
  } as any
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase }

// Types pour TypeScript
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'reader' | 'writer' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'reader' | 'writer' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'reader' | 'writer' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          description: string | null
          author: string
          price: number
          type: 'ebook' | 'audio' | 'both'
          cover: string | null
          file_url: string | null
          audio_url: string | null
          sample_url: string | null
          audio_sample_url: string | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          author: string
          price: number
          type: 'ebook' | 'audio' | 'both'
          cover?: string | null
          file_url?: string | null
          audio_url?: string | null
          sample_url?: string | null
          audio_sample_url?: string | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          author?: string
          price?: number
          type?: 'ebook' | 'audio' | 'both'
          cover?: string | null
          file_url?: string | null
          audio_url?: string | null
          sample_url?: string | null
          audio_sample_url?: string | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      purchases: {
        Row: {
          id: string
          user_id: string
          book_id: string
          price: number
          payment_method: string
          payment_intent_id: string | null
          purchase_date: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          price: number
          payment_method: string
          payment_intent_id?: string | null
          purchase_date?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          price?: number
          payment_method?: string
          payment_intent_id?: string | null
          purchase_date?: string
        }
      }
      reading_progress: {
        Row: {
          id: string
          user_id: string
          book_id: string
          last_position: number
          completion_percentage: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          book_id: string
          last_position?: number
          completion_percentage?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          book_id?: string
          last_position?: number
          completion_percentage?: number
          last_updated?: string
        }
      }
    }
  }
}