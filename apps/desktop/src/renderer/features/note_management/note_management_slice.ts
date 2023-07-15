import { ulid } from 'ulid'
import type { RootState } from '@renderer/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
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
	console.log(
		'>>>>>>',
		Object.keys(tree).reduce((acc, key) => {
			acc[key] = {
				path: key,
				isOpen: false,
				isRenaming: false,
				notes:
					tree[key]?.files?.map(file => ({
						name: file.name,
						path: file.path,
						isRenaming: false
					})) ?? [],
				folders:
					tree[key]?.folders?.map(folder => ({
						name: folder.name,
						path: folder.path
					})) ?? []
			}
			return acc
		}, {} as NoteTree)
	)
	return Object.keys(tree).reduce((acc, key) => {
		acc[key] = {
			path: key,
			isOpen: false,
			isRenaming: false,
			notes:
				tree[key]?.files?.map(file => ({
					name: file.name,
					path: file.path,
					isRenaming: false
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

// TODO: Delete folders delete all forlders from state, luckly not from disk
// TODO: Event handlers are called twice, duplicating into the state the actions
// TODO: Create folder does not reflect on ui

export const noteManagement = createSlice({
	name: 'noteManagement',
	initialState,
	reducers: {
		toggleDirectory: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]

			console.log('>>>>>>', path, directory)

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
					isRenaming: false,
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.folders?.push({
				name,
				path
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
					isRenaming: false,
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.notes?.push({
				name,
				path,
				isRenaming: false
			})
		},
		folderDeleted: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const directory = state.tree[path]
			if (directory) {
				directory.folders = directory.folders.filter(
					folder => folder.path !== path && folder.name !== name
				)
			}
		},
		noteDeleted: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const directory = state.tree[path]
			if (directory) {
				directory.notes = directory.notes.filter(
					note => note.path !== path && note.name !== name
				)
			}
		},
		noteRenamed: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const directory = state.tree[path]
			if (directory) {
				const note = directory.notes.find(
					note => note.path === path && note.name !== name
				)
				if (note) {
					note.name = name
				}
			}
		},
		startRenamingNote: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]
			if (directory) {
				const note = directory.notes.find(note => note.path === path)
				if (note) {
					note.isRenaming = true
				}
			}
		},
		startRenamingFolder: (state, action: PayloadAction<{ path: string }>) => {
			const { path } = action.payload
			const directory = state.tree[path]
			if (directory) {
				directory.isRenaming = true
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
	noteDeleted,
	startRenamingFolder,
	startRenamingNote
} = noteManagement.actions

// Selectors
// ---------
