import type { Supabase } from '@services/supabase'

// Module Name
export const NAME = 'authentication' as const

export type ModuleDependencies = {
	supabase: Supabase
}
