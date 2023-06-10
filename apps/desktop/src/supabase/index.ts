import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fphulvfmwjdhlpgwktsr.supabase.co'
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaHVsdmZtd2pkaGxwZ3drdHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzODY4MzAsImV4cCI6MjAwMTk2MjgzMH0.4YrUbVcSXPte8mgIgIP1KvMraJz72Vv9GHPZ1CXjTf0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Supabase = typeof supabase
