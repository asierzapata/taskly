import { ulid } from 'ulid'
import type { RootState } from '@renderer/store'
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'

import type { Folder, Note, NoteNotification, NoteTree } from './types'
import { createAppAsyncThunk } from '@renderer/store/hooks'
import {
	addNote,
	initializeSearchEngine,
	removeNote,
	searchNotes,
	updateNote
} from './note_search_engine'

type NoteManagementState = {
	tree: NoteTree
	notes: Record<string, Note>
	folders: Record<string, Folder>
	noteNavigation: {
		stack: string[]
		currentStackIndex: number
	}
	selectedPath: string
	isRebuilding: boolean
	noteSearch: {
		searchQuery: string
		searchResults: Awaited<ReturnType<typeof searchNotes>>
	}
	notifications: NoteNotification[]
}

const initialState: NoteManagementState = {
	tree: {},
	notes: {},
	folders: {},
	noteNavigation: {
		stack: [],
		currentStackIndex: 0
	},
	selectedPath: '/',
	isRebuilding: false,
	noteSearch: {
		searchQuery: '',
		searchResults: {
			count: 0,
			notes: []
		}
	},
	notifications: []
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
>(
	'noteManagement/rebuildTree',
	async (_, { extra }) => {
		const { noteTree, notes, folders } = await _getNoteTree({
			noteFileSystem: extra.windowApi.noteFileSystem
		})
		const notesWithSeachIds = await initializeSearchEngine({
			notes: Object.values(notes),
			noteFileSystem: extra.windowApi.noteFileSystem
		})
		const normalizedNotes = {} as Record<string, Note>
		notesWithSeachIds.forEach(note => {
			normalizedNotes[note.id] = note
		})
		return { noteTree, notes: normalizedNotes, folders }
	},
	{
		condition: (_, { getState }) => {
			const { noteManagement } = getState()
			const isRebuilding = noteManagement.isRebuilding
			if (isRebuilding) {
				return false
			}
		}
	}
)

export const noteCreated = createAppAsyncThunk<
	{
		note: Note
	},
	{ path: string; name: string },
	{ state: RootState }
>('noteManagement/noteCreated', async ({ path, name }, { extra }) => {
	const note = {
		id: ulid(),
		searchId: '',
		type: 'note' as const,
		path,
		name,
		displayName: name.split('.').slice(0, -1).join('.'),
		isRenaming: true
	}
	await addNote({
		note,
		noteFileSystem: extra.windowApi.noteFileSystem
	})
	return { note }
})

export const noteDeleted = createAppAsyncThunk<
	{
		path: string
		name: string
	},
	{ path: string; name: string },
	{ state: RootState }
>('noteManagement/noteDeleted', async ({ path, name }, { getState }) => {
	const note = _.find(
		getState().noteManagement.notes,
		note => note.path === path && note.name === name
	)
	if (!note) {
		throw new Error('Note not found')
	}
	await removeNote({
		note
	})
	return { path, name }
})

export const noteRenamed = createAppAsyncThunk<
	{
		path: string
		oldName: string
		newName: string
	},
	{ path: string; oldName: string; newName: string },
	{ state: RootState }
>(
	'noteManagement/noteRenamed',
	async ({ path, oldName, newName }, { getState, extra }) => {
		console.log('>>>>>> notes', getState().noteManagement.notes)
		const note = _.find(
			getState().noteManagement.notes,
			note => note.path === path && note.name === oldName
		)
		console.log('>>>>>> note found', note)
		if (!note) {
			throw new Error('Note not found')
		}
		const newNote = {
			...note,
			name: newName,
			displayName: newName.split('.').slice(0, -1).join('.')
		}
		console.log('>>>>>>newNote', newNote)
		await updateNote({
			note: newNote,
			noteFileSystem: extra.windowApi.noteFileSystem
		})

		return { path, oldName, newName }
	}
)

export const noteContentUpdated = createAppAsyncThunk<
	{
		path: string
		name: string
		content: string
	},
	{ path: string; name: string; content: string },
	{ state: RootState }
>(
	'noteManagement/noteContentUpdated',
	async ({ path, name, content }, { getState, extra }) => {
		const note = _.find(
			getState().noteManagement.notes,
			note => note.path === path && note.name === name
		)
		if (!note) {
			throw new Error('Note not found')
		}
		await updateNote({
			note,
			noteFileSystem: extra.windowApi.noteFileSystem
		})

		return { path, name, content }
	}
)

export const searchNotesInSafe = createAppAsyncThunk<
	{
		searchQuery: string
		searchResults: Awaited<ReturnType<typeof searchNotes>>
	},
	{ searchQuery: string },
	{ state: RootState }
>('noteManagement/searchNotes', async ({ searchQuery }) => {
	const searchResults = await searchNotes({
		query: searchQuery
	})
	return { searchQuery, searchResults }
})

// Slice
// -----

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
		selectFolder: (state, action: PayloadAction<{ folderId: string }>) => {
			const { folderId } = action.payload
			const folder = state.folders[folderId]
			if (!folder) {
				return
			}
			const folderFullPath = folder?.path.endsWith('/')
				? `${folder.path}${folder.name}`
				: `${folder?.path}/${folder?.name}`
			state.selectedPath = folderFullPath
		},
		selectNote: (state, action: PayloadAction<{ noteId: string }>) => {
			const { noteId } = action.payload
			const note = state.notes[noteId]
			if (!note) {
				return
			}
			const noteFullPath = note?.path.endsWith('/')
				? `${note.path}${note.name}`
				: `${note?.path}/${note?.name}`
			state.selectedPath = noteFullPath
		},
		navigatedToNote: (state, action: PayloadAction<{ noteId: string }>) => {
			const { noteId } = action.payload
			const note = state.notes[noteId]

			if (!note) {
				return
			}

			if (
				noteId ===
				state.noteNavigation.stack[state.noteNavigation.currentStackIndex]
			) {
				return
			}
			// We have to slice the stack to the current index and then push the new noteId
			// to the stack.
			if (
				state.noteNavigation.currentStackIndex <
				state.noteNavigation.stack.length - 1
			) {
				state.noteNavigation.stack = state.noteNavigation.stack.slice(
					0,
					state.noteNavigation.currentStackIndex + 1
				)
			}
			state.noteNavigation.stack.push(noteId)
			state.noteNavigation.currentStackIndex =
				state.noteNavigation.stack.length - 1

			const noteFullPath = note.path.endsWith('/')
				? `${note.path}${note.name}`
				: `${note.path}/${note.name}`
			state.selectedPath = noteFullPath
		},
		navigatedBack: state => {
			state.noteNavigation.currentStackIndex -= 1

			const noteId =
				state.noteNavigation.stack[state.noteNavigation.currentStackIndex]
			if (!noteId) {
				return
			}

			const note = state.notes[noteId]
			if (!note) {
				return
			}

			const noteFullPath = note.path.endsWith('/')
				? `${note.path}${note.name}`
				: `${note.path}/${note.name}`
			state.selectedPath = noteFullPath
		},
		navigatedForward: state => {
			state.noteNavigation.currentStackIndex += 1

			const noteId =
				state.noteNavigation.stack[state.noteNavigation.currentStackIndex]
			if (!noteId) {
				return
			}

			const note = state.notes[noteId]
			if (!note) {
				return
			}

			const noteFullPath = note.path.endsWith('/')
				? `${note.path}${note.name}`
				: `${note.path}/${note.name}`
			state.selectedPath = noteFullPath
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
			.addCase(rebuildTree.pending, state => {
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
			.addCase(rebuildTree.rejected, state => {
				state.isRebuilding = false
				state.notifications.push(
					_createErrorNotification({
						title: 'Failed to rebuild tree',
						message: 'Restart the application and try again.'
					})
				)
			})
			.addCase(noteCreated.fulfilled, (state, action) => {
				const note = action.payload.note
				if (!state.tree[note.path]) {
					state.tree[note.path] = {
						notes: [],
						folders: []
					}
				}
				state.tree[note.path]?.notes?.push({
					id: note.id
				})
				state.notes[note.id] = note
			})
			.addCase(noteCreated.rejected, state => {
				state.notifications.push(
					_createErrorNotification({
						title: "Ops! We couldn't create the note.",
						message: ''
					})
				)
			})
			.addCase(noteDeleted.fulfilled, (state, action) => {
				const { path, name } = action.payload
				const note = _.find(
					state.notes,
					note => note.path === path && note.name === name
				)
				if (note) {
					delete state.notes[note.id]
					state.tree[path]?.notes?.filter(note => note.id !== note.id)
				}
			})
			.addCase(noteDeleted.rejected, (state, action) => {
				const noteName = action.meta.arg.name.split('.').slice(0, -1).join('.')
				state.notifications.push(
					_createErrorNotification({
						title: `Ops! We couldn't delete ${noteName}.`,
						message: ''
					})
				)
			})
			.addCase(noteRenamed.fulfilled, (state, action) => {
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
			})
			.addCase(noteRenamed.rejected, (state, action) => {
				const { oldName } = action.meta.arg
				const noteName = oldName.split('.').slice(0, -1).join('.')
				state.notifications.push(
					_createErrorNotification({
						title: `Ops! We couldn't rename ${noteName}.`,
						message: ''
					})
				)
			})
			.addCase(searchNotesInSafe.fulfilled, (state, action) => {
				const { searchQuery, searchResults } = action.payload
				state.noteSearch.searchQuery = searchQuery
				state.noteSearch.searchResults = searchResults
			})
			.addCase(searchNotesInSafe.rejected, (state, action) => {
				const { searchQuery } = action.meta.arg
				state.notifications.push(
					_createErrorNotification({
						title: `Ops! We couldn't search for ${searchQuery}.`,
						message: ''
					})
				)
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
	navigatedToNote,
	navigatedBack,
	navigatedForward,
	folderCreated,
	folderDeleted,
	folderRenamed,
	startRenamingFolder,
	stopRenamingFolder,
	startRenamingNote,
	stopRenamingNote
} = noteManagement.actions

// Selectors
// ---------

export const selectNotesOnPath =
	(path: string, idToExclude?: string) => (state: RootState) => {
		const treeNode = state.noteManagement.tree[path]
		if (!treeNode) return []
		let notesWithoutCurrentNote = [...treeNode.notes]
		if (idToExclude) {
			notesWithoutCurrentNote = notesWithoutCurrentNote?.filter(
				n => n.id !== idToExclude
			)
		}
		return (
			notesWithoutCurrentNote?.map(n => {
				return state.noteManagement.notes[n.id]?.displayName
			}) ?? []
		)
	}

// Helpers
// -------

async function _getNoteTree({
	noteFileSystem
}: {
	noteFileSystem: {
		GetFullTree: () => Promise<
			Record<
				string,
				{
					files: { name: string; path: string }[]
					folders: { name: string; path: string }[]
				}
			>
		>
	}
}) {
	const tree = await noteFileSystem.GetFullTree()

	const notes: Record<string, Note> = {}
	const folders: Record<string, Folder> = {}
	const noteTree = Object.keys(tree).reduce((acc, key) => {
		const nodeNotes =
			tree[key]?.files?.map(file => ({
				id: ulid(),
				searchId: '',
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
}

function _createInfoNotification({
	title,
	message
}: Pick<NoteNotification, 'title' | 'message'>) {
	return {
		title,
		message,
		type: 'info' as const,
		createdAt: Date.now()
	}
}

function _createErrorNotification({
	title,
	message
}: Pick<NoteNotification, 'title' | 'message'>) {
	return {
		title,
		message,
		type: 'error' as const,
		createdAt: Date.now()
	}
}
