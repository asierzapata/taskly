import {
	create,
	insert,
	remove,
	insertMultiple,
	type Result,
	count
} from '@orama/orama'
import {
	afterInsert as highlightAfterInsert,
	searchWithHighlight,
	type OramaWithHighlight,
	type Position
} from '@orama/plugin-match-highlight'
import { type Note } from './types'
import _ from 'lodash'

let noteDb: OramaWithHighlight

export const initializeSearchEngine = async ({
	notes,
	noteFileSystem
}: {
	notes: Note[]
	noteFileSystem: {
		ReadNote: ({
			path,
			name
		}: {
			path: string
			name: string
		}) => Promise<{ content: string }>
	}
}): Promise<Note[]> => {
	noteDb = (await create({
		schema: {
			name: 'string',
			content: 'string',
			path: 'string'
		},
		components: {
			// Register the hook
			afterInsert: [highlightAfterInsert]
		}
	})) as OramaWithHighlight
	const notesToInsert = await Promise.all(
		Object.values(notes).map(async note => {
			const { content } = await noteFileSystem.ReadNote({
				path: note.path,
				name: note.name
			})
			return {
				name: note.name,
				content,
				path: note.path
			}
		})
	)
	const noteIds = await insertMultiple(noteDb, notesToInsert, 100)
	return _.zipWith(notes, noteIds, (note, id) => {
		note.searchId = id
		return note
	})
}

export const addNote = async ({
	note,
	noteFileSystem
}: {
	note: Note
	noteFileSystem: {
		ReadNote: ({
			path,
			name
		}: {
			path: string
			name: string
		}) => Promise<{ content: string }>
	}
}) => {
	const { content } = await noteFileSystem.ReadNote({
		path: note.path,
		name: note.name
	})
	await insert(noteDb, {
		name: note.name,
		content,
		path: note.path
	})
}

export const removeNote = async ({ note }: { note: Note }) => {
	await remove(noteDb, note.searchId)
}

export const updateNote = async ({
	note,
	noteFileSystem
}: {
	note: Note
	noteFileSystem: {
		ReadNote: ({
			path,
			name
		}: {
			path: string
			name: string
		}) => Promise<{ content: string }>
	}
}) => {
	const { content } = await noteFileSystem.ReadNote({
		path: note.path,
		name: note.name
	})
	await remove(noteDb, note.searchId)
	await insert(noteDb, {
		name: note.name,
		content,
		path: note.path
	})
}

type Hit = Result & {
	positions: {
		name: Record<string, Position[]>
		content: Record<string, Position[]>
	}
}
export const searchNotes = async ({ query }: { query: string }) => {
	const results = await searchWithHighlight(noteDb, {
		term: query,
		properties: ['name', 'content']
	})
	// The type of the library is wrong, so we need to cast it to the correct type
	const hits = results.hits as unknown as Hit[]
	return {
		count: results.count,
		notes: hits.map((hit: Hit) => ({
			searchId: hit.id,
			score: hit.score,
			name: hit.document.name,
			path: hit.document.path,
			content: hit.document.content,
			highlights: hit.positions
		}))
	}
}
