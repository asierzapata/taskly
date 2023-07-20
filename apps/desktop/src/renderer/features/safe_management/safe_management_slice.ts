import _ from 'lodash'
import type { RootState } from '@renderer/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Safe } from './type'
import { createAppAsyncThunk } from '@renderer/store/hooks'

type SafeManagementState = {
	safes: Record<string, Safe>
	currentSafeId?: string
}

const initialState: SafeManagementState = {
	safes: {},
	currentSafeId: undefined
}

// Thunks
// ------

export const createSafe = createAppAsyncThunk<
	{
		safe: Safe
	},
	{
		id: string
		name: string
		path: string
	},
	{ state: RootState }
>('safeManagement/createSafe', async (parameters, { getState, extra }) => {
	const { id, name, path } = parameters
	await extra.windowApi.noteFileSystem.UpdateNoteFileSystemPath({
		newPath: path
	})

	return {
		safe: {
			id,
			name,
			path
		}
	}
})

export const selectSafe = createAppAsyncThunk<
	{
		safe: Safe
	},
	{
		id: string
	},
	{ state: RootState }
>('noteManagement/selectSafe', async (parameters, { getState, extra }) => {
	const { id } = parameters
	const { safes } = getState().safeManagement
	const safe = safes[id]
	if (!safe) {
		throw new Error(`Safe with id ${id} not found`)
	}

	await extra.windowApi.noteFileSystem.UpdateNoteFileSystemPath({
		newPath: safe.path
	})

	return {
		safe
	}
})

// Slice
// -----

export const safeManagement = createSlice({
	name: 'safeManagement',
	initialState,
	reducers: {
		removeSafe: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			delete state.safes[id]
		}
	},
	extraReducers: builder => {
		builder
			.addCase(createSafe.fulfilled, (state, action) => {
				const { safe } = action.payload
				state.safes[safe.id] = safe
			})
			.addCase(selectSafe.fulfilled, (state, action) => {
				const { safe } = action.payload
				state.currentSafeId = safe.id
			})
	}
})

export const safeManagementReducer = safeManagement.reducer

// Actions
// -------

export const { removeSafe } = safeManagement.actions

// Selectors
// ---------
