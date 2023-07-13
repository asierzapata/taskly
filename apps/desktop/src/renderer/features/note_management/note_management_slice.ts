import { ulid } from 'ulid'
import type { RootState } from '@renderer/store'
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction
} from '@reduxjs/toolkit'
import _ from 'lodash'

import type { NoteTree } from './types'
import { createAppAsyncThunk } from '@renderer/store/hooks'

type NoteManagementState = {
	tree: NoteTree
	isRebuilding: boolean
}

const initialState: NoteManagementState = {
	tree: {},
	isRebuilding: false
}

// Thunks
// ------

export const rebuildTree = createAppAsyncThunk<
	NoteTree,
	void,
	{ state: RootState }
>('noteManagement/rebuildTree', async (_, { getState, extra }) => {
	const tree = await extra.windowApi.noteFileSystem.GetFullTree()

	return Object.keys(tree).reduce((acc, key) => {
		acc[key] = {
			path: key,
			isOpen: false,
			notes:
				tree[key]?.files?.map(file => ({
					name: file.name,
					path: file.path
				})) ?? [],
			folders:
				tree[key]?.folders?.map(folder => ({
					name: folder.name,
					path: folder.path
				})) ?? []
		}
		return acc
	}, {} as NoteTree)
})

// Slice
// -----

export const noteManagement = createSlice({
	name: 'noteManagement',
	initialState,
	reducers: {
		toggleDirectory: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]

			if (directory) {
				directory.isOpen = !directory.isOpen
			}
		}
	},
	extraReducers: builder => {
		builder
			.addCase(rebuildTree.pending, (state, action) => {
				if (!state.isRebuilding) {
					state.isRebuilding = true
				}
			})
			.addCase(rebuildTree.fulfilled, (state, action) => {
				if (state.isRebuilding) {
					state.isRebuilding = false
					state.tree = action.payload
				}
			})
			.addCase(rebuildTree.rejected, (state, action) => {
				state.isRebuilding = false
			})
	}
})

export const noteManagementReducer = noteManagement.reducer

// Actions
// -------

export const { toggleDirectory } = noteManagement.actions

// Selectors
// ---------
