import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uyprpugxtpidlzdqqvqx.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cHJwdWd4dHBpZGx6ZHFxdnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjQ5MjksImV4cCI6MjA3MDM0MDkyOX0.3Lv4gJMRZyq4AXmdyC98A0TDdP8MnbArY-e6zJhXERY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Message = {
  id: number
  content: string
  nickname: string
  created_at: string
}
