import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type DeleteNoteParameters = {
	path: string
}
type DeleteNoteResponse = {
	path: string
}

export const DeleteNote = async ({
	parameters: { path },
	dependencies
}: {
	parameters: DeleteNoteParameters
	dependencies: ModuleDependencies
}): Promise<DeleteNoteResponse> => {
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

export const DeleteNoteGenerator = createCommand<
	'DeleteNote',
	DeleteNoteParameters,
	DeleteNoteResponse,
	ModuleDependencies
>('DeleteNote', DeleteNote)
