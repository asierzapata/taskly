import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type DeleteNoteParameters = {
	path: string
	name: string
}
type DeleteNoteResponse = {
	path: string
	name: string
}

export const DeleteNote = async ({
	parameters: { path, name },
	dependencies
}: {
	parameters: DeleteNoteParameters
	dependencies: ModuleDependencies
}): Promise<DeleteNoteResponse> => {
	const absolutePath = dependencies.notesPath.getAbsoluteNotePath(path, name)

	// We need to make sure the path is valid
	// and that it is a file
	const stats = await dependencies.fs.stat(absolutePath)

	if (!stats.isFile()) {
		throw new Error('Path is not a file')
	}

	await dependencies.fs.rm(absolutePath)

	return {
		path,
		name
	}
}

export const DeleteNoteGenerator = createCommand<
	'DeleteNote',
	DeleteNoteParameters,
	DeleteNoteResponse,
	ModuleDependencies
>('DeleteNote', DeleteNote)
