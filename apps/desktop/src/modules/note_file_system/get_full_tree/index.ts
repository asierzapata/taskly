import _ from 'lodash'

import { createMethodCalledFromRender } from '@modules/factory'
import { ModuleDependencies } from '../module'
import { Folder, File } from '../types'

type GetFullTreeParameters = void
type TreeLevel = {
	files: File[]
	folders: Folder[]
}
type GetFullTreeResponse = Record<string, TreeLevel>

export const GetFullTree = async ({
	parameters,
	dependencies
}: {
	parameters: GetFullTreeParameters
	dependencies: ModuleDependencies
}): Promise<GetFullTreeResponse> => {
	const initialPath = '/'
	const filesAndFolders = await getPathFoldersAndFiles(
		initialPath,
		dependencies
	)

	return filesAndFolders
}

export const GetFullTreeGenerator = createMethodCalledFromRender<
	'GetFullTree',
	GetFullTreeParameters,
	GetFullTreeResponse,
	ModuleDependencies
>('GetFullTree', GetFullTree)

async function getPathFoldersAndFiles(
	path: string,
	dependencies: ModuleDependencies
): Promise<Record<string, TreeLevel>> {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)
	const filesAndFolders = await dependencies.fs.readdir(absolutePath, {
		withFileTypes: true
	})

	// We only want files with the .md extension
	const files = filesAndFolders
		.filter(
			fileOrFolder => fileOrFolder.isFile() && fileOrFolder.name.endsWith('.md')
		)
		.map(file => file.name)

	const folders = filesAndFolders
		.filter(fileOrFolder => fileOrFolder.isDirectory())
		.map(folder => folder.name)

	const folderPaths = await Promise.all(
		folders.map(folder =>
			getPathFoldersAndFiles(
				dependencies.notesPath.getCleanNotePath(path, folder),
				dependencies
			)
		)
	)

	const response = {} as Record<string, TreeLevel>
	folderPaths.forEach(folderPath => {
		Object.keys(folderPath).forEach(folder => {
			const _folder = folderPath[folder]
			if (!_folder) return
			response[folder] = _folder
		})
	})

	return {
		[path]: {
			files: _.sortBy(files).map(file => ({
				name: file,
				path: dependencies.notesPath.getCleanNotePath(path, file)
			})),
			folders: _.sortBy(folders).map(folder => ({
				name: folder,
				path: dependencies.notesPath.getCleanNotePath(path, folder)
			}))
		},
		...response
	}
}
