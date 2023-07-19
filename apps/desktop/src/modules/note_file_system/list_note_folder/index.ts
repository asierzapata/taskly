import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { type ModuleDependencies } from '../module'
import { type Folder, type File } from '../types'

type ListNoteFolderParameters = {
	path: string
}
type ListNoteFolderResponse = {
	files: File[]
	folders: Folder[]
}

export const ListNoteFolder = async ({
	parameters: { path },
	dependencies
}: {
	parameters: ListNoteFolderParameters
	dependencies: ModuleDependencies
}): Promise<ListNoteFolderResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	// We need to make sure the path is valid
	// and that it is a directory
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isDirectory()) {
		throw new Error('Path is not a folder')
	}

	const filesAndFolders = await dependencies.fs.readdir(absolutePath, {
		withFileTypes: true
	})

	// We only want files with the .md extension
	const files = filesAndFolders
		.filter(file => file.isFile() && file.name.endsWith('.md'))
		.map(file => file.name)

	const folders = filesAndFolders
		.filter(file => file.isDirectory())
		.map(file => file.name)

	return {
		files: _.sortBy(files).map(file => ({
			name: file,
			path: dependencies.notesPath.getCleanNotePath(path, file)
		})),
		folders: _.sortBy(folders).map(folder => ({
			name: folder,
			path: dependencies.notesPath.getCleanNotePath(path, folder)
		}))
	}
}

export const ListNoteFolderGenerator = createCommand<
	'ListNoteFolder',
	ListNoteFolderParameters,
	ListNoteFolderResponse,
	ModuleDependencies
>('ListNoteFolder', ListNoteFolder)
