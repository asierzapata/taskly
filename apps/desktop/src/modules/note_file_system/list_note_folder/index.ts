import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'
import { Folder, File } from '../types'

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

export const ListNoteFolderGenerator = createMethodCalledFromRender<
	'ListNoteFolder',
	ListNoteFolderParameters,
	ListNoteFolderResponse,
	ModuleDependencies
>('ListNoteFolder', ListNoteFolder)
