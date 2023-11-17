import _ from 'lodash'

import type { Safe } from './type'
import { create } from 'zustand'
import { createSelectors } from '@renderer/lib/zustand'

type SafeManagementState = {
	safes: Record<string, Safe>
	currentSafeId?: string
	createSafe: (parameters: {
		id: string
		name: string
		path: string
	}) => Promise<void>
	selectSafe: (parameters: { id: string; path: string }) => Promise<void>
	removeSafe: (parameters: { id: string }) => void
}

const windowApi = window.api

// Store
// -----

const _useSafeManagementStore = create<SafeManagementState>()(set => ({
	safes: {},
	currentSafeId: undefined,
	createSafe: async (parameters: {
		id: string
		name: string
		path: string
	}) => {
		const { id, name, path } = parameters
		await windowApi.noteFileSystem.UpdateNoteFileSystemPath({
			newPath: path
		})
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
	selectSafe: async (parameters: { id: string; path: string }) => {
		const { id, path } = parameters
		await windowApi.noteFileSystem.UpdateNoteFileSystemPath({
			newPath: path
		})
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
