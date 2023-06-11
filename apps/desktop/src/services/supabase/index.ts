import { createClient } from '@supabase/supabase-js'
import Store from 'electron-store'

const supabaseUrl = 'https://fphulvfmwjdhlpgwktsr.supabase.co'
const supabaseAnonKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwaHVsdmZtd2pkaGxwZ3drdHNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODYzODY4MzAsImV4cCI6MjAwMTk2MjgzMH0.4YrUbVcSXPte8mgIgIP1KvMraJz72Vv9GHPZ1CXjTf0'

const store = new Store<Record<string, string>>({
	name: '@taskly/supabase',
	encryptionKey: 'this_only_obfuscates_the_data'
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		storage: {
			getItem: (key: string) => store.get(key),
			setItem: (key: string, value: string) => store.set(key, value),
			removeItem: (key: string) => store.delete(key)
		}
	}
})

export type Supabase = typeof supabase
