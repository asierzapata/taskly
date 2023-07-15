import _ from 'lodash'

import { createCommand } from '@modules/factory'
import { ModuleDependencies } from '../module'

type RenameNoteParameters = {
	path: string
	oldFilename: string
	newFilename: string
}
type RenameNoteResponse = void

export const RenameNote = async ({
	parameters: { path, oldFilename, newFilename },
	dependencies
}: {
	parameters: RenameNoteParameters
	dependencies: ModuleDependencies
}): Promise<RenameNoteResponse> => {
	const oldPath = dependencies.notesPath.getCleanNotePath(
		dependencies.notesPath.getPathInNotesFolder(path),
		oldFilename
	)

	const newPath = dependencies.notesPath.getCleanNotePath(
		dependencies.notesPath.getPathInNotesFolder(path),
		newFilename
	)

	await dependencies.fs.rename(oldPath, newPath)

	return
}

export const RenameNoteGenerator = createCommand<
	'RenameNote',
	RenameNoteParameters,
	RenameNoteResponse,
	ModuleDependencies
>('RenameNote', RenameNote)
