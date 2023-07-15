export type Note = {
	name: string
	path: Path
	isRenaming: boolean
}

export type Folder = {
	name: string
	path: Path
}

export type Directory = {
	path: Path
	isOpen: boolean
	isRenaming: boolean
	folders: Folder[]
	notes: Note[]
}

export type Path = string

export type NoteTree = Record<Path, Directory>
