import _ from 'lodash'

import type { Safe } from './type'
import { create } from 'zustand'
import { createSelectors } from '@/lib/zustand'

type SafeManagementState = {
	safes: Record<string, Safe>
	currentSafeId?: string
	createSafe: (parameters: { id: string; name: string; path: string }) => void
	selectSafe: (parameters: { id: string }) => void
	removeSafe: (parameters: { id: string }) => void
}

// Store
// -----

const _useSafeManagementStore = create<SafeManagementState>()(set => ({
	safes: {},
	currentSafeId: undefined,
	createSafe: (parameters: { id: string; name: string; path: string }) => {
		const { id, name, path } = parameters
		set(state => ({
			safes: {
				...state.safes,
				[id]: {
					id,
					name,
					path
				}
			}
		}))
	},
	selectSafe: (parameters: { id: string }) => {
		const { id } = parameters
		set({
			currentSafeId: id
		})
	},
	removeSafe: (parameters: { id: string }) => {
		const { id } = parameters
		set(state => ({
			safes: _.omit(state.safes, id)
		}))
	}
}))

export const useSafeManagementStore = createSelectors(_useSafeManagementStore)
