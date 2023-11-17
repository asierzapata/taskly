export type FileSystemFile = {
	id: string
	name: string
	formatedName: string
	type: 'file'
	handle: FileSystemFileHandle
	parentHandle: FileSystemDirectoryHandle
}

export type FileSystemTreeNode = {
	name: string
	parentHandle: FileSystemDirectoryHandle
	handle: FileSystemDirectoryHandle
	files: FileSystemFile[]
	folders: FileSystemTreeNode[]
}
