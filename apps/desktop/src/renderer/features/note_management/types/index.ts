export type Note = {
	id: string
	searchId: string
	type: 'note'
	path: Path
	name: string // It contains the extension
	displayName: string // It doesn't contain the extension
	isRenaming: boolean
}

export type Folder = {
	id: string
	type: 'folder'
	path: Path
	name: string
	isRenaming: boolean
	isOpen: boolean
}

// A node is an array of notes and folders
export type TreeNode = {
	notes: { id: string }[]
	folders: { id: string }[]
}

// A path is a string that represents the path to a note or folder
// without the name of the note or folder
export type Path = string

export type NoteTree = Record<Path, TreeNode>

export type NoteNotificationType = 'info' | 'error'
export type NoteNotification = {
	type: NoteNotificationType
	title: string
	message: string
	createdAt: number
}
