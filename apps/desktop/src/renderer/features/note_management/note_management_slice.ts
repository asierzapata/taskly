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
	selectedPath: string
	isRebuilding: boolean
}

const initialState: NoteManagementState = {
	tree: {},
	selectedPath: '/',
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
				state.selectedPath = path
			}
		},
		selectFolder: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			state.selectedPath = path
		},
		selectNote: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			state.selectedPath = path
		},
		folderCreated: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			if (!state.tree[path]) {
				state.tree[path] = {
					path: path,
					isOpen: false,
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.folders?.push({
				name: name,
				path: `${path}/${name}`
			})
		},
		noteCreated: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			if (!state.tree[path]) {
				state.tree[path] = {
					path: path,
					isOpen: false,
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.notes?.push({
				name: name,
				path: `${path}/${name}`
			})
		},
		folderDeleted: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]
			if (directory) {
				directory.folders = directory.folders.filter(
					folder => folder.path !== path
				)
			}
		},
		noteDeleted: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]
			if (directory) {
				directory.notes = directory.notes.filter(note => note.path !== path)
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

export const {
	toggleDirectory,
	selectFolder,
	selectNote,
	folderCreated,
	noteCreated,
	folderDeleted,
	noteDeleted
} = noteManagement.actions

// Selectors
// ---------
