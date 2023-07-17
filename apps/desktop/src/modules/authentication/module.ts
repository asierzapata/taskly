import type { shell } from 'electron'

// Module Name
export const NAME = 'authentication' as const

export type ModuleDependencies = {
	shell: typeof shell
}
