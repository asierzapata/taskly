import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type DeleteFolderParameters = {
	path: string
}
type DeleteFolderResponse = {
	path: string
}

export const DeleteFolder = async ({
	parameters: { path },
	dependencies
}: {
	parameters: DeleteFolderParameters
	dependencies: ModuleDependencies
}): Promise<DeleteFolderResponse> => {
	const absolutePath = dependencies.notesPath.getPathInNotesFolder(path)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isFile()) {
		throw new Error('Path is not a file')
	}

	await dependencies.fs.rm(absolutePath)

	return {
		path
	}
}

export const DeleteFolderGenerator = createCommand<
	'DeleteFolder',
	DeleteFolderParameters,
	DeleteFolderResponse,
	ModuleDependencies
>('DeleteFolder', DeleteFolder)
