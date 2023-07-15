import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type DeleteFolderParameters = {
	path: string
	name: string
}
type DeleteFolderResponse = {
	path: string
	name: string
}

export const DeleteFolder = async ({
	parameters: { path, name },
	dependencies
}: {
	parameters: DeleteFolderParameters
	dependencies: ModuleDependencies
}): Promise<DeleteFolderResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteFolderPath(path, name)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isDirectory()) {
		throw new Error('Path is not a file')
	}

	await dependencies.fs.rm(absolutePath, {
		recursive: true
	})

	return {
		path,
		name
	}
}

export const DeleteFolderGenerator = createCommand<
	'DeleteFolder',
	DeleteFolderParameters,
	DeleteFolderResponse,
	ModuleDependencies
>('DeleteFolder', DeleteFolder)
