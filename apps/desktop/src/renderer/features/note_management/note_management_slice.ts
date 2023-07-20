import { ulid } from 'ulid'
import type { RootState } from '@renderer/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'

import type { Folder, Note, NoteTree } from './types'
import { createAppAsyncThunk } from '@renderer/store/hooks'

type NoteManagementState = {
	tree: NoteTree
	notes: Record<string, Note>
	folders: Record<string, Folder>
	selectedPath: string
	isRebuilding: boolean
}

const initialState: NoteManagementState = {
	tree: {},
	notes: {},
	folders: {},
	selectedPath: '/',
	isRebuilding: false
}

// Thunks
// ------

export const rebuildTree = createAppAsyncThunk<
	{
		noteTree: NoteTree
		notes: Record<string, Note>
		folders: Record<string, Folder>
	},
	void,
	{ state: RootState }
>('noteManagement/rebuildTree', async (_, { getState, extra }) => {
	const tree = await extra.windowApi.noteFileSystem.GetFullTree()

	const notes: Record<string, Note> = {}
	const folders: Record<string, Folder> = {}
	const noteTree = Object.keys(tree).reduce((acc, key) => {
		const nodeNotes =
			tree[key]?.files?.map(file => ({
				id: ulid(),
				type: 'note' as const,
				name: file.name,
				displayName: file.name.split('.').slice(0, -1).join('.'),
				path: file.path,
				isRenaming: false
			})) ?? []
		nodeNotes.forEach(note => {
			notes[note.id] = note
		})

		const nodeFolders =
			tree[key]?.folders?.map(folder => ({
				id: ulid(),
				type: 'folder' as const,
				name: folder.name,
				path: folder.path,
				isRenaming: false,
				isOpen: false
			})) ?? []
		nodeFolders.forEach(folder => {
			folders[folder.id] = folder
		})

		acc[key] = {
			notes: nodeNotes.map(note => ({ id: note.id })),
			folders: nodeFolders.map(folder => ({ id: folder.id }))
		}
		return acc
	}, {} as NoteTree)
	return { noteTree, notes, folders }
})

// Slice
// -----

// TODO: Event handlers are called twice, duplicating into the state the actions

export const noteManagement = createSlice({
	name: 'noteManagement',
	initialState,
	reducers: {
		toggleFolder: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const folder = state.folders[id]
			if (folder) {
				folder.isOpen = !folder.isOpen
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
			const newFolder = {
				id: ulid(),
				type: 'folder' as const,
				path,
				name,
				isRenaming: true,
				isOpen: false
			}
			if (!state.tree[path]) {
				state.tree[path] = {
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.folders?.push({
				id: newFolder.id
			})
			state.folders[newFolder.id] = newFolder
		},
		noteCreated: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const newNote = {
				id: ulid(),
				type: 'note' as const,
				path,
				name,
				displayName: name.split('.').slice(0, -1).join('.'),
				isRenaming: true
			}
			if (!state.tree[path]) {
				state.tree[path] = {
					notes: [],
					folders: []
				}
			}
			state.tree[path]?.notes?.push({
				id: newNote.id
			})
			state.notes[newNote.id] = newNote
		},
		folderDeleted: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const folder = _.find(
				state.folders,
				folder => folder.path === path && folder.name === name
			)
			if (folder) {
				delete state.folders[folder.id]
				state.tree[path]?.folders?.filter(folder => folder.id !== folder.id)
			}
		},
		noteDeleted: (
			state,
			action: PayloadAction<{ path: string; name: string }>
		) => {
			const { path, name } = action.payload
			const note = _.find(
				state.notes,
				note => note.path === path && note.name === name
			)
			if (note) {
				delete state.notes[note.id]
				state.tree[path]?.notes?.filter(note => note.id !== note.id)
			}
		},
		noteRenamed: (
			state,
			action: PayloadAction<{ path: string; oldName: string; newName: string }>
		) => {
			const { path, oldName, newName } = action.payload
			const note = _.find(
				state.notes,
				note => note.path === path && note.name === oldName
			)
			if (note) {
				note.isRenaming = false
				note.name = newName
				note.displayName = newName.split('.').slice(0, -1).join('.')
			}
		},
		folderRenamed: (
			state,
			action: PayloadAction<{ path: string; oldName: string; newName: string }>
		) => {
			const { path, oldName, newName } = action.payload
			const folder = _.find(
				state.folders,
				folder => folder.path === path && folder.name === oldName
			)
			if (folder) {
				folder.isRenaming = false
				folder.name = newName
			}
		},
		startRenamingNote: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const note = state.notes[id]
			if (note) {
				note.isRenaming = true
			}
		},
		stopRenamingNote: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const note = state.notes[id]
			if (note) {
				note.isRenaming = false
			}
		},
		startRenamingFolder: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const folder = state.folders[id]
			if (folder) {
				folder.isRenaming = true
			}
		},
		stopRenamingFolder: (state, action: PayloadAction<{ id: string }>) => {
			const { id } = action.payload
			const folder = state.folders[id]
			if (folder) {
				folder.isRenaming = false
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
					state.tree = action.payload.noteTree
					state.notes = action.payload.notes
					state.folders = action.payload.folders
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
	toggleFolder,
	selectFolder,
	selectNote,
	folderCreated,
	noteCreated,
	folderDeleted,
	noteDeleted,
	noteRenamed,
	folderRenamed,
	startRenamingFolder,
	stopRenamingFolder,
	startRenamingNote,
	stopRenamingNote
} = noteManagement.actions

// Selectors
// ---------
